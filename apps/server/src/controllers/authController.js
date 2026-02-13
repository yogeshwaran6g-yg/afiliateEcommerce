import authService from '#services/authService.js';
import { createUser, existinguserFieldsCheck, findUserByPhone, updateRegistrationDetails } from '#services/userService.js';
import { rtnRes, log } from '#utils/helper.js';
import { queryRunner } from '#config/db.js';


const authController = {

    signup: async function (req, res) {
        try {
            const { phone, referralId: referralCode } = req.body;
            if (!phone) {
                return rtnRes(res, 400, "phone is required");
            }

            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                return rtnRes(res, 400, "Invalid phone format");
            }

            const existingUser = await findUserByPhone(phone);
            
            if (existingUser) {
                if (!existingUser.is_phone_verified) {
                    // Resend OTP for unverified user
                    const otpRes = await authService.sendOtp(existingUser.id, existingUser.phone, 'signup');
                    if (otpRes.code !== 200) {
                        return rtnRes(res, otpRes.code, otpRes.message);
                    }
                    return rtnRes(res, 201, "OTP resent for verification.", { userId: existingUser.id });
                }
                return rtnRes(res, 400, "User already exists and is verified. Please login.");
            }

            let referredBy = null;
            if (referralCode) {
                const results = await queryRunner(`select id from users where referral_id = ?`, [referralCode]);
                if (results && results.length > 0) {
                    referredBy = results[0].id;
                } else {
                    return rtnRes(res, 400, "Invalid referral id");
                }
            }

            const user = await createUser({ 
                phone, 
                referredBy 
            });
            if(!user.id){
                return rtnRes(res, 500, "Internal error");
            }
            // Send OTP
            const otpRes = await authService.sendOtp(user.id, user.phone, 'signup');
            if (otpRes.code !== 200) {
                return rtnRes(res, otpRes.code, otpRes.message);
            }

            return rtnRes(res, 201, "OTP sent successfully.", { userId: user.id });

        } catch (e) {
            log(`Signup error: ${e.message}`, "error");
            rtnRes(res, 500, "internal error");
        }
    },

    completeRegistration: async function (req, res) {
        try {
            const userId = req.user.id; // From protection middleware
            const { name, email, password, selectedProductId, paymentType } = req.body;
            const proofFile = req.file;

            if (!name || !password || !selectedProductId || !paymentType || !proofFile) {
                return rtnRes(res, 400, "Missing required fields or payment proof");
            }

            // 1. Check if user is verified
            const userRows = await queryRunner(`SELECT is_phone_verified, account_activation_status FROM users WHERE id = ?`, [userId]);
            if (!userRows || userRows.length === 0 || !userRows[0].is_phone_verified) {
                return rtnRes(res, 403, "Mobile not verified. Access denied.");
            }

            // 1b. Check for existing pending payment
            const pendingPayments = await queryRunner(
                'SELECT id FROM activation_payments_details WHERE user_id = ? AND status = ?',
                [userId, 'PENDING']
            );
            if (pendingPayments && pendingPayments.length > 0) {
                return rtnRes(res, 400, "You already have a payment proof under review.");
            }

            // 2. Update user details
            await updateRegistrationDetails(userId, {
                name,
                email,
                password,
                selectedProductId
            });

            // 3. Create payment record
            const proofUrl = `/uploads/${proofFile.filename}`;
            await queryRunner(
                `INSERT INTO activation_payments_details (user_id, product_id, payment_type, proof_url, status) 
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, selectedProductId, paymentType, proofUrl, 'PENDING']
            );

            return rtnRes(res, 200, "Registration and payment proof submitted successfully. Under review.");

        } catch (e) {
            log(`CompleteRegistration error: ${e.message}`, "error");
            rtnRes(res, 500, "internal error");
        }
    },

    login: async function (req, res) {
        try {
            const { phone, password } = req.body;
            if (!phone || !password) {
                return rtnRes(res, 400, "phone and password are required");
            }

            const result = await authService.login(phone, password);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from login ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    verifyOtp: async function (req, res) {
        try {
            const { userId, otp, purpose } = req.body;
            if (!userId || !otp) {
                return rtnRes(res, 400, "userId and otp are required");
            }

            const result = await authService.verifyOtp(userId, otp, purpose);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from verifyOtp ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    resendOtp: async function (req, res) {
        try {
            const { userId, phone, purpose } = req.body;
            if (!userId || !phone || !purpose) {
                return rtnRes(res, 400, "userId, phone and purpose are required");
            }

            const result = await authService.resendOtp(userId, phone, purpose);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from resendOtp ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    getProfile: async function (req, res) {
        try {
            // req.user is set by passport middleware
            const userId = req.user.id;
            const result = await authService.getProfile(userId);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from getProfile ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    updateProfile: async function (req, res) {
        try {
            const userId = req.user.id;
            const { profile, address } = req.body;

            const result = await authService.updateProfile(userId, profile, address);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from updateProfile ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    forgotPassword: async function (req, res) {
        try {
            const { phone } = req.body;
            if (!phone) {
                return rtnRes(res, 400, "phone is required");
            }
            const result = await authService.forgotPassword(phone);
            return rtnRes(res, result.code, result.message, result.data);
        } catch (e) {
            console.log("err from forgotPassword ", e);
            rtnRes(res, 500, "internal error");
        }
    },

    resetPassword: async function (req, res) {
        try {
            const { userId, otp, newPassword } = req.body;
            if (!userId || !otp || !newPassword) {
                return rtnRes(res, 400, "userId, otp and newPassword are required");
            }
            const result = await authService.resetPassword(userId, otp, newPassword);
            return rtnRes(res, result.code, result.message, result.data);
        } catch (e) {
            console.log("err from resetPassword ", e);
            rtnRes(res, 500, "internal error");
        }
    }

}

export default authController;
