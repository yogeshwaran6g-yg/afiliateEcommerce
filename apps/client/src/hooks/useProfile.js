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
        mutationFn: ({ profile, address }) =>
            profileService.updateProfile(profile, address),
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
