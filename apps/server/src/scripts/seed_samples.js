import { log } from "../utils/helper.js";

export const seedSamples = async (connection, adminId, adminWalletId) => {
  log("Seeding sample data (withdrawals, recharges, tickets, notifications, orders)...", "info");

  // 1. Withdrawal record
  const [withdrawalResult] = await connection.execute(
    `INSERT INTO withdrawal_requests (
      user_id, amount, platform_fee, net_amount, status, bank_details, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      adminId,
      10000.0,
      500.0, // 5% of 10000
      9500.0,
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

  // 2. Recharge record
  const [rechargeResult] = await connection.execute(
    `INSERT INTO recharge_requests (
      user_id, amount, payment_method, payment_reference, proof_image, status, admin_comment
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      adminId,
      5000.0,
      "UPI",
      "UPI123456789",
      "/uploads/admin/recharge_proof.jpg",
      "APPROVED",
      "Admin recharge - approved",
    ],
  );

  // 3. Random Wallet Transactions
  let currentBalance = 50000.0;
  for (let i = 0; i < 15; i++) {
    const isCredit = Math.random() > 0.4;
    const amount = Math.floor(Math.random() * 2000) + 100;
    const daysAgo = Math.floor(Math.random() * 20);

    let entryType, transactionType, balanceBefore, balanceAfter, description;

    if (isCredit) {
      entryType = "CREDIT";
      transactionType = Math.random() > 0.5 ? "REFERRAL_COMMISSION" : "RECHARGE_REQUEST";
      balanceBefore = currentBalance;
      currentBalance += amount;
      balanceAfter = currentBalance;
      description = `Random credit transaction #${i + 1}`;
    } else {
      entryType = "DEBIT";
      transactionType = "WITHDRAWAL_REQUEST";
      balanceBefore = currentBalance;
      currentBalance -= amount;
      balanceAfter = currentBalance;
      description = `Random debit transaction #${i + 1}`;
    }

    if (currentBalance >= 0) {
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      await connection.execute(
        `INSERT INTO wallet_transactions (
          wallet_id, entry_type, transaction_type, amount, balance_before, balance_after,
          reference_table, reference_id, description, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [adminWalletId, entryType, transactionType, amount, balanceBefore, balanceAfter, null, null, description, "SUCCESS", createdAt]
      );
    }
  }

  // Update final balance
  await connection.execute("UPDATE wallets SET balance = ? WHERE id = ?", [currentBalance, adminWalletId]);

  // 4. Notifications
  const notifications = [
    ["Welcome to AffiliateEcom", "Start your journey with us today.", "We are happy to have you here.", null, "2026-12-31 23:59:59"],
    ["Big Sale!", "Up to 50% off on all items.", "Grab the best deals of the season.", null, "2026-12-31 23:59:59"],
  ];
  for (const [heading, sDesc, lDesc, img, endTime] of notifications) {
    await connection.execute(
      `INSERT INTO notifications (heading, short_description, long_description, image_url, advertisement_end_time) VALUES (?, ?, ?, ?, ?)`,
      [heading, sDesc, lDesc, img, endTime],
    );
  }

  // 5. Tickets
  const tickets = [
    { category: "Support", subject: "Issue with withdrawal", description: "Where is my money?", priority: "HIGH", status: "OPEN" },
  ];
  for (const ticket of tickets) {
    await connection.execute(
      `INSERT INTO tickets (user_id, category, subject, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [adminId, ticket.category, ticket.subject, ticket.description, ticket.priority, ticket.status]
    );
  }

  // 6. User Notifications
  await connection.execute(
    `INSERT INTO user_notifications (user_id, type, title, is_read) VALUES (?, ?, ?, ?)`,
    [adminId, "SYSTEM", "Welcome!", false]
  );

  // 7. Sample Order
  const [orderResult] = await connection.execute(
    `INSERT INTO orders (user_id, order_number, total_amount, status, payment_status, shipping_address) VALUES (?, ?, ?, 'DELIVERED', 'PAID', '123 Admin St, Chennai')`,
    [adminId, "ORD-" + Date.now(), 1098.00]
  );
  const orderId = orderResult.insertId;
  log(`Created sample order with ID: ${orderId}`, "info");

  await connection.execute(
    `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
    [orderId, 1, 1, 899.00]
  );

  log("Sample data seeded.", "success");
};
