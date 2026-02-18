import { useQuery, keepPreviousData } from "@tanstack/react-query";
import referralService from "../services/referralService";

export const REFERRAL_QUERY_KEYS = {
    overview: ["referral-overview"],
    direct: ["direct-referrals"],
};

export const useReferralOverview = () => {
    return useQuery({
        queryKey: REFERRAL_QUERY_KEYS.overview,
        queryFn: async () => {
            const response = await referralService.getReferralOverview();
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useDirectReferrals = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: [...REFERRAL_QUERY_KEYS.direct, page, limit],
        queryFn: async () => {
            const response = await referralService.getDirectReferrals(page, limit);
            return response.data;
        },
        placeholderData: keepPreviousData, // Keep previous data while fetching new page
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
