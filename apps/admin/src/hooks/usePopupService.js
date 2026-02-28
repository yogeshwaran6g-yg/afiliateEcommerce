import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import popupApiService from "../services/popup.apiservice";

export const POPUPS_QUERY_KEY = ["popups"];

/**
 * Hook to fetch all popup banners.
 */
export const usePopups = () => {
    return useQuery({
        queryKey: POPUPS_QUERY_KEY,
        queryFn: popupApiService.getPopups,
    });
};

/**
 * Hook to fetch a single popup banner by ID.
 */
export const usePopupById = (id) => {
    return useQuery({
        queryKey: [...POPUPS_QUERY_KEY, id],
        queryFn: () => popupApiService.getPopupById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new popup banner.
 */
export const useCreatePopupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (popupData) => popupApiService.createPopup(popupData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POPUPS_QUERY_KEY });
        },
    });
};

/**
 * Hook to update an existing popup banner.
 */
export const useUpdatePopupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, popupData }) => popupApiService.updatePopup(id, popupData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [...POPUPS_QUERY_KEY, id] });
            queryClient.invalidateQueries({ queryKey: POPUPS_QUERY_KEY });
        },
    });
};

/**
 * Hook to delete a popup banner.
 */
export const useDeletePopupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => popupApiService.deletePopup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POPUPS_QUERY_KEY });
        },
    });
};
