import rechargeService from '#services/rechargeService.js';
import { rtnRes, log } from '#utils/helper.js';
import {getUserReviewPendingRechareRequestCount} from "#services/userService.js"

const rechargeController = {
    createRequest: async (req, res) => {
        try {
            const { amount, paymentMethod, paymentReference } = req.body;
            // Store relative path accessible via static middleware
            const proofImage = req.file ? `/uploads/payments/${req.file.filename}` : null; 
            const userId = req.user.id;

            if (!amount || amount <= 0) {
                return rtnRes(res, 400, "Invalid amount");
            }
            if (!paymentMethod){
                 return rtnRes(res, 400, "Payment method is required")
            };
            if (!proofImage) {
                return rtnRes(res, 400, "Payment proof (image) is required");
            }
            const count = await getUserReviewPendingRechareRequestCount(userId);
            if(count>=5)  {
                console.log("count greater then 5 or equals ")
                return rtnRes(res, 400, "maximum recharge request is reached please wail until to review the request");
            }

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
            if (req.user.role !== 'ADMIN') {
                filters.userId = req.user.id;
            }
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
