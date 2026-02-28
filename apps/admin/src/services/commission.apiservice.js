import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const commissionApiService = {
    getConfigs: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.COMMISSION.CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error in commissionApiService.getConfigs:', error);
            throw error;
        }
    },

    upsertConfig: async (configData) => {
        try {
            const response = await api.post(API_ENDPOINTS.COMMISSION.CONFIG, configData);
            return response.data;
        } catch (error) {
            console.error('Error in commissionApiService.upsertConfig:', error);
            throw error;
        }
    }
};

export default commissionApiService;
