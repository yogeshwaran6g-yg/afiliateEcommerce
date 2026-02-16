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
    const { name, email, password, referralId, selectedProductId } = details;

    const runner = connection || queryRunner;

    let hashedPassword = null;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    // If referralId is provided, we might need to verify it or store it if not already stored.
    // The requirement says "insert into ref tree" happens later.

    const sql = `
        UPDATE users SET 
            name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            password = COALESCE(?, password),
            selected_product_id = COALESCE(?, selected_product_id),
            account_activation_status = 'UNDER_REVIEW'
        WHERE id = ?
    `;

    await runner(sql, [name, email, hashedPassword, selectedProductId, userId]);
};

export const activateUser = async (userId, paymentId = null) => {
    return await transactionRunner(async (connection) => {
        log(`Activating user: ${userId}${paymentId ? ` via payment: ${paymentId}` : ''}`, "info");

        // 1. Get user details including referrer
        const [userRows] = await connection.execute(
            'SELECT id, referred_by FROM users WHERE id = ?',
            [userId]
        );

        if (!userRows || userRows.length === 0) {
            throw new Error("User not found");
        }

        const user = userRows[0];

        // 2. Update user status and payment status together
        await connection.execute(
            'UPDATE users SET account_activation_status = "ACTIVATED" WHERE id = ?',
            [userId]
        );

        if (paymentId) {
            await connection.execute(
                'UPDATE activation_payments_details SET status = "APPROVED" WHERE id = ?',
                [paymentId]
            );
        }

        // 3. Insert into referral tree if referrer exists
        if (user.referred_by) {
            log(`Inserting user ${userId} into referral tree with referrer ${user.referred_by}`, "info");
            await createReferral(user.referred_by, userId, connection);
        }

        // 4. Trigger commission distribution
        // Fetch payment details and product ID from activation records
        const [paymentRows] = await connection.execute(
            'SELECT id, product_id FROM activation_payments_details WHERE user_id = ? AND status = "APPROVED" ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        if (paymentRows && paymentRows.length > 0) {
            const payment = paymentRows[0];
            const [productRows] = await connection.execute(
                'SELECT sale_price FROM products WHERE id = ?',
                [payment.product_id]
            );

            if (productRows && productRows.length > 0) {
                const amount = productRows[0].sale_price;

                // 4a. Create an order record to satisfy FK constraints
                const [orderResult] = await connection.execute(
                    'INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)',
                    [userId, amount, 'COMPLETED']
                );
                const orderId = orderResult.insertId;

                log(`Distributing commission for user ${userId}, amount ${amount} (Order: ${orderId}, via activation payment ${payment.id})`, "info");
                await distributeCommission(orderId, userId, amount, connection);
            }
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
