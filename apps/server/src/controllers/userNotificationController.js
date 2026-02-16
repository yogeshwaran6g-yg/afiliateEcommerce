import userNotificationService from "#src/services/userNotificationService.js";
import { rtnRes } from "#src/utils/helper.js";

const userNotificationController = {


    getNotifications: async function (req, res) {
        try {
            const user_id = req.user?.id;

            if (!user_id) {
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
            console.error("Error in getNotifications:", err);
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
            const user_id = req.user?.id;
            const { id } = req.params;

            if (!user_id) return rtnRes(res, 401, "Authentication required");
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
            const user_id = req.user?.id;
            const { id } = req.params;

            if (!user_id) return rtnRes(res, 401, "Authentication required");
            if (!id) return rtnRes(res, 400, "Notification ID required");

            const result = await userNotificationService.deleteNotification(id, user_id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in deleteNotification:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    }
};

export default userNotificationController;