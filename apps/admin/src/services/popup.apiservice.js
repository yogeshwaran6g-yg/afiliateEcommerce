import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const popupApiService = {
    getPopups: async () => {
        try {
            const data = await api.get(API_ENDPOINTS.POPUP.BASE);
            return data.data;
        } catch (error) {
            console.error('Error in popupApiService.getPopups:', error);
            throw error;
        }
    },

    getPopupById: async (id) => {
        try {
            const data = await api.get(API_ENDPOINTS.POPUP.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in popupApiService.getPopupById:', error);
            throw error;
        }
    },

    createPopup: async (popupData) => {
        try {
            // Using FormData because we might send an image
            const formData = new FormData();
            Object.keys(popupData).forEach(key => {
                if (key === 'logo' && popupData[key] instanceof File) {
                    formData.append('logo', popupData[key]);
                } else if (popupData[key] !== undefined && popupData[key] !== null) {
                    formData.append(key, popupData[key]);
                }
            });

            const data = await api.post(API_ENDPOINTS.POPUP.BASE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data;
        } catch (error) {
            console.error('Error in popupApiService.createPopup:', error);
            throw error;
        }
    },

    updatePopup: async (id, popupData) => {
        try {
            const formData = new FormData();
            Object.keys(popupData).forEach(key => {
                if (key === 'logo' && popupData[key] instanceof File) {
                    formData.append('logo', popupData[key]);
                } else if (popupData[key] !== undefined && popupData[key] !== null) {
                    formData.append(key, popupData[key]);
                }
            });

            const data = await api.put(API_ENDPOINTS.POPUP.BY_ID(id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data;
        } catch (error) {
            console.error('Error in popupApiService.updatePopup:', error);
            throw error;
        }
    },

    deletePopup: async (id) => {
        try {
            const data = await api.delete(API_ENDPOINTS.POPUP.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in popupApiService.deletePopup:', error);
            throw error;
        }
    }
};

export default popupApiService;
