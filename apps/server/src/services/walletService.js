import { queryRunner, transactionRunner } from "#config/db.js";
import { log } from "#utils/helper.js";

export const createWallet = async (userId, connection = null) => {
  const runner = connection || queryRunner;
  try {
    log(`Creating wallet for user: ${userId}`, "info");
    await runner(
      "INSERT IGNORE INTO wallets (user_id, balance, locked_balance) VALUES (?, ?, ?)",
      [userId, 0.0, 0.0],
    );
    return { success: true };
  } catch (error) {
    log(`Error creating wallet: ${error.message}`, "error");
    throw error;
  }
};

export const getWalletByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId not found");
    }
    const rows = await queryRunner("SELECT * FROM wallets WHERE user_id = ?", [
      userId,
    ]);
    if (!rows || rows.length === 0) {
      // Auto-create wallet if it doesn't exist (safety)
      await createWallet(userId);
      const newRows = await queryRunner(
        "SELECT * FROM wallets WHERE user_id = ?",
        [userId],
      );
      return newRows[0];
    }
    return rows[0];
  } catch (error) {
    log(`Error fetching wallet: ${error.message}`, "error");
    throw error;
  }
};

export const getWalletStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId not found");
    }

    // Get wallet data
    const wallet = await getWalletByUserId(userId);

    // Calculate total, monthly, and today's commissions
    const statsRows = await queryRunner(
      `SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN amount ELSE 0 END), 0) as month_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND DATE(created_at) = CURRENT_DATE() THEN amount ELSE 0 END), 0) as today_income
       FROM wallet_transactions 
       WHERE wallet_id = ?`,
      [wallet.id],
    );

    // Calculate Team Stats
    const teamStatsRows = await queryRunner(
      `SELECT 
        COUNT(*) as total_members,
        SUM(CASE WHEN MONTH(u.created_at) = MONTH(CURRENT_DATE()) AND YEAR(u.created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) as month_joined,
        SUM(CASE WHEN DATE(u.created_at) = CURRENT_DATE() THEN 1 ELSE 0 END) as today_joined
       FROM referral_tree rt
       JOIN users u ON rt.downline_id = u.id
       WHERE rt.upline_id = ?`,
      [userId],
    );

    // Calculate Team Purchase Stats
    const teamPurchaseRows = await queryRunner(
      `SELECT 
        COALESCE(SUM(o.total_amount), 0) as total_purchase,
        COALESCE(SUM(CASE WHEN MONTH(o.created_at) = MONTH(CURRENT_DATE()) AND YEAR(o.created_at) = YEAR(CURRENT_DATE()) THEN o.total_amount ELSE 0 END), 0) as month_purchase,
        COALESCE(SUM(CASE WHEN DATE(o.created_at) = CURRENT_DATE() THEN o.total_amount ELSE 0 END), 0) as today_purchase
       FROM referral_tree rt
       JOIN orders o ON rt.downline_id = o.user_id
       WHERE rt.upline_id = ? AND o.payment_status = 'PAID'`,
      [userId],
    );

    const stats = statsRows[0];
    const teamStats = teamStatsRows[0];
    const teamPurchase = teamPurchaseRows[0];

    // Return wallet data with calculated stats
    return {
      ...wallet,
      balance: parseFloat(wallet.balance),
      locked_balance: parseFloat(wallet.locked_balance),
      withdrawable: parseFloat(wallet.balance),
      on_hold: parseFloat(wallet.locked_balance),
      total_income: parseFloat(stats.total_income || 0),
      month_income: parseFloat(stats.month_income || 0),
      today_income: parseFloat(stats.today_income || 0),
      commissions: parseFloat(stats.total_income || 0), // Alias for backward compatibility

      // Team Stats
      total_team_members: parseInt(teamStats.total_members || 0),
      month_joined: parseInt(teamStats.month_joined || 0),
      today_joined: parseInt(teamStats.today_joined || 0),

      // Team Purchase Stats
      total_team_purchase: parseFloat(teamPurchase.total_purchase || 0),
      month_purchase: parseFloat(teamPurchase.month_purchase || 0),
      today_purchase: parseFloat(teamPurchase.today_purchase || 0),
    };
  } catch (error) {
    log(`Error fetching wallet stats: ${error.message}`, "error");
    throw error;
  }
};


