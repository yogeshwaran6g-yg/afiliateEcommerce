import { api } from "../util/axios";

const rechargeApiService = {
    getRecharges: async (status = null) => {
        try {
            const data = await api.get("/admin/recharges", { status });
            return data.data;
        } catch (error) {
            console.error('Error in rechargeApiService.getRecharges:', error);
            throw error;
        }
    },

    approveRecharge: async (requestId, adminComment) => {
        try {
            return await api.post("/admin/approve-recharge", { requestId, adminComment });
        } catch (error) {
            console.error('Error in rechargeApiService.approveRecharge:', error);
            throw error;
        }
    },

    rejectRecharge: async (requestId, adminComment) => {
        try {
            return await api.post("/admin/reject-recharge", { requestId, adminComment });
        } catch (error) {
            console.error('Error in rechargeApiService.rejectRecharge:', error);
            throw error;
        }
    }
};

export default rechargeApiService;
