import { api, handleServiceError } from "../util/axios";
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
            handleServiceError(error, "Get Profile");
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
            handleServiceError(error, "Update Profile");
        }
    }

    /**
     * Updates the current user's personal details (Name, Phone, DOB, Profile Image).
     * @param {Object} personalData - { name, phone, profile: { dob, profile_image } }
     * @param {File} file - Optional profile image file
     * @returns {Promise<Object>} The updated response data.
     */
    async updatePersonal(personalData, file) {
        try {
            let data;
            if (file) {
                data = new FormData();
                data.append('file', file);
                data.append('name', personalData.name || '');
                data.append('phone', personalData.phone || '');
                data.append('email', personalData.email || '');
                if (personalData.profile) {
                    data.append('profile', JSON.stringify(personalData.profile));
                }
            } else {
                data = personalData;
            }

            const response = await api.put(profileEndpoints.personal, data);
            return response;
        } catch (error) {
            handleServiceError(error, "Update Personal Details");
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

            const response = await api.put(profileEndpoints.identity, formData);
            return response;
        } catch (error) {
            handleServiceError(error, "Update Identity");
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

            const response = await api.put(profileEndpoints.address, formData);
            return response;
        } catch (error) {
            handleServiceError(error, "Update Address");
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

            const response = await api.put(profileEndpoints.bank, formData);
            return response;
        } catch (error) {
            handleServiceError(error, "Update Bank");
        }
    }
}

export default new ProfileService();
