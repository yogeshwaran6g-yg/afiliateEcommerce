import { log } from "../utils/helper.js";
import { callSP } from "../config/db.js";
import walletService from "../services/walletService.js";

export const seedSamples = async (connection, adminId, adminWalletId) => {
  log("Seeding comprehensive sample data for all tables...", "info");

  // Get all users except admin
  const [users] = await connection.execute("SELECT id, name FROM users WHERE id != ?", [adminId]);
  const userIds = users.map(u => u.id);
  
  // Find products
  const [products] = await connection.execute("SELECT id, name, sale_price FROM products");
  if (products.length === 0) {
    log("No products found to seed orders. Skipping complex order seeding.", "warning");
    return;
  }

  // 1. Seed OTPs for some users
  log("Seeding mock OTPs...", "info");
  for (let i = 0; i < 5; i++) {
    const userId = userIds[i % userIds.length];
    await connection.execute(
      "INSERT IGNORE INTO otp (user_id, otp_hash, purpose, expires_at) VALUES (?, ?, ?, ?)",
      [userId, "hash_123456", "login", new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ')]
    );
  }

  // 2. Seed Profiles and Addresses for a few users
  log("Seeding profiles and addresses for users...", "info");
  for (let i = 0; i < 5; i++) {
    const userId = userIds[i];
    await connection.execute(
      `INSERT INTO profiles (user_id, dob, identity_status, bank_status) VALUES (?, ?, ?, ?)`,
      [userId, "1990-05-10", "VERIFIED", "VERIFIED"]
    );
    await connection.execute(
      `INSERT INTO addresses (user_id, address_line1, city, state, country, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, `Street ${i}`, "Bangalore", "Karnataka", "India", "560001", true]
    );
  }

  // 3. Seed Recharge Requests (Some approved, some pending)
  log("Seeding recharge requests...", "info");
  for (let i = 0; i < 5; i++) {
    const userId = userIds[i];
    const amount = (i + 1) * 2000;
    const status = i % 2 === 0 ? "APPROVED" : "REVIEW_PENDING";
    
    const [rechargeResult] = await connection.execute(
      `INSERT INTO recharge_requests (user_id, amount, payment_method, payment_reference, status) VALUES (?, ?, ?, ?, ?)`,
      [userId, amount, "UPI", `REF-${userId}-${i}`, status]
    );

    if (status === "APPROVED") {
      // Credit wallet
      const [wallet] = await connection.execute("SELECT id, balance FROM wallets WHERE user_id = ?", [userId]);
      if (wallet[0]) {
        const balanceBefore = parseFloat(wallet[0].balance);
        const balanceAfter = balanceBefore + amount;
        await connection.execute("UPDATE wallets SET balance = ? WHERE id = ?", [balanceAfter, wallet[0].id]);
        await connection.execute(
          `INSERT INTO wallet_transactions (wallet_id, entry_type, transaction_type, amount, balance_before, balance_after, reference_table, reference_id, status) 
           VALUES (?, 'CREDIT', 'RECHARGE_REQUEST', ?, ?, ?, 'recharge_requests', ?, 'SUCCESS')`,
          [wallet[0].id, amount, balanceBefore, balanceAfter, rechargeResult.insertId]
        );
      }
    }
  }

  // 4. Seed Orders, Payments, and Commissions
  log("Seeding orders, payments, and referral commissions...", "info");
  for (let i = 0; i < 8; i++) {
    const userId = userIds[i % userIds.length];
    const product = products[i % products.length];
    const amount = product.sale_price;
    const orderNumber = `ORD-${Date.now()}-${i}`;
    const paymentMethod = i % 2 === 0 ? "WALLET" : "MANUAL";
    const paymentStatus = i < 6 ? "PAID" : "PENDING";
    const orderStatus = i < 4 ? "DELIVERED" : "PROCESSING";

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, status, order_type, payment_status, payment_method, shipping_address) 
       VALUES (?, ?, ?, ?, 'PRODUCT_PURCHASE', ?, ?, 'Mock Address, India')`,
      [userId, orderNumber, amount, orderStatus, paymentStatus, paymentMethod]
    );
    const orderId = orderResult.insertId;

    await connection.execute(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, 1, ?)",
      [orderId, product.id, amount]
    );

    if (paymentMethod === "MANUAL") {
      await connection.execute(
        `INSERT INTO order_payments (order_id, payment_type, transaction_reference, proof_url, status) 
         VALUES (?, 'UPI', ?, '/uploads/mock/proof.jpg', ?)`,
        [orderId, `TXN-${orderId}`, paymentStatus === "PAID" ? "APPROVED" : "PENDING"]
      );
    }

    if (paymentStatus === "PAID") {
      // Distribute Commissions
      await callSP("sp_distribute_commission", [orderId, 0, userId, amount], connection);

      // Approve some commissions to test wallet updates
      const [commissions] = await connection.execute(
        "SELECT id, amount, upline_id FROM referral_commission_distribution WHERE order_id = ? AND status = 'PENDING'",
        [orderId]
      );

      for (const comm of commissions) {
        // Only approve some commissions to keep some pending
        if (Math.random() > 0.3) {
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
            `Commission for Order ${orderNumber}`,
            'SUCCESS',
            null,
            connection
          );
        }
      }
    }
  }

  // 5. Seed Withdrawal Requests
  log("Seeding withdrawal requests...", "info");
  for (let i = 0; i < 3; i++) {
    const userId = userIds[i];
    const [wallet] = await connection.execute("SELECT id, balance FROM wallets WHERE user_id = ?", [userId]);
    if (wallet[0] && parseFloat(wallet[0].balance) > 500) {
      const amount = 500;
      const fee = 25;
      const net = 475;
      
      const [withdrawalResult] = await connection.execute(
        `INSERT INTO withdrawal_requests (user_id, amount, platform_fee, net_amount, status, bank_details) 
         VALUES (?, ?, ?, ?, 'REVIEW_PENDING', ?)`,
        [userId, amount, fee, net, JSON.stringify({ bank: "Sample Bank", acc: "12345" })]
      );

      // Lock balance for pending withdrawal
      await connection.execute(
        "UPDATE wallets SET balance = balance - ?, locked_balance = locked_balance + ? WHERE id = ?",
        [amount, amount, wallet[0].id]
      );
      
      await connection.execute(
        `INSERT INTO wallet_transactions (wallet_id, entry_type, transaction_type, amount, balance_before, balance_after, reference_table, reference_id, status) 
         VALUES (?, 'DEBIT', 'WITHDRAWAL_REQUEST', ?, ?, ?, 'withdrawal_requests', ?, 'PENDING')`,
        [wallet[0].id, amount, wallet[0].balance, parseFloat(wallet[0].balance) - amount, withdrawalResult.insertId]
      );
    }
  }

  // 6. Seed Tickets and Notifications
  log("Seeding tickets and user notifications...", "info");
  for (let i = 0; i < 5; i++) {
    const userId = userIds[i % userIds.length];
    await connection.execute(
      `INSERT INTO tickets (user_id, category, subject, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'ORDER', `Sample Ticket ${i}`, 'I have an issue with my order.', 'MEDIUM', 'OPEN']
    );
    await connection.execute(
      `INSERT INTO user_notifications (user_id, title, type, description) VALUES (?, ?, ?, ?)`,
      [userId, `Welcome Notification ${i}`, 'ACCOUNT', 'Welcome to the platform!']
    );
  }

  // 7. Seed Popup Banners
  log("Seeding popup banners...", "info");
  const banners = [
    { title: "Welcome Sale", short: "Get 20% off on your first order!", long: "Enjoy our welcome sale with 20% off on all electronics and fashion items. Valid for a limited time." },
    { title: "Refer & Earn", short: "Earn commissions by referring friends!", long: "Join our referral program and earn up to 6 levels of commission on every purchase made by your referrals." }
  ];
  for (const banner of banners) {
    await connection.execute(
      "INSERT INTO popup_banners (title, short_description, long_description, is_active) VALUES (?, ?, ?, true)",
      [banner.title, banner.short, banner.long]
    );
  }

  // 8. Seed Global Notifications (Advertisements)
  log("Seeding global notifications...", "info");
  for (let i = 1; i <= 3; i++) {
    await connection.execute(
      `INSERT INTO notifications (heading, short_description, long_description, advertisement_end_time) VALUES (?, ?, ?, ?)`,
      [
        `Summer Deal ${i}`,
        `Exclusive summer deals just for you!`,
        `Check out our summer collection and enjoy huge discounts on sports and outdoor gear.`,
        new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
  }

  // 9. Seed Carts and Cart Items
  log("Seeding user carts...", "info");
  for (let i = 0; i < 10; i++) {
    const userId = userIds[i % userIds.length];
    const [cartResult] = await connection.execute(
      "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
      [userId]
    );
    const cartId = cartResult.insertId;

    // Add 1-3 random products to cart
    const numItems = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      await connection.execute(
        "INSERT IGNORE INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, product.id, Math.floor(Math.random() * 2) + 1]
      );
    }
  }

  // 10. Seed Order Tracking for existing orders
  log("Seeding order tracking...", "info");
  const [allOrders] = await connection.execute("SELECT id, status FROM orders");
  for (const order of allOrders) {
    await connection.execute(
      "INSERT INTO order_tracking (order_id, title, description) VALUES (?, ?, ?)",
      [order.id, "Order Placed", "Your order has been successfully placed and is being processed."]
    );
    
    if (order.status !== 'PROCESSING' && order.status !== 'CANCELLED') {
      await connection.execute(
        "INSERT INTO order_tracking (order_id, title, description) VALUES (?, ?, ?)",
        [order.id, "Order Shipped", "Your order has been handed over to the courier."]
      );
    }
    
    if (order.status === 'DELIVERED') {
      await connection.execute(
        "INSERT INTO order_tracking (order_id, title, description) VALUES (?, ?, ?)",
        [order.id, "Order Delivered", "Your order has been delivered successfully."]
      );
    }
  }

  log("Sample data seeding completed successfully!", "success");
};

