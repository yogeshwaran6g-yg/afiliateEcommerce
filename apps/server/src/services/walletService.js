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

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const last6MonthsStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const last7DaysStart = new Date(todayStart);
    last7DaysStart.setDate(last7DaysStart.getDate() - 6);

    // Get wallet data
    const wallet = await getWalletByUserId(userId);

    // 1. Core Income Stats (Today, Month, Total)
    const statsRows = await queryRunner(
      `SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND created_at >= ? THEN amount ELSE 0 END), 0) AS month_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND created_at >= ? THEN amount ELSE 0 END), 0) AS today_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND created_at >= ? AND created_at < ? THEN amount ELSE 0 END), 0) AS yesterday_income
      FROM wallet_transactions
      WHERE wallet_id = ?`,
      [monthStart, todayStart, yesterdayStart, todayStart, wallet.id],
    );

    // 2. Team Growth Stats
    const teamStatsRows = await queryRunner(
      `SELECT 
        COUNT(*) AS total_members,
        SUM(CASE WHEN u.created_at >= ? THEN 1 ELSE 0 END) AS month_joined,
        SUM(CASE WHEN u.created_at >= ? THEN 1 ELSE 0 END) AS today_joined,
        SUM(CASE WHEN u.created_at >= ? AND u.created_at < ? THEN 1 ELSE 0 END) AS yesterday_joined
      FROM referral_tree rt
      JOIN users u ON rt.downline_id = u.id
      WHERE rt.upline_id = ?`,
      [monthStart, todayStart, yesterdayStart, todayStart, userId],
    );

    // 3. Team Purchase Stats
    const teamPurchaseRows = await queryRunner(
      `SELECT 
        COALESCE(SUM(o.total_amount), 0) AS total_purchase,
        COALESCE(SUM(CASE WHEN o.created_at >= ? THEN o.total_amount ELSE 0 END), 0) AS month_purchase,
        COALESCE(SUM(CASE WHEN o.created_at >= ? THEN o.total_amount ELSE 0 END), 0) AS today_purchase,
        COALESCE(SUM(CASE WHEN o.created_at >= ? AND o.created_at < ? THEN o.total_amount ELSE 0 END), 0) AS yesterday_purchase
      FROM referral_tree rt
      JOIN orders o ON rt.downline_id = o.user_id
      WHERE rt.upline_id = ? AND o.payment_status = 'PAID'`,
      [monthStart, todayStart, yesterdayStart, todayStart, userId],
    );

    // 4. Historical Data for Charts (Last 7 Days - Sparklines)
    const dailyIncome = await queryRunner(
      `SELECT DATE(created_at) as date, SUM(amount) as value 
       FROM wallet_transactions 
       WHERE wallet_id = ? AND transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND created_at >= ?
       GROUP BY DATE(created_at) ORDER BY date ASC`,
      [wallet.id, last7DaysStart]
    );

    const dailyJoins = await queryRunner(
      `SELECT DATE(u.created_at) as date, COUNT(*) as value 
       FROM referral_tree rt JOIN users u ON rt.downline_id = u.id
       WHERE rt.upline_id = ? AND u.created_at >= ?
       GROUP BY DATE(u.created_at) ORDER BY date ASC`,
      [userId, last7DaysStart]
    );

    const dailyPurchases = await queryRunner(
      `SELECT DATE(o.created_at) as date, SUM(o.total_amount) as value 
       FROM referral_tree rt JOIN orders o ON rt.downline_id = o.user_id
       WHERE rt.upline_id = ? AND o.payment_status = 'PAID' AND o.created_at >= ?
       GROUP BY DATE(o.created_at) ORDER BY date ASC`,
      [userId, last7DaysStart]
    );

    // 5. Historical Data for Main Charts (Last 6 Months)
    const monthlyIncome = await queryRunner(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as value 
       FROM wallet_transactions 
       WHERE wallet_id = ? AND transaction_type = 'REFERRAL_COMMISSION' AND status = 'SUCCESS' AND created_at >= ?
       GROUP BY month ORDER BY month ASC`,
      [wallet.id, last6MonthsStart]
    );

    const monthlyJoins = await queryRunner(
      `SELECT DATE_FORMAT(u.created_at, '%Y-%m') as month, COUNT(*) as value 
       FROM referral_tree rt JOIN users u ON rt.downline_id = u.id
       WHERE rt.upline_id = ? AND u.created_at >= ?
       GROUP BY month ORDER BY month ASC`,
      [userId, last6MonthsStart]
    );

    // Helper to calculate percentage change
    const calculateChange = (today, yesterday) => {
      if (!yesterday || yesterday === 0) return today > 0 ? "100" : "0";
      return (((today - yesterday) / yesterday) * 100).toFixed(1);
    };

    const income = statsRows[0];
    const team = teamStatsRows[0];
    const purchase = teamPurchaseRows[0];

    return {
      ...wallet,
      balance: parseFloat(wallet.balance),
      locked_balance: parseFloat(wallet.locked_balance),
      withdrawable: parseFloat(wallet.balance),
      on_hold: parseFloat(wallet.locked_balance),
      total_income: parseFloat(income.total_income || 0),
      month_income: parseFloat(income.month_income || 0),
      today_income: parseFloat(income.today_income || 0),
      commissions: parseFloat(income.total_income || 0), // Alias for backward compatibility
      
      income_change: calculateChange(parseFloat(income.today_income), parseFloat(income.yesterday_income)),
      members_change: calculateChange(parseInt(team.today_joined), parseInt(team.yesterday_joined)),
      purchase_change: calculateChange(parseFloat(purchase.today_purchase), parseFloat(purchase.yesterday_purchase)),

      total_team_members: parseInt(team.total_members || 0),
      month_joined: parseInt(team.month_joined || 0),
      today_joined: parseInt(team.today_joined || 0),

      total_team_purchase: parseFloat(purchase.total_purchase || 0),
      month_purchase: parseFloat(purchase.month_purchase || 0),
      today_purchase: parseFloat(purchase.today_purchase || 0),

      charts: {
        dailyIncome,
        dailyJoins,
        dailyPurchases,
        monthlyIncome,
        monthlyJoins
      }
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
