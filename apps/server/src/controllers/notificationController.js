import notificationService from "#src/services/notificationService.js";
import { rtnRes } from "#src/utils/helper.js";

const notificationController = {
    createNotification: async function (req, res) {
        try {
            const { heading, short_description, long_description, advertisement_end_time } = req.body;

            if (!heading || !short_description || !long_description || !advertisement_end_time) {
                return rtnRes(res, 400, "Missing required fields");
            }

            const result = await notificationService.create(req.body);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in createNotification:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    getNotifications: async function (req, res) {
        try {
            const result = await notificationService.get(req.query);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in getNotifications:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    getNotificationById: async function (req, res) {
        try {
            const { id } = req.params;
            const result = await notificationService.get({ id });
            return rtnRes(res, result.code, result.msg, result.data ? result.data[0] : null);
        } catch (err) {
            console.error("Error in getNotificationById:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    updateNotification: async function (req, res) {
        try {
            const { id } = req.params;
            const result = await notificationService.update(id, req.body);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in updateNotification:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    deleteNotification: async function (req, res) {
        try {
            const { id } = req.params;
            const result = await notificationService.delete(id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.error("Error in deleteNotification:", err);
            return rtnRes(res, 500, "Internal Server Error");
        }
    }
};

export default notificationController;
