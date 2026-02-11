import authService from '#services/authService.js';
import { createUser, existinguserFieldsCheck } from '#services/userService.js';
import { rtnRes, log } from '#utils/helper.js';
import { queryRunner } from '#config/db.js';


const authController = {

    signup: async function (req, res) {
        try {
            const { name, phone, email, password, referrerId:referralId } = req.body;
            if (!phone || !name) {
                return rtnRes(res, 400, "name and phone are required");
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[6-9]\d{9}$/;
            if(email){

                if (!emailRegex.test(email)) {
                    return rtnRes(res, 400, "Invalid email format");
                }
            }
            if (!phoneRegex.test(phone)) {
                return rtnRes(res, 400, "Invalid phone format");
            }
            const existingUser = await existinguserFieldsCheck({ name, phone });
            if(existingUser.isExisting){
                return rtnRes(res, 400, `User already exists with ${existingUser.field}`);
            }

            if (referralId) {
                const results = await queryRunner(`select id from users where referral_id = ?`, [referralId]);
                console.log(results)
                if (!results || results.length === 0) {
                    return rtnRes(res, 400, "Invalid referral id");
                }
                const referrerId = results[0].id;
                console.log("here the referral user", referrerId);
                req.body.referralId = referrerId; 
                
            }

            const user = await createUser({ 
                name, 
                phone, 
                email, 
                password, 
                referralId 
            });

            // Send OTP
            const otpRes = await authService.sendOtp(user.id, user.phone, 'signup');
            if (otpRes.code !== 200) {
                return rtnRes(res, otpRes.code, otpRes.message);
            }

            return rtnRes(res, 201, "User registered successfully. OTP sent.", { userId: user.id });

        } catch (e) {
            console.log("err from signup ", e);
            if (e.code === 'ER_DUP_ENTRY') {
                return rtnRes(res, 400, "Phone or Email already exists");
            }
            rtnRes(res, 500, "internal error");
        }
    },

    login: async function (req, res) {
        try {
            const { phone, password, otp } = req.body;
            if (!phone) {
                return rtnRes(res, 400, "phone is required");
            }

            const result = await authService.login(phone, password, otp);
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
