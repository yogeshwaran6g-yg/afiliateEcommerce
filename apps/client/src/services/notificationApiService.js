import { api } from "../util/axios";
import constants from "../config/constants";

const { notifications: notificationEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getNotifications = async (params = {}) => {
    try {
        const response = await api.get(notificationEndpoints.base, { params });
        return response;
    } catch (error) {
        handleApiError(error, "Get Notifications");
    }
};

export default {
    getNotifications
};
