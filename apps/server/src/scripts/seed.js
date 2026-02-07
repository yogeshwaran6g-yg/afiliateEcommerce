import { queryRunner, transactionRunner } from '../config/db.js';
import { log } from '../utils/helper.js';

const seed = async (connection) => {
  log("Starting Database Seed...", "info");

  // 1. Drop Tables (Reverse Order to handle Foreign Keys)
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  const tables = [
    'referral_commission_distribution',
    'referral_tree',
    'referral_commission_config',
    'orders',
    'users'
  ];
  for (const table of tables) {
    await connection.execute(`DROP TABLE IF EXISTS ${table}`);
  }
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  log("Dropped existing tables.", "success");

  // 2. Create Users Table
  await connection.execute(`
    CREATE TABLE users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  log("Created users table.", "success");

  // 3. Create Orders Table
  await connection.execute(`
    CREATE TABLE orders (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  log("Created orders table.", "success");

  // 4. Create Referral Config Table
  await connection.execute(`
    CREATE TABLE referral_commission_config (
      id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      level TINYINT UNSIGNED NOT NULL,
      percent DECIMAL(5,2) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE KEY uq_level (level),
      CONSTRAINT chk_level_range CHECK (level BETWEEN 1 AND 6),
      CONSTRAINT chk_percent_range CHECK (percent >= 0 AND percent <= 100)
    ) ENGINE=InnoDB
  `);
  log("Created referral_commission_config table.", "success");

  // 5. Create Referral Tree Table
  await connection.execute(`
    CREATE TABLE referral_tree (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      upline_id BIGINT UNSIGNED NOT NULL,
      downline_id BIGINT UNSIGNED NOT NULL,
      level TINYINT UNSIGNED NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_upline_downline (upline_id, downline_id),
      KEY idx_downline_level (downline_id, level),
      KEY idx_upline (upline_id),
      CONSTRAINT fk_referral_upline FOREIGN KEY (upline_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_referral_downline FOREIGN KEY (downline_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT chk_referral_level CHECK (level BETWEEN 1 AND 6)
    ) ENGINE=InnoDB
  `);
  log("Created referral_tree table.", "success");

  // 6. Create Referral Commissions Table
  await connection.execute(`
    CREATE TABLE referral_commission_distribution (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      upline_id BIGINT UNSIGNED NOT NULL,
      downline_id BIGINT UNSIGNED NOT NULL,
      order_id BIGINT UNSIGNED NOT NULL,
      payment_id BIGINT UNSIGNED NULL,
      level TINYINT UNSIGNED NOT NULL,
      percent DECIMAL(5,2) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('PENDING', 'APPROVED', 'REVERSED') NOT NULL DEFAULT 'PENDING',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME NULL,
      
      UNIQUE KEY uq_order_upline_level (order_id, upline_id, level),
      KEY idx_upline_status (upline_id, status),
      KEY idx_order (order_id),
      KEY idx_downline (downline_id),
      CONSTRAINT fk_comm_upline FOREIGN KEY (upline_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_comm_downline FOREIGN KEY (downline_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_comm_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT chk_comm_level CHECK (level BETWEEN 1 AND 6)
    ) ENGINE=InnoDB
  `);
  log("Created referral_commission_distribution table.", "success");

  // 7. Seed Data
  // Referral Config
  const configs = [
    [1, 10.00], [2, 5.00], [3, 2.50], [4, 1.25], [5, 0.75], [6, 0.50]
  ];

  for (const [lvl, pct] of configs) {
    await connection.execute(
      'INSERT INTO referral_commission_config (level, percent) VALUES (?, ?)',
      [lvl, pct]
    );
  }
  log("Seeded referral levels.", "success");

  // Users (Root + Downlines)
  const users = [
    ['Root User', 'root@example.com'],          // ID 1
  ];

  for (const [name, email] of users) {
    await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, 'password123']
    );
  }
  log("Seeded users.", "success");
return;
  // Build Tree (Linear Chain for simplicity: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8)
  // For User 2 (Ref by 1): (1, 2, 1)
  // For User 3 (Ref by 2): (2, 3, 1), (1, 3, 2)
  // ...
  const treeEntries = [
    // Downline 2
    [1, 2, 1],
    // Downline 3
    [2, 3, 1], [1, 3, 2],
    // Downline 4
    [3, 4, 1], [2, 4, 2], [1, 4, 3],
    // Downline 5
    [4, 5, 1], [3, 5, 2], [2, 5, 3], [1, 5, 4],
    // Downline 6
    [5, 6, 1], [4, 6, 2], [3, 6, 3], [2, 6, 4], [1, 6, 5],
    // Downline 7
    [6, 7, 1], [5, 7, 2], [4, 7, 3], [3, 7, 4], [2, 7, 5], [1, 7, 6],
    // Downline 8
    [7, 8, 1], [6, 8, 2], [5, 8, 3], [4, 8, 4], [3, 8, 5], [2, 8, 6] 
  ];

  for (const [up, down, lvl] of treeEntries) {
    await connection.execute(
      'INSERT INTO referral_tree (upline_id, downline_id, level) VALUES (?, ?, ?)',
      [up, down, lvl]
    );
  }
  log("Seeded referral_tree.", "success");

  // Create an Order for User 8 (Should trigger commissions for 2..7, and 1)
  await connection.execute(
    'INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)',
    [8, 1000.00, 'COMPLETED']
  );
  log("Seeded order for User 8.", "success");

  // Note: We are not seeding actual commissions here as that would usually be logic triggered by the order.
  // But we can verify the tree is correct.

  log("Database Seed Verified and Completed!", "success");
};

// Execute
transactionRunner(seed)
  .then(() => process.exit(0))
  .catch((err) => {
    log(`Seed Failed: ${err.message}`, "error");
    process.exit(1);
  });
