import { api } from "../util/axios";

const productApiService = {
    getProducts: async (params = {}) => {
        try {
            const data = await api.get("/admin/products", params);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProducts:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const data = await api.get(`/admin/products/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProductById:', error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            // axios handles FormData automatically
            const data = await api.post("/admin/products", productData);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.createProduct:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const data = await api.put(`/admin/products/${id}`, productData);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.updateProduct:', error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const data = await api.delete(`/admin/products/${id}`);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.deleteProduct:', error);
            throw error;
        }
    }
};

export default productApiService;
