import { api } from "../util/axios";

/**
 * ProfileService provides methods to interact with the user profile-related
 * backend endpoints.
 */
class ProfileService {
    /**
     * Fetches the current user's profile.
     * @returns {Promise<Object>} The profile data.
     */
    async getProfile() {
        try {
            const response = await api.get("/auth/profile");
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
            const response = await api.put("/auth/profile", { profile, address });

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
}

export default new ProfileService();
