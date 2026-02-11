import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import profileService from "../services/profileService";

export const PROFILE_QUERY_KEY = ["user"];

/**
 * Hook to fetch the current user profile.
 */
export const useProfileQuery = (enabled = true) => {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: () => profileService.getProfile(),
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
        mutationFn: ({ profile }) =>
            profileService.updateProfile(profile),
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
