import pool from '../config/db.js';
import { createReferral } from './referralService.js';
import { log } from '../utils/helper.js';

export const createUser = async (userData) => {
    const { name, email, password, referralId } = userData;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        log(`Creating user: ${email}`, "info");
        const [result] = await connection.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        
        const newUserId = result.insertId;
        
        if (referralId) {
            log(`Linking referral: ${referralId} -> ${newUserId}`, "info");
            // Pass the same connection to keep it in the same transaction
            await createReferral(referralId, newUserId, connection);
        }
        
        await connection.commit();
        return { id: newUserId, name, email };
    } catch (error) {
        await connection.rollback();
        log(`Error in createUser: ${error.message}`, "error");
        throw error;
    } finally {
        connection.release();
    }
};

export const getFirstUser = async () => {
    try {
        const [rows] = await pool.query('SELECT id FROM users ORDER BY id ASC LIMIT 1');
        return rows[0] || null;
    } catch (error) {
        log(`Error fetching first user: ${error.message}`, "error");
        throw error;
    }
};
