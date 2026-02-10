import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

/**
 * Key for caching user profile data
 */
export const USER_QUERY_KEY = ["user"];

/**
 * Hook for user login.
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ phone, password, otp }) =>
            authService.login(phone, password, otp),
        onSuccess: (data) => {
            // Invalidate user query or set data immediately if Profile query is using the same key
            // However, it's better to let ProfileContext handle the user data.
            // But for immediate feedback, we can set query data if keys match.
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
 * Hook for logging out.
 */
export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            authService.logout();
        },
        onSuccess: () => {
            queryClient.clear();
        },
    });
};
