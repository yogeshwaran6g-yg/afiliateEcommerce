import { api } from "../util/axios";

const announcementApiService = {
    getAnnouncements: async () => {
        try {
            const data = await api.get("/admin/notifications");
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncements:', error);
            throw error;
        }
    },

    getAnnouncementById: async (id) => {
        try {
            const data = await api.get(`/admin/notifications/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncementById:', error);
            throw error;
        }
    },

    createAnnouncement: async (announcementData) => {
        try {
            const data = await api.post("/admin/notifications", announcementData);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.createAnnouncement:', error);
            throw error;
        }
    },

    updateAnnouncement: async (id, announcementData) => {
        try {
            const data = await api.put(`/admin/notifications/${id}`, announcementData);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.updateAnnouncement:', error);
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const data = await api.delete(`/admin/notifications/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.deleteAnnouncement:', error);
            throw error;
        }
    }
};

export default announcementApiService;
