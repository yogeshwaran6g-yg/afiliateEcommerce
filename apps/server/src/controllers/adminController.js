import adminService from '#services/adminService.js';
import withdrawalService from '#services/withdrawalService.js';
import rechargeService from '#services/rechargeService.js';
import userNotificationService from '#services/userNotificationService.js';
import * as orderService from '#services/orderService.js';
import { queryRunner, transactionRunner } from '#config/db.js';
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
            const { name, email, phone, is_blocked, account_activation_status, balance, locked_balance } = req.body;

            if (!userId) return rtnRes(res, 400, "userId is required");

            await transactionRunner(async (connection) => {
                // Fetch current wallet state if balance or locked_balance is provided
                let oldWallet = null;
                if (balance !== undefined || locked_balance !== undefined) {
                    const [rows] = await connection.execute('SELECT * FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);
                    oldWallet = rows[0];
                }

                // Update users table
                await connection.execute(`
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

                // Update wallets table if balance or locked_balance is provided
                if (balance !== undefined || locked_balance !== undefined) {
                    const newBalance = balance !== undefined ? balance : (oldWallet ? oldWallet.balance : 0);
                    const newLockedBalance = locked_balance !== undefined ? locked_balance : (oldWallet ? oldWallet.locked_balance : 0);

                    await connection.execute(`
                        UPDATE wallets SET 
                            balance = COALESCE(?, balance),
                            locked_balance = COALESCE(?, locked_balance)
                        WHERE user_id = ?
                    `, [
                        balance === undefined ? null : balance,
                        locked_balance === undefined ? null : locked_balance,
                        userId
                    ]);

                    // Log transaction if there's a difference
                    if (oldWallet) {
                        const balanceDiff = Number(newBalance) - Number(oldWallet.balance);
                        const lockedDiff = Number(newLockedBalance) - Number(oldWallet.locked_balance);

                        if (balanceDiff !== 0 || lockedDiff !== 0) {
                            // We use the absolute total change for the 'amount' field as per table constraint amount > 0
                            // If multiple balances change, we log it as one adjustment.
                            const totalAbsDiff = Math.abs(balanceDiff) + Math.abs(lockedDiff);

                            if (totalAbsDiff > 0) {
                                await connection.execute(`
                                    INSERT INTO wallet_transactions (
                                        wallet_id, entry_type, transaction_type, 
                                        amount, balance_before, balance_after,
                                        locked_before, locked_after, 
                                        status, description
                                    ) VALUES (?, ?, 'ADMIN_ADJUSTMENT', ?, ?, ?, ?, ?, 'SUCCESS', ?)
                                `, [
                                    oldWallet.id,
                                    balanceDiff >= 0 ? 'CREDIT' : 'DEBIT',
                                    totalAbsDiff,
                                    oldWallet.balance,
                                    newBalance,
                                    oldWallet.locked_balance,
                                    newLockedBalance,
                                    `Admin adjusted balance (Available: ${balanceDiff >= 0 ? '+' : ''}${balanceDiff}, Locked: ${lockedDiff >= 0 ? '+' : ''}${lockedDiff})`
                                ]);
                            }
                        }
                    }
                }
            });

            return rtnRes(res, 200, "User updated successfully");
        } catch (e) {
            log(`Error in updateUser: ${e.message}`, "error");
            return rtnRes(res, 500, e.message || "internal error");
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
    }
}

export default adminController;
