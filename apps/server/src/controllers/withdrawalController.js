import withdrawalService from '#services/withdrawalService.js';
import { rtnRes, log } from '#utils/helper.js';

const withdrawalController = {
    createRequest: async (req, res) => {
        try {
            const { amount } = req.body;
            const userId = req.user.id;

            if (!amount || amount <= 0) return rtnRes(res, 400, "Invalid amount");

            const result = await withdrawalService.createWithdrawalRequest(userId, amount);
            return rtnRes(res, 201, "Withdrawal request created successfully", result);
        } catch (error) {
            log(`Error in createWithdrawalRequest: ${error.message}`, "error");
            if (error.message.includes("must be activated")) {
                return rtnRes(res, 403, error.message);
            }
            return rtnRes(res, error.message === "Insufficient wallet balance" ? 400 : 500, error.message);
        }
    },

    getRequests: async (req, res) => {
        try {
            const filters = {};
            if (req.user.role !== 'ADMIN') {
                filters.userId = req.user.id;
            }
            if (req.query.status) filters.status = req.query.status;

            const requests = await withdrawalService.getWithdrawalRequests(filters);
            return rtnRes(res, 200, "Requests fetched successfully", requests);
        } catch (error) {
            log(`Error in getWithdrawalRequests: ${error.message}`, "error");
            return rtnRes(res, 500, "Internal server error");
        }
    }
};

export default withdrawalController;
