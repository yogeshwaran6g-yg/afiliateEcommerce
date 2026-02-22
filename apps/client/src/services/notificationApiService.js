import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { notifications: notificationEndpoints } = constants.endpoints;

export const getNotifications = async (params = {}) => {
    try {
        const response = await api.get(notificationEndpoints.base, params);
        return response;
    } catch (error) {
        handleServiceError(error, "Get Notifications");
    }
};

export default {
    getNotifications
};
