import { rtnRes } from "#utils/helper.js";
import {
  createReferral,
  distributeCommission,
  getReferralOverview,
} from "#services/referralService.js";

const referalController = {
  createReferral: async (req, res) => {
    try {
      const { referrerId, newUserId } = req.body;

      if (!referrerId || !newUserId) {
        return rtnRes(res, 400, "Referrer ID and New User ID are required");
      }

      const result = await createReferral(referrerId, newUserId);
      rtnRes(res, 201, result.message);
    } catch (error) {
      console.error("Error creating referral:", error);
      rtnRes(res, 500, "Internal server error");
    }
  },

  distributeCommissions: async (req, res) => {
    try {
      const { orderId, userId, amount } = req.body;

      if (!orderId || !userId || !amount) {
        return rtnRes(res, 400, "Order ID, User ID, and Amount are required");
      }

      const result = await distributeCommission(orderId, userId, amount);
      rtnRes(res, 200, result.message);
    } catch (error) {
      console.error("Error distributing commissions:", error);
      rtnRes(res, 500, "Internal server error");
    }
  },

  getUserReferralOverview: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return rtnRes(res, 401, "Unauthorized");
      }

      const result = await getReferralOverview(userId);
      return rtnRes(res, 200, "Referral overview fetched successfully", result.data);
    } catch (error) {
      console.error("Error in getReferralOverview:", error);
      return rtnRes(res, 500, "Internal server error");
    }
  },
};

export default referalController;
