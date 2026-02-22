import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { products: productEndpoints } = constants.endpoints;

export const getProducts = async (params = {}) => {
    try {
        const response = await api.get(productEndpoints.base, params);
        return response;
    } catch (error) {
        handleServiceError(error, "Get Products");
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(productEndpoints.detail(id));
        return response;
    } catch (error) {
        handleServiceError(error, "Get Product By ID");
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post(productEndpoints.base, productData);
        return response;
    } catch (error) {
        handleServiceError(error, "Create Product");
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(productEndpoints.detail(id), productData);
        return response;
    } catch (error) {
        handleServiceError(error, "Update Product");
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(productEndpoints.detail(id));
        return response;
    } catch (error) {
        handleServiceError(error, "Delete Product");
    }
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
