import pool from '../config/db.js';
import { distributeCommission } from './referralService.js';
import { log } from '../utils/helper.js';

export const createOrder = async (orderData) => {
    const { userId, amount, status = 'PENDING' } = orderData;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        log(`Creating order for user ${userId}, amount ${amount}`, "info");
        const [result] = await connection.query(
            'INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)',
            [userId, amount, status]
        );

        const orderId = result.insertId;

        // If order is completed (or based on payment logic), distribute commission
        if (status === 'COMPLETED') {
            log(`Distributing commission for completed order ${orderId}`, "info");
            // Pass the same connection to keep it in the same transaction
            await distributeCommission(orderId, userId, amount, connection);
        }

        await connection.commit();
        return { orderId, userId, amount, status };
    } catch (error) {
        await connection.rollback();
        log(`Error in createOrder: ${error.message}`, "error");
        throw error;
    } finally {
        connection.release();
    }
};
