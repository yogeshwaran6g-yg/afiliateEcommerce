import * as userService from '#services/userService.js';
import { rtnRes, log } from '#utils/helper.js';

const signup = async (req, res) => {
    try {
        const { name, email, password, referralId } = req.body;
        
        if (!name || !email || !password) {
            return rtnRes(res, 400, "Name, email, and password are required");
        }
        
        const user = await userService.createUser({ name, email, password, referralId });
        
        return rtnRes(res, 201, "User registered successfully", user);
    } catch (error) {
        log(`Signup error: ${error.message}`, "error");
        if (error.code === 'ER_DUP_ENTRY') {
            return rtnRes(res, 400, "Email already exists");
        }
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const getGlobalReferralId = async (req, res) => {
    try {
        const firstUser = await userService.getFirstUser();
        if (!firstUser) {
            return rtnRes(res, 404, "No users found in the system");
        }
        return rtnRes(res, 200, "Global referral ID fetched", { referralId: firstUser.id });
    } catch (error) {
        log(`Error in getGlobalReferralId: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export default {
    signup,
    getGlobalReferralId
};
