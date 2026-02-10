import { queryRunner, transactionRunner } from '#config/db.js';
import { createReferral } from '#services/referralService.js';
import { log } from '#utils/helper.js';
import bcrypt from 'bcrypt';

const generateReferralId = () => {
    return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createUser = async (userData) => {
    const { name, phone, email, password, referralId } = userData;
    const userRefID = generateReferralId();
    
    return await transactionRunner(async (connection) => {
        log(`Creating user: ${name} (${phone}) with referral ID: ${userRefID}`, "info");

        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const [result] = await connection.execute(
            'INSERT INTO users (name, phone, email, password, referral_id) VALUES (?, ?, ?, ?, ?)',
            [name, phone, email || null, hashedPassword, userRefID]
        );

        const newUserId = result.insertId;

        if (referralId) {
            log(`Linking referral: ${referralId} -> ${newUserId}`, "info");
            // Pass the same connection to keep it in the same transaction
            await createReferral(referralId, newUserId, connection);
        }

        return { id: newUserId, name, phone, email, referral_id: userRefID };
    });
};

export const findUserByPhone = async (phone) => {
    try {
        const rows = await queryRunner('SELECT * FROM users WHERE phone = ?', [phone]);
        return rows ? rows[0] : null;
    } catch (error) {
        log(`Error finding user by phone: ${error.message}`, "error");
        throw error;
    }
};

export const findUserById = async (id) => {
    try {
        const rows = await queryRunner('SELECT * FROM users WHERE id = ?', [id]);
        return rows ? rows[0] : null;
    } catch (error) {
        log(`Error finding user by id: ${error.message}`, "error");
        throw error;
    }
};

export const getFirstUser = async () => {
    try {
        const rows = await queryRunner('SELECT id FROM users ORDER BY id ASC LIMIT 1');
        return rows ? rows[0] : null;
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
            if (user) {
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

