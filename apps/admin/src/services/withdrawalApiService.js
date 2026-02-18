import { api } from "../util/axios";

const withdrawalApiService = {
    getWithdrawals: async (status = null) => {
        try {
            const data = await api.get("/admin/withdrawals", { status });
            return data.data;
        } catch (error) {
            console.error('Error in withdrawalApiService.getWithdrawals:', error);
            throw error;
        }
    },

    approveWithdrawal: async (requestId, adminComment) => {
        try {
            return await api.post("/admin/approve-withdrawal", { requestId, adminComment });
        } catch (error) {
            console.error('Error in withdrawalApiService.approveWithdrawal:', error);
            throw error;
        }
    },

    rejectWithdrawal: async (requestId, adminComment) => {
        try {
            return await api.post("/admin/reject-withdrawal", { requestId, adminComment });
        } catch (error) {
            console.error('Error in withdrawalApiService.rejectWithdrawal:', error);
            throw error;
        }
    }
};

export default withdrawalApiService;
