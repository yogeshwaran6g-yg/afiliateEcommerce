import { api } from "../util/axios";

const categoryApiService = {
    getAllCategories: async (params = {}) => {
        try {
            const data = await api.get("/categories", { params });
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.getAllCategories:', error);
            throw error;
        }
    },

    getCategoryById: async (id) => {
        try {
            const data = await api.get(`/categories/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.getCategoryById:', error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const data = await api.post("/categories", categoryData);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.createCategory:', error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const data = await api.put(`/categories/${id}`, categoryData);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.updateCategory:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const data = await api.delete(`/categories/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in categoryApiService.deleteCategory:', error);
            throw error;
        }
    }
};

export default categoryApiService;
