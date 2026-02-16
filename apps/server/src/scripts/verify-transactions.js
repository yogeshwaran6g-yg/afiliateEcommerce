
import pool from "../config/db.js";
import { log } from "../utils/helper.js";

async function verifyTransactions() {
  try {
    log("Verifying wallet transactions...", "info");

    const [rows] = await pool.query(
      `SELECT wt.*, u.name as user_name 
       FROM wallet_transactions wt
       JOIN wallets w ON wt.wallet_id = w.id
       JOIN users u ON w.user_id = u.id
       WHERE u.role = 'ADMIN'
       ORDER BY wt.created_at DESC`
    );

    log(`Found ${rows.length} transactions for Admin user.`, "success");

    if (rows.length > 0) {
      console.table(rows.map(r => ({
        id: r.id,
        type: r.transaction_type,
        amount: r.amount,
        balance_after: r.balance_after,
        created_at: r.created_at
      })));
    } else {
      log("No transactions found!", "error");
    }

    process.exit(0);
  } catch (err) {
    log(`Verification failed: ${err.message}`, "error");
    process.exit(1);
  }
}

verifyTransactions();
