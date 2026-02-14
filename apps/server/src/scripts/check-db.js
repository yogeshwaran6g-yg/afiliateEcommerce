import pool from "../config/db.js";

const checkDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Check users table
    const [users] = await connection.execute(
      "SELECT COUNT(*) as count FROM users",
    );
    console.log("👤 Users count:", users[0].count);

    // Check wallets table
    const [wallets] = await connection.execute(
      "SELECT COUNT(*) as count FROM wallets",
    );
    console.log("💰 Wallets count:", wallets[0].count);

    // Check wallet_transactions table
    const [transactions] = await connection.execute(
      "SELECT COUNT(*) as count FROM wallet_transactions",
    );
    console.log("📊 Transactions count:", transactions[0].count);

    // Check profiles table
    const [profiles] = await connection.execute(
      "SELECT COUNT(*) as count FROM profiles",
    );
    console.log("📋 Profiles count:", profiles[0].count);

    // Check products table
    const [products] = await connection.execute(
      "SELECT COUNT(*) as count FROM products",
    );
    console.log("🛍️  Products count:", products[0].count);

    // If users exist, show details
    if (users[0].count > 0) {
      const [userDetails] = await connection.execute(
        "SELECT id, name, phone, role, is_active FROM users LIMIT 5",
      );
      console.log("\n📋 User details:");
      console.table(userDetails);
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

checkDatabase();
