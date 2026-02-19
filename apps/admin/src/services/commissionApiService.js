import { api } from "../util/axios";

const commissionApiService = {
    getConfigs: async () => {
        try {
            const response = await api.get("/commission-config");
            return response.data;
        } catch (error) {
            console.error('Error in commissionApiService.getConfigs:', error);
            throw error;
        }
    },

    upsertConfig: async (configData) => {
        try {
            const response = await api.post("/commission-config", configData);
            return response.data;
        } catch (error) {
            console.error('Error in commissionApiService.upsertConfig:', error);
            throw error;
        }
    }
};

export default commissionApiService;
