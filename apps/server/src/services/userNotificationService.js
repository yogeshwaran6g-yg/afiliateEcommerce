import { queryRunner } from "#src/config/db.js";
import { srvRes } from "#src/utils/helper.js";

const userNotificationService = {

    create: async function ({ user_id, type, title, description }) {
        try {
            if (!user_id || !type || !title) {
                return srvRes(400, "Missing required fields: user_id, type, title");
            }

            const sql = `
                INSERT INTO user_notifications 
                (user_id, type, title, description)
                VALUES (?, ?, ?, ?)
            `;
            const params = [user_id, type, title, description || null];

            const result = await queryRunner(sql, params);
            if (result?.affectedRows > 0) {
                return srvRes(201, "Notification created", { id: result.insertId });
            }
            return srvRes(500, "Failed to create notification");
        } catch (e) {
            console.error("create user notification error:", e);
            throw e;
        }
    },

    get: async function ({ user_id, unread_only = false, page = 1, limit = 20, type = null }) {
        try {
            if (!user_id) return srvRes(400, "user_id is required");

            let sql = `SELECT * FROM user_notifications WHERE user_id = ?`;
            const params = [user_id];

            if (unread_only === true || unread_only === "true" || unread_only === 1) {
                sql += ` AND is_read = 0`;
            }
            if (type) {
                sql += ` AND type = ?`;
                params.push(type);
            }

            sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

            const notifications = await queryRunner(sql, params);

            // Total count for pagination
            let countSql = `SELECT COUNT(*) as total FROM user_notifications WHERE user_id = ?`;
            const countParams = [user_id];
            if (unread_only) countSql += ` AND is_read = 0`;
            if (type) {
                countSql += ` AND type = ?`;
                countParams.push(type);
            }
            const [{ total }] = await queryRunner(countSql, countParams);

            return srvRes(200, "Notifications fetched", {
                items: notifications,
                pagination: {
                    total: Number(total),
                    page: Number(page),
                    limit: Number(limit),
                    pages: total > 0 ? Math.ceil(total / limit) : 0
                }
            });
        } catch (e) {
            console.error("get user notifications error:", e);
            throw e;
        }
    },

    getUnreadCount: async function (user_id) {
        try {
            if (!user_id) return srvRes(400, "user_id is required");

            const sql = `
                SELECT COUNT(*) as count 
                FROM user_notifications 
                WHERE user_id = ? AND is_read = 0
            `;
            const [{ count }] = await queryRunner(sql, [user_id]);

            return srvRes(200, "Unread count fetched", { unread_count: Number(count) });
        } catch (e) {
            console.error("getUnreadCount error:", e);
            throw e;
        }
    },

    markAsRead: async function (id, user_id) {
        try {
            const sql = `
                UPDATE user_notifications 
                SET is_read = 1 
                WHERE id = ? AND user_id = ?
            `;
            const result = await queryRunner(sql, [id, user_id]);

            if (result?.affectedRows > 0) {
                return srvRes(200, "Notification marked as read");
            }
            return srvRes(404, "Notification not found or not owned by user");
        } catch (e) {
            console.error("markAsRead error:", e);
            throw e;
        }
    },

    markAllAsRead: async function (user_id) {
        try {
            const sql = `
                UPDATE user_notifications 
                SET is_read = 1 
                WHERE user_id = ? AND is_read = 0
            `;
            const result = await queryRunner(sql, [user_id]);

            return srvRes(200, `Marked ${result?.affectedRows || 0} notifications as read`);
        } catch (e) {
            console.error("markAllAsRead error:", e);
            throw e;
        }
    },

    deleteNotification: async function (id, user_id) {
        try {
            const sql = `
                DELETE FROM user_notifications 
                WHERE id = ? AND user_id = ?
            `;
            const result = await queryRunner(sql, [id, user_id]);

            if (result?.affectedRows > 0) {
                return srvRes(200, "Notification deleted successfully");
            }
            return srvRes(404, "Notification not found or not owned by user");
        } catch (e) {
            console.error("deleteNotification error:", e);
            throw e;
        }
    }
};

export default userNotificationService;