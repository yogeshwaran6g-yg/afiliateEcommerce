import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { orders: orderEndpoints } = constants.endpoints;

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(orderEndpoints.base, orderData);
        return response;
    } catch (error) {
        handleServiceError(error, "Create Order");
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get(orderEndpoints.myOrders);
        return response;
    } catch (error) {
        handleServiceError(error, "Get My Orders");
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(orderEndpoints.detail(id));
        return response;
    } catch (error) {
        handleServiceError(error, "Get Order By ID");
    }
};

export const uploadProof = async (file) => {
    try {
        const formData = new FormData();
        formData.append('proof', file);
        const response = await api.post(orderEndpoints.uploadProof, formData);
        return response;
    } catch (error) {
        handleServiceError(error, "Upload Proof");
    }
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    uploadProof
};
