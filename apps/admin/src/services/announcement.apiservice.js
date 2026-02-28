import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const announcementApiService = {
    getAnnouncements: async () => {
        try {
            const data = await api.get(API_ENDPOINTS.ANNOUNCEMENTS.BASE);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncements:', error);
            throw error;
        }
    },

    getAnnouncementById: async (id) => {
        try {
            const data = await api.get(API_ENDPOINTS.ANNOUNCEMENTS.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.getAnnouncementById:', error);
            throw error;
        }
    },

    createAnnouncement: async (announcementData) => {
        try {
            const data = await api.post(API_ENDPOINTS.ANNOUNCEMENTS.BASE, announcementData);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.createAnnouncement:', error);
            throw error;
        }
    },

    updateAnnouncement: async (id, announcementData) => {
        try {
            const data = await api.put(API_ENDPOINTS.ANNOUNCEMENTS.BY_ID(id), announcementData);
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.updateAnnouncement:', error);
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const data = await api.delete(API_ENDPOINTS.ANNOUNCEMENTS.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in announcementApiService.deleteAnnouncement:', error);
            throw error;
        }
    }
};

export default announcementApiService;
