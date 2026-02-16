import { queryRunner, transactionRunner } from '#config/db.js';
import { log } from '#utils/helper.js';

/**
 * Get full profile information for a user
 */
export const getProfileByUserId = async (userId) => {
    try {
        const users = await queryRunner('SELECT id, name, phone, email, referral_id, is_phone_verified FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) return null;

        const profiles = await queryRunner('SELECT * FROM profiles WHERE user_id = ?', [userId]);
        const addresses = await queryRunner('SELECT * FROM addresses WHERE user_id = ?', [userId]);

        return {
            user: users[0],
            profile: profiles ? profiles[0] : null,
            addresses: addresses || []
        };
    } catch (error) {
        log(`Error in getProfileByUserId: ${error.message}`, "error");
        throw error;
    }
};

/**
 * Ensure a profile record exists for the user
 */
const ensureProfileExists = async (userId, connection) => {
    const profiles = await connection.execute('SELECT id FROM profiles WHERE user_id = ?', [userId]);
    if (profiles[0].length === 0) {
        await connection.execute('INSERT INTO profiles (user_id) VALUES (?)', [userId]);
    }
};

/**
 * Update personal profile information
 */
export const updatePersonalProfile = async (userId, { name = null, phone = null, email = null, dob = null, profile_image = null }) => {
    return await transactionRunner(async (connection) => {
        // Update user table
        if (name || phone || email) {
            await connection.execute(
                'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), email = COALESCE(?, email) WHERE id = ?',
                [name, phone, email, userId]
            );
        }

        // Update profile table
        const profileUpdates = [];
        const profileParams = [];

        if (dob !== undefined) {
            profileUpdates.push('dob = ?');
            profileParams.push(dob);
        }
        if (profile_image !== undefined) {
            profileUpdates.push('profile_image = ?');
            profileParams.push(profile_image);
        }

        if (profileUpdates.length > 0) {
            // Ensure profile exists
            await ensureProfileExists(userId, connection);

            profileParams.push(userId);
            await connection.execute(
                `UPDATE profiles SET ${profileUpdates.join(', ')} WHERE user_id = ?`,
                profileParams
            );
        }

        return true;
    });
};

/**
 * Update identity verification details
 */
export const updateIdentity = async (userId, { idType, idNumber, idDocumentUrl = null }) => {
    return await transactionRunner(async (connection) => {
        await ensureProfileExists(userId, connection);

        await connection.execute(
            'UPDATE profiles SET id_type = ?, id_number = ?, id_document_url = COALESCE(?, id_document_url), identity_status = "PENDING" WHERE user_id = ?',
            [idType, idNumber, idDocumentUrl, userId]
        );

        return true;
    });
};

/**
 * Update address verification details
 */
export const updateAddress = async (userId, { addressData, addressDocumentUrl = null }) => {
    return await transactionRunner(async (connection) => {
        await ensureProfileExists(userId, connection);

        // Update or Insert address in addresses table
        const [existingAddresses] = await connection.execute('SELECT id FROM addresses WHERE user_id = ? AND is_default = 1', [userId]);

        if (existingAddresses.length > 0) {
            await connection.execute(
                'UPDATE addresses SET address_line1 = ?, city = ?, state = ?, pincode = ?, country = ? WHERE id = ?',
                [addressData.address_line1, addressData.city, addressData.state, addressData.pincode, addressData.country, existingAddresses[0].id]
            );
        } else {
            await connection.execute(
                'INSERT INTO addresses (user_id, address_line1, city, state, pincode, country, is_default) VALUES (?, ?, ?, ?, ?, ?, 1)',
                [userId, addressData.address_line1, addressData.city, addressData.state, addressData.pincode, addressData.country]
            );
        }

        // Update profile status and document
        await connection.execute(
            'UPDATE profiles SET address_document_url = COALESCE(?, address_document_url), address_status = "PENDING" WHERE user_id = ?',
            [addressDocumentUrl, userId]
        );

        return true;
    });
};

/**
 * Update bank details
 */
export const updateBank = async (userId, { bankData, bankDocumentUrl = null }) => {
    return await transactionRunner(async (connection) => {
        await ensureProfileExists(userId, connection);

        await connection.execute(
            'UPDATE profiles SET bank_account_name = ?, bank_name = ?, bank_account_number = ?, bank_ifsc = ?, bank_document_url = COALESCE(?, bank_document_url), bank_status = "PENDING" WHERE user_id = ?',
            [bankData.account_name, bankData.bank_name, bankData.account_number, bankData.ifsc_code, bankDocumentUrl, userId]
        );

        return true;
    });
};