export const getWalletTransactions = async (
  userId,
  limit = 20,
  offset = 0,
  searchTerm = null,
  status = null,
  type = null,
) => {
  try {
    const wallet = await getWalletByUserId(userId);

    // Base query conditions
    let conditions = "WHERE wallet_id = ?";
    let params = [wallet.id];

    if (searchTerm) {
      conditions += " AND (description LIKE ? OR reference_id LIKE ?)";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (status) {
      conditions += " AND status = ?";
      params.push(status);
    }

    if (type) {
      conditions += " AND transaction_type = ?";
      params.push(type);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM wallet_transactions ${conditions}`;
    const [countResult] = await queryRunner(countQuery, params);
    const total = countResult.total;

    // Get transactions
    const query = `SELECT * FROM wallet_transactions ${conditions} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const rows = await queryRunner(query, [...params, parseInt(limit), parseInt(offset)]);

    return {
      transactions: rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + rows.length < total
      }
    };
  } catch (error) {
    log(`Error fetching wallet transactions: ${error.message}`, "error");
    throw error;
  }
};

export const getNetworkTransactions = async (
  userId,
  limit = 20,
  offset = 0,
) => {
  try {
    const wallet = await getWalletByUserId(userId);

    // Query to join wallet_transactions with commission distribution, users (downline), and orders
    const query = `
      SELECT 
        wt.id,
        wt.amount,
        wt.status,
        wt.created_at,
        rcd.level,
        rcd.percent,
        downline.name as downline_name,
        o.order_number
      FROM wallet_transactions wt
      JOIN referral_commission_distribution rcd ON wt.reference_table = 'referral_commission_distribution' AND wt.reference_id = rcd.id
      JOIN users downline ON rcd.downline_id = downline.id
      JOIN orders o ON rcd.order_id = o.id
      WHERE wt.wallet_id = ? AND wt.transaction_type = 'REFERRAL_COMMISSION'
      ORDER BY wt.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM wallet_transactions wt
      WHERE wt.wallet_id = ? AND wt.transaction_type = 'REFERRAL_COMMISSION'
    `;

    const [countResult] = await queryRunner(countQuery, [wallet.id]);
    const total = countResult.total;

    const rows = await queryRunner(query, [wallet.id, parseInt(limit), parseInt(offset)]);

    return {
      transactions: rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + rows.length < total
      }
    };
  } catch (error) {
    log(`Error fetching network transactions: ${error.message}`, "error");
    throw error;
  }
};

