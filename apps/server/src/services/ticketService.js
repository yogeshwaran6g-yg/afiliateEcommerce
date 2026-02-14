import pool from "../config/db.js";

/**
 * Creates a new support ticket in the database.
 * @param {number} userId - The ID of the user creating the ticket.
 * @param {object} ticketData - The data for the new ticket.
 * @returns {Promise<number>} - The ID of the newly created ticket.
 */
export const createTicket = async (userId, { category, subject, description, image }) => {
    const [result] = await pool.execute(
        `INSERT INTO tickets (user_id, category, subject, description, image) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, category, subject, description, image || null]
    );
    return result.insertId;
};

/**
 * Fetches all tickets for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - List of tickets.
 */
export const getTicketsByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT id, category, subject, description, image, priority, status, created_at, updated_at 
         FROM tickets 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};
