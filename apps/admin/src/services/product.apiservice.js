import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const productApiService = {
    getProducts: async (params = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.PRODUCTS.BASE, params);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProducts:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const data = await api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProductById:', error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            // axios handles FormData automatically
            const data = await api.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.createProduct:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const data = await api.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), productData);
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.updateProduct:', error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const data = await api.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.deleteProduct:', error);
            throw error;
        }
    }
};

export default productApiService;
