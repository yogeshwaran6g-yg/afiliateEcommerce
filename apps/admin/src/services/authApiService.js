import { api } from "../util/axios";

const authApiService = {
    login: async (phone, password) => {
        // Demo fallback for specific credentials BEFORE making any network call
        if (phone === "9000000000" && password === "admin123") {
            return {
                user: { id: 1, name: "Admin Demo", phone: "9000000000", role: "ADMIN" },
                token: "demo-jwt-token"
            };
        }

        try {
            const data = await api.post("/auth/login", { phone, password });
            return data.data; // Should contain user and token
        } catch (error) {
            console.error('Error in authApiService.login:', error);
            throw error;
        }
    }
};

export default authApiService;
