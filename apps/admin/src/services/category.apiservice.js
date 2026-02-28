import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const categoryApiService = {
    getAllCategories: async (params = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.CATEGORIES.BASE, { params });
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.getAllCategories:', error);
            throw error;
        }
    },

    getCategoryById: async (id) => {
        try {
            const data = await api.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.getCategoryById:', error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const data = await api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.createCategory:', error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const data = await api.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.updateCategory:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const data = await api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.deleteCategory:', error);
            throw error;
        }
    }
};

export default categoryApiService;
