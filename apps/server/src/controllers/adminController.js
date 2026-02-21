import adminService from '#services/adminService.js';
import withdrawalService from '#services/withdrawalService.js';
import rechargeService from '#services/rechargeService.js';
import userNotificationService from '#services/userNotificationService.js';
import * as orderService from '#services/orderService.js';
import * as referralService from '#services/referralService.js';
import { queryRunner } from '#config/db.js';
import { rtnRes, log } from '#utils/helper.js';

const adminController = {
    approvePayment: async function (req, res) {
        try {
            const { orderId } = req.body;
            const adminComment = req.body.adminComment || "Approved by admin";

            if (!orderId) {
                return rtnRes(res, 400, "orderId is required");
            }

            log(`Admin approving payment for order ${orderId}`, "info");
            await orderService.verifyOrderPayment(orderId, 'APPROVED', adminComment);

            return rtnRes(res, 200, "Payment approved successfully");
        } catch (e) {
            log(`Error in approvePayment: ${e.message}`, "error");
            rtnRes(res, 500, e.message || "internal error");
        }
    },

    rejectPayment: async function (req, res) {
        try {
            const { orderId, reason } = req.body;
            if (!orderId) return rtnRes(res, 400, "orderId is required");

            log(`Admin rejecting payment for order ${orderId}`, "info");
            await orderService.verifyOrderPayment(orderId, 'REJECTED', reason || "Rejected by admin");

            return rtnRes(res, 200, "Payment rejected and user notified");
        } catch (e) {
            log(`Error in rejectPayment: ${e.message}`, "error");
            rtnRes(res, 500, e.message || "internal error");
        }
    },

    approveWithdrawal: async function (req, res) {
        try {
            const { requestId, adminComment } = req.body;
            if (!requestId) return rtnRes(res, 400, "requestId is required");

            const result = await withdrawalService.approveWithdrawal(requestId, adminComment);
            
            // Send Notification
            await userNotificationService.create({
                user_id: result.request.user_id,
                type: 'WITHDRAWAL_APPROVED',
                title: 'Withdrawal Request Approved',
                description: `Your withdrawal request of ₹${result.request.amount} has been approved. The amount will be credited to your account shortly.`
            });

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

            const result = await withdrawalService.rejectWithdrawal(requestId, adminComment);
            
            // Send Notification
            await userNotificationService.create({
                user_id: result.request.user_id,
                type: 'WITHDRAWAL_REJECTED',
                title: 'Withdrawal Request Rejected',
                description: `Your withdrawal request of ₹${result.request.amount} was rejected. Reason: ${adminComment || "Rejected by admin"}. The balance has been returned to your wallet.`
            });

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

            const result = await rechargeService.approveRecharge(requestId, adminComment);
            
            // Send Notification
            await userNotificationService.create({
                user_id: result.request.user_id,
                type: 'RECHARGE_APPROVED',
                title: 'Recharge Request Approved',
                description: `Your recharge request of ₹${result.request.amount} has been approved. The amount has been added to your wallet balance.`
            });

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

            const result = await rechargeService.rejectRecharge(requestId, adminComment);
            
            // Send Notification
            await userNotificationService.create({
                user_id: result.request.user_id,
                type: 'RECHARGE_REJECTED',
                title: 'Recharge Request Rejected',
                description: `Your recharge request of ₹${result.request.amount} was rejected. Reason: ${adminComment || "Rejected by admin"}.`
            });

            return rtnRes(res, 200, "Recharge rejected");
        } catch (e) {
            log(`Error in rejectRecharge: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }
    },

    getRecharges: async function (req, res) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;

            const recharges = await rechargeService.getRechargeRequests(filters);
            return rtnRes(res, 200, "Recharges fetched successfully", recharges);
        } catch (e) {
            log(`Error in getRecharges: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getWithdrawals: async function (req, res) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;

            const withdrawals = await withdrawalService.getWithdrawalRequests(filters);
            return rtnRes(res, 200, "Withdrawals fetched successfully", withdrawals);
        } catch (e) {
            log(`Error in getWithdrawals: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getUsers: async function (req, res) {
        try {
            const formattedUsers = await adminService.getAllUsers();
            return rtnRes(res, 200, "Users fetched successfully", formattedUsers);
        } catch (e) {
            log(`Error in getUsers: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getUserDetails: async function (req, res) {
        try {
            const { userId } = req.params;
            if (!userId) return rtnRes(res, 400, "userId is required");

            const user = await adminService.getUserDetails(userId);
            if (!user) return rtnRes(res, 404, "User not found");

            return rtnRes(res, 200, "User details fetched successfully", user);
        } catch (e) {
            log(`Error in getUserDetails: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    updateUser: async function (req, res) {
        try {
            const { userId } = req.params;
            const { name, email, phone, is_blocked, account_activation_status } = req.body;

            if (!userId) return rtnRes(res, 400, "userId is required");

            await queryRunner(`
                UPDATE users SET 
                    name = COALESCE(?, name),
                    email = COALESCE(?, email),
                    phone = COALESCE(?, phone),
                    is_blocked = COALESCE(?, is_blocked),
                    account_activation_status = COALESCE(?, account_activation_status)
                WHERE id = ?
            `, [
                name === undefined ? null : name,
                email === undefined ? null : email,
                phone === undefined ? null : phone,
                is_blocked === undefined ? null : is_blocked,
                account_activation_status === undefined ? null : account_activation_status,
                userId
            ]);

            return rtnRes(res, 200, "User updated successfully");
        } catch (e) {
            log(`Error in updateUser: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getKYCRecords: async function (req, res) {
        try {
            const records = await adminService.getKYCRecords(req.query.status);
            return rtnRes(res, 200, "KYC records fetched successfully", records);
        } catch (e) {
            log(`Error in getKYCRecords: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },
    getWalletTransactions: async function (req, res) {
        try {
            const { page = 1, limit = 50, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const { transactions, total, totalPages } = await adminService.getWalletTransactions(filters, parseInt(limit), parseInt(offset));

            return res.json({
                success: true,
                data: {
                    transactions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages
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
            const { page = 1, limit = 50, ...filters } = req.query;
            const offset = (page - 1) * limit;

            const { tickets, total, totalPages } = await adminService.getTickets(filters, parseInt(limit), parseInt(offset));

            return res.json({
                success: true,
                data: {
                    tickets,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages
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

            const success = await adminService.updateTicketStatus(ticketId, status);

            if (!success) {
                return rtnRes(res, 404, "Ticket not found");
            }

            return rtnRes(res, 200, "Ticket status updated successfully");

        } catch (e) {
            log(`Error in updateTicketStatus: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
        }

    },
      updateKYCStatus: async function (req, res) {
        try {
            const { userId } = req.params;
            const { type, status } = req.body;

            if (!userId || !type || !status) {
                return rtnRes(res, 400, "userId, type, and status are required");
            }

            const validTypes = ['identity', 'address', 'bank'];
            const validStatuses = ['VERIFIED', 'REJECTED', 'PENDING'];

            if (!validTypes.includes(type)) {
                return rtnRes(res, 400, "Invalid verification type");
            }

            if (!validStatuses.includes(status)) {
                return rtnRes(res, 400, "Invalid status");
            }

            const fieldName = `${type}_status`;

            await queryRunner(`
                UPDATE profiles 
                SET ${fieldName} = ? 
                WHERE user_id = ?
            `, [status, userId]);

            return rtnRes(res, 200, `KYC ${type} status updated to ${status}`);
        } catch (e) {
            log(`Error in updateKYCStatus: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getUserNotifications: async function (req, res) {
        try {
            const result = await userNotificationService.get(req.query);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in getUserNotifications: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    sendUserNotification: async function (req, res) {
        try {
            const { user_id, type, title, description } = req.body;
            if (!user_id || !type || !title) {
                return rtnRes(res, 400, "Missing required fields: user_id, type, title");
            }

            const result = await userNotificationService.create({ user_id, type, title, description });
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in sendUserNotification: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    broadcastUserNotification: async function (req, res) {
        try {
            const { type, title, description } = req.body;
            if (!type || !title) {
                return rtnRes(res, 400, "Missing required fields: type, title");
            }

            const result = await userNotificationService.broadcast({ type, title, description });
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in broadcastUserNotification: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    deleteUserNotification: async function (req, res) {
        try {
            const { id } = req.params;
            const result = await userNotificationService.deleteNotification(id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in deleteUserNotification: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getUserReferralOverview: async function (req, res) {
        try {
            const { userId } = req.params;
            if (!userId) return rtnRes(res, 400, "userId is required");

            const result = await referralService.getReferralOverview(userId);
            return rtnRes(res, 200, "Referral overview fetched successfully", result.data);
        } catch (e) {
            log(`Error in getUserReferralOverview: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    },

    getTeamMembersByLevel: async function (req, res) {
        try {
            const { userId, level } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            if (!userId || !level) {
                return rtnRes(res, 400, "userId and level are required");
            }

            const result = await referralService.getTeamMembersByLevel(userId, Number(level), page, limit);
            return rtnRes(res, 200, "Team members fetched successfully", result.data);
        } catch (e) {
            log(`Error in getTeamMembersByLevel: ${e.message}`, "error");
            return rtnRes(res, 500, "internal error");
        }
    }
}

export default adminController;
