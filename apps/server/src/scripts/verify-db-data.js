import pool from "../config/db.js";
import { env } from "../config/env.js";

const showDatabaseInfo = async () => {
  try {
    console.log("==================================================");
    console.log("📊 DATABASE CONNECTION INFO");
    console.log("==================================================");
    console.log("Host:", env.DB_HOST);
    console.log("User:", env.DB_USER);
    console.log("Database:", env.DB_NAME);
    console.log("Port:", env.DB_PORT);
    console.log("==================================================\n");

    const connection = await pool.getConnection();

    console.log("✅ Successfully connected to database!\n");

    // Check all relevant tables
    const tables = [
      "users",
      "profiles",
      "addresses",
      "wallets",
      "wallet_transactions",
      "withdrawal_requests",
      "recharge_requests",
      "activation_payments_details",
      "products",
      "category",
      "notifications",
    ];

    console.log("📋 TABLE COUNTS:");
    console.log("==================================================");

    for (const table of tables) {
      try {
        const [result] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${table}`,
        );
        const count = result[0].count;
        const icon = count > 0 ? "✅" : "⚠️";
        console.log(`${icon} ${table.padEnd(30)} ${count}`);
      } catch (err) {
        console.log(`❌ ${table.padEnd(30)} ERROR: ${err.message}`);
      }
    }

    console.log("==================================================\n");

    // Show admin user details
    const [users] = await connection.execute(
      "SELECT id, name, phone, email, role, is_active, account_activation_status FROM users WHERE role = 'ADMIN' LIMIT 1",
    );

    if (users.length > 0) {
      console.log("👤 ADMIN USER DETAILS:");
      console.log("==================================================");
      const admin = users[0];
      console.log("ID:", admin.id);
      console.log("Name:", admin.name);
      console.log("Phone:", admin.phone);
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
      console.log("Active:", admin.is_active ? "Yes" : "No");
      console.log("Status:", admin.account_activation_status);
      console.log("==================================================\n");

      // Show wallet balance
      const [wallet] = await connection.execute(
        "SELECT balance, locked_balance FROM wallets WHERE user_id = ?",
        [admin.id],
      );

      if (wallet.length > 0) {
        console.log("💰 WALLET BALANCE:");
        console.log("==================================================");
        console.log("Balance:", `₹${wallet[0].balance}`);
        console.log("Locked:", `₹${wallet[0].locked_balance}`);
        console.log("==================================================\n");
      }

      // Show latest transactions
      const [transactions] = await connection.execute(
        `SELECT wt.*, w.user_id 
         FROM wallet_transactions wt
         JOIN wallets w ON wt.wallet_id = w.id
         WHERE w.user_id = ?
         ORDER BY wt.created_at DESC
         LIMIT 5`,
        [admin.id],
      );

      if (transactions.length > 0) {
        console.log("📊 RECENT WALLET TRANSACTIONS:");
        console.log("==================================================");
        transactions.forEach((txn, i) => {
          console.log(
            `\n${i + 1}. ${txn.entry_type} - ${txn.transaction_type}`,
          );
          console.log(`   Amount: ₹${txn.amount}`);
          console.log(
            `   Balance: ₹${txn.balance_before} → ₹${txn.balance_after}`,
          );
          console.log(`   Status: ${txn.status}`);
          console.log(`   Description: ${txn.description}`);
        });
        console.log("\n==================================================");
      }
    } else {
      console.log("⚠️  No admin user found in the database!");
    }

    console.log("\n✅ Database verification complete!");
    console.log(
      "\n💡 If you're using a MySQL client (like phpMyAdmin, MySQL Workbench, etc.),",
    );
    console.log("   make sure you're connecting to:");
    console.log(`   - Host: ${env.DB_HOST}`);
    console.log(`   - Database: ${env.DB_NAME}`);
    console.log(`   - User: ${env.DB_USER}\n`);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

showDatabaseInfo();
