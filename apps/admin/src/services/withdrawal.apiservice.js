import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const withdrawalApiService = {
    getWithdrawals: async (status = null) => {
        try {
            const response = await api.get(API_ENDPOINTS.WITHDRAWAL.BASE, { 
                params: { status: status === 'All' ? null : status } 
            });
            return response.data;
        } catch (error) {
            console.error('Error in withdrawalApiService.getWithdrawals:', error);
            throw error;
        }
    },

    approveWithdrawal: async (requestId, adminComment) => {
        try {
            return await api.post(API_ENDPOINTS.WITHDRAWAL.APPROVE, { requestId, adminComment });
        } catch (error) {
            console.error('Error in withdrawalApiService.approveWithdrawal:', error);
            throw error;
        }
    },

    rejectWithdrawal: async (requestId, adminComment) => {
        try {
            return await api.post(API_ENDPOINTS.WITHDRAWAL.REJECT, { requestId, adminComment });
        } catch (error) {
            console.error('Error in withdrawalApiService.rejectWithdrawal:', error);
            throw error;
        }
    }
};

export default withdrawalApiService;
