import pool from '#config/db.js';
import { log } from '#utils/helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '#config/env.js';
import { findUserByPhone, findUserById } from '#services/userService.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
    );
};

export const login = async (phone, password) => {
    try {
        const user = await findUserByPhone(phone);
        if (!user) {
            return { code: 404, message: "User not found" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { code: 401, message: "Invalid credentials" };
        }

        if (!user.is_active) {
            return { code: 403, message: "Account is inactive" };
        }

        const token = generateToken(user);

        // Remove password from response
        delete user.password;

        return {
            code: 200,
            message: "Login successful",
            data: { user, token }
        };

    } catch (e) {
        log(`Login error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export const sendOtp = async (userId, phone) => {
    const connection = await pool.getConnection();
    try {
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Mocking: Log OTP to console for testing
        log(`[MOCK OTP] OTP for ${phone} (User ID: ${userId}): ${otp}`, "warn");

        // Hash OTP before storing
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await connection.query(
            `INSERT INTO otp (user_id, otp_hash, expires_at) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE otp_hash = VALUES(otp_hash), expires_at = VALUES(expires_at)`,
            [userId, otpHash, expiresAt]
        );

        return { code: 200, message: "OTP sent successfully" };

    } catch (e) {
        log(`Send OTP error: ${e.message}`, "error");
        return { code: 500, message: "Failed to send OTP" };
    } finally {
        connection.release();
    }
};

export const verifyOtp = async (userId, otp) => {
    try {
        const [rows] = await pool.query('SELECT * FROM otp WHERE user_id = ?', [userId]);
        
        if (rows.length === 0) {
            return { code: 400, message: "OTP not found or expired" };
        }

        const otpRecord = rows[0];
        
        if (new Date() > new Date(otpRecord.expires_at)) {
            return { code: 400, message: "OTP expired" };
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
        if (!isMatch) {
            return { code: 400, message: "Invalid OTP" };
        }

        // Mark user as verified
        await pool.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);
        
        // Clear OTP
        await pool.query('DELETE FROM otp WHERE user_id = ?', [userId]);

        return { code: 200, message: "OTP verified successfully" };

    } catch (e) {
        log(`Verify OTP error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export const getProfile = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) return { code: 404, message: "User not found" };

        const [profiles] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
        const [addresses] = await pool.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);

        delete user.password;

        return {
            code: 200,
            message: "Profile fetched",
            data: {
                user,
                profile: profiles[0] || null,
                addresses: addresses
            }
        };

    } catch (e) {
        log(`Get Profile error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export const updateProfile = async (userId, profileData, addressData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if (profileData) {
            // Upsert profile
            const { kyc_pan, kyc_aadhar, profile_image } = profileData;
            // Check if profile exists
             const [existing] = await connection.query('SELECT id FROM profiles WHERE user_id = ?', [userId]);
             
             if(existing.length > 0){
                 await connection.query(
                    'UPDATE profiles SET kyc_pan = COALESCE(?, kyc_pan), kyc_aadhar = COALESCE(?, kyc_aadhar), profile_image = COALESCE(?, profile_image) WHERE user_id = ?',
                    [kyc_pan, kyc_aadhar, profile_image, userId]
                 );
             } else {
                 await connection.query(
                    'INSERT INTO profiles (user_id, kyc_pan, kyc_aadhar, profile_image) VALUES (?, ?, ?, ?)',
                    [userId, kyc_pan, kyc_aadhar, profile_image]
                 );
             }
        }

        if (addressData) {
            // For simplicity, let's say we add a new address or update default. 
            // The prompt asked for "Full controller and signup based functions". 
            // I'll assume adding an address for now if provided.
            const { address_line1, address_line2, city, state, country, pincode, is_default } = addressData;
            if(address_line1 && city && state && country && pincode){
                 await connection.query(
                    'INSERT INTO addresses (user_id, address_line1, address_line2, city, state, country, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, address_line1, address_line2, city, state, country, pincode, is_default || false]
                );
            }
        }

        await connection.commit();
        return { code: 200, message: "Profile updated successfully" };

    } catch (e) {
        await connection.rollback();
        log(`Update Profile error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    } finally {
        connection.release();
    }
};




export default {
    login,
    sendOtp,
    verifyOtp,
    getProfile,
    updateProfile
};
