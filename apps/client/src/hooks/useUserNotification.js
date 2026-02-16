import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../services/userNotificationApiservice";

// Refactor: Use strings for keys to avoid nested array footguns in React Query matching
export const USER_NOTIFICATION_QUERY_KEY = "userNotifications";
export const UNREAD_COUNT_QUERY_KEY = "unreadCount";

export const useUserNotification = (params = {}) => {
    return useQuery({
        // Standard flat query key: ["userNotifications", { ... }]
        queryKey: [USER_NOTIFICATION_QUERY_KEY, params],
        queryFn: async () => {
            const response = await getNotifications(params);
            if (response?.data?.items) return response.data.items;
            if (Array.isArray(response)) return response;
            if (Array.isArray(response?.data)) return response.data;
            return [];
        },
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: [UNREAD_COUNT_QUERY_KEY],
        queryFn: async () => {
            const response = await getUnreadCount();
            return response?.data?.unread_count || 0;
        },
    });
};

export const useMarkAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => markAsRead(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            await queryClient.cancelQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });

            const previousNotifications = queryClient.getQueriesData({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            const previousUnreadCount = queryClient.getQueryData([UNREAD_COUNT_QUERY_KEY]);

            queryClient.setQueriesData({ queryKey: [USER_NOTIFICATION_QUERY_KEY] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map(notif => notif.id == id ? { ...notif, is_read: true } : notif);
            });

            queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], (old) => {
                if (typeof old !== 'number') return old;
                return Math.max(0, old - 1);
            });

            return { previousNotifications, previousUnreadCount };
        },
        onError: (err, id, context) => {
            if (context?.previousNotifications) {
                context.previousNotifications.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            }
            if (context?.previousUnreadCount !== undefined) {
                queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], context.previousUnreadCount);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        },
    });
};

export const useMarkAllAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        },
    });
};

export const useDeleteNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        },
    });
};
