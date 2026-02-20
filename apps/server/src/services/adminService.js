import { queryRunner } from '#config/db.js';
import { log } from '#utils/helper.js';

const adminService = {
    /**
     * Get all users with their summary stats and ranks.
     */
    getAllUsers: async () => {
        try {
            const users = await queryRunner(`
                SELECT 
                    u.id, u.name, u.phone, u.email, u.referral_id, 
                    u.account_activation_status, u.created_at, u.is_blocked,
                    (SELECT COUNT(*) FROM referral_tree WHERE upline_id = u.id AND level = 1) as direct_referrals
                FROM users u
                ORDER BY u.created_at DESC
            `);

            return users.map(user => {
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
                    joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    status: user.is_blocked ? 'BLOCKED' : (user.account_activation_status === 'ACTIVATED' ? 'ACTIVE' : 'INACTIVE'),
                    avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                    color: "bg-blue-100 text-blue-600"
                };
            });
        } catch (error) {
            log(`Error in getAllUsers Service: ${error.message}`, "error");
            throw error;
        }
    },

    /**
     * Get detailed information about a single user.
     */
    getUserDetails: async (userId) => {
        try {
            // Note: activation_payments_details table was removed in DB changes.
            // We now join with orders table where order_type = 'ACTIVATION'.
            const [user] = await queryRunner(`
                SELECT u.id, u.name, u.phone, u.email, u.role, u.referral_id, 
                       u.is_phone_verified, u.account_activation_status, u.is_blocked, u.created_at,
                       u.referred_by,
                       r.referral_id as referred_by_referral_id,
                       p.dob, p.id_type, p.id_number, p.identity_status, p.address_status, p.bank_status,
                       p.bank_account_name, p.bank_name, p.bank_account_number, p.bank_ifsc,
                       p.id_document_url, p.address_document_url, p.bank_document_url,
                       w.balance, w.locked_balance,
                       o.payment_method as activation_payment_method,
                       o.payment_status as activation_payment_status,
                       op.payment_type as activation_payment_type,
                       op.proof_url as activation_proof_url,
                       op.status as activation_verification_status,
                       op.admin_comment as activation_admin_comment,
                       o.created_at as activation_submitted_at
                FROM users u
                LEFT JOIN users r ON u.referred_by = r.id
                LEFT JOIN profiles p ON u.id = p.user_id
                LEFT JOIN wallets w ON u.id = w.user_id
                LEFT JOIN orders o ON u.id = o.user_id AND o.order_type = 'ACTIVATION'
                LEFT JOIN order_payments op ON o.id = op.order_id
                WHERE u.id = ?
                ORDER BY o.created_at DESC LIMIT 1
            `, [userId]);

            return user || null;
        } catch (error) {
            log(`Error in getUserDetails Service: ${error.message}`, "error");
            throw error;
        }
    },

    /**
     * Get KYC records for approval/rejection.
     */
    getKYCRecords: async (statusFilter = null) => {
        try {
            let query = `
                SELECT 
                    u.id, u.name, u.phone, u.email, u.referral_id,
                    p.identity_status, p.address_status, p.bank_status,
                    p.created_at as profile_created, p.updated_at as profile_updated
                FROM users u
                JOIN profiles p ON u.id = p.user_id
            `;
            const params = [];

            if (statusFilter) {
                query += ` WHERE p.identity_status = ? OR p.address_status = ? OR p.bank_status = ?`;
                params.push(statusFilter, statusFilter, statusFilter);
            }

            query += ` ORDER BY p.updated_at DESC`;

            const records = await queryRunner(query, params);

            return records.map(record => ({
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
        } catch (error) {
            log(`Error in getKYCRecords Service: ${error.message}`, "error");
            throw error;
        }
    },

    /**
     * Get wallet transactions with user details (admin view).
     */
    getWalletTransactions: async (filters = {}, limit = 50, offset = 0) => {
        try {
            const { userId, transactionType, entryType, status, startDate, endDate } = filters;
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

            return {
                transactions: transactions.map(t => ({
                    ...t,
                    bank_details: t.bank_details ? (typeof t.bank_details === 'string' ? JSON.parse(t.bank_details) : t.bank_details) : null
                })),
                total,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            log(`Error in getWalletTransactions Service: ${error.message}`, "error");
            throw error;
        }
    },

    /**
     * Get support tickets (admin view).
     */
    getTickets: async (filters = {}, limit = 50, offset = 0) => {
        try {
            const { userId, status, priority, category, startDate, endDate, search } = filters;
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

            return {
                tickets,
                total,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            log(`Error in getTickets Service: ${error.message}`, "error");
            throw error;
        }
    },

    /**
     * Update ticket status.
     */
    updateTicketStatus: async (ticketId, status) => {
        try {
            const validStatuses = ['OPEN', 'IN_REVIEW', 'COMPLETED', 'CLOSED'];
            if (!validStatuses.includes(status)) {
                throw new Error("Invalid status");
            }

            const result = await queryRunner('UPDATE tickets SET status = ? WHERE id = ?', [status, ticketId]);
            return result.affectedRows > 0;
        } catch (error) {
            log(`Error in updateTicketStatus Service: ${error.message}`, "error");
            throw error;
        }
    }
};

export default adminService;
