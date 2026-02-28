import pool from "#config/db.js";
import {
  distributeCommission,
  createReferral,
} from "#services/referralService.js";
import walletService from "#services/walletService.js";
import userNotificationService from "#services/userNotificationService.js";
import { log } from "#utils/helper.js";
import {queryRunner } from "#config/db.js"

/**
 * Creates a new order with items and initial tracking.
 * @param {object} orderData - The order data.
 * @returns {Promise<object>} - The created order details.
 */
export const createOrder = async (orderData) => {
  const {
    userId,
    items,
    totalAmount,
    shippingCost = 0.0,
    shippingAddress,
    paymentMethod, // 'WALLET' or 'MANUAL'
    paymentType, // 'UPI' or 'BANK' (for manual)
    transactionReference, // (for manual)
    proofUrl, // (for manual)
    orderType = "PRODUCT_PURCHASE",
  } = orderData;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (items && items.length <= 0) {
      throw new Error("unable to make a order with empty items")
    }
    // 1. Generate Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 2. Create Order
    log(
      `Creating ${orderType} order ${orderNumber} for user ${userId} via ${paymentMethod} to be created`,
      "info"
    );

    let paymentStatus = "PENDING";
    let walletTransactionId = null;

    if (paymentMethod === "WALLET") {
      // Check if user is activated for non-activation orders
      if (orderType !== "ACTIVATION") {
        const [userRows] = await connection.execute(
          "SELECT account_activation_status FROM users WHERE id = ?",
          [userId]
        );
        if (userRows[0]?.account_activation_status !== "ACTIVATED") {
          throw new Error(
            "Your account must be activated to use wallet for product purchases."
          );
        }
      }

      const wallet = await walletService.getWalletByUserId(userId, connection);
      if (parseFloat(wallet.balance) < totalAmount) {
        throw new Error("Insufficient wallet balance");
      }
      
      const transactionType =
        orderType === "ACTIVATION" ? "ACTIVATION_PURCHASE" : "PRODUCT_PURCHASE";
      
      const holdResult = await walletService.holdBalance(
        userId,
        totalAmount,
        transactionType,
        "orders",
        null, // Will update with orderId later
        `Holding payment for ${orderType} order`,
        connection
      );
      walletTransactionId = holdResult.transactionId;
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_number, user_id, total_amount, shipping_cost, status, order_type, payment_status, payment_method, shipping_address) 
             VALUES (?, ?, ?, ?, 'PROCESSING', ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        totalAmount,
        shippingCost,
        orderType,
        paymentStatus,
        paymentMethod,
        JSON.stringify(shippingAddress),
      ]
    );

    const orderId = orderResult.insertId;
    log(`Order ${orderNumber} (ID: ${orderId}) record created in DB.`, "info");

    // Update wallet transaction with orderId if it was a wallet purchase
    if (walletTransactionId) {
      await connection.query(
        "UPDATE wallet_transactions SET reference_id = ?, description = ? WHERE id = ?",
        [orderId, `Payment for ${orderType} order ${orderNumber}`, walletTransactionId]
      );
    }

    // 3. Insert Order Items
    if (items && items.length > 0) {
      const itemValues = items.map((item) => [
        orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
        [itemValues]
      );
      log(`Order items inserted for orderId: ${orderId}`, "info");
    }

    // 4. Handle Payment Details
    if (paymentMethod === "MANUAL") {
      await connection.query(
        `INSERT INTO order_payments (order_id, payment_type, transaction_reference, proof_url, status) 
                 VALUES (?, ?, ?, ?, 'PENDING')`,
        [orderId, paymentType, transactionReference, proofUrl]
      );
      log(`Manual payment details inserted for orderId: ${orderId}`, "info");

      if (orderType === "ACTIVATION") {
        await connection.query(
          "UPDATE users SET account_activation_status = ? WHERE id = ?",
          ["UNDER_REVIEW", userId]
        );
      }

      // Notify admins about new manual payment order
      const [currentUser] = await connection.execute('SELECT name FROM users WHERE id = ?', [userId]);
      await userNotificationService.notifyAdmins({
        type: 'PAYMENT',
        title: orderType === 'ACTIVATION' ? 'New Activation Request' : 'New Manual Payment Order',
        description: `User ${currentUser[0]?.name || 'Unknown'} has placed an order (${orderNumber}) with manual payment proof.`,
        link: '/order-payment'
      });
    } else if (paymentMethod === "WALLET") {
       // Also insert into order_payments for visibility in order payments page
       await connection.query(
        `INSERT INTO order_payments (order_id, payment_type, transaction_reference, proof_url, status) 
                 VALUES (?, ?, ?, ?, 'PENDING')`,
        [orderId, 'WALLET', `WALLET-${orderNumber}`, 'wallet_payment']
      );

      if (orderType === "ACTIVATION") {
        await connection.query(
          'UPDATE users SET account_activation_status = "UNDER_REVIEW" WHERE id = ?',
          [userId]
        );
      }

      const [currentUser] = await connection.execute('SELECT name FROM users WHERE id = ?', [userId]);
      await userNotificationService.notifyAdmins({
        type: 'PAYMENT',
        title: orderType === 'ACTIVATION' ? 'New Activation Request (Wallet)' : 'New Wallet Payment Order',
        description: `User ${currentUser[0]?.name || 'Unknown'} has placed an order (${orderNumber}) via Wallet.`,
        link: '/order-payment'
      });
    }

    // 5. Insert Initial Tracking
    await connection.query(
      `INSERT INTO order_tracking (order_id, title, description, status_time) 
             VALUES (?, 'Order Placed', ?, NOW())`,
      [
        orderId,
        paymentMethod === "MANUAL"
          ? "Your order has been placed and is awaiting payment verification."
          : "Your order has been placed and payment confirmed.",
      ]
    );

    await connection.commit();
    return { orderId, orderNumber, status: "PROCESSING", paymentStatus };
  } catch (error) {
    if (connection) await connection.rollback();
    log(`Error in createOrder: ${error.message}`, "error");
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Updates an order payment status (usually called by admin).
 */
export const verifyOrderPayment = async (orderId, status, adminComment) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );
    if (orders.length === 0) throw new Error("Order not found");
    const order = orders[0];

    const [orderPayment] = await connection.query(
      "SELECT * FROM order_payments WHERE order_id = ?",
      [orderId]
    );

    if (orderPayment.length === 0) throw new Error("Order payment details not found");

    if (orderPayment[0].status === "APPROVED") {
      throw new Error("unable change the approved order");
    }

    await connection.query(
      "UPDATE order_payments SET status = ?, admin_comment = ? WHERE order_id = ?",
      [status, adminComment, orderId]
    );

    if (status === "APPROVED") {
      // Update Payment Status
      await connection.query(
        'UPDATE orders SET payment_status = "PAID" WHERE id = ?',
        [orderId]
      );

      if (order.payment_method === "WALLET") {
        // Release Held Balance
        const [wallet] = await connection.query("SELECT id FROM wallets WHERE user_id = ?", [order.user_id]);
        await walletService.releaseHeldBalance(wallet[0].id, order.total_amount, connection);

        // Update Wallet Transaction Status
        await connection.query(
          "UPDATE wallet_transactions SET status = 'SUCCESS' WHERE reference_table = 'orders' AND reference_id = ? AND wallet_id = ?",
          [orderId, wallet[0].id]
        );
      } else {
        // Record Wallet Transaction for Manual Payment to unify history
        // Without affecting actual wallet balance (direct log)
        const [wallet] = await connection.query("SELECT id, balance, locked_balance FROM wallets WHERE user_id = ?", [order.user_id]);
        if (wallet.length === 0) throw new Error("Wallet not found");

        const transactionType =
          order.order_type === "ACTIVATION" ? "ACTIVATION_PURCHASE" : "PRODUCT_PURCHASE";

        await connection.query(
          `INSERT INTO wallet_transactions (
                    wallet_id, entry_type, transaction_type, amount, balance_before, balance_after,
                    locked_after, locked_before, reference_table, reference_id, status, description
                ) VALUES (?, 'DEBIT', ?, ?, ?, ?, ?, ?, 'orders', ?, 'SUCCESS', ?)`,
          [
            wallet[0].id,
            transactionType,
            order.total_amount,
            wallet[0].balance,
            wallet[0].balance, // Balance remains the same
            wallet[0].locked_balance,
            wallet[0].locked_balance,
            orderId,
            `Manual payment for ${order.order_type} order ${order.order_number}`
          ]
        );
      }

      if (order.order_type === "ACTIVATION") {
        await connection.query(
          'UPDATE users SET account_activation_status = "ACTIVATED", is_active = TRUE WHERE id = ?',
          [order.user_id]
        );

        const [userRows] = await connection.execute(
          "SELECT referred_by FROM users WHERE id = ?",
          [order.user_id]
        );
        if (userRows[0]?.referred_by) {
      
          const [exists] = await connection.query("SELECT 1 FROM referral_tree WHERE upline_id = ? AND downline_id = ? AND level = 1", [userRows[0].referred_by, order.user_id]);
          if (exists.length === 0) {
            await createReferral(
              userRows[0].referred_by,
              order.user_id,
              connection
            );
          }
        }
      }

      await distributeCommission(
        orderId,
        order.user_id,
        order.total_amount,
        connection
      );

      await connection.query(
        `INSERT INTO order_tracking (order_id, title, description) VALUES (?, 'Payment Verified', 'Your payment has been successfully verified.')`,
        [orderId]
      );
    } else {
      // REJECTED
      if (order.payment_method === "WALLET") {
        // Rollback Held Balance
        const [wallet] = await connection.query("SELECT id FROM wallets WHERE user_id = ?", [order.user_id]);
        await walletService.rollbackHeldBalance(wallet[0].id, order.total_amount, connection);
        
        // Update Wallet Transaction Status
        await connection.query(
          "UPDATE wallet_transactions SET status = 'REVERSED' WHERE reference_table = 'orders' AND reference_id = ? AND wallet_id = ?",
          [orderId, wallet[0].id]
        );
      }

      if (order.order_type === "ACTIVATION") {
        await connection.query(
          'UPDATE users SET account_activation_status = "REJECTED", is_blocked = TRUE WHERE id = ?',
          [order.user_id]
        );
      }

      await connection.query(
        `INSERT INTO order_tracking (order_id, title, description) VALUES (?, 'Payment Rejected', ?)`,
        [orderId, adminComment || "Your payment proof was rejected."]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    if (connection) await connection.rollback();
    log(`Error in verifyOrderPayment: ${error.message}`, "error");
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const getOrdersByUserId = async (userId, options = {}) => {
  let { page = 1, limit = 10, status, date } = options;

  // Normalize and clamp pagination values for safety
  page = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  limit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const MAX_LIMIT = 50;
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const offset = (page - 1) * limit;

  let query = `
        SELECT id, order_number, total_amount, shipping_cost, status, order_type, payment_status, payment_method, created_at 
        FROM orders 
        WHERE user_id = ?
    `;
  const params = [userId];

  if (status && status !== "All Orders") {
    query += " AND status = ?";
    params.push(status.toUpperCase().replace(" ", "_"));
  }

  if (date) {
    // Use a range filter so MySQL can leverage (user_id, created_at) index
    query += " AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)";
    params.push(date, date);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  console.log(query, params);
  const rows = await queryRunner(query, params);
  console.log(rows)

  // Get total count for pagination
  let countQuery = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
  const countParams = [userId];

  if (status && status !== "All Orders") {
    countQuery += " AND status = ?";
    countParams.push(status.toUpperCase().replace(" ", "_"));
  }

  if (date) {
    countQuery += " AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)";
    countParams.push(date, date);
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0]?.total || 0;

  // Get status counts for tabs
  const [statusCounts] = await pool.execute(
    `SELECT status, COUNT(*) as count FROM orders WHERE user_id = ? GROUP BY status`,
    [userId]
  );

  const counts = {
    "All Orders": 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    OUT_FOR_DELIVERY: 0,
  };

  let allTotal = 0;
  statusCounts.forEach((row) => {
    counts[row.status] = row.count;
    allTotal += row.count;
  });
  counts["All Orders"] = allTotal;

  return { orders: rows, total, counts };
};


export const getOrderById = async (orderId, userId) => {
  const [orders] = await pool.execute(
    `SELECT o.*, op.payment_type, op.transaction_reference, op.proof_url, op.status as verification_status, op.admin_comment 
         FROM orders o
         LEFT JOIN order_payments op ON o.id = op.order_id
         WHERE o.id = ? AND o.user_id = ?`,
    [orderId, userId]
  );

  if (orders.length === 0) return null;
  const order = orders[0];

  const [items] = await pool.execute(
    `SELECT oi.*, p.name as product_name, p.images 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
    [orderId]
  );

  const [tracking] = await pool.execute(
    `SELECT * FROM order_tracking WHERE order_id = ? ORDER BY status_time DESC`,
    [orderId]
  );

  return { ...order, items, tracking };
};

/**
 * Fetches all orders (admin view) with pagination and basic filters.
 */
export const getAllOrders = async (filters = {}, limit = 50, offset = 0) => {
  let query = `
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
    `;
  const params = [];
  const conditions = [];

  if (filters.status) {
    conditions.push("o.status = ?");
    params.push(filters.status);
  }
  if (filters.orderType) {
    conditions.push("o.order_type = ?");
    params.push(filters.orderType);
  }
  if (filters.search) {
    conditions.push(
      "(o.order_number LIKE ? OR u.name LIKE ? OR u.phone LIKE ?)"
    );
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  const [orders] = await pool.query(query, params);

  // Count total for pagination
  let countQuery =
    "SELECT COUNT(*) as total FROM orders o JOIN users u ON o.user_id = u.id";
  if (conditions.length > 0) {
    countQuery += " WHERE " + conditions.join(" AND ");
  }
  const [countResult] = await pool.query(countQuery, params.slice(0, -2));
  const total = countResult[0]?.total || 0;

  return { orders, total };
};

/**
 * Fetches a single order by ID with items and tracking (admin view - no userId check).
 */
export const getOrderByIdAdmin = async (orderId) => {
  const [orders] = await pool.execute(
    `SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
                op.payment_type, op.transaction_reference, op.proof_url, op.status as verification_status, op.admin_comment 
         FROM orders o
         JOIN users u ON o.user_id = u.id
         LEFT JOIN order_payments op ON o.id = op.order_id
         WHERE o.id = ?`,
    [orderId]
  );

  if (orders.length === 0) return null;
  const order = orders[0];

  const [items] = await pool.execute(
    `SELECT oi.*, p.name as product_name, p.images 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
    [orderId]
  );

  const [tracking] = await pool.execute(
    `SELECT * FROM order_tracking WHERE order_id = ? ORDER BY status_time DESC`,
    [orderId]
  );

  return { ...order, items, tracking };
};

/**
 * Adds a new tracking update for an order.
 */
export const addOrderTracking = async (orderId, title, description) => {
    const [result] = await pool.execute(
        `INSERT INTO order_tracking (order_id, title, description, status_time) 
         VALUES (?, ?, ?, NOW())`,
        [orderId, title, description]
    );

    // Also update order status if title matches certain keywords (optional but helpful)
    const upperTitle = title.toUpperCase();
    let newStatus = null;
    if (upperTitle.includes('SHIPPED')) newStatus = 'SHIPPED';
    else if (upperTitle.includes('OUT FOR DELIVERY')) newStatus = 'OUT_FOR_DELIVERY';
    else if (upperTitle.includes('DELIVERED')) newStatus = 'DELIVERED';
    else if (upperTitle.includes('CANCEL')) newStatus = 'CANCELLED';

    if (newStatus) {
        await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
    }

    return { id: result.insertId, orderId, title, description };
};

/**
 * Fetches all order payments (admin view) with pagination and basic filters.
 */
export const getAllOrderPayments = async (filters = {}, limit = 50, offset = 0) => {
    let query = `
        SELECT op.*, o.order_number, o.total_amount, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM order_payments op
        JOIN orders o ON op.order_id = o.id
        JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (filters.status) {
        conditions.push("op.status = ?");
        params.push(filters.status);
    }
    if (filters.search) {
        conditions.push("(o.order_number LIKE ? OR u.name LIKE ? OR op.transaction_reference LIKE ?)");
        const searchPattern = `%${filters.search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY op.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [payments] = await pool.query(query, params);

    // Count total for pagination
    let countQuery = `
        SELECT COUNT(*) as total 
        FROM order_payments op 
        JOIN orders o ON op.order_id = o.id 
        JOIN users u ON o.user_id = u.id
    `;
    if (conditions.length > 0) {
        countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countResult] = await pool.query(countQuery, params.slice(0, -2));
    const total = countResult[0]?.total || 0;

    // Get status counts for tabs
    const [statusCounts] = await pool.execute(
        `SELECT status, COUNT(*) as count FROM order_payments GROUP BY status`
    );

    const counts = {
        ALL: 0,
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
    };

    let allTotal = 0;
    statusCounts.forEach((row) => {
        counts[row.status] = row.count;
        allTotal += row.count;
    });
    counts["ALL"] = allTotal;

    return { payments, total, counts };
};
