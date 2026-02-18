import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import announcementApiService from "../services/announcementApiService";

export const ANNOUNCEMENTS_QUERY_KEY = ["announcements"];

/**
 * Hook to fetch all announcements.
 */
export const useAnnouncements = () => {
    return useQuery({
        queryKey: ANNOUNCEMENTS_QUERY_KEY,
        queryFn: announcementApiService.getAnnouncements,
    });
};

/**
 * Hook to fetch a single announcement by ID.
 */
export const useAnnouncementById = (id) => {
    return useQuery({
        queryKey: [...ANNOUNCEMENTS_QUERY_KEY, id],
        queryFn: () => announcementApiService.getAnnouncementById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new announcement.
 */
export const useCreateAnnouncementMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (announcementData) => announcementApiService.createAnnouncement(announcementData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
        },
    });
};

/**
 * Hook to update an existing announcement.
 */
export const useUpdateAnnouncementMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, announcementData }) => announcementApiService.updateAnnouncement(id, announcementData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [...ANNOUNCEMENTS_QUERY_KEY, id] });
            queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
        },
    });
};

/**
 * Hook to delete an announcement.
 */
export const useDeleteAnnouncementMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => announcementApiService.deleteAnnouncement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
        },
    });
};
