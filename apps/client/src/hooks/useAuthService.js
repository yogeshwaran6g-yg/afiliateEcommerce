import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authApiService";
import profileService from "../services/profileService";

/**
 * Key for caching user profile data.
 * Used by React Query to identify and manage user-related cache.
 */
export const USER_QUERY_KEY = ["user"];

/**
 * Hook to fetch the current user's profile.
 * Only fetches if the user is authenticated.
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useUser = () => {
    return useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: async () => {
            try {
                const response = await profileService.getProfile();
                // Backend returns { success, data: { user, ... } }
                return response.data?.user || response.data;
            } catch (error) {
                // Fallback to local storage if API fails or we are offline
                const localUser = authService.getCurrentUser();
                if (localUser) return localUser;
                throw error;
            }
        },
        enabled: authService.isAuthenticated(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for user login.
 * Handles phone/password or phone/OTP login flows.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ phone, password }) =>
            authService.login(phone, password),
        onSuccess: (data) => {
            if (data.success && data.data?.user) {
                // Update local cache immediately
                queryClient.setQueryData(USER_QUERY_KEY, data.data.user);
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
};

/**
 * Hook for user signup.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSignupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userDetails) => authService.signup(userDetails),
        onSuccess: (data) => {
            // If signup logs the user in immediately (returns token/user)
            if (data.success && data.data?.token) {
                queryClient.setQueryData(USER_QUERY_KEY, data.data.user);
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
};


/**
 * Hook for verifying OTP (usually for signup).
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useVerifyOtpMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, otp, purpose }) => authService.verifyOtp(userId, otp, purpose),
        onSuccess: (data) => {
            if (data.success && data.data?.user) {
                // Sync user data to cache if verification results in a login
                queryClient.setQueryData(USER_QUERY_KEY, data.data.user);
            }
        },
    });
};

/**
 * Hook for resending an OTP.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useResendOtpMutation = () => {
    return useMutation({
        mutationFn: ({ userId, phone, purpose }) => authService.resendOtp(userId, phone, purpose),
    });
};

/**
 * Hook for initiating forgot password flow.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (phone) => authService.forgotPassword(phone),
    });
};

/**
 * Hook for resetting password.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: ({ userId, otp, newPassword }) => authService.resetPassword(userId, otp, newPassword),
    });
};

/**
 * Hook for logging out.
 * Clears local storage and all query cache.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            authService.logout();
        },
        onSuccess: () => {
            // Clear all queries and reset state
            queryClient.clear();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        },
    });
};
