import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const authApiService = {
    login: async (phone, password) => {
        try {
            const data = await api.post(API_ENDPOINTS.AUTH.LOGIN, { phone, password });
            return data.data; // Expected to contain user and token
        } catch (error) {
            console.error('Error in authApiService.login:', error);
            throw error;
        }
    }
};

export default authApiService;
