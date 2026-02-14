import rechargeService from '#services/rechargeService.js';
import { rtnRes, log } from '#utils/helper.js';

const rechargeController = {
    createRequest: async (req, res) => {
        try {
            const { amount, paymentMethod, paymentReference, proofImage } = req.body;
            const userId = req.user.id;

            if (!amount || amount <= 0) return rtnRes(res, 400, "Invalid amount");
            if (!paymentMethod) return rtnRes(res, 400, "Payment method is required");

            const result = await rechargeService.createRechargeRequest(userId, amount, paymentMethod, paymentReference, proofImage);
            return rtnRes(res, 201, "Recharge request created successfully", result);
        } catch (error) {
            log(`Error in createRechargeRequest: ${error.message}`, "error");
            return rtnRes(res, 500, "Internal server error");
        }
    },

    getRequests: async (req, res) => {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;

            const requests = await rechargeService.getRechargeRequests(filters);
            return rtnRes(res, 200, "Requests fetched successfully", requests);
        } catch (error) {
            log(`Error in getRechargeRequests: ${error.message}`, "error");
            return rtnRes(res, 500, "Internal server error");
        }
    }
};

export default rechargeController;
