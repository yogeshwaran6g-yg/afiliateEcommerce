import pool, { transactionRunner } from "../config/db.js";
import { log } from "../utils/helper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import seed modules
import { seedSettings } from "./seed_settings.js";
import { seedCore } from "./seed_core.js";
import { seedUsers } from "./seed_users.js";
import { seedReferrals } from "./seed_referrals.js";
import { seedSamples } from "./seed_samples.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDB = async (connection) => {
  log("Starting Consolidated Database Setup...", "info");

  // 1. Drop stored procedures
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
    "popup_banners",
    "settings",
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
    "order_payments",
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

  const dbStatements = dbSqlContent
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of dbStatements) {
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
        throw err;
      }
    }
  }
  log("Schema created successfully.", "success");

  // 4. Create stored procedures from storedProcedure.sql
  log("Creating stored procedures from storedProcedure.sql...", "info");
  const spSqlPath = path.resolve(__dirname, "../../storedProcedure.sql");
  const spSqlContent = fs.readFileSync(spSqlPath, "utf8");

  const spBlocks = spSqlContent
    .split("//")
    .filter((block) => block.trim().toLowerCase().includes("create procedure"));

  for (let block of spBlocks) {
    let cleanBlock = block
      .split("\n")
      .filter((line) => !line.trim().toUpperCase().startsWith("DELIMITER"))
      .join("\n")
      .trim();

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

  // 5. Consolidated Seeding
  log("Starting modular seeding process...", "info");
  
  // 5.1 System Settings
  await seedSettings(connection);

  // 5.2 Core System Data (Configs, Categories, Products)
  await seedCore(connection);

  // 5.3 Initial Users (Admin)
  const { adminUserId, adminWalletId } = await seedUsers(connection);

  // 5.4 Referral Tree and Commissions
  await seedReferrals(connection, adminUserId);

  // 5.5 Other Sample Data
  await seedSamples(connection, adminUserId, adminWalletId);

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

