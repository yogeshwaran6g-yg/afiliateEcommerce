import { api } from "../util/axios";

const userApiService = {
    getUsers: async () => {
        try {
            const data = await api.get("/admin/users");
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUsers:', error);
            throw error;
        }
    },

    getUserDetails: async (userId) => {
        try {
            const data = await api.get(`/admin/users/${userId}`);
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUserDetails:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const data = await api.put(`/admin/users/${userId}`, userData);
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateUser:', error);
            throw error;
        }
    },

    getKYCRecords: async (status) => {
        try {
            const data = await api.get("/admin/kyc", { status });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getKYCRecords:', error);
            throw error;
        }
    },

    updateKYCStatus: async (userId, type, status) => {
        try {
            const data = await api.put(`/admin/kyc/${userId}`, { type, status });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateKYCStatus:', error);
            throw error;
        }
    },

    getUserReferralOverview: async (userId) => {
        try {
            const data = await api.get(`/admin/users/${userId}/referral-overview`);
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUserReferralOverview:', error);
            throw error;
        }
    },

    getTeamMembers: async (userId, level, page = 1, limit = 10) => {
        try {
            const data = await api.get(`/admin/users/${userId}/team/${level}`, { page, limit });
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getTeamMembers:', error);
            throw error;
        }
    }
};

export default userApiService;
