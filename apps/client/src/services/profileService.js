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
     * Updates the current user's profile information.
     * @param {Object} profile 
     * @returns {Promise<Object>} The updated response data.
     */
    async updateProfile(profile) {
        try {
            const response = await api.put("/auth/profile", { profile });

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
     * Updates Identity documents/details
     */
    async updateIdentity(idType, idNumber, file) {
        try {
            const formData = new FormData();
            formData.append('idType', idType);
            formData.append('idNumber', idNumber);
            if (file) formData.append('identityProof', file);

            const response = await api.post("/auth/kyc/identity", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            console.error("Update Identity Error:", error);
            throw error;
        }
    }

    /**
     * Updates Address details and proof
     */
    async updateAddress(addressData, file) {
        try {
            const formData = new FormData();
            Object.keys(addressData).forEach(key => {
                formData.append(key, addressData[key]);
            });
            if (file) formData.append('addressProof', file);

            const response = await api.post("/auth/kyc/address", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            console.error("Update Address Error:", error);
            throw error;
        }
    }

    /**
     * Updates Bank details and proof
     */
    async updateBank(bankData, file) {
        try {
            const formData = new FormData();
            Object.keys(bankData).forEach(key => {
                formData.append(key, bankData[key]);
            });
            if (file) formData.append('bankProof', file);

            const response = await api.post("/auth/kyc/bank", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            console.error("Update Bank Error:", error);
            throw error;
        }
    }
}

export default new ProfileService();
