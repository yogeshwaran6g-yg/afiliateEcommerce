import { api } from "../util/axios";
import constants from "../config/constants";

const { products: productEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getProducts = async (params = {}) => {
    try {
        const response = await api.get(productEndpoints.base, { params });
        return response;
    } catch (error) {
        handleApiError(error, "Get Products");
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`${productEndpoints.base}/${id}`);
        return response;
    } catch (error) {
        handleApiError(error, "Get Product By ID");
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post(productEndpoints.base, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;
    } catch (error) {
        handleApiError(error, "Create Product");
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`${productEndpoints.base}/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;
    } catch (error) {
        handleApiError(error, "Update Product");
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`${productEndpoints.base}/${id}`);
        return response;
    } catch (error) {
        handleApiError(error, "Delete Product");
    }
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
