import pool from '#config/db.js';
import { createReferral } from '#service/referralService.js';
import { log } from '#utils/helper.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
    const { name, phone, email, password, referralId } = userData;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        log(`Creating user: ${name} (${phone})`, "info");
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await connection.query(
            'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)',
            [name, phone, email || null, hashedPassword]
        );
        
        const newUserId = result.insertId;
        
        if (referralId) {
            log(`Linking referral: ${referralId} -> ${newUserId}`, "info");
            // Pass the same connection to keep it in the same transaction
            await createReferral(referralId, newUserId, connection);
        }
        
        await connection.commit();
        return { id: newUserId, name, phone, email };
    } catch (error) {
        await connection.rollback();
        log(`Error in createUser: ${error.message}`, "error");
        throw error;
    } finally {
        connection.release();
    }
};

export const findUserByPhone = async (phone) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
        return rows[0] || null;
    } catch (error) {
        log(`Error finding user by phone: ${error.message}`, "error");
        throw error;
    }
};

export const findUserById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        log(`Error finding user by id: ${error.message}`, "error");
        throw error;
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

