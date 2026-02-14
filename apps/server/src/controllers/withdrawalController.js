import withdrawalService from '#services/withdrawalService.js';
import { rtnRes, log } from '#utils/helper.js';

const withdrawalController = {
    createRequest: async (req, res) => {
        try {
            const { amount, bankDetails } = req.body;
            const userId = req.user.id;

            if (!amount || amount <= 0) return rtnRes(res, 400, "Invalid amount");
            if (!bankDetails) return rtnRes(res, 400, "Bank details are required");

            const result = await withdrawalService.createWithdrawalRequest(userId, amount, bankDetails);
            return rtnRes(res, 201, "Withdrawal request created successfully", result);
        } catch (error) {
            log(`Error in createWithdrawalRequest: ${error.message}`, "error");
            return rtnRes(res, error.message === "Insufficient wallet balance" ? 400 : 500, error.message);
        }
    },

    getRequests: async (req, res) => {
        try {
            const filters = {};
            if (req.user.role !== 'ADMIN') {
                filters.userId = req.user.id; // Future proofing: filter by user if not admin
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
