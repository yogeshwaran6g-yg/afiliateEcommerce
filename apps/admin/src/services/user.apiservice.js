import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const userApiService = {
    getUsers: async () => {
        try {
            const data = await api.get(API_ENDPOINTS.USERS.BASE);
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUsers:', error);
            throw error;
        }
    },

    getUserDetails: async (userId) => {
        try {
            const data = await api.get(API_ENDPOINTS.USERS.BY_ID(userId));
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUserDetails:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const data = await api.put(API_ENDPOINTS.USERS.BY_ID(userId), userData);
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateUser:', error);
            throw error;
        }
    },

    getKYCRecords: async (status) => {
        try {
            const data = await api.get(API_ENDPOINTS.USERS.KYC, { status });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getKYCRecords:', error);
            throw error;
        }
    },

    updateKYCStatus: async (userId, type, status) => {
        try {
            const data = await api.put(API_ENDPOINTS.USERS.KYC_BY_ID(userId), { type, status });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateKYCStatus:', error);
            throw error;
        }
    },

    getUserReferralOverview: async (userId) => {
        try {
            const data = await api.get(API_ENDPOINTS.USERS.REFERRAL_OVERVIEW(userId));
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUserReferralOverview:', error);
            throw error;
        }
    },

    getTeamMembers: async (userId, level, page = 1, limit = 10) => {
        try {
            const data = await api.get(API_ENDPOINTS.USERS.TEAM_MEMBERS(userId, level), { page, limit });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getTeamMembers:', error);
            throw error;
        }
    }
};

export default userApiService;
