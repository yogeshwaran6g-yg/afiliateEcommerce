import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getMyNotifications, markAsRead, markAllAsRead, sendNotification, broadcastNotification, deleteNotification, markUserNotificationAsRead, markAllUserNotificationsAsRead } from "../services/userNotification.apiservice";
import { toast } from "react-toastify";

export const USER_NOTIFICATION_QUERY_KEY = "adminUserNotifications";

export const useUserNotification = (params = {}) => {
    return useQuery({
        queryKey: [USER_NOTIFICATION_QUERY_KEY, params],
        queryFn: async () => {
            const response = await getNotifications(params);
            console.log("[DEBUG] getNotifications response:", response);
            // Return full response if it has pagination info
            if (response?.items && response?.pagination) return response;
            if (response?.data?.items && response?.data?.pagination) return response.data;

            // Fallback for simple arrays
            if (response?.items) return { items: response.items };
            if (response?.data?.items) return { items: response.data.items };
            if (Array.isArray(response)) return { items: response };
            return { items: [] };
        },
    });
};

export const useSendNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationData) => sendNotification(notificationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            toast.success("Notification dispatched successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to send notification");
        }
    });
};

export const useBroadcastNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationData) => broadcastNotification(notificationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            toast.success("Broadcast successful");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to broadcast notification");
        }
    });
};

export const useDeleteNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            toast.info("Notification record deleted");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete notification");
        }
    });
};

export const MY_NOTIFICATION_QUERY_KEY = "myNotifications";

export const useMyNotifications = (params = {}) => {
    return useQuery({
        queryKey: [MY_NOTIFICATION_QUERY_KEY, params],
        queryFn: async () => {
            const response = await getMyNotifications(params);
            if (response?.items) return response.items;
            if (response?.data?.items) return response.data.items;
            if (Array.isArray(response)) return response;
            return [];
        },
    });
};

export const useMarkMyAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MY_NOTIFICATION_QUERY_KEY] });
        },
    });
};

export const useMarkAllMyAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MY_NOTIFICATION_QUERY_KEY] });
            toast.success("All personal notifications marked as read");
        },
    });
};

export const useMarkUserNotificationAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => markUserNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
        },
    });
};

export const useMarkAllUserNotificationsAsReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllUserNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATION_QUERY_KEY] });
            toast.success("All system notifications marked as read");
        },
    });
};
