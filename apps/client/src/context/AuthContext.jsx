import React, { createContext, useCallback } from "react";
import authService from "../services/authService";
import {
    useUserQuery,
    useLoginMutation,
    useSignupMutation,
    useRequestLoginOtpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useUpdateProfileMutation,
    useLogoutMutation,
} from "../hooks/useAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Use TanStack Query hooks
    const { data: userProfile, isLoading: isLoadingUser, error: userError } =
        useUserQuery();

    const loginMutation = useLoginMutation();
    const signupMutation = useSignupMutation();
    const requestOtpMutation = useRequestLoginOtpMutation();
    const verifyOtpMutation = useVerifyOtpMutation();
    const resendOtpMutation = useResendOtpMutation();
    const updateProfileMutation = useUpdateProfileMutation();
    const logoutMutation = useLogoutMutation();

    // Derived state
    // userProfile might be the response object or the user object depending on API return
    // Adjust based on your API response structure. 
    // Assuming authService.getProfile() returns { success: true, data: { user: ... } } or similar
    // If api returns directly the data, adjust accordingly.
    // Based on authService.js: getProfile returns response. 
    const user = userProfile?.data?.user || userProfile?.data || null;

    const loading =
        isLoadingUser ||
        loginMutation.isPending ||
        signupMutation.isPending ||
        requestOtpMutation.isPending ||
        verifyOtpMutation.isPending ||
        resendOtpMutation.isPending ||
        updateProfileMutation.isPending ||
        logoutMutation.isPending;

    const error =
        userError ||
        loginMutation.error ||
        signupMutation.error ||
        requestOtpMutation.error ||
        verifyOtpMutation.error ||
        resendOtpMutation.error ||
        updateProfileMutation.error ||
        logoutMutation.error;

    const login = async (phone, password, otp) => {
        return loginMutation.mutateAsync({ phone, password, otp });
    };

    const requestLoginOtp = async (phone) => {
        return requestOtpMutation.mutateAsync(phone);
    };

    const signup = async (userDetails) => {
        return signupMutation.mutateAsync(userDetails);
    };

    const verifyOtp = async (userId, otp) => {
        return verifyOtpMutation.mutateAsync({ userId, otp });
    };

    const resendOtp = async (userId) => {
        return resendOtpMutation.mutateAsync(userId);
    };

    const logout = useCallback(() => {
        logoutMutation.mutate();
        // No need to manually clear local storage here, the mutation onSuccess handles it
    }, [logoutMutation]);

    const updateProfile = async (profile, address) => {
        return updateProfileMutation.mutateAsync({ profile, address });
    };

    const value = {
        user,
        loading,
        error: error ? (error.message || "An error occurred") : null,
        isAuthenticated: !!user,
        login,
        requestLoginOtp,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
