import authService from '#services/authService.js';
import { createUser, existinguserFieldsCheck } from '#services/userService.js';
import { rtnRes } from '#utils/helper.js';


const authController = {

    signup: async function (req, res) {
        try {
            const { name, phone, email, password, referralId } = req.body;
            if (!phone || !name || !password) {
                return rtnRes(res, 400, "name, phone, and password are required");
            }
            
            
            const existingUser = await existinguserFieldsCheck({ name, phone });
            if(existingUser.isExisting){
                return rtnRes(res, 400, `User already exists with ${existingUser.field}`);
            }

            // Create User
            const user = await createUser({ name, phone, email, password, referralId });

            // Send OTP
            await authService.sendOtp(user.id, user.phone);

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
            const { userId, otp } = req.body;
            if (!userId || !otp) {
                return rtnRes(res, 400, "userId and otp are required");
            }

            const result = await authService.verifyOtp(userId, otp);
            return rtnRes(res, result.code, result.message, result.data);

        } catch (e) {
            console.log("err from verifyOtp ", e);
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
    }

}

export default authController;
