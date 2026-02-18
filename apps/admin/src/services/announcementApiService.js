const API_BASE_URL = 'http://localhost:4000/api/v1';

const announcementApiService = {
    getAnnouncements: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch announcements');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncements:', error);
            throw error;
        }
    },

    getAnnouncementById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch announcement');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncementById:', error);
            throw error;
        }
    },

    createAnnouncement: async (announcementData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
                method: 'POST',
                body: announcementData // FormData for image
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create announcement');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.createAnnouncement:', error);
            throw error;
        }
    },

    updateAnnouncement: async (id, announcementData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
                method: 'PUT',
                body: announcementData // FormData for image
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update announcement');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.updateAnnouncement:', error);
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete announcement');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.deleteAnnouncement:', error);
            throw error;
        }
    }
};

export default announcementApiService;
