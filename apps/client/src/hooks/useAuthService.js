import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

/**
 * Key for caching user profile data
 */
export const USER_QUERY_KEY = ["user"];

/**
 * Hook to fetch the current user profile.
 * It relies on the token stored in localStorage (handled by authService/axios).
 */
export const useUserQuery = () => {
    return useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: () => authService.getProfile(),
        // Only fetch if we have a token (simple check, or rely on API failure)
        enabled: authService.isAuthenticated(),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for user login.
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ phone, password, otp }) =>
            authService.login(phone, password, otp),
        onSuccess: (data) => {
            // Invalidate user query to refetch profile or set data immediately
            queryClient.setQueryData(USER_QUERY_KEY, { data: data.data?.user });
            // queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
};

/**
 * Hook for user signup.
 */
export const useSignupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userDetails) => authService.signup(userDetails),
        onSuccess: (data) => {
            // If signup logs the user in immediately
            if (data.data?.token) {
                queryClient.setQueryData(USER_QUERY_KEY, { data: data.data?.user });
            }
        },
    });
};


/**
 * Hook for requesting login OTP.
 */
export const useRequestLoginOtpMutation = () => {
    return useMutation({
        mutationFn: (phone) => authService.requestLoginOtp(phone),
    });
};

/**
 * Hook for verifying OTP.
 */
export const useVerifyOtpMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, otp }) => authService.verifyOtp(userId, otp),
        onSuccess: (data) => {
            if (data.success && data.data?.user) {
                queryClient.setQueryData(USER_QUERY_KEY, { data: data.data.user });
            }
        },
    });
};

/**
 * Hook for resending OTP.
 */
export const useResendOtpMutation = () => {
    return useMutation({
        mutationFn: (userId) => authService.resendOtp(userId),
    });
};


/**
 * Hook for updating user profile.
 */
export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profile, address }) =>
            authService.updateProfile(profile, address),
        onSuccess: (data) => {
            // Optimistically update or invalidate
            if (data.success && data.data) {
                queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
                    if (!oldData) return { data: data.data };
                    return {
                        ...oldData,
                        data: { ...oldData.data, ...data.data }
                    }
                });
            }
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
};

/**
 * Hook for logging out.
 */
export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            authService.logout();
        },
        onSuccess: () => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.clear();
        },
    });
};
