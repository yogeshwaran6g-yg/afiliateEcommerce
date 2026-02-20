import http from "../util/axios";

const userNotificationApiService = {
    getNotifications: async (filters = {}) => {
        try {
            const response = await http.get('/admin/user-notifications', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.getNotifications:', error);
            throw error;
        }
    },

    sendNotification: async (notificationData) => {
        try {
            const response = await http.post('/admin/user-notifications', notificationData);
            return response.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.sendNotification:', error);
            throw error;
        }
    },

    broadcastNotification: async (notificationData) => {
        try {
            const response = await http.post('/admin/user-notifications/broadcast', notificationData);
            return response.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.broadcastNotification:', error);
            throw error;
        }
    },

    deleteNotification: async (id) => {
        try {
            const response = await http.delete(`/admin/user-notifications/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.deleteNotification:', error);
            throw error;
        }
    }
};

export default userNotificationApiService;
