import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import profileService from "../services/profileService";

export const PROFILE_QUERY_KEY = ["profile"];

/**
 * Hook to fetch the current user profile.
 */
export const useProfileQuery = (enabled = true) => {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: async () => {
            const response = await profileService.getProfile();
            return response.data;
        },
        enabled: enabled,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for updating user profile.
 */
export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, file }) =>
            profileService.updatePersonal(data, file),
        onSuccess: (data) => {
            if (data.success && data.data) {
                queryClient.setQueryData(PROFILE_QUERY_KEY, (oldData) => {
                    if (!oldData) return { data: data.data };
                    return {
                        ...oldData,
                        data: { ...oldData.data, ...data.data }
                    };
                });
            }
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

/**
 * Hook for updating Identity verification.
 */
export const useUpdateIdentityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ idType, idNumber, file }) =>
            profileService.updateIdentity(idType, idNumber, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
};

/**
 * Hook for updating Address verification.
 */
export const useUpdateAddressMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ addressData, file }) =>
            profileService.updateAddress(addressData, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
};

/**
 * Hook for updating Bank verification.
 */
export const useUpdateBankMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bankData, file }) =>
            profileService.updateBank(bankData, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
};
