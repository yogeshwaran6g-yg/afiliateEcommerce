import bcrypt from "bcrypt";
import { log } from "../utils/helper.js";
import { callSP } from "../config/db.js";
import walletService from "../services/walletService.js";

export const seedReferrals = async (connection, adminId) => {
  log("Seeding referral tree and commissions...", "info");

  const password = await bcrypt.hash("password123", 10);

  // Helper to create a user and add referral
  const createReferralUser = async (name, phone, referrerId) => {
    const referralId = `REF_${phone}`;
    const [result] = await connection.execute(
      `INSERT INTO users (name, phone, email, password, role, is_active, is_phone_verified, account_activation_status, referral_id, referred_by) 
       VALUES (?, ?, ?, ?, 'USER', true, true, 'ACTIVATED', ?, ?)`,
      [name, phone, `${phone}@mock.com`, password, referralId, referrerId]
    );
    const userId = result.insertId;

    // Create Wallet
    await connection.execute(
      "INSERT INTO wallets (user_id, balance, locked_balance) VALUES (?, ?, ?)",
      [userId, 0, 0]
    );

    // Add to referral tree using Procedure
    await callSP("sp_add_referral", [referrerId, userId], connection);

    return userId;
  };

  // 1. Create 10 Direct Referrals (Level 1)
  log("Creating 10 direct referrals for admin...", "info");
  const directReferralIds = [];
  for (let i = 1; i <= 10; i++) {
    const userId = await createReferralUser(
      `Direct Referral ${i}`,
      `910000000${i}`,
      adminId
    );
    directReferralIds.push(userId);
  }

  // 2. Create a 6-level chain starting from Direct Referral 1
  log("Creating a 6-level deep referral chain...", "info");
  let lastReferrerId = directReferralIds[0];
  const chainIds = [lastReferrerId];
  for (let i = 2; i <= 6; i++) {
    const userId = await createReferralUser(
      `Chain Level ${i}`,
      `920000000${i}`,
      lastReferrerId
    );
    chainIds.push(userId);
    lastReferrerId = userId;
  }

  // 3. Simulate Orders and Commissions
  log("Simulating orders and commissions...", "info");

  // Find a product
  const [products] = await connection.execute("SELECT id FROM products LIMIT 1");
  const productId = products[0]?.id || 1;

  const simulateOrder = async (userId, amount) => {
    const orderNumber = `MOCK-ORD-${Date.now()}-${userId}`;
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, order_number, total_amount, status, payment_status, shipping_address) VALUES (?, ?, ?, 'DELIVERED', 'PAID', 'Mock Address')",
      [userId, orderNumber, amount]
    );
    const orderId = orderResult.insertId;

    await connection.execute(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, 1, ?)",
      [orderId, productId, amount]
    );

    // Distribute Commissions using Procedure
    await callSP("sp_distribute_commission", [orderId, 0, userId, amount], connection);

    // Approve commissions for the Admin (upline_id = adminId) or other uplines
    const [commissions] = await connection.execute(
      "SELECT id, amount, upline_id FROM referral_commission_distribution WHERE order_id = ? AND status = 'PENDING'",
      [orderId]
    );

    for (const comm of commissions) {
      await connection.execute(
        "UPDATE referral_commission_distribution SET status = 'APPROVED', approved_at = NOW() WHERE id = ?",
        [comm.id]
      );

      // Update Wallet Balance
      await walletService.updateWalletBalance(
        comm.upline_id,
        comm.amount,
        'CREDIT',
        'REFERRAL_COMMISSION',
        'referral_commission_distribution',
        comm.id,
        `Mock Commission for Order ${orderNumber}`,
        'SUCCESS',
        null,
        connection
      );
    }
  };

  // Simulate orders
  await simulateOrder(chainIds[chainIds.length - 1], 10000); // Deepest user
  await simulateOrder(chainIds[2], 5000); // Middle of chain
  await simulateOrder(directReferralIds[1], 2000); 
  await simulateOrder(directReferralIds[4], 3000);

  log("Referral seeding completed.", "success");
};
