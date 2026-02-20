import { queryRunner, transactionRunner } from '#config/db.js';
import { createReferral, distributeCommission } from '#services/referralService.js';
import { log } from '#utils/helper.js';
import bcrypt from 'bcrypt';


const generateReferralId = () => {
    return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createUser = async (userData) => {
    try {
        const { phone, referredBy } = userData;
        const userRefID = generateReferralId();

        return await transactionRunner(async (connection) => {
            log(`Creating initial user for phone: ${phone} (Referred by: ${referredBy}) with referral ID: ${userRefID}`, "info");

            const [result] = await connection.execute(
                'INSERT INTO users (name, phone, referral_id, account_activation_status, referred_by) VALUES (?, ?, ?, ?, ?)',
                [`User_${phone}`, phone, userRefID, 'NOT_STARTED', referredBy || null]
            );

            const newUserId = result.insertId;

            return { id: newUserId, phone, referral_id: userRefID };
        });
    } catch (error) {
        console.log("err from create user", error)
        throw error
    }
};

export const getUserReviewPendingRechareRequestCount = async (id) => {
    try {


        const rows = await queryRunner(
            `SELECT COUNT(*) as count FROM recharge_requests WHERE user_id = ?
             AND status = "REVIEW_PENDING"`,
            [id]
        );

        return rows[0].count;

    } catch (error) {
        console.log("err from count pending req user", error)
        throw error
    }
};

export const updateRegistrationDetails = async (userId, details, connection = null) => {
    const { name, email, password } = details;

    const runner = connection || queryRunner;

    let hashedPassword = null;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    const sql = `
        UPDATE users SET 
            name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            password = COALESCE(?, password),
            account_activation_status = 'PENDING_PAYMENT'
        WHERE id = ?
    `;

    await runner(sql, [name, email, hashedPassword, userId]);
};

/**
 * Activates a user, sets status to ACTIVATED, and inserts into referral tree.
 */
export const activateUser = async (userId, connection = null) => {
    return await transactionRunner(async (conn) => {
        const runner = connection || conn;
        log(`Activating user: ${userId}`, "info");

        // 1. Get user details including referrer
        const [userRows] = await runner.execute(
            'SELECT id, referred_by FROM users WHERE id = ?',
            [userId]
        );

        if (!userRows || userRows.length === 0) {
            throw new Error("User not found");
        }

        const user = userRows[0];

        // 2. Update user status
        await runner.execute(
            'UPDATE users SET account_activation_status = "ACTIVATED", is_active = TRUE WHERE id = ?',
            [userId]
        );

        // 3. Insert into referral tree if referrer exists
        if (user.referred_by) {
            log(`Inserting user ${userId} into referral tree with referrer ${user.referred_by}`, "info");
            await createReferral(user.referred_by, userId, runner);
        }

        return { success: true };
    });
};

export const findUserByPhone = async (phone) => {
    try {
        const rows = await queryRunner('SELECT * FROM users WHERE phone = ?', [phone]);
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        log(`Error finding user by phone: ${error.message}`, "error");
        throw error;
    }
};

export const findUserById = async (id) => {
    try {
        const rows = await queryRunner('SELECT * FROM users WHERE id = ?', [id]);
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        log(`Error finding user by id: ${error.message}`, "error");
        throw error;
    }
};

export const getFirstUser = async () => {
    try {
        const rows = await queryRunner('SELECT id FROM users ORDER BY id ASC LIMIT 1');
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        log(`Error fetching first user: ${error.message}`, "error");
        throw error;
    }
};

export const existinguserFieldsCheck = async ({ name = null, phone = null }) => {
    try {
        if (phone) {
            const user = await findUserByPhone(phone);
            if (user) {
                return {
                    isExisting: true,
                    field: "phone"
                };
            }
        }
        if (name) {
            const user = await queryRunner(`
                    select * from users where name = ?`,
                [name]
            )
            if (user && user.length > 0) {
                return {
                    isExisting: true,
                    field: "name"
                };
            }
        }
        return {
            isExisting: false,
            field: null
        }
    } catch (e) {
        console.log(e)
        throw e;
    }
}


export const getUserNotifications = async (userId, limit = 10) => {
    try {
        const rows = await queryRunner(
            `SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
            [userId, limit]
        );
        return rows;
    } catch (error) {
        log(`Error fetching notifications for user ${userId}: ${error.message}`, "error");
        throw error;
    }
};
