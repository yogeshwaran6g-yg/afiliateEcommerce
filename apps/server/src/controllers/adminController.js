import { activateUser } from '#services/userService.js';
import { queryRunner } from '#config/db.js';
import { rtnRes, log } from '#utils/helper.js';

const adminController = {
    approvePayment: async function (req, res) {
        try {
            const { paymentId } = req.body;
            if (!paymentId) return rtnRes(res, 400, "paymentId is required");

            const [payment] = await queryRunner('SELECT * FROM activation_payments WHERE id = ?', [paymentId]);
            if (!payment) return rtnRes(res, 404, "Payment record not found");

            if (payment.status !== 'PENDING') {
                return rtnRes(res, 400, `Payment is already ${payment.status}`);
            }

            await queryRunner('UPDATE activation_payments SET status = "APPROVED" WHERE id = ?', [paymentId]);
            await activateUser(payment.user_id);

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

            const [payment] = await queryRunner('SELECT * FROM activation_payments WHERE id = ?', [paymentId]);
            if (!payment) return rtnRes(res, 404, "Payment record not found");

            await queryRunner('UPDATE activation_payments SET status = "REJECTED", admin_comment = ? WHERE id = ?', [reason || "Rejected by admin", paymentId]);
            await queryRunner('UPDATE users SET activation_status = "REJECTED" WHERE id = ?', [payment.user_id]);

            return rtnRes(res, 200, "Payment rejected and user notified");

        } catch (e) {
            log(`Error in rejectPayment: ${e.message}`, "error");
            rtnRes(res, 500, "internal error");
        }
    }
};

export default adminController;
