import pool, { queryRunner } from '#config/db.js';
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

export const login = async (phone, password, otp) => {
    try {
        const user = await findUserByPhone(phone);
        if (!user) {
            return { code: 404, message: "User not found" };
        }

        if (!user.is_active) {
            return { code: 403, message: "Account is inactive" };
        }

        // 1. If password/otp are NOT provided, trigger Stage 1 (request OTP)
        if (!password && !otp) {
            const otpRes = await sendOtp(user.id, user.phone, 'login');
            if (otpRes.code !== 200) return otpRes;

            return {
                code: 202,
                message: "OTP sent successfully",
                data: { userId: user.id }
            };
        }

        // 2. If password/otp ARE provided, verify them (Stage 2)
        if (password) {
            if (!user.password) {
                return { code: 401, message: "Password not set for this account" };
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { code: 401, message: "Invalid credentials" };
            }
        }

        if (otp) {
            const rows = await queryRunner('SELECT * FROM otp WHERE user_id = ? AND purpose = ?', [user.id, 'login']);
            if (!rows || rows.length === 0) {
                return { code: 400, message: "OTP not found or expired" };
            }
            const otpRecord = rows[0];
            if (new Date() > new Date(otpRecord.expires_at)) {
                return { code: 400, message: "OTP expired" };
            }
            const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
            if (!isOtpMatch) {
                return { code: 400, message: "Invalid OTP" };
            }
            // Clear OTP after successful use
            await queryRunner('DELETE FROM otp WHERE user_id = ? AND purpose = ?', [user.id, 'login']);
        }

        const token = generateToken(user);
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

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    options.signal = controller.signal;

    try {
        const res = await fetch(url, options);
        clearTimeout(id);
        return { result: true, res };
    } catch (err) {
        log("OTP Fetch Error", "error", err.message || "unknown error");
        clearTimeout(id);
        return { result: false };
    }
}
export const sendOtp = async (userId, phone, purpose = 'login') => {
    const connection = await pool.getConnection();
    try {
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        log(`Sending OTP for ${phone} (User ID: ${userId}, Purpose: ${purpose}): ${otp}`, "info");

         const payload = {
            phone_number: `91${phone}`, // Assuming phone is passed without country code, adding 91 prefix
            template_name: "app_verify",
            template_language: "en_US",
            field_1: `${otp}`,
            button_0: `${otp}`
        };

        const token = env.WHATSUP_OTP_TOKEN;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        };
        
       try{
            const response = await fetchWithTimeout(env.WHATSUP_BASE_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!result.resposne) {
                log(`error: ${JSON.stringify(result)}`, "error");
                return { code: 500, message: "Failed to send OTP" };

            }
        } catch (fetchErr) {
            log(`fetch error: ${fetchErr.message}`, "error");
        return { code: 500, message: "Failed to send OTP" };

        }

        // Hash OTP before storing
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await connection.query(
            `INSERT INTO otp (user_id, otp_hash, purpose, expires_at) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
                otp_hash = VALUES(otp_hash), 
                purpose = VALUES(purpose), 
                expires_at = VALUES(expires_at),
                updated_at = CURRENT_TIMESTAMP`,
            [userId, otpHash, purpose, expiresAt]
        );

        return { code: 200, message: "OTP sent successfully" };

    } catch (e) {
        log(`Send OTP error: ${e.message}`, "error");
        return { code: 500, message: "Failed to send OTP" };
    } finally {
        connection.release();
    }
};

export const resendOtp = async (userId, phone, purpose) => {
    try {
        const [rows] = await pool.query('SELECT updated_at FROM otp WHERE user_id = ?', [userId]);
        
        if (rows.length > 0) {
            const lastSent = new Date(rows[0].updated_at).getTime();
            const now = Date.now();
            const cooldownMs = (env.OTP_RESEND_COOLDOWN || 100) * 1000;

            if (now - lastSent < cooldownMs) {
                const remaining = Math.ceil((cooldownMs - (now - lastSent)) / 1000);
                return { 
                    code: 429, 
                    message: `Please wait ${remaining} seconds before resending OTP` 
                };
            }
        }

        return await sendOtp(userId, phone, purpose);

    } catch (e) {
        log(`Resend OTP error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export const verifyOtp = async (userId, otp, purpose) => {
    try {
        const rows = await queryRunner('SELECT * FROM otp WHERE user_id = ?', [userId]);

        if (!rows || rows.length === 0) {
            return { code: 400, message: "OTP not found or expired" };
        }

        const otpRecord = rows[0];

        if (new Date() > new Date(otpRecord.expires_at)) {
            return { code: 400, message: "OTP expired" };
        }

        if (purpose && otpRecord.purpose !== purpose) {
            return { code: 400, message: "OTP purpose mismatch" };
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
        if (!isMatch) {
            return { code: 400, message: "Invalid OTP" };
        }

        // Mark user as verified
        await queryRunner('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);

        // Clear OTP
        await queryRunner('DELETE FROM otp WHERE user_id = ?', [userId]);

        const user = await findUserById(userId);
        delete user.password;

        // Generate token for all successful verifications (signup or login)
        const token = generateToken(user);
        return { 
            code: 200, 
            message: "OTP verified successfully", 
            data: { user, token } 
        };

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
            const { kyc_pan, kyc_aadhar, profile_image } = profileData;
            const [existing] = await connection.query('SELECT id FROM profiles WHERE user_id = ?', [userId]);

            if (existing.length > 0) {
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
            const { address_line1, address_line2, city, state, country, pincode, is_default } = addressData;
            if (address_line1 && city && state && country && pincode) {
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

export const forgotPassword = async (phone) => {
    try {
        const user = await findUserByPhone(phone);
        if (!user) {
            return { code: 404, message: "User not found with this phone number" };
        }

        const otpRes = await sendOtp(user.id, user.phone, 'forgot_password');
        if (otpRes.code !== 200) return otpRes;

        return {
            code: 200,
            message: "OTP sent successfully for password reset",
            data: { userId: user.id }
        };

    } catch (e) {
        log(`Forgot Password error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export const resetPassword = async (userId, otp, newPassword) => {
    try {
        // 1. Verify OTP first
        const rows = await queryRunner('SELECT * FROM otp WHERE user_id = ? AND purpose = ?', [userId, 'forgot_password']);
        if (!rows || rows.length === 0) {
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

        // 2. Hash and update new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await queryRunner('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // 3. Clear OTP
        await queryRunner('DELETE FROM otp WHERE user_id = ? AND purpose = ?', [userId, 'forgot_password']);

        return { code: 200, message: "Password reset successful" };

    } catch (e) {
        log(`Reset Password error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};

export default {
    login,
    sendOtp,
    resendOtp,
    verifyOtp,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
};
