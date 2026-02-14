import { api } from "../util/axios";
import constants from "../config/constants";

const { profile: profileEndpoints, auth: authEndpoints } = constants.endpoints;

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
            const response = await api.get(authEndpoints.profile);
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
            const response = await api.put(authEndpoints.profile, { profile });

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
     * Updates the current user's personal details (Name, Phone, DOB, Profile Image).
    /**
     * Updates the current user's personal details (Name, Phone, DOB, Profile Image).
     * @param {Object} personalData - { name, phone, profile: { dob, profile_image } }
     * @returns {Promise<Object>} The updated response data.
     */
    async updatePersonal(personalData) {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("updatePersonal: Token from localStorage:", token ? "Present" : "Missing", token);

            const config = {};
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }

            const response = await api.put(profileEndpoints.personal, personalData, config);
            return response;
        } catch (error) {
            console.error("Update Personal Details Error:", error);
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
            if (file) formData.append('file', file);

            const response = await api.put(profileEndpoints.identity, formData, {
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
            formData.append('addressData', JSON.stringify(addressData));
            if (file) formData.append('file', file);

            const response = await api.put(profileEndpoints.address, formData, {
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
            formData.append('bankData', JSON.stringify(bankData));
            if (file) formData.append('file', file);

            const response = await api.put(profileEndpoints.bank, formData, {
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