export const updateWalletBalance = async (
  userId,
  amount,
  type,
  purpose,
  referenceTable = null,
  referenceId = null,
  description = null,
  status = "SUCCESS",
  metadata = null,
  connection = null,
) => {
  const executeUpdate = async (runner) => {
    // 1. Get wallet and lock row for update
    const [walletRows] = await runner.execute(
      "SELECT id, balance, locked_balance FROM wallets WHERE user_id = ? FOR UPDATE",
      [userId],
    );

    let walletId;
    let currentBalance;
    let currentLockedBalance;

    if (!walletRows || walletRows.length === 0) {
      // Create wallet if missing
      const [result] = await runner.execute(
        "INSERT INTO wallets (user_id, balance, locked_balance) VALUES (?, ?, ?)",
        [userId, 0.0, 0.0],
      );
      walletId = result.insertId;
      currentBalance = 0.0;
      currentLockedBalance = 0.0;
    } else {
      walletId = walletRows[0].id;
      currentBalance = parseFloat(walletRows[0].balance);
      currentLockedBalance = parseFloat(walletRows[0].locked_balance);
    }

    // 2. Calculate new balances
    const numAmount = parseFloat(amount);
    let newBalance = currentBalance;
    let newLockedBalance = currentLockedBalance;

    if (type === "CREDIT") {
      newBalance += numAmount;
    } else if (type === "DEBIT") {
      if (currentBalance < numAmount) {
        throw new Error("Insufficient wallet balance");
      }
      if (status === "PENDING") {
        newBalance -= numAmount;
        newLockedBalance += numAmount;
      } else {
        newBalance -= numAmount;
      }
    } else {
      throw new Error("Invalid transaction type");
    }

    // 3. Update wallet balance
    await runner.execute(
      "UPDATE wallets SET balance = ?, locked_balance = ? WHERE id = ?",
      [newBalance, newLockedBalance, walletId],
    );

    // 4. Record transaction
    const [transResult] = await runner.execute(
      `INSERT INTO wallet_transactions (
                wallet_id, entry_type, transaction_type, amount, balance_before, balance_after, 
                reference_table, reference_id, status, description, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        walletId,
        type,
        purpose,
        numAmount,
        currentBalance,
        newBalance,
        referenceTable,
        referenceId,
        status,
        description,
        metadata ? JSON.stringify(metadata) : null,
      ],
    );

    return {
      transactionId: transResult.insertId,
      newBalance: newBalance,
      newLockedBalance: newLockedBalance,
    };
  };

  if (connection) {
    return await executeUpdate(connection);
  } else {
    return await transactionRunner(executeUpdate);
  }
};

export const holdBalance = async (
  userId,
  amount,
  purpose,
  referenceTable = null,
  referenceId = null,
  description = null,
  connection = null,
) => {
  return await updateWalletBalance(
    userId,
    amount,
    "DEBIT",
    purpose,
    referenceTable,
    referenceId,
    description,
    "PENDING",
    null,
    connection,
  );
};

export const releaseHeldBalance = async (
  walletId,
  amount,
  connection = null,
) => {
  const runner = connection || queryRunner;
  try {
    const [walletRows] = await runner.execute(
      "SELECT locked_balance FROM wallets WHERE id = ? FOR UPDATE",
      [walletId],
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    const currentLocked = parseFloat(walletRows[0].locked_balance);
    const numAmount = parseFloat(amount);
    if (currentLocked < numAmount)
      throw new Error("Insufficient locked balance");

    await runner.execute(
      "UPDATE wallets SET locked_balance = locked_balance - ? WHERE id = ?",
      [numAmount, walletId],
    );
    return { success: true };
  } catch (error) {
    log(`Error releasing locked balance: ${error.message}`, "error");
    throw error;
  }
};

export const rollbackHeldBalance = async (
  walletId,
  amount,
  connection = null,
) => {
  const runner = connection || queryRunner;
  try {
    const [walletRows] = await runner.execute(
      "SELECT balance, locked_balance FROM wallets WHERE id = ? FOR UPDATE",
      [walletId],
    );
    if (!walletRows || walletRows.length === 0)
      throw new Error("Wallet not found");

    const currentLocked = parseFloat(walletRows[0].locked_balance);
    const numAmount = parseFloat(amount);
    if (currentLocked < numAmount)
      throw new Error("Insufficient locked balance to rollback");

    await runner.execute(
      "UPDATE wallets SET balance = balance + ?, locked_balance = locked_balance - ? WHERE id = ?",
      [numAmount, numAmount, walletId],
    );
    return { success: true };
  } catch (error) {
    log(`Error rolling back locked balance: ${error.message}`, "error");
    throw error;
  }
};

export default {
  createWallet,
  getWalletByUserId,
  getWalletStats,
  getWalletTransactions,
  getNetworkTransactions,
  updateWalletBalance,
  holdBalance,
  releaseHeldBalance,
  rollbackHeldBalance,
};
