import pool from '#config/db.js';
import { distributeCommission, createReferral } from '#services/referralService.js';
import walletService from '#services/walletService.js';
import { log } from '#utils/helper.js';

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
        shippingCost = 0.00,
        shippingAddress,
        paymentMethod, // 'WALLET' or 'MANUAL'
        paymentType, // 'UPI' or 'BANK' (for manual)
        transactionReference, // (for manual)
        proofUrl, // (for manual)
        orderType = 'PRODUCT_PURCHASE'
    } = orderData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Generate Order Number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 2. Create Order
        log(`Creating ${orderType} order ${orderNumber} for user ${userId} via ${paymentMethod}`, "info");

        let paymentStatus = 'PENDING';
        if (paymentMethod === 'WALLET') {
            const wallet = await walletService.getWalletByUserId(userId, connection);
            if (parseFloat(wallet.balance) < totalAmount) {
                throw new Error("Insufficient wallet balance");
            }
            paymentStatus = 'PAID';
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders (order_number, user_id, total_amount, shipping_cost, status, order_type, payment_status, payment_method, shipping_address) 
             VALUES (?, ?, ?, ?, 'PROCESSING', ?, ?, ?, ?)`,
            [orderNumber, userId, totalAmount, shippingCost, orderType, paymentStatus, paymentMethod, JSON.stringify(shippingAddress)]
        );

        const orderId = orderResult.insertId;

        // 3. Insert Order Items
        if (items && items.length > 0) {
            const itemValues = items.map(item => [orderId, item.productId, item.quantity, item.price]);
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
                [itemValues]
            );
        }

        // 4. Handle Payment Details
        if (paymentMethod === 'MANUAL' && proofUrl) {
            await connection.query(
                `INSERT INTO order_payments (order_id, payment_type, transaction_reference, proof_url, status) 
                 VALUES (?, ?, ?, ?, 'PENDING')`,
                [orderId, paymentType, transactionReference, proofUrl]
            );

            if (orderType === 'ACTIVATION') {
                await connection.query(
                    'UPDATE users SET account_activation_status = ? WHERE id = ?',
                    ['UNDER_REVIEW', userId]
                );
            }
        } else if (paymentMethod === 'WALLET') {
            const transactionType = orderType === 'ACTIVATION' ? 'ACTIVATION_PURCHASE' : 'PRODUCT_PURCHASE';
            await walletService.updateWalletBalance(
                userId,
                totalAmount,
                'DEBIT',
                transactionType,
                'orders',
                orderId,
                `Payment for ${orderType} order ${orderNumber}`,
                'SUCCESS',
                null,
                connection
            );

            if (orderType === 'ACTIVATION') {
                await connection.query(
                    'UPDATE users SET account_activation_status = "ACTIVATED", is_active = TRUE WHERE id = ?',
                    [userId]
                );

                const [userRows] = await connection.execute('SELECT referred_by FROM users WHERE id = ?', [userId]);
                if (userRows[0]?.referred_by) {
                    await connection.query('CALL sp_add_referral(?, ?)', [userRows[0].referred_by, userId]);
                }
            }

            await distributeCommission(orderId, userId, totalAmount, connection);
        }

        // 5. Insert Initial Tracking
        await connection.query(
            `INSERT INTO order_tracking (order_id, title, description, status_time) 
             VALUES (?, 'Order Placed', ?, NOW())`,
            [orderId, paymentMethod === 'MANUAL' ? 'Your order has been placed and is awaiting payment verification.' : 'Your order has been placed and payment confirmed.']
        );

        await connection.commit();
        return { orderId, orderNumber, status: 'PROCESSING', paymentStatus };
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

        const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) throw new Error("Order not found");
        const order = orders[0];

        await connection.query(
            'UPDATE order_payments SET status = ?, admin_comment = ? WHERE order_id = ?',
            [status, adminComment, orderId]
        );

        if (status === 'APPROVED') {
            await connection.query(
                'UPDATE orders SET payment_status = "PAID" WHERE id = ?',
                [orderId]
            );

            if (order.order_type === 'ACTIVATION') {
                await connection.query(
                    'UPDATE users SET account_activation_status = "ACTIVATED", is_active = TRUE WHERE id = ?',
                    [order.user_id]
                );

                const [userRows] = await connection.execute('SELECT referred_by FROM users WHERE id = ?', [order.user_id]);
                if (userRows[0]?.referred_by) {
                    await createReferral(userRows[0].referred_by, order.user_id, connection);
                }
            }

            await distributeCommission(orderId, order.user_id, order.total_amount, connection);

            await connection.query(
                `INSERT INTO order_tracking (order_id, title, description) VALUES (?, 'Payment Verified', 'Your payment has been successfully verified.')`,
                [orderId]
            );
        } else {
            if (order.order_type === 'ACTIVATION') {
                await connection.query(
                    'UPDATE users SET account_activation_status = "REJECTED" WHERE id = ?',
                    [order.user_id]
                );
            }

            await connection.query(
                `INSERT INTO order_tracking (order_id, title, description) VALUES (?, 'Payment Rejected', ?)`,
                [orderId, adminComment || 'Your payment proof was rejected.']
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

/**
 * Fetches all orders for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - List of orders.
 */
export const getOrdersByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT id, order_number, total_amount, shipping_cost, status, order_type, payment_status, payment_method, created_at 
         FROM orders 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};

/**
 * Fetches a single order by ID with items and tracking.
 * @param {number} orderId - The ID of the order.
 * @param {number} userId - The ID of the user (for ownership check).
 * @returns {Promise<object>} - Order details.
 */
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
        conditions.push("(o.order_number LIKE ? OR u.name LIKE ? OR u.phone LIKE ?)");
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
    let countQuery = "SELECT COUNT(*) as total FROM orders o JOIN users u ON o.user_id = u.id";
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
