import { queryRunner, transactionRunner } from "#config/db.js";
import { log } from "#utils/helper.js";
import {
  holdBalance,
  releaseHeldBalance,
  rollbackHeldBalance,
} from "./walletService.js";

export const createWithdrawalRequest = async (userId, amount, bankDetails) => {
  return await transactionRunner(async (conn) => {
    // 1. Create withdrawal request record first to get its ID
    const [reqResult] = await conn.execute(
      'INSERT INTO withdrawal_requests (user_id, amount, bank_details, status) VALUES (?, ?, ?, "REVIEW_PENDING")',
      [userId, amount, JSON.stringify(bankDetails)],
    );
    const requestId = reqResult.insertId;

    // 2. Hold balance and link to the request
    const result = await holdBalance(
      userId,
      amount,
      "WITHDRAWAL_REQUEST",
      "withdrawal_requests",
      requestId,
      "Withdrawal request pending review",
      conn,
    );

    return {
      requestId: requestId,
      transactionId: result.transactionId,
    };
  });
};

export const approveWithdrawal = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM withdrawal_requests WHERE id = ? FOR UPDATE",
      [requestId],
    );
    if (!rows || rows.length === 0)
      throw new Error("Withdrawal request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Get wallet for user
    const [walletRows] = await conn.execute(
      "SELECT id FROM wallets WHERE user_id = ?",
      [request.user_id],
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    // 3. Release locked balance
    await releaseHeldBalance(walletRows[0].id, request.amount, conn);

    // 4. Update request status
    await conn.execute(
      'UPDATE withdrawal_requests SET status = "APPROVED", admin_comment = ? WHERE id = ?',
      [adminComment || "Approved by admin", requestId],
    );

    // 5. Update transaction status
    await conn.execute(
      'UPDATE wallet_transactions SET status = "SUCCESS" WHERE reference_table = "withdrawal_requests" AND reference_id = ?',
      [requestId],
    );

    return { success: true };
  });
};

export const rejectWithdrawal = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM withdrawal_requests WHERE id = ? FOR UPDATE",
      [requestId],
    );
    if (!rows || rows.length === 0)
      throw new Error("Withdrawal request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Get wallet for user
    const [walletRows] = await conn.execute(
      "SELECT id FROM wallets WHERE user_id = ?",
      [request.user_id],
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    // 3. Rollback locked balance
    await rollbackHeldBalance(walletRows[0].id, request.amount, conn);

    // 4. Update request status
    await conn.execute(
      'UPDATE withdrawal_requests SET status = "REJECTED", admin_comment = ? WHERE id = ?',
      [adminComment || "Rejected by admin", requestId],
    );

    // 5. Update transaction status
    await conn.execute(
      'UPDATE wallet_transactions SET status = "FAILED" WHERE reference_table = "withdrawal_requests" AND reference_id = ?',
      [requestId],
    );

    return { success: true };
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
