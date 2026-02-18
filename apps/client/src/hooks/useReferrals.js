import { useQuery } from "@tanstack/react-query";
import referralService from "../services/referralService";

export const REFERRAL_KEYS = {
    overview: ["referral", "overview"],
    direct: ["referral", "direct"],
    teamMembers: (level, page, limit) => ["referral", "team", level, page, limit],
    tree: (depth) => ["referral", "tree", depth],
};

export const useReferralOverview = () => {
    return useQuery({
        queryKey: REFERRAL_KEYS.overview,
        queryFn: async () => {
            const response = await referralService.getReferralOverview();
            return response?.data || response;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useTeamMembers = (level, page = 1, limit = 10) => {
    return useQuery({
        queryKey: REFERRAL_KEYS.teamMembers(level, page, limit),
        queryFn: async () => {
            const response = await referralService.getTeamMembersByLevel(level, page, limit);
            return response?.data || response;
        },
        enabled: !!level,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useNetworkTree = (depth = 6) => {
    return useQuery({
        queryKey: REFERRAL_KEYS.tree(depth),
        queryFn: async () => {
            const response = await referralService.getNetworkTree(depth);
            return response?.data || response;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
