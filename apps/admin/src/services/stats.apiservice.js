import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const statsApiService = {
    getDashboardStats: async () => {
        try {
            const data = await api.get(API_ENDPOINTS.STATS.DASHBOARD);
            return data.data;
        } catch (error) {
            console.error('Error in statsApiService.getDashboardStats:', error);
            throw error;
        }
    }
};

export default statsApiService;
