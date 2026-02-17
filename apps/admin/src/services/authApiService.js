const API_BASE_URL = "http://localhost:4000/api/v1";

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
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, password })
            });

            // Handle non-JSON responses gracefully
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(`Server returned non-JSON response (${response.status})`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            return data.data; // Should contain user and token
        } catch (error) {
            console.error('Error in authApiService.login:', error);
            throw error;
        }
    }
};

export default authApiService;
