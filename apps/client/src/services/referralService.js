import { api } from "../util/axios";
import constants from "../config/constants";

const { referral: referralEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getReferralOverview = async () => {
    try {
        const response = await api.get(referralEndpoints.overview);
        return response;
    } catch (error) {
        handleApiError(error, "Get Referral Overview");
    }
};

export const getDirectReferrals = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(referralEndpoints.direct, {
             page, limit 
        });
        return response;
    } catch (error) {
        handleApiError(error, "Get Direct Referrals");
    }
};

export const getTeamMembersByLevel = async (level, page = 1, limit = 10) => {
    try {
        const response = await api.get(referralEndpoints.teamMembers(level), {
             page, limit 
        });
        return response;
    } catch (error) {
        handleApiError(error, `Get Team Members Level ${level}`);
    }
};

export const getNetworkTree = async (depth = 6) => {
    try {
        const response = await api.get(referralEndpoints.tree, {
             depth 
        });
        return response;
    } catch (error) {
        handleApiError(error, "Get Network Tree");
    }
};

export default {
    getReferralOverview,
    getDirectReferrals,
    getTeamMembersByLevel,
    getNetworkTree,
};
