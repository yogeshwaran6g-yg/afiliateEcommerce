import { activateUser } from '#services/userService.js';
import withdrawalService from '#services/withdrawalService.js';
import rechargeService from '#services/rechargeService.js';
import { queryRunner } from '#config/db.js';
import { rtnRes, log } from '#utils/helper.js';

const adminController = {
    approvePayment: async function (req, res) {
        try {
            const { paymentId } = req.body;
            if (!paymentId) return rtnRes(res, 400, "paymentId is required");

            const [payment] = await queryRunner('SELECT * FROM activation_payments_details WHERE id = ?', [paymentId]);
            if (!payment) return rtnRes(res, 404, "Payment record not found");

            if (payment.status !== 'PENDING') {
                return rtnRes(res, 400, `Payment is already ${payment.status}`);
            }

            await activateUser(payment.user_id, paymentId);

            return rtnRes(res, 200, "Payment approved and user activated successfully");

        } catch (e) {
            log(`Error in approvePayment: ${e.message}`, "error");
            rtnRes(res, 500, "internal error");
        }
    },

    rejectPayment: async function (req, res) {
        try {
            const { paymentId, reason } = req.body;
            if (!paymentId) return rtnRes(res, 400, "paymentId is required");

            const [payment] = await queryRunner('SELECT * FROM activation_payments_details WHERE id = ?', [paymentId]);
            if (!payment) return rtnRes(res, 404, "Payment record not found");

            await queryRunner('UPDATE activation_payments_details SET status = "REJECTED", admin_comment = ? WHERE id = ?', [reason || "Rejected by admin", paymentId]);
            await queryRunner('UPDATE users SET account_activation_status = "REJECTED" WHERE id = ?', [payment.user_id]);

            return rtnRes(res, 200, "Payment rejected and user notified");

        } catch (e) {
            log(`Error in rejectPayment: ${e.message}`, "error");
            rtnRes(res, 500, "internal error");
        }
    },

    approveWithdrawal: async function (req, res) {
        try {
            const { requestId, adminComment } = req.body;
            if (!requestId) return rtnRes(res, 400, "requestId is required");

            await withdrawalService.approveWithdrawal(requestId, adminComment);
            return rtnRes(res, 200, "Withdrawal approved successfully");
        } catch (e) {
            log(`Error in approveWithdrawal: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    rejectWithdrawal: async function (req, res) {
        try {
            const { requestId, adminComment } = req.body;
            if (!requestId) return rtnRes(res, 400, "requestId is required");

            await withdrawalService.rejectWithdrawal(requestId, adminComment);
            return rtnRes(res, 200, "Withdrawal rejected and balance rolled back");
        } catch (e) {
            log(`Error in rejectWithdrawal: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    approveRecharge: async function (req, res) {
        try {
            const { requestId, adminComment } = req.body;
            if (!requestId) return rtnRes(res, 400, "requestId is required");

            await rechargeService.approveRecharge(requestId, adminComment);
            return rtnRes(res, 200, "Recharge approved and wallet updated");
        } catch (e) {
            log(`Error in approveRecharge: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    rejectRecharge: async function (req, res) {
        try {
            const { requestId, adminComment } = req.body;
            if (!requestId) return rtnRes(res, 400, "requestId is required");

            await rechargeService.rejectRecharge(requestId, adminComment);
            return rtnRes(res, 200, "Recharge rejected");
        } catch (e) {
            log(`Error in rejectRecharge: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    }
};

export default adminController;
