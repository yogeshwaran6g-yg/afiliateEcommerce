import pool from '#config/db.js';
import { distributeCommission } from '#services/referralService.js';
import { log } from '#utils/helper.js';

/**
 * Creates a new order with items and initial tracking.
 * @param {object} orderData - The order data.
 * @returns {Promise<object>} - The created order details.
 */
export const createOrder = async (orderData) => {
    const { userId, items, totalAmount, shippingAddress, paymentStatus = 'PENDING' } = orderData;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Generate Order Number (Simple timestamp + random suffix for now)
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 2. Create Order
        log(`Creating order ${orderNumber} for user ${userId}`, "info");
        const [orderResult] = await connection.query(
            `INSERT INTO orders (order_number, user_id, total_amount, status, payment_status, shipping_address) 
             VALUES (?, ?, ?, 'PROCESSING', ?, ?)`,
            [orderNumber, userId, totalAmount, paymentStatus, JSON.stringify(shippingAddress)]
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

        // 4. Insert Initial Tracking
        await connection.query(
            `INSERT INTO order_tracking (order_id, title, description, status_time) 
             VALUES (?, 'Order Placed', 'Your order has been placed successfully.', NOW())`,
            [orderId]
        );

        // 5. Commission Distribution (if applicable immediately)
        // Note: Usually commission is distributed after payment/delivery, but keeping logic placeholder
        if (paymentStatus === 'PAID') {
            // await distributeCommission(orderId, userId, totalAmount, connection); 
        }

        await connection.commit();
        return { orderId, orderNumber, status: 'PROCESSING' };
    } catch (error) {
        await connection.rollback();
        log(`Error in createOrder: ${error.message}`, "error");
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Fetches all orders for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - List of orders.
 */
export const getOrdersByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT id, order_number, total_amount, status, payment_status, created_at 
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
    // 1. Get Order Details
    const [orders] = await pool.execute(
        `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
        [orderId, userId]
    );

    if (orders.length === 0) return null;
    const order = orders[0];

    // 2. Get Order Items
    const [items] = await pool.execute(
        `SELECT oi.*, p.name as product_name, p.images 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [orderId]
    );

    // 3. Get Order Tracking
    const [tracking] = await pool.execute(
        `SELECT * FROM order_tracking WHERE order_id = ? ORDER BY status_time DESC`,
        [orderId]
    );

    return { ...order, items, tracking };
};

