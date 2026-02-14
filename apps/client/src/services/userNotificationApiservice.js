import { api } from "../util/axios";
import constants from "../config/constants";

const { userNotifications: endpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getNotifications = async (params = {}) => {
    try {
        const response = await api.get(endpoints.base, { params });
        return response;
    } catch (error) {
        handleApiError(error, "Get User Notifications");
    }
};

export const getUnreadCount = async () => {
    try {
        const response = await api.get(endpoints.unreadCount);
        return response;
    } catch (error) {
        handleApiError(error, "Get Unread Count");
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await api.put(endpoints.markAsRead(id));
        return response;
    } catch (error) {
        handleApiError(error, "Mark As Read");
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await api.put(endpoints.markAllAsRead);
        return response;
    } catch (error) {
        handleApiError(error, "Mark All As Read");
    }
};

export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
