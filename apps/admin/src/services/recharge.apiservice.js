import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const rechargeApiService = {
    getRecharges: async (status = null) => {
        try {
            const data = await api.get(API_ENDPOINTS.RECHARGE.BASE, { status });
            return data.data;
        } catch (error) {
            console.error('Error in rechargeApiService.getRecharges:', error);
            throw error;
        }
    },

    approveRecharge: async (requestId, adminComment) => {
        try {
            return await api.post(API_ENDPOINTS.RECHARGE.APPROVE, { requestId, adminComment });
        } catch (error) {
            console.error('Error in rechargeApiService.approveRecharge:', error);
            throw error;
        }
    },

    rejectRecharge: async (requestId, adminComment) => {
        try {
            return await api.post(API_ENDPOINTS.RECHARGE.REJECT, { requestId, adminComment });
        } catch (error) {
            console.error('Error in rechargeApiService.rejectRecharge:', error);
            throw error;
        }
    }
};

export default rechargeApiService;
