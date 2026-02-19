import { activateUser } from '#services/userService.js';
import withdrawalService from '#services/withdrawalService.js';
import rechargeService from '#services/rechargeService.js';
import userNotificationService from '#services/userNotificationService.js';
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
            const users = await queryRunner(`
                SELECT 
                    u.id, u.name, u.phone, u.email, u.referral_id, 
                    u.account_activation_status, u.created_at, u.is_blocked,
                    (SELECT COUNT(*) FROM referral_tree WHERE upline_id = u.id AND level = 1) as direct_referrals
                FROM users u
                ORDER BY u.created_at DESC
            `);

            const formattedUsers = users.map(user => {
                let rank = "Silver";
                if (user.direct_referrals >= 10) rank = "Diamond";
                else if (user.direct_referrals >= 5) rank = "Platinum";
                else if (user.direct_referrals >= 2) rank = "Gold";

                return {
                    id: `UL-${user.id.toString().padStart(6, '0')}`,
                    dbId: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    referral_id: user.referral_id,
                    rank: rank,
                    level: `Level ${Math.floor(Math.random() * 5) + 1}`,
                    joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    status: user.is_blocked ? 'BLOCKED' : (user.account_activation_status === 'ACTIVATED' ? 'ACTIVE' : 'INACTIVE'),
                    avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                    color: "bg-blue-100 text-blue-600"
                };
            });

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

            const [user] = await queryRunner(`
                SELECT u.id, u.name, u.phone, u.email, u.role, u.referral_id, 
                       u.is_phone_verified, u.account_activation_status, u.is_blocked, u.created_at,
                       u.referred_by,
                       r.referral_id as referred_by_referral_id,
                       p.dob, p.id_type, p.id_number, p.identity_status, p.address_status, p.bank_status,
                       p.bank_account_name, p.bank_name, p.bank_account_number, p.bank_ifsc,
                       p.id_document_url, p.address_document_url, p.bank_document_url,
                       w.balance, w.locked_balance,
                       apd.payment_type as activation_payment_type,
                       apd.proof_url as activation_proof_url,
                       apd.status as activation_payment_status,
                       apd.admin_comment as activation_admin_comment,
                       apd.created_at as activation_submitted_at,
                       prd.name as activated_product_name
                FROM users u
                LEFT JOIN users r ON u.referred_by = r.id
                LEFT JOIN profiles p ON u.id = p.user_id
                LEFT JOIN wallets w ON u.id = w.user_id
                LEFT JOIN activation_payments_details apd ON u.id = apd.user_id
                LEFT JOIN products prd ON apd.product_id = prd.id
                WHERE u.id = ?
            `, [userId]);

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
            const { status } = req.query;
            let query = `
                SELECT 
                    u.id, u.name, u.phone, u.email, u.referral_id,
                    p.identity_status, p.address_status, p.bank_status,
                    p.created_at as profile_created, p.updated_at as profile_updated
                FROM users u
                JOIN profiles p ON u.id = p.user_id
            `;
            const params = [];

            if (status) {
                query += ` WHERE p.identity_status = ? OR p.address_status = ? OR p.bank_status = ?`;
                params.push(status, status, status);
            }

            query += ` ORDER BY p.updated_at DESC`;

            const records = await queryRunner(query, params);

            const formattedRecords = records.map(record => ({
                id: `UL-${record.id.toString().padStart(6, '0')}`,
                dbId: record.id,
                name: record.name,
                phone: record.phone,
                email: record.email,
                referral_id: record.referral_id,
                statuses: {
                    identity: record.identity_status,
                    address: record.address_status,
                    bank: record.bank_status
                },
                lastUpdated: record.profile_updated
            }));

            return rtnRes(res, 200, "KYC records fetched successfully", formattedRecords);
        } catch (e) {
            log(`Error in getKYCRecords: ${e.message}`, "error");

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
                    w.balance as current_balance,
                    rr.proof_image,
                    rr.payment_method,
                    rr.payment_reference,
                    wr.bank_details,
                    wr.platform_fee,
                    wr.net_amount
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.id
                JOIN users u ON w.user_id = u.id
                LEFT JOIN recharge_requests rr ON wt.reference_table = 'recharge_requests' AND wt.reference_id = rr.id
                LEFT JOIN withdrawal_requests wr ON wt.reference_table = 'withdrawal_requests' AND wt.reference_id = wr.id
                ${whereClause}
                ORDER BY wt.created_at DESC
                LIMIT ? OFFSET ?
            `;

            const transactions = await queryRunner(query, [...queryParams, parseInt(limit), parseInt(offset)]);

            return res.json({
                success: true,
                data: {
                    transactions: transactions.map(t => ({
                        ...t,
                        bank_details: t.bank_details ? (typeof t.bank_details === 'string' ? JSON.parse(t.bank_details) : t.bank_details) : null
                    })),
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
