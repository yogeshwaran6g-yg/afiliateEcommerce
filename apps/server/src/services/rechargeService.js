import { queryRunner, transactionRunner } from "#config/db.js";
import { log } from "#utils/helper.js";
import { updateWalletBalance } from "./walletService.js";

export const createRechargeRequest = async (
  userId,
  amount,
  paymentMethod,
  paymentReference,
  proofImage
) => {
  try {
    const result = await queryRunner(
      `INSERT INTO recharge_requests (user_id, amount, payment_method, payment_reference, proof_image, status) 
             VALUES (?, ?, ?, ?, ?, 'REVIEW_PENDING')`,
      [userId, amount, paymentMethod, paymentReference, proofImage]
    );

    const [userRows] = await queryRunner(
      `SELECT name FROM users WHERE id = ?`,
      [userId]
    );
    const userName = userRows[0]?.name || "Unknown User";
    await userNotificationService.notifyAdmins({
      type: "PAYMENT",
      title: "New Recharge Request",
      description: `User ${userName} has requested a wallet recharge of ₹${amount}.`,
    });

    return { requestId: result.insertId };
  } catch (error) {
    log(`Error creating recharge request: ${error.message}`, "error");
    throw error;
  }
};

export const approveRecharge = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM recharge_requests WHERE id = ? FOR UPDATE",
      [requestId]
    );
    if (!rows || rows.length === 0)
      throw new Error("Recharge request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Update wallet balance and record transaction
    const walletResult = await updateWalletBalance(
      request.user_id,
      request.amount,
      "CREDIT",
      "RECHARGE_REQUEST",
      "recharge_requests",
      requestId,
      "Wallet recharge approved",
      "SUCCESS",
      null,
      conn
    );

    // 3. Update request status
    await conn.execute(
      'UPDATE recharge_requests SET status = "APPROVED", admin_comment = ? WHERE id = ?',
      [adminComment || "Approved by admin", requestId]
    );

    return { success: true, request };
  });
};

export const rejectRecharge = async (requestId, adminComment = null) => {
  return await transactionRunner(async (conn) => {
    // 1. Get request details
    const [rows] = await conn.execute(
      "SELECT * FROM recharge_requests WHERE id = ? FOR UPDATE",
      [requestId]
    );
    if (!rows || rows.length === 0)
      throw new Error("Recharge request not found");
    const request = rows[0];

    if (request.status !== "REVIEW_PENDING")
      throw new Error(`Request is already ${request.status}`);

    // 2. Update request status
    await conn.execute(
      'UPDATE recharge_requests SET status = "REJECTED", admin_comment = ? WHERE id = ?',
      [adminComment || "Rejected by admin", requestId]
    );

    return { success: true, request };
  });
};

export const getRechargeRequests = async (filters = {}) => {
  let query =
    "SELECT rr.*, u.name as user_name, u.phone as user_phone FROM recharge_requests rr JOIN users u ON rr.user_id = u.id WHERE 1=1";
  const params = [];

  if (filters.status) {
    query += " AND rr.status = ?";
    params.push(filters.status);
  }

  if (filters.userId) {
    query += " AND rr.user_id = ?";
    params.push(filters.userId);
  }

  query += " ORDER BY rr.created_at DESC";

  const rows = await queryRunner(query, params);
  return rows;
};

export default {
  createRechargeRequest,
  approveRecharge,
  rejectRecharge,
  getRechargeRequests,
};
