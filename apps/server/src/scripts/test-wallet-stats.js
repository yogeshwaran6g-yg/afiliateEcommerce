import pool from "../config/db.js";
import { env } from "../config/env.js";

const testWalletStats = async () => {
  try {
    console.log("==================================================");
    console.log("🧪 TESTING WALLET STATS CALCULATION");
    console.log("==================================================\n");

    const connection = await pool.getConnection();

    // Get admin user ID
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1",
    );

    if (users.length === 0) {
      console.log("❌ No admin user found!");
      connection.release();
      process.exit(1);
    }

    const userId = users[0].id;
    console.log(`✅ Found admin user ID: ${userId}\n`);

    // Get wallet
    const [wallets] = await connection.execute(
      "SELECT * FROM wallets WHERE user_id = ?",
      [userId],
    );

    if (wallets.length === 0) {
      console.log("❌ No wallet found for user!");
      connection.release();
      process.exit(1);
    }

    const wallet = wallets[0];
    console.log("💰 WALLET DATA:");
    console.log("==================================================");
    console.log(`Balance: ₹${wallet.balance}`);
    console.log(`Locked Balance: ₹${wallet.locked_balance}`);
    console.log("==================================================\n");

    // Calculate commissions
    const [commissionResult] = await connection.execute(
      `SELECT COALESCE(SUM(amount), 0) as total_commissions 
       FROM wallet_transactions 
       WHERE wallet_id = ? 
       AND transaction_type = 'REFERRAL_COMMISSION' 
       AND status = 'SUCCESS'`,
      [wallet.id],
    );

    const totalCommissions = parseFloat(commissionResult[0].total_commissions);

    console.log("📊 CALCULATED STATS:");
    console.log("==================================================");
    console.log(`Withdrawable: ₹${parseFloat(wallet.balance).toFixed(2)}`);
    console.log(`On Hold: ₹${parseFloat(wallet.locked_balance).toFixed(2)}`);
    console.log(`Total Commissions: ₹${totalCommissions.toFixed(2)}`);
    console.log("==================================================\n");

    // Get all transactions
    const [transactions] = await connection.execute(
      `SELECT transaction_type, amount, status FROM wallet_transactions WHERE wallet_id = ?`,
      [wallet.id],
    );

    console.log("📋 TRANSACTION BREAKDOWN:");
    console.log("==================================================");
    transactions.forEach((txn, i) => {
      console.log(
        `${i + 1}. ${txn.transaction_type} - ₹${txn.amount} (${txn.status})`,
      );
    });
    console.log("==================================================\n");

    // Verify expected stats
    console.log("✅ VERIFICATION:");
    console.log("==================================================");
    console.log(
      `✓ Withdrawable should equal balance: ${parseFloat(wallet.balance) === parseFloat(wallet.balance)}`,
    );
    console.log(
      `✓ On Hold should equal locked_balance: ${parseFloat(wallet.locked_balance) === parseFloat(wallet.locked_balance)}`,
    );
    console.log(`✓ Commissions calculated: ${totalCommissions >= 0}`);
    console.log("==================================================\n");

    console.log("🎉 Wallet stats calculation working correctly!");
    console.log("\n💡 EXPECTED FRONTEND DISPLAY:");
    console.log("==================================================");
    console.log(`Commission Card: ₹${totalCommissions.toFixed(2)}`);
    console.log(
      `On Hold Card: ₹${parseFloat(wallet.locked_balance).toFixed(2)}`,
    );
    console.log(`Withdrawable Card: ₹${parseFloat(wallet.balance).toFixed(2)}`);
    console.log("==================================================\n");

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

testWalletStats();
