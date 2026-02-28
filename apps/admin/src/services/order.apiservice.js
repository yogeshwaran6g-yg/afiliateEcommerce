import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const orderApiService = {
    getOrders: async (filters = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.ORDERS.BASE, { params: filters });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrders:', error);
            throw error;
        }
    },

    approvePayment: async (orderId, adminComment) => {
        try {
            const data = await api.post(API_ENDPOINTS.ORDERS.APPROVE_PAYMENT, { orderId, adminComment });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.approvePayment:', error);
            throw error;
        }
    },

    rejectPayment: async (orderId, reason) => {
        try {
            const data = await api.post(API_ENDPOINTS.ORDERS.REJECT_PAYMENT, { orderId, reason });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.rejectPayment:', error);
            throw error;
        }
    },

    getOrderDetails: async (orderId) => {
        try {
            const data = await api.get(API_ENDPOINTS.ORDERS.BY_ID(orderId));
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrderDetails:', error);
            throw error;
        }
    },

    addOrderTracking: async (orderId, title, description) => {
        try {
            const data = await api.post(API_ENDPOINTS.ORDERS.TRACKING(orderId), { title, description });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.addOrderTracking:', error);
            throw error;
        }
    },

    getOrderPayments: async (filters = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.ORDERS.PAYMENTS, { params: filters });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrderPayments:', error);
            throw error;
        }
    }
};

export default orderApiService;
