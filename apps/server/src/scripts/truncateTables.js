import pool from "../config/db.js";
import { log } from "../utils/helper.js";

const tablesToKeep = [
  "category",
  "products",
  "settings",
  "referral_commission_config",
  "popup_banners",
];

const truncateTables = async () => {
  log("Starting database truncation...", "info");
  const connection = await pool.getConnection();

  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    // Get all tables in the current database
    const [rows] = await connection.query("SHOW TABLES");

    const tablesInDb = rows.map((row) => Object.values(row)[0]);

    for (const table of tablesInDb) {
      if (!tablesToKeep.includes(table)) {
        log(`Truncating table: ${table}`, "info");
        await connection.query(`TRUNCATE TABLE ${table}`);
      } else {
        log(`Skipping table: ${table}`, "info");
      }
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    log("Database truncation completed successfully!", "success");
  } catch (err) {
    log(`Truncation failed: ${err.message}`, "error");
    throw err;
  } finally {
    connection.release();
    await pool.end();
  }
};

truncateTables()
  .then(() => {
    log("Truncation script finished.", "success");
    process.exit(0);
  })
  .catch((err) => {
    log(`Truncation script failed: ${err.message}`, "error");
    process.exit(1);
  });


//   SELECT CONCAT('TRUNCATE TABLE `', table_name, '`;') AS truncate_sql
// FROM information_schema.tables
// WHERE table_schema = DATABASE()
//   AND table_name NOT IN (
//     'category',
//     'products',
//     'settings',
//     'referral_commission_config',
//     'popup_banners'
//   )
//   AND table_type = 'BASE TABLE';