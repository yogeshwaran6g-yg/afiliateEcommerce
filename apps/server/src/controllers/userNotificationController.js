import userNotificationService from "#src/services/userNotificationService.js";
import { rtnRes } from "#src/utils/helper.js";

const userNotificationController = {
    getUserNotifications: async function (req, res) {
        try {
            // Security: Regular users can ONLY see their own notifications.
            // Admins can see everyone's (if query.user_id is null) or filter by a specific user.
            const user_id = (req.user?.role === 'ADMIN') ? (req.query.user_id || null) : req.user?.id;

            if (!req.user) {
                return rtnRes(res, 401, "Authentication required");
            }
            const result = await userNotificationService.get({
                user_id,
                unread_only: req.query.unread_only,
                page: req.query.page || 1,
                limit: req.query.limit || 20,
                type: req.query.type || null
            });

            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in getUserNotifications:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    getUnreadCount: async function (req, res) {
        try {
            const user_id = req.user?.id;
            if (!user_id) return rtnRes(res, 401, "Authentication required");

            const result = await userNotificationService.getUnreadCount(user_id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in getUnreadCount:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    markAsRead: async function (req, res) {
        try {
            const user_id = req.user?.role !== 'ADMIN' ? req.user?.id : null;
            const { id } = req.params;

            if (!id) return rtnRes(res, 400, "Notification ID required");

            const result = await userNotificationService.markAsRead(id, user_id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in markAsRead:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    markAllAsRead: async function (req, res) {
        try {
            const user_id = req.user?.id;
            if (!user_id) return rtnRes(res, 401, "Authentication required");

            const result = await userNotificationService.markAllAsRead(user_id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in markAllAsRead:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    deleteNotification: async function (req, res) {
        try {
            const user_id = req.user?.role !== 'ADMIN' ? req.user?.id : null;
            const { id } = req.params;

            if (!id) return rtnRes(res, 400, "Notification ID required");

            const result = await userNotificationService.deleteNotification(id, user_id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in deleteNotification:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    sendNotification: async function (req, res) {
        try {
            const { user_id, type, title, description } = req.body;
            if (!user_id || !type || !title) {
                return rtnRes(res, 400, "Missing required fields: user_id, type, title");
            }

            const result = await userNotificationService.create({ user_id, type, title, description });
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            console.error("Error in sendNotification:", e);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    broadcastNotification: async function (req, res) {
        try {
            const { type, title, description } = req.body;
            if (!type || !title) {
                return rtnRes(res, 400, "Missing required fields: type, title");
            }

            const result = await userNotificationService.broadcast({ type, title, description });
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            console.error("Error in broadcastNotification:", e);
            return rtnRes(res, 500, "Internal Server Error");
        }
    }
};

export default userNotificationController;