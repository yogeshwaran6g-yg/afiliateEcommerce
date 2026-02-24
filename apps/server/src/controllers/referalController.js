import { rtnRes } from "#utils/helper.js";
import {
  createReferral,
  distributeCommission,
  getReferralOverview,
  getDirectReferrals,
  getTeamMembersByLevel,
  getRecursiveTree,
} from "#services/referralService.js";
import { queryRunner } from '#config/db.js';


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

  getDirectReferrals: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return rtnRes(res, 401, "Unauthorized");
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;

      const result = await getDirectReferrals(userId, page, limit);
      return rtnRes(res, 200, "Direct referrals fetched successfully", result.data);
    } catch (error) {
      console.error("Error in getDirectReferrals:", error);
      return rtnRes(res, 500, "Internal server error");
    }
  },

  getTeamMembersByLevel: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return rtnRes(res, 401, "Unauthorized");
      }

      const { level } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!level) {
      return rtnRes(res, 400, "Level is required");
    }

    const result = await getTeamMembersByLevel(userId, Number(level), page, limit);
      return rtnRes(res, 200, "Team members fetched successfully", result.data);
    } catch (error) {
      console.error("Error in getTeamMembersByLevel:", error);
      return rtnRes(res, 500, "Internal server error");
    }
  },
  getNetworkTree: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return rtnRes(res, 401, "Unauthorized");
      }

      const { depth, uplineId } = req.query;
      const targetUplineId = uplineId ? Number(uplineId) : userId;

      // Security check: Ensure targetUplineId is the user themselves or in their downline
      if (targetUplineId !== userId) {
        const checkSql = `SELECT 1 FROM referral_tree WHERE upline_id = ? AND downline_id = ? LIMIT 1`;
        const [isDownline] = await queryRunner(checkSql, [userId, targetUplineId]);
        if (!isDownline) {
          return rtnRes(res, 403, "Forbidden: You can only view your own downline");
        }
      }

      const result = await getRecursiveTree(targetUplineId, depth ? Number(depth) : 1);
      return rtnRes(res, 200, "Network tree fetched successfully", result.data);
    } catch (error) {
      console.error("Error in getNetworkTree:", error);
      return rtnRes(res, 500, "Internal server error");
    }
  },
};


export default referalController;
