import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getNotifications = async (params = {}) => {
    try {
        const response = await api.get(API_ENDPOINTS.USER_NOTIFICATIONS.ADMIN, { params });
        return response;
    } catch (error) {
        handleApiError(error, "Get User Notifications");
    }
};

export const sendNotification = async (notificationData) => {
    try {
        const response = await api.post(API_ENDPOINTS.USER_NOTIFICATIONS.ADMIN, notificationData);
        return response;
    } catch (error) {
        handleApiError(error, "Send Notification");
    }
};

export const broadcastNotification = async (notificationData) => {
    try {
        const response = await api.post(API_ENDPOINTS.USER_NOTIFICATIONS.BROADCAST, notificationData);
        return response;
    } catch (error) {
        handleApiError(error, "Broadcast Notification");
    }
};

export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.USER_NOTIFICATIONS.ADMIN}/${id}`);
        return response;
    } catch (error) {
        handleApiError(error, "Delete Notification");
    }
};

// Admin's own notifications (System Alerts)
export const getMyNotifications = async (params = {}) => {
    try {
        const token = localStorage.getItem("adminToken");
        if (token === "demo-jwt-token") {
            // Return mock data for demo mode to prevent 401 logout
            return {
                items: [
                    {
                        id: 'demo-1',
                        type: 'INFO',
                        title: 'Demo Mode Active',
                        description: 'You are currently viewing the admin panel in demo mode. Real notifications require a valid admin account.',
                        is_read: false,
                        created_at: new Date().toISOString()
                    }
                ]
            };
        }
        const response = await api.get(API_ENDPOINTS.USER_NOTIFICATIONS.MY, { params });
        return response;
    } catch (error) {
        handleApiError(error, "Get My Notifications");
    }
};

export const markAsRead = async (id) => {
    try {
        const token = localStorage.getItem("adminToken");
        if (token === "demo-jwt-token") return { success: true };
        const response = await api.put(API_ENDPOINTS.USER_NOTIFICATIONS.MY_MARK_AS_READ(id));
        return response;
    } catch (error) {
        handleApiError(error, "Mark As Read");
    }
};

export const markAllAsRead = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        if (token === "demo-jwt-token") return { success: true };
        const response = await api.put(API_ENDPOINTS.USER_NOTIFICATIONS.MY_MARK_ALL_AS_READ);
        return response;
    } catch (error) {
        handleApiError(error, "Mark All As Read");
    }
};

export const markUserNotificationAsRead = async (id) => {
    try {
        const response = await api.put(API_ENDPOINTS.USER_NOTIFICATIONS.MARK_AS_READ(id));
        return response;
    } catch (error) {
        handleApiError(error, "Admin Mark As Read");
    }
};

export const markAllUserNotificationsAsRead = async () => {
    try {
        const response = await api.put(API_ENDPOINTS.USER_NOTIFICATIONS.MARK_ALL_AS_READ);
        return response;
    } catch (error) {
        handleApiError(error, "Admin Mark All As Read");
    }
};

export default {
    getNotifications,
    sendNotification,
    broadcastNotification,
    deleteNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    markUserNotificationAsRead,
    markAllUserNotificationsAsRead
};
