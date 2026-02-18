const API_BASE_URL = "http://localhost:4000/api/v1";

const userNotificationApiService = {
    getNotifications: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `${API_BASE_URL}/admin/user-notifications?${queryParams}` : `${API_BASE_URL}/admin/user-notifications`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user notifications');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.getNotifications:', error);
            throw error;
        }
    },

    sendNotification: async (notificationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user-notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send notification');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.sendNotification:', error);
            throw error;
        }
    },

    broadcastNotification: async (notificationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user-notifications/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to broadcast notification');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.broadcastNotification:', error);
            throw error;
        }
    },

    deleteNotification: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user-notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete notification');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userNotificationApiService.deleteNotification:', error);
            throw error;
        }
    }
};

export default userNotificationApiService;
