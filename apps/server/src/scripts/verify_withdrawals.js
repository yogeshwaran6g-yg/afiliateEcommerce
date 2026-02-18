import pool, { transactionRunner } from "../config/db.js";
import { log } from "../utils/helper.js";
import { createWithdrawalRequest } from "../services/withdrawalService.js";
import { getWalletByUserId } from "../services/walletService.js";

async function verifyWithdrawals() {
  log("Starting Withdrawal Verification...", "info");

  // Get admin user (seeded with 50000 balance)
  const [userRows] = await pool.query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminId = userRows[0].id;

  log(`Testing with admin ID: ${adminId}`, "info");

  // 1. Clear any existing pending requests for a clean state
  await pool.query("DELETE FROM withdrawal_requests WHERE user_id = ?", [adminId]);
  
  const walletBefore = await getWalletByUserId(adminId);
  log(`Wallet before: balance=${walletBefore.balance}, locked=${walletBefore.locked_balance}`, "info");

  // 2. Test valid request
  log("Test 1: Creating valid withdrawal request (₹1000)...", "info");
  const bankDetails = { bank_name: "Test Bank", account_number: "123" };
  const res1 = await createWithdrawalRequest(adminId, 1000, bankDetails);
  log(`Request 1 created: ${JSON.stringify(res1)}`, "success");

  // Verify DB record
  const [rows] = await pool.query("SELECT * FROM withdrawal_requests WHERE id = ?", [res1.requestId]);
  const req = rows[0];
  log(`Stored request: amount=${req.amount}, platform_fee=${req.platform_fee}, net_amount=${req.net_amount}`, "info");

  if (parseFloat(req.platform_fee) === 50 && parseFloat(req.net_amount) === 950) {
    log("Fee calculation verified (5% of 1000 = 50)", "success");
  } else {
    log(`Fee calculation mismatch! Expected 50, got ${req.platform_fee}`, "error");
  }

  // Verify wallet
  const walletAfter = await getWalletByUserId(adminId);
  log(`Wallet after: balance=${walletAfter.balance}, locked=${walletAfter.locked_balance}`, "info");
  if (parseFloat(walletAfter.locked_balance) === 1000) {
    log("Balance correctly held in locked_balance", "success");
  }

  // 3. Test pending limit (Test 2)
  log("Test 2: Creating 2nd valid withdrawal request (₹1000)...", "info");
  await createWithdrawalRequest(adminId, 1000, bankDetails);
  log("Request 2 created.", "success");

  log("Test 3: Attempting 3rd withdrawal request (should fail)...", "info");
  try {
    await createWithdrawalRequest(adminId, 1000, bankDetails);
    log("ERROR: 3rd request should have failed but succeeded!", "error");
  } catch (err) {
    log(`Success: 3rd request failed as expected: ${err.message}`, "success");
  }

  // 4. Test max amount limit (Test 4)
  // Clear pending requests for this test
  await pool.query("DELETE FROM withdrawal_requests WHERE user_id = ?", [adminId]);
  log("Test 4: Attempting withdrawal over max limit (₹60000)...", "info");
  try {
    await createWithdrawalRequest(adminId, 60000, bankDetails);
    log("ERROR: Withdrawal over max limit should have failed!", "error");
  } catch (err) {
    log(`Success: Oversized request failed as expected: ${err.message}`, "success");
  }

  log("Withdrawal verification completed.", "success");
  process.exit(0);
}

verifyWithdrawals().catch(err => {
  log(`Verification failed: ${err.message}`, "error");
  console.error(err);
  process.exit(1);
});
