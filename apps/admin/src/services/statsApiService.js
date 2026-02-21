import { api } from "../util/axios";

const statsApiService = {
    getDashboardStats: async () => {
        try {
            const data = await api.get("/admin/stats");
            return data.data;
        } catch (error) {
            console.error('Error in statsApiService.getDashboardStats:', error);
            throw error;
        }
    }
};

export default statsApiService;
