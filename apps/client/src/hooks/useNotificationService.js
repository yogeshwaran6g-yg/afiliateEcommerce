import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notificationApiService";

export const NOTIFICATION_QUERY_KEY = ["notifications"];

export const useNotifications = (filters = {}) => {
    return useQuery({
        queryKey: [...NOTIFICATION_QUERY_KEY, filters],
        queryFn: async () => {
            const response = await getNotifications(filters);
            return response.data || response;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
