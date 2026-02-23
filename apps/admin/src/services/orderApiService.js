import { api } from "../util/axios";

const orderApiService = {
    getOrders: async (filters = {}) => {
        try {
            const data = await api.get("/admin/orders", { params: filters });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrders:', error);
            throw error;
        }
    },

    approvePayment: async (orderId, adminComment) => {
        try {
            const data = await api.post("/admin/approve-payment", { orderId, adminComment });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.approvePayment:', error);
            throw error;
        }
    },

    rejectPayment: async (orderId, reason) => {
        try {
            const data = await api.post("/admin/reject-payment", { orderId, reason });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.rejectPayment:', error);
            throw error;
        }
    },

    getOrderDetails: async (orderId) => {
        try {
            const data = await api.get(`/admin/orders/${orderId}`);
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrderDetails:', error);
            throw error;
        }
    },

    addOrderTracking: async (orderId, title, description) => {
        try {
            const data = await api.post(`/admin/orders/${orderId}/tracking`, { title, description });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.addOrderTracking:', error);
            throw error;
        }
    },

    getOrderPayments: async (filters = {}) => {
        try {
            const data = await api.get("/admin/order-payments", { params: filters });
            return data.data;
        } catch (error) {
            console.error('Error in orderApiService.getOrderPayments:', error);
            throw error;
        }
    }
};

export default orderApiService;
