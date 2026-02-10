import { api } from "../util/axios";

/**
 * AuthService provides methods to interact with the authentication-related
 * backend endpoints. It includes error handling and local storage management
 * for the access token and user information.
 */
class AuthService {
    /**
   * Authenticates a user using phone, password, and optional OTP.
   * @param {string} phone 
   * @param {string} password 
   * @param {string} [otp]
   * @returns {Promise<Object>} The response data.
   */
    async login(phone, password, otp = null) {
        try {
            const response = await api.post("/api/auth/login", { phone, password, otp });
            // Store token and user data in local storage
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    }

    /**
     * Requests an OTP for login.
     * @param {string} phone 
     * @returns {Promise<Object>} The response data.
     */
    async requestLoginOtp(phone) {
        try {
            const response = await api.post("/api/auth/login-otp", { phone });
            return response;
        } catch (error) {
            console.error("Login OTP Request Error:", error);
            throw error;
        }
    }

    /**
     * Registers a new user.
     * @param {Object} userDetails - Contains name, phone, email, password, referralId.
     * @returns {Promise<Object>} The response data.
     */
    async signup(userDetails) {
        try {
            const response = await api.post("/api/auth/signup", userDetails);
            return response;
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    }

    /**
     * Verifies the OTP for a user.
     * @param {string} userId 
     * @param {string} otp 
     * @returns {Promise<Object>} The response data.
     */
    async verifyOtp(userId, otp) {
        try {
            const response = await api.post("/api/auth/verify-otp", { userId, otp });

            // If OTP verification also returns tokens, store them
            if (response.success && response.data?.token) {
                localStorage.setItem("accessToken", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            return response;
        } catch (error) {
            console.error("OTP Verification Error:", error);
            throw error;
        }
    }

    /**
   * Resends the OTP for a user.
   * @param {string} userId 
   * @returns {Promise<Object>} The response data.
   */
    async resendOtp(userId) {
        try {
            const response = await api.post("/api/auth/resend-otp", { userId });
            return response;
        } catch (error) {
            console.error("Resend OTP Error:", error);
            throw error;
        }
    }

    /**
       * Fetches the current user's profile.
       * @returns {Promise<Object>} The profile data.
       */
    async getProfile() {
        try {
            const response = await api.get("/api/auth/profile");
            return response;
        } catch (error) {
            console.error("Get Profile Error:", error);
            throw error;
        }
    }

    /**
     * Updates the current user's profile and address information.
     * @param {Object} profile 
     * @param {Object} address 
     * @returns {Promise<Object>} The updated response data.
     */
    async updateProfile(profile, address) {
        try {
            const response = await api.put("/api/auth/profile", { profile, address });

            // Update local storage user if needed
            if (response.success && response.data) {
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                const updatedUser = { ...currentUser, ...response.data };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }

            return response;
        } catch (error) {
            console.error("Update Profile Error:", error);
            throw error;
        }
    }

    /**
     * Logs out the user by clearing local storage.
     */
    logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // Reload or redirect could be handled by the interceptor or caller
    }

    /**
     * Checks if the user is currently authenticated.
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    }

    /**
     * Retrieves the current user from local storage.
     * @returns {Object|null}
     */
    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
}

export default new AuthService();
