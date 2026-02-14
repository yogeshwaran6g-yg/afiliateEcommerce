import { queryRunner, transactionRunner } from "#config/db.js";
import { log } from "#utils/helper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async (connection) => {
  log("Starting Database Seed...", "info");

  // 1. Drop Tables (Reverse Order to handle Foreign Keys)
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  const tables = [
    "notifications",
    "activation_payments_details",
    "cart_items",
    "carts",
    "addresses",
    "profiles",
    "otp",
    "referral_commission_distribution",
    "referral_tree",
    "referral_commission_config",
    "products",
    "category",
    "orders",
    "wallet_transactions",
    "withdrawal_requests",
    "recharge_requests",
    "wallets",
    "users",
  ];
  for (const table of tables) {
    await connection.execute(`DROP TABLE IF EXISTS ${table}`);
  }
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  log("Dropped existing tables.", "success");

  // 2. Read and Execute db.sql
  const dbSqlPath = path.resolve(__dirname, "../../db.sql");
  const sqlContent = fs.readFileSync(dbSqlPath, "utf8");

  // Split by semicolon, but be careful with stored procedures if they were in the file.
  // The current db.sql seems to have stored procedures at the end with DELIMITER //
  // We need to parse this carefully.
  // Simple strategy: Remove comments, split by ';', but ignore delimiters for now if we can or just run the table creates.
  // The db.sql contains "DELIMITER //" blocks. simple splitting by ';' might break procedures.
  // However, the main goal is to create tables.

  // Let's split by statement.
  // A better way for this specific file structure:
  // 1. Extract content before "Stored Procedures" section or just run everything?
  // If we run everything, we need a smarter parser.
  // For now, let's assume standard statements separated by ;
  // But wait, the file has DELIMITER // which means we need to handle that.

  // Actually, the seed.js is mostly about setting up data.
  // Stored procedures might be handled by `create_procedures.js`.
  // Let's inspect db.sql availability. It has procedures at the end.
  // We should probably only run the CREATE TABLE parts if create_procedures.js handles the rest.
  // Or we can try to run it all.

  // Robust approach: Split by `;\n` or `;\r\n` generally works for tables.
  // But procedures use `END //`.

  // Let's try to just read the file and execute statements that are not empty.
  // We will simple-split by `;` for now, assuming the CREATE TABLEs are standard.

  // Alternative: Read until "Stored Procedures" comment and only execute that part.
  const schemaPart = sqlContent.split("Stored Procedures")[0];

  const rawStatements = schemaPart.split(";");

  for (const rawStmt of rawStatements) {
    const stmt = rawStmt.trim();
    if (!stmt) continue;

    // Remove comments
    const cleanStmt = stmt
      .split("\n")
      .map((line) => {
        const commentIndex = line.indexOf("--");
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      })
      .join("\n")
      .trim();

    if (cleanStmt && !cleanStmt.startsWith("DELIMITER")) {
      try {
        await connection.execute(cleanStmt);
      } catch (e) {
        log(
          `Error executing statement: ${cleanStmt.substring(0, 50)}... - ${e.message}`,
          "error",
        );
        throw e;
      }
    }
  }
  log("Executed db.sql schema (Tables).", "success");

  // 3. Seed Data
  // Referral Config
  const configs = [
    [1, 10.0],
    [2, 5.0],
    [3, 2.5],
    [4, 1.25],
    [5, 0.75],
    [6, 0.5],
  ];

  for (const [lvl, pct] of configs) {
    await connection.execute(
      "INSERT INTO referral_commission_config (level, percent) VALUES (?, ?)",
      [lvl, pct],
    );
  }
  log("Seeded referral levels.", "success");

  // Users (Root + Downlines)
  // Updated for new schema: name, phone, email, password, role, is_active
  const users = [
    ["Root User", "9000000001", "root@example.com"], // ID 1
  ];

  const adminPassword = await bcrypt.hash("password123", 10);

  for (const [name, phone, email] of users) {
    await connection.execute(
      "INSERT INTO users (name, phone, email, password, role, is_phone_verified, is_active, account_activation_status, referral_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        phone,
        email,
        adminPassword,
        "ADMIN",
        true,
        true,
        "ACTIVATED",
        "ADMIN001",
      ],
    );
  }
  log("Seeded users.", "success");

  // Complete Admin User Registration
  // 1. Profile for Admin User (user_id = 1)
  await connection.execute(
    `INSERT INTO profiles (
      user_id, dob, id_type, id_number, id_document_url, identity_status,
      address_document_url, address_status, 
      bank_account_name, bank_name, bank_account_number, bank_ifsc, bank_document_url, bank_status,
      profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1, // user_id
      "1985-01-15", // dob
      "AADHAAR", // id_type
      "1234-5678-9012", // id_number
      "/uploads/admin/aadhaar.jpg", // id_document_url
      "VERIFIED", // identity_status
      "/uploads/admin/address_proof.jpg", // address_document_url
      "VERIFIED", // address_status
      "Root Admin", // bank_account_name
      "State Bank of India", // bank_name
      "12345678901234", // bank_account_number
      "SBIN0001234", // bank_ifsc
      "/uploads/admin/passbook.jpg", // bank_document_url
      "VERIFIED", // bank_status
      "/uploads/admin/profile.jpg", // profile_image
    ],
  );
  log("Seeded admin profile.", "success");

  // 2. Address for Admin User
  await connection.execute(
    `INSERT INTO addresses (
      user_id, address_line1, address_line2, city, state, country, pincode, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1, // user_id
      "123 Admin Street", // address_line1
      "Silicon Valley Complex", // address_line2
      "Chennai", // city
      "Tamil Nadu", // state
      "India", // country
      "600001", // pincode
      true, // is_default
    ],
  );
  log("Seeded admin address.", "success");

  // 3. Activation Payment Details for Admin User
  await connection.execute(
    `INSERT INTO activation_payments_details (
      user_id, product_id, payment_type, proof_url, status, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      1, // user_id
      1, // product_id (will be created later with products)
      "UPI", // payment_type
      "/uploads/admin/payment_proof.jpg", // proof_url
      "APPROVED", // status
      "Admin account - auto-approved", // admin_comment
    ],
  );
  log("Seeded admin activation payment.", "success");

  // 4. Wallet for Admin User
  await connection.execute(
    `INSERT INTO wallets (user_id, balance, locked_balance, version) VALUES (?, ?, ?, ?)`,
    [1, 50000.0, 0.0, 0],
  );
  log("Seeded admin wallet.", "success");

  // Get wallet ID for transactions
  const [walletResult] = await connection.execute(
    "SELECT id FROM wallets WHERE user_id = ?",
    [1],
  );
  const adminWalletId = walletResult[0].id;

  // 5. Create Withdrawal Request (will be referenced by wallet transaction)
  await connection.execute(
    `INSERT INTO withdrawal_requests (
      user_id, amount, status, bank_details, admin_comment
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      1, // user_id
      10000.0, // amount
      "APPROVED", // status
      JSON.stringify({
        account_name: "Root Admin",
        bank_name: "State Bank of India",
        account_number: "12345678901234",
        ifsc: "SBIN0001234",
      }),
      "Admin withdrawal - approved",
    ],
  );
  log("Seeded withdrawal request.", "success");

  // 6. Create Recharge Request (will be referenced by wallet transaction)
  await connection.execute(
    `INSERT INTO recharge_requests (
      user_id, amount, payment_method, payment_reference, proof_image, status, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      1, // user_id
      5000.0, // amount
      "UPI", // payment_method
      "UPI123456789", // payment_reference
      "/uploads/admin/recharge_proof.jpg", // proof_image
      "APPROVED", // status
      "Admin recharge - approved",
    ],
  );
  log("Seeded recharge request.", "success");

  // 7. Wallet Transactions for Admin User
  const walletTransactions = [
    // Initial credit
    {
      wallet_id: adminWalletId,
      entry_type: "CREDIT",
      transaction_type: "ADMIN_ADJUSTMENT",
      amount: 50000.0,
      balance_before: 0.0,
      balance_after: 50000.0,
      description: "Initial wallet setup - admin credit",
      status: "SUCCESS",
    },
    // Sample commission credit
    {
      wallet_id: adminWalletId,
      entry_type: "CREDIT",
      transaction_type: "REFERRAL_COMMISSION",
      amount: 5000.0,
      balance_before: 50000.0,
      balance_after: 55000.0,
      reference_table: "referral_commission_distribution",
      reference_id: 1,
      description: "Level 1 referral commission",
      status: "SUCCESS",
    },
    // Sample withdrawal debit
    {
      wallet_id: adminWalletId,
      entry_type: "DEBIT",
      transaction_type: "WITHDRAWAL_REQUEST",
      amount: 10000.0,
      balance_before: 55000.0,
      balance_after: 45000.0,
      reference_table: "withdrawal_requests",
      reference_id: 1,
      description: "Withdrawal to bank account",
      status: "SUCCESS",
    },
    // Sample recharge credit
    {
      wallet_id: adminWalletId,
      entry_type: "CREDIT",
      transaction_type: "RECHARGE_REQUEST",
      amount: 5000.0,
      balance_before: 45000.0,
      balance_after: 50000.0,
      reference_table: "recharge_requests",
      reference_id: 1,
      description: "Wallet recharge via UPI",
      status: "SUCCESS",
    },
  ];

  for (const txn of walletTransactions) {
    await connection.execute(
      `INSERT INTO wallet_transactions (
        wallet_id, entry_type, transaction_type, amount, balance_before, balance_after,
        reference_table, reference_id, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        txn.wallet_id,
        txn.entry_type,
        txn.transaction_type,
        txn.amount,
        txn.balance_before,
        txn.balance_after,
        txn.reference_table || null,
        txn.reference_id || null,
        txn.description,
        txn.status,
      ],
    );
  }
  log("Seeded wallet transactions.", "success");

  // Build Tree (Linear Chain for simplicity: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8)
  // We need more users to build this tree.
  const downlines = [
    ["User 2", "9000000002", "user2@example.com"],
    ["User 3", "9000000003", "user3@example.com"],
    ["User 4", "9000000004", "user4@example.com"],
    ["User 5", "9000000005", "user5@example.com"],
    ["User 6", "9000000006", "user6@example.com"],
    ["User 7", "9000000007", "user7@example.com"],
    ["User 8", "9000000008", "user8@example.com"],
  ];

  const userPassword = await bcrypt.hash("password123", 10);

  for (const [name, phone, email] of downlines) {
    await connection.execute(
      "INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, userPassword, "USER"],
    );
  }

  // Tree Logic
  // For User 2 (Ref by 1): (1, 2, 1)
  // For User 3 (Ref by 2): (2, 3, 1), (1, 3, 2)
  // ...
  const treeEntries = [
    // Downline 2 (ID 2 ref by 1)
    [1, 2, 1],
    // Downline 3 (ID 3 ref by 2)
    [2, 3, 1],
    [1, 3, 2],
    // Downline 4 (ID 4 ref by 3)
    [3, 4, 1],
    [2, 4, 2],
    [1, 4, 3],
    // Downline 5 (ID 5 ref by 4)
    [4, 5, 1],
    [3, 5, 2],
    [2, 5, 3],
    [1, 5, 4],
    // Downline 6 (ID 6 ref by 5)
    [5, 6, 1],
    [4, 6, 2],
    [3, 6, 3],
    [2, 6, 4],
    [1, 6, 5],
    // Downline 7 (ID 7 ref by 6)
    [6, 7, 1],
    [5, 7, 2],
    [4, 7, 3],
    [3, 7, 4],
    [2, 7, 5],
    [1, 7, 6],
    // Downline 8 (ID 8 ref by 7)
    [7, 8, 1],
    [6, 8, 2],
    [5, 8, 3],
    [4, 8, 4],
    [3, 8, 5],
    [2, 8, 6],
  ];

  for (const [up, down, lvl] of treeEntries) {
    await connection.execute(
      "INSERT INTO referral_tree (upline_id, downline_id, level) VALUES (?, ?, ?)",
      [up, down, lvl],
    );
  }
  log("Seeded referral_tree.", "success");

  // Create an Order for User 8 (Should trigger commissions for 2..7, and 1)
  // user_id=8
  await connection.execute(
    "INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)",
    [8, 1000.0, "COMPLETED"],
  );
  log("Seeded order for User 8.", "success");

  // Notifications
  const sampleNotifications = [
    [
      "Welcome to AfiliateEcom",
      "Success comes to those who wait.",
      "We are happy to have you here. Explore our wide range of products and start your journey with us today!",
      null,
      "2026-12-31 23:59:59",
    ],
    [
      "Big Winter Sale!",
      "Up to 50% off on all winter wear.",
      "Grab the best deals of the season. Limited time offer on all premium winter collections including jackets, sweaters and more.",
      "https://images.unsplash.com/photo-1511943044008-e93f7bb9721d",
      "2026-02-28 23:59:59",
    ],
    [
      "New Arrivals in Electronics",
      "Check out the latest gadgets.",
      "Stay ahead with our newest collection of smartphones, laptops and accessories. High performance guaranteed.",
      null,
      "2026-03-15 23:59:59",
    ],
  ];

  for (const [heading, sDesc, lDesc, img, endTime] of sampleNotifications) {
    await connection.execute(
      `INSERT INTO notifications (heading, short_description, long_description, image_url, advertisement_end_time) 
       VALUES (?, ?, ?, ?, ?)`,
      [heading, sDesc, lDesc, img, endTime],
    );
  }
  log("Seeded sample notifications.", "success");

  log("Database Seed Verified and Completed!", "success");
};

// Execute
transactionRunner(seed)
  .then(() => process.exit(0))
  .catch((err) => {
    log(`Seed Failed: ${err.message}`, "error");
    process.exit(1);
  });
