import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../services/userNotificationApiservice";

export const USER_NOTIFICATION_QUERY_KEY = ["userNotifications"];
export const UNREAD_COUNT_QUERY_KEY = ["unreadCount"];

export const useUserNotification = (params = {}) => {
    return useQuery({
        queryKey: [USER_NOTIFICATION_QUERY_KEY, params],
        queryFn: async () => {
            const response = await getNotifications(params);
            // Handle both { data: [...] } and direct [...] responses
            if (Array.isArray(response)) return response;
            if (Array.isArray(response?.data)) return response.data;
            return [];
        },
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: UNREAD_COUNT_QUERY_KEY,
        queryFn: async () => {
            const response = await getUnreadCount();
            return response?.data?.count || 0;
        },
    });
};

export const useMarkAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_NOTIFICATION_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
        },
    });
};

export const useMarkAllAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_NOTIFICATION_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
        },
    });
};
