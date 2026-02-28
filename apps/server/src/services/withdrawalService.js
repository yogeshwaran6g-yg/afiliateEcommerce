import { queryRunner, transactionRunner } from "#config/db.js";
import { log } from "#utils/helper.js";
import {
  holdBalance,
  releaseHeldBalance,
  rollbackHeldBalance,
} from "./walletService.js";
import { getSettings } from "./settingsService.js";
import userNotificationService from "./userNotificationService.js";

export const createWithdrawalRequest = async (userId, amount) => {
  return await transactionRunner(async (conn) => {
    // 0. Check user activation status
    const [userRows] = await conn.execute(
      "SELECT name, account_activation_status FROM users WHERE id = ?",
      [userId]
    );
    if (userRows[0]?.account_activation_status !== "ACTIVATED") {
      throw new Error(
        "Your account must be activated to request a withdrawal."
      );
    }

    // 1. Check pending requests
    const [pendingCount] = await conn.execute(
      'SELECT COUNT(*) as count FROM withdrawal_requests WHERE user_id = ? AND status = "REVIEW_PENDING"',
      [userId]
    );
    if (pendingCount[0].count >= 2) {
      throw new Error(
        "You already have 2 pending withdrawal requests. Please wait for them to be processed."
      );
    }

    // 2. Fetch bank details from profile
    const [profileRows] = await conn.execute(
      "SELECT bank_account_name, bank_name, bank_account_number, bank_ifsc FROM profiles WHERE user_id = ?",
      [userId]
    );

    if (!profileRows || profileRows.length === 0) {
      throw new Error("Profile not found. Please complete your profile first.");
    }

    const profile = profileRows[0];
    if (
      !profile.bank_account_number ||
      !profile.bank_ifsc ||
      !profile.bank_account_name ||
      !profile.bank_name
    ) {
      throw new Error(
        "Bank details are incomplete. Please update your bank details in your profile first."
      );
    }

    const bankDetailsToStore = {
      account_name: profile.bank_account_name,
      bank_name: profile.bank_name,
      account_number: profile.bank_account_number,
      ifsc_code: profile.bank_ifsc,
    };

    // 3. Fetch withdrawal settings
    const settings = await getSettings([
      "withdraw_commission",
      "maximum_amount_per_withdraw",
    ]);
    const commissionPercent = parseFloat(settings.withdraw_commission || 5.0);
    const maxAmount = parseFloat(
      settings.maximum_amount_per_withdraw || 50000.0
    );

    // 4. Validate amount
    if (amount > maxAmount) {
      throw new Error(`Maximum withdrawal amount per request is ₹${maxAmount}`);
    }

    // 5. Calculate fees
    const platformFee = (amount * commissionPercent) / 100;
    const netAmount = amount - platformFee;

    // 6. Create withdrawal request record
    const [reqResult] = await conn.execute(
      'INSERT INTO withdrawal_requests (user_id, amount, platform_fee, net_amount, bank_details, status) VALUES (?, ?, ?, ?, ?, "REVIEW_PENDING")',
      [
        userId,
        amount,
        platformFee,
        netAmount,
        JSON.stringify(bankDetailsToStore),
      ]
    );
    const requestId = reqResult.insertId;

    // 6. Hold balance and link to the request
    const result = await holdBalance(
      userId,
      amount,
      "WITHDRAWAL_REQUEST",
      "withdrawal_requests",
      requestId,
      "Withdrawal request pending review",
      conn
    );

    await userNotificationService.notifyAdmins({
      type: "WALLET",
      title: "New Withdrawal Request",
      description: `User ${userRows[0].name} has requested a withdrawal of ₹${amount}.`,
      link: "/withdrawals",
    });

    return {
      requestId: requestId,
      transactionId: result.transactionId,
      platformFee,
      netAmount,
    };
  });
};

export const approveWithdrawal = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM withdrawal_requests WHERE id = ? FOR UPDATE",
      [requestId]
    );
    if (!rows || rows.length === 0)
      throw new Error("Withdrawal request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Get wallet for user
    const [walletRows] = await conn.execute(
      "SELECT id FROM wallets WHERE user_id = ?",
      [request.user_id]
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    // 3. Release locked balance
    await releaseHeldBalance(walletRows[0].id, request.amount, conn);

    // 4. Update request status
    await conn.execute(
      'UPDATE withdrawal_requests SET status = "APPROVED", admin_comment = ? WHERE id = ?',
      [adminComment || "Approved by admin", requestId]
    );

    // 5. Update transaction status
    await conn.execute(
      'UPDATE wallet_transactions SET status = "SUCCESS" WHERE reference_table = "withdrawal_requests" AND reference_id = ?',
      [requestId]
    );

    return { success: true, request };
  });
};

export const rejectWithdrawal = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM withdrawal_requests WHERE id = ? FOR UPDATE",
      [requestId]
    );
    if (!rows || rows.length === 0)
      throw new Error("Withdrawal request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Get wallet for user
    const [walletRows] = await conn.execute(
      "SELECT id FROM wallets WHERE user_id = ?",
      [request.user_id]
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    // 3. Rollback locked balance
    await rollbackHeldBalance(walletRows[0].id, request.amount, conn);

    // 4. Update request status
    await conn.execute(
      'UPDATE withdrawal_requests SET status = "REJECTED", admin_comment = ? WHERE id = ?',
      [adminComment || "Rejected by admin", requestId]
    );

    // 5. Update transaction status
    await conn.execute(
      'UPDATE wallet_transactions SET status = "FAILED" WHERE reference_table = "withdrawal_requests" AND reference_id = ?',
      [requestId]
    );

    return { success: true, request };
  });
};

export const getWithdrawalRequests = async (filters = {}) => {
  let query =
    "SELECT wr.*, u.name as user_name, u.phone as user_phone FROM withdrawal_requests wr JOIN users u ON wr.user_id = u.id WHERE 1=1";
  const params = [];

  if (filters.status) {
    query += " AND wr.status = ?";
    params.push(filters.status);
  }

  if (filters.userId) {
    query += " AND wr.user_id = ?";
    params.push(filters.userId);
  }

  query += " ORDER BY wr.created_at DESC";

  const rows = await queryRunner(query, params);
  return rows;
};

export default {
  createWithdrawalRequest,
  approveWithdrawal,
  rejectWithdrawal,
  getWithdrawalRequests,
};
