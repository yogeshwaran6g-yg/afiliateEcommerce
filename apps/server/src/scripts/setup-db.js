import pool, { transactionRunner } from "../config/db.js";
import { log } from "../utils/helper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDB = async (connection) => {
  log("Starting Consolidated Database Setup...", "info");

  // 1. Drop stored procedures (as requested)
  log("Dropping existing stored procedures...", "info");
  const dropProcs = [
    "DROP PROCEDURE IF EXISTS sp_add_referral",
    "DROP PROCEDURE IF EXISTS sp_distribute_commission",
  ];
  for (const dropSql of dropProcs) {
    await connection.query(dropSql);
  }
  log("Dropped existing stored procedures.", "success");

  // 2. Drop all tables
  log("Dropping existing tables...", "info");
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  const tables = [
    "tickets",
    "user_notifications",
    "notifications",
    "withdrawal_requests",
    "recharge_requests",
    "wallet_transactions",
    "wallets",
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
    "order_tracking",
    "order_items",
    "orders",
    "users",
  ];
  for (const table of tables) {
    await connection.query(`DROP TABLE IF EXISTS ${table}`);
  }
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  log("Dropped all existing tables.", "success");

  // 3. Create schema from db.sql
  log("Creating schema from db.sql...", "info");
  const dbSqlPath = path.resolve(__dirname, "../../db.sql");
  const dbSqlContent = fs.readFileSync(dbSqlPath, "utf8");

  // Split by statement, but handle potential comments and whitespace
  const dbStatements = dbSqlContent
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of dbStatements) {
    // Basic comment cleaning for multiline statements
    const cleanStmt = stmt
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim();

    if (cleanStmt) {
      try {
        await connection.query(cleanStmt);
      } catch (err) {
        log(`Error executing db.sql statement: ${err.message}`, "error");
        log(`Full statement: ${cleanStmt}`, "error");
        throw err;
      }
    }
  }
  log("Schema created successfully.", "success");

  // 4. Create stored procedures from storedProcedure.sql
  log("Creating stored procedures from storedProcedure.sql...", "info");
  const spSqlPath = path.resolve(__dirname, "../../storedProcedure.sql");
  const spSqlContent = fs.readFileSync(spSqlPath, "utf8");

  // Stored procedures use DELIMITER //
  // We'll extract only the CREATE PROCEDURE blocks
  const spBlocks = spSqlContent
    .split("//")
    .filter((block) => block.trim().toLowerCase().includes("create procedure"));

  for (let block of spBlocks) {
    let cleanBlock = block.trim();
    // Remove DELIMITER keywords if they somehow got in
    cleanBlock = cleanBlock
      .replace(/DELIMITER\s+\/\//gi, "")
      .replace(/DELIMITER\s+;/gi, "");

    if (cleanBlock) {
      try {
        await connection.query(cleanBlock);
        const procName = cleanBlock.match(/CREATE PROCEDURE\s+(\w+)/i)?.[1];
        log(`Procedure ${procName} created successfully.`, "success");
      } catch (err) {
        log(`Error creating stored procedure: ${err.message}`, "error");
        throw err;
      }
    }
  }
  log("Stored procedures created successfully.", "success");

  // 5. Seed initial data
  log("Seeding initial data...", "info");

  // 5.1 Referral configs
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
  log("Seeded referral commission levels.", "success");

  // 5.2 Categories
  const categories = [
    ["Electronics"],
    ["Fashion"],
    ["Home & Living"],
    ["Beauty"],
    ["Health"],
    ["Books"],
    ["Sports"],
  ];
  const categoryMap = {};
  for (const [name] of categories) {
    const [result] = await connection.execute(
      "INSERT INTO category (name) VALUES (?)",
      [name],
    );
    categoryMap[name] = result.insertId;
  }
  log("Seeded categories.", "success");

  // 5.3 Mock Products
  const mockProducts = [
    {
      name: "Smartphone X1",
      slug: "smartphone-x1",
      short_desc: "Latest flagship smartphone with 108MP camera.",
      long_desc:
        "Experience the power of Smartphone X1 with its advanced 108MP camera, 120Hz OLED display, and the fastest chip in a smartphone.",
      category_name: "Electronics",
      original_price: 999.0,
      sale_price: 899.0,
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      short_desc: "Active noise cancelling wireless earbuds.",
      long_desc:
        "Wireless Earbuds Pro feature active noise cancellation for immersive sound. Better transparency mode and comfort.",
      category_name: "Electronics",
      original_price: 249.0,
      sale_price: 199.0,
      stock: 100,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Classic Leather Jacket",
      slug: "classic-leather-jacket",
      short_desc: "Premium quality genuine leather jacket.",
      long_desc:
        "This classic leather jacket is crafted from high-quality genuine leather. Timeless design.",
      category_name: "Fashion",
      original_price: 199.0,
      sale_price: 149.0,
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=500&auto=format&fit=crop",
      ],
    },
  ];

  for (const prod of mockProducts) {
    await connection.execute(
      `INSERT INTO products (name, slug, short_desc, long_desc, category_id, original_price, sale_price, stock, images) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prod.name,
        prod.slug,
        prod.short_desc,
        prod.long_desc,
        categoryMap[prod.category_name],
        prod.original_price,
        prod.sale_price,
        prod.stock,
        JSON.stringify(prod.images),
      ],
    );
  }
  log("Seeded mock products.", "success");

  // 5.4 Admin User - Complete Registration
  const adminPassword = await bcrypt.hash("admin123", 10);
  const [adminUserResult] = await connection.execute(
    `INSERT INTO users (
      name, phone, email, password, role, referral_id, 
      is_active, is_phone_verified, account_activation_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Admin",
      "9000000000",
      "admin@example.com",
      adminPassword,
      "ADMIN",
      "ADMINREF",
      true,
      true,
      "ACTIVATED",
    ],
  );
  const adminUserId = adminUserResult.insertId;
  log("Seeded admin user (9000000000 / admin123).", "success");

  // 5.4.1 Admin Profile
  await connection.execute(
    `INSERT INTO profiles (
      user_id, dob, id_type, id_number, id_document_url, identity_status,
      address_document_url, address_status, 
      bank_account_name, bank_name, bank_account_number, bank_ifsc, 
      bank_document_url, bank_status, profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      "1985-01-15",
      "AADHAAR",
      "1234-5678-9012",
      "/uploads/admin/aadhaar.jpg",
      "VERIFIED",
      "/uploads/admin/address_proof.jpg",
      "VERIFIED",
      "Admin",
      "State Bank of India",
      "12345678901234",
      "SBIN0001234",
      "/uploads/admin/passbook.jpg",
      "VERIFIED",
      "/uploads/admin/profile.jpg",
    ],
  );
  log("Seeded admin profile.", "success");

  // 5.4.2 Admin Address
  await connection.execute(
    `INSERT INTO addresses (
      user_id, address_line1, address_line2, city, state, country, pincode, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      "123 Admin Street",
      "Silicon Valley Complex",
      "Chennai",
      "Tamil Nadu",
      "India",
      "600001",
      true,
    ],
  );
  log("Seeded admin address.", "success");

  // 5.4.3 Admin Activation Payment
  await connection.execute(
    `INSERT INTO activation_payments_details (
      user_id, product_id, payment_type, proof_url, status, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      1, // First product created
      "UPI",
      "/uploads/admin/payment_proof.jpg",
      "APPROVED",
      "Admin account - auto-approved",
    ],
  );
  log("Seeded admin activation payment.", "success");

  // 5.4.4 Admin Wallet
  const [adminWalletResult] = await connection.execute(
    `INSERT INTO wallets (user_id, balance, locked_balance, version) 
     VALUES (?, ?, ?, ?)`,
    [adminUserId, 50000.0, 0.0, 0],
  );
  const adminWalletId = adminWalletResult.insertId;
  log("Seeded admin wallet.", "success");

  // 5.4.5 Create sample withdrawal request
  const [withdrawalResult] = await connection.execute(
    `INSERT INTO withdrawal_requests (
      user_id, amount, status, bank_details, admin_comment
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      adminUserId,
      10000.0,
      "APPROVED",
      JSON.stringify({
        account_name: "Admin",
        bank_name: "State Bank of India",
        account_number: "12345678901234",
        ifsc: "SBIN0001234",
      }),
      "Admin withdrawal - approved",
    ],
  );
  log("Seeded withdrawal request.", "success");

  // 5.4.6 Create sample recharge request
  const [rechargeResult] = await connection.execute(
    `INSERT INTO recharge_requests (
      user_id, amount, payment_method, payment_reference, proof_image, status, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      5000.0,
      "UPI",
      "UPI123456789",
      "/uploads/admin/recharge_proof.jpg",
      "APPROVED",
      "Admin recharge - approved",
    ],
  );
  log("Seeded recharge request.", "success");

  // 5.4.7 Wallet Transactions
  const walletTransactions = [
    // Initial credit
    {
      entry_type: "CREDIT",
      transaction_type: "ADMIN_ADJUSTMENT",
      amount: 50000.0,
      balance_before: 0.0,
      balance_after: 50000.0,
      description: "Initial wallet setup - admin credit",
      reference_table: null,
      reference_id: null,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    // Sample commission credit
    {
      entry_type: "CREDIT",
      transaction_type: "REFERRAL_COMMISSION",
      amount: 5000.0,
      balance_before: 50000.0,
      balance_after: 55000.0,
      description: "Level 1 referral commission",
      reference_table: "referral_commission_distribution",
      reference_id: null, // Would be real ID in production
      created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
    },
    // Sample withdrawal debit
    {
      entry_type: "DEBIT",
      transaction_type: "WITHDRAWAL_REQUEST",
      amount: 10000.0,
      balance_before: 55000.0,
      balance_after: 45000.0,
      description: "Withdrawal to bank account",
      reference_table: "withdrawal_requests",
      reference_id: withdrawalResult.insertId,
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    },
    // Sample recharge credit
    {
      entry_type: "CREDIT",
      transaction_type: "RECHARGE_REQUEST",
      amount: 5000.0,
      balance_before: 45000.0,
      balance_after: 50000.0,
      description: "Wallet recharge via UPI",
      reference_table: "recharge_requests",
      reference_id: rechargeResult.insertId,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    },
  ];

  // Generate 25 more random transactions
  let currentBalance = 50000.0;
  const transactionTypes = [
    "REFERRAL_COMMISSION",
    "WITHDRAWAL_REQUEST",
    "RECHARGE_REQUEST",
    "ADMIN_ADJUSTMENT",
  ];

  for (let i = 0; i < 25; i++) {
    const isCredit = Math.random() > 0.4; // 60% chance of credit
    const amount = Math.floor(Math.random() * 5000) + 100; // Random amount between 100 and 5100
    const daysAgo = Math.floor(Math.random() * 20); // Random date within last 20 days

    let entryType, transactionType, balanceBefore, balanceAfter, description;

    if (isCredit) {
      entryType = "CREDIT";
      transactionType =
        Math.random() > 0.5 ? "REFERRAL_COMMISSION" : "RECHARGE_REQUEST";
      if (Math.random() > 0.9) transactionType = "ADMIN_ADJUSTMENT"; // Rare
      
      balanceBefore = currentBalance;
      currentBalance += amount;
      balanceAfter = currentBalance;
      description = `Random credit transaction #${i + 1}`;
    } else {
      entryType = "DEBIT";
      transactionType = "WITHDRAWAL_REQUEST"; 
      if (Math.random() > 0.9) transactionType = "ADMIN_ADJUSTMENT"; // Rare reversal/adjustment

      // Ensure we don't go below 0
      if (currentBalance < amount) {
          // If we can't debit, just skip this iteration or make it a credit
          currentBalance += amount;
          entryType = "CREDIT";
          transactionType = "ADMIN_ADJUSTMENT";
          balanceBefore = currentBalance - amount;
          balanceAfter = currentBalance;
          description = `Correction credit transaction #${i + 1}`;
      } else {
          balanceBefore = currentBalance;
          currentBalance -= amount;
          balanceAfter = currentBalance;
          description = `Random debit transaction #${i + 1}`;
      }
    }

    walletTransactions.push({
      entry_type: entryType,
      transaction_type: transactionType,
      amount: amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: description,
      reference_table: null,
      reference_id: null,
      created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }
  
  // Update wallet balance to match final transaction
  await connection.execute(
    "UPDATE wallets SET balance = ? WHERE id = ?",
    [currentBalance, adminWalletId]
  );
  log(`Updated admin wallet balance to ${currentBalance}`, "info");


  for (const txn of walletTransactions) {
    const createdAt = txn.created_at ? txn.created_at.toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
    await connection.execute(
      `INSERT INTO wallet_transactions (
        wallet_id, entry_type, transaction_type, amount, balance_before, balance_after,
        reference_table, reference_id, description, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminWalletId,
        txn.entry_type,
        txn.transaction_type,
        txn.amount,
        txn.balance_before,
        txn.balance_after,
        txn.reference_table,
        txn.reference_id,
        txn.description,
        "SUCCESS",
        createdAt
      ],
    );
  }
  log("Seeded wallet transactions.", "success");

  // 5.5 Sample Notifications
  const notifications = [
    [
      "Welcome to AffiliateEcom",
      "Start your journey with us today.",
      "We are happy to have you here. Explore our wide range of products!",
      null,
      "2026-12-31 23:59:59",
    ],
    [
      "Big Sale!",
      "Up to 50% off on all items.",
      "Grab the best deals of the season. Limited time offer.",
      null,
      "2026-12-31 23:59:59",
    ],
  ];
  for (const [heading, sDesc, lDesc, img, endTime] of notifications) {
    await connection.execute(
      `INSERT INTO notifications (heading, short_description, long_description, image_url, advertisement_end_time) 
             VALUES (?, ?, ?, ?, ?)`,
      [heading, sDesc, lDesc, img, endTime],
    );
  }
  log("Seeded sample notifications.", "success");

  // 5.6 Tickets
  const tickets = [
    {
      category: "Support",
      subject: "Issue with withdrawal",
      description: "I requested a withdrawal 2 days ago but haven't received it yet.",
      priority: "HIGH",
      status: "OPEN"
    },
    {
       category: "General",
       subject: "How to refer friends?",
       description: "Where can I find my referral link?",
       priority: "LOW",
       status: "COMPLETED"
    }
  ];

  for(const ticket of tickets) {
      await connection.execute(
          `INSERT INTO tickets (user_id, category, subject, description, priority, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
           [adminUserId, ticket.category, ticket.subject, ticket.description, ticket.priority, ticket.status]
      );
  }
  log("Seeded sample tickets.", "success");

  // 5.7 User Notifications
  const userNotifications = [
      {
          type: "SYSTEM",
          title: "Welcome to the platform!",
          is_read: false
      },
      {
          type: "TRANSACTION",
          title: "Wallet credited with 500.00",
          is_read: true
      }
  ];

  for(const notif of userNotifications) {
      await connection.execute(
          `INSERT INTO user_notifications (user_id, type, title, is_read)
           VALUES (?, ?, ?, ?)`,
           [adminUserId, notif.type, notif.title, notif.is_read]
      );
  }
  log("Seeded sample user notifications.", "success");
  
  // 5.8 Sample Orders
  const sampleOrder = {
      order_number: "ORD-" + Date.now(),
      total_amount: 1098.00,
      status: "DELIVERED",
      payment_status: "PAID",
      shipping_address: "123 Admin St, Chennai, TN, 600001"
  };
  
  const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, status, payment_status, shipping_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
       [adminUserId, sampleOrder.order_number, sampleOrder.total_amount, sampleOrder.status, sampleOrder.payment_status, sampleOrder.shipping_address]
  );
  const orderId = orderResult.insertId;

  // Order Items
  // Using Mock Product 1 (Smartphone X1) and Mock Product 2 (Wireless Earbuds)
  // Assuming IDs 1 and 2 exist from previous seed
  await connection.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
      [orderId, 1, 1, 899.00]
  );
  await connection.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
      [orderId, 2, 1, 199.00]
  );
  
  await connection.execute(
      `INSERT INTO order_tracking (order_id, title, description) VALUES (?, ?, ?)`,
      [orderId, "Order Placed", "Your order has been placed successfully."]
  );
  await connection.execute(
      `INSERT INTO order_tracking (order_id, title, description) VALUES (?, ?, ?)`,
      [orderId, "Delivered", "Your order has been delivered."]
  );

  log("Seeded sample orders and tracking.", "success");

  log("Database setup and seeding completed successfully!", "success");
};

// Run the script
transactionRunner(setupDB)
  .then(() => {
    log("Setup script finished.", "success");
    process.exit(0);
  })
  .catch((err) => {
    log(`Setup failed: ${err.message}`, "error");
    process.exit(1);
  });
