import { useQuery } from "@tanstack/react-query";
import statsApiService from "../services/stats.apiservice";

export const DASHBOARD_STATS_QUERY_KEY = ["dashboardStats"];

/**
 * Hook to fetch dashboard statistics.
 */
export const useDashboardStats = () => {
    return useQuery({
        queryKey: DASHBOARD_STATS_QUERY_KEY,
        queryFn: statsApiService.getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
