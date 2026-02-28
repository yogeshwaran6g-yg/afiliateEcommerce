import pool from "./apps/server/src/config/db.js";
import { createOrder, verifyOrderPayment } from "./apps/server/src/services/orderService.js";
import walletService from "./apps/server/src/services/walletService.js";
import { log } from "./apps/server/src/utils/helper.js";

async function testOrderUnification() {
  let testUserId = null;
  try {
    console.log("Starting Order Unification Tests...");

    // 1. Setup Test User
    const [userResult] = await pool.query(
      "INSERT INTO users (name, phone, role, referral_id, is_active, account_activation_status) VALUES (?, ?, ?, ?, ?, ?)",
      ["Test User", "9999999999", "USER", "TESTREF", false, "NOT_STARTED"]
    );
    testUserId = userResult.insertId;
    console.log(`Created test user with ID: ${testUserId}`);

    // 2. Setup Wallet with Balance
    await walletService.createWallet(testUserId);
    await walletService.updateWalletBalance(testUserId, 1000, "CREDIT", "ADMIN_ADJUSTMENT", null, null, "Test initial balance");
    
    let wallet = await walletService.getWalletByUserId(testUserId);
    console.log("Initial Wallet:", { balance: wallet.balance, locked: wallet.locked_balance });

    if (parseFloat(wallet.balance) !== 1000) throw new Error("Initial balance setup failed");

    // 3. Test Wallet Activation Order Creation
    console.log("\n--- Testing Activation Order Creation (Wallet) ---");
    const orderData = {
      userId: testUserId,
      items: [],
      totalAmount: 500,
      shippingAddress: {},
      paymentMethod: "WALLET",
      orderType: "ACTIVATION"
    };
    const order = await createOrder(orderData);
    console.log("Order Created:", order);

    wallet = await walletService.getWalletByUserId(testUserId);
    console.log("Wallet after order creation:", { balance: wallet.balance, locked: wallet.locked_balance });

    if (parseFloat(wallet.balance) !== 500) throw new Error("Balance not reduced after hold");
    if (parseFloat(wallet.locked_balance) !== 500) throw new Error("Balance not moved to locked");

    const [userRows] = await pool.query("SELECT account_activation_status FROM users WHERE id = ?", [testUserId]);
    console.log("User status after order:", userRows[0].account_activation_status);
    if (userRows[0].account_activation_status !== "UNDER_REVIEW") throw new Error("User status should be UNDER_REVIEW");

    // 4. Test Approval
    console.log("\n--- Testing Order Approval ---");
    await verifyOrderPayment(order.orderId, "APPROVED", "Approved for test");
    
    wallet = await walletService.getWalletByUserId(testUserId);
    console.log("Wallet after approval:", { balance: wallet.balance, locked: wallet.locked_balance });

    if (parseFloat(wallet.locked_balance) !== 0) throw new Error("Locked balance not released");
    
    const [finalUserRows] = await pool.query("SELECT account_activation_status, is_active FROM users WHERE id = ?", [testUserId]);
    console.log("User status after approval:", finalUserRows[0]);
    if (finalUserRows[0].account_activation_status !== "ACTIVATED") throw new Error("User should be ACTIVATED");
    if (!finalUserRows[0].is_active) throw new Error("User should be active");

    // 5. Test Rejection & Blocking
    console.log("\n--- Testing Order Rejection & Blocking ---");
    // Create another order
    const order2 = await createOrder({
      userId: testUserId,
      items: [],
      totalAmount: 200,
      shippingAddress: {},
      paymentMethod: "WALLET",
      orderType: "PRODUCT_PURCHASE" // Just to test balance logic again
    });

    console.log("Order 2 Created:", order2.orderId);
    
    await verifyOrderPayment(order2.orderId, "REJECTED", "Rejected for test");
    
    wallet = await walletService.getWalletByUserId(testUserId);
    console.log("Wallet after rejection:", { balance: wallet.balance, locked: wallet.locked_balance });

    if (parseFloat(wallet.balance) !== 500) throw new Error("Balance should be 500 after rollback (1000 - 500 approved = 500)");
    if (parseFloat(wallet.locked_balance) !== 0) throw new Error("Locked balance not cleared on rejection");

    // For rejection testing of ACTIVATION, let's reset user and try activation rejection
    await pool.query("UPDATE users SET account_activation_status = 'PENDING_PAYMENT', is_active = FALSE, is_blocked = FALSE WHERE id = ?", [testUserId]);
    const order3 = await createOrder({
      userId: testUserId,
      items: [],
      totalAmount: 100,
      shippingAddress: {},
      paymentMethod: "WALLET",
      orderType: "ACTIVATION"
    });
    
    await verifyOrderPayment(order3.orderId, "REJECTED", "Rejected activation");
    const [blockedUserRows] = await pool.query("SELECT account_activation_status, is_blocked FROM users WHERE id = ?", [testUserId]);
    console.log("User status after activation rejection:", blockedUserRows[0]);
    if (blockedUserRows[0].is_blocked !== 1) throw new Error("User should be blocked");

    console.log("\nAll tests passed successfully!");

  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
    if (testUserId) {
      console.log("\nCleaning up test user...");
      await pool.query("DELETE FROM order_tracking WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)", [testUserId]);
      await pool.query("DELETE FROM wallet_transactions WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = ?)", [testUserId]);
      await pool.query("DELETE FROM wallets WHERE user_id = ?", [testUserId]);
      await pool.query("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)", [testUserId]);
      await pool.query("DELETE FROM order_payments WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)", [testUserId]);
      await pool.query("DELETE FROM orders WHERE user_id = ?", [testUserId]);
      await pool.query("DELETE FROM users WHERE id = ?", [testUserId]);
    }
    await pool.end();
  }
}

testOrderUnification();
