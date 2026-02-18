import { api } from "../util/axios";
import constants from "../config/constants";

// Define endpoints if they aren't in constants yet (or assume they will be added)
// For now I'll use the base URL structure directly if constants doesn't have it, 
// but best practice is to use constants. 
// I'll assume constants.endpoints.orders might need to be added or I'll just use string literal for now to be safe.
const { orders: orderEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(orderEndpoints.base, orderData);
        return response;
    } catch (error) {
        handleApiError(error, "Create Order");
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get(orderEndpoints.myOrders);
        return response;
    } catch (error) {
        handleApiError(error, "Get My Orders");
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`${orderEndpoints.base}/${id}`);
        return response;
    } catch (error) {
        handleApiError(error, "Get Order By ID");
    }
};

export const uploadProof = async (file) => {
    try {
        const formData = new FormData();
        formData.append('proof', file);
        const response = await api.post(`${orderEndpoints.base}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        handleApiError(error, "Upload Proof");
    }
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    uploadProof
};
