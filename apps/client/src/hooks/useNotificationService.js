import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notificationApiService";

export const NOTIFICATION_QUERY_KEY = ["notifications"];

export const useNotifications = (filters = {}) => {
    return useQuery({
        queryKey: [...NOTIFICATION_QUERY_KEY, filters],
        queryFn: async () => {
            const response = await getNotifications(filters);
            // Handle various response shapes consistently
            if (!response) return [];
            if (response.success && Array.isArray(response.data)) return response.data;
            if (Array.isArray(response.data?.items)) return response.data.items;
            if (Array.isArray(response)) return response;
            return [];
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
