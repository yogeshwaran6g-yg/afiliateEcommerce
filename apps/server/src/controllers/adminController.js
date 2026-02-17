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
    },

    getWalletTransactions: async function (req, res) {
        try {
            const { page = 1, limit = 50, userId, transactionType, entryType, status, startDate, endDate } = req.query;
            const offset = (page - 1) * limit;

            let whereConditions = [];
            let queryParams = [];

            if (userId) {
                whereConditions.push('w.user_id = ?');
                queryParams.push(userId);
            }
            if (transactionType) {
                whereConditions.push('wt.transaction_type = ?');
                queryParams.push(transactionType);
            }
            if (entryType) {
                whereConditions.push('wt.entry_type = ?');
                queryParams.push(entryType);
            }
            if (status) {
                whereConditions.push('wt.status = ?');
                queryParams.push(status);
            }
            if (startDate) {
                whereConditions.push('wt.created_at >= ?');
                queryParams.push(startDate);
            }
            if (endDate) {
                whereConditions.push('wt.created_at <= ?');
                queryParams.push(endDate);
            }

            const whereClause = whereConditions.length > 0
                ? 'WHERE ' + whereConditions.join(' AND ')
                : '';

            const countQuery = `
                SELECT COUNT(*) as total 
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.id
                ${whereClause}
            `;
            const [countResult] = await queryRunner(countQuery, queryParams);
            const total = countResult.total;

            const query = `
                SELECT 
                    wt.*,
                    u.id as user_id,
                    u.name as user_name,
                    u.phone as user_phone,
                    u.email as user_email,
                    w.balance as current_balance
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.id
                JOIN users u ON w.user_id = u.id
                ${whereClause}
                ORDER BY wt.created_at DESC
                LIMIT ? OFFSET ?
            `;

            const transactions = await queryRunner(query, [...queryParams, parseInt(limit), parseInt(offset)]);

            return res.json({
                success: true,
                data: {
                    transactions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (e) {
            log(`Error in getWalletTransactions: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    getTickets: async function (req, res) {
        try {
            const { page = 1, limit = 50, userId, status, priority, category, startDate, endDate, search } = req.query;
            const offset = (page - 1) * limit;

            let whereConditions = [];
            let queryParams = [];

            if (userId) {
                whereConditions.push('t.user_id = ?');
                queryParams.push(userId);
            }
            if (status) {
                whereConditions.push('t.status = ?');
                queryParams.push(status);
            }
            if (priority) {
                whereConditions.push('t.priority = ?');
                queryParams.push(priority);
            }
            if (category) {
                whereConditions.push('t.category = ?');
                queryParams.push(category);
            }
            if (startDate) {
                whereConditions.push('t.created_at >= ?');
                queryParams.push(startDate);
            }
            if (endDate) {
                whereConditions.push('t.created_at <= ?');
                queryParams.push(endDate);
            }
            if (search) {
                whereConditions.push('(t.subject LIKE ? OR t.description LIKE ? OR u.name LIKE ? OR u.phone LIKE ?)');
                const searchPattern = `%${search}%`;
                queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
            }

            const whereClause = whereConditions.length > 0
                ? 'WHERE ' + whereConditions.join(' AND ')
                : '';

            const countQuery = `
                SELECT COUNT(*) as total 
                FROM tickets t
                JOIN users u ON t.user_id = u.id
                ${whereClause}
            `;
            const [countResult] = await queryRunner(countQuery, queryParams);
            const total = countResult.total;

            const query = `
                SELECT 
                    t.*,
                    u.name as user_name,
                    u.phone as user_phone,
                    u.email as user_email
                FROM tickets t
                JOIN users u ON t.user_id = u.id
                ${whereClause}
                ORDER BY t.created_at DESC
                LIMIT ? OFFSET ?
            `;

            const tickets = await queryRunner(query, [...queryParams, parseInt(limit), parseInt(offset)]);

            return res.json({
                success: true,
                data: {
                    tickets,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (e) {
            log(`Error in getTickets: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    updateTicketStatus: async function (req, res) {
        try {
            const { ticketId, status } = req.body;
            if (!ticketId || !status) return rtnRes(res, 400, "ticketId and status are required");

            const validStatuses = ['OPEN', 'IN_REVIEW', 'COMPLETED', 'CLOSED'];
            if (!validStatuses.includes(status)) {
                return rtnRes(res, 400, "Invalid status");
            }

            const result = await queryRunner('UPDATE tickets SET status = ? WHERE id = ?', [status, ticketId]);

            if (result.affectedRows === 0) {
                return rtnRes(res, 404, "Ticket not found");
            }

            return rtnRes(res, 200, "Ticket status updated successfully");

        } catch (e) {
            log(`Error in updateTicketStatus: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    }
};

export default adminController;
