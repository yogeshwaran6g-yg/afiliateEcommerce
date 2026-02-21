import { api } from "../util/axios";

const authApiService = {
    login: async (phone, password) => {
        try {
            const data = await api.post("/auth/login", { phone, password });
            return data.data; // Expected to contain user and token
        } catch (error) {
            console.error('Error in authApiService.login:', error);
            throw error;
        }
    }
};

export default authApiService;
