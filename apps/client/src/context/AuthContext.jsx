import React, { createContext, useCallback, useContext } from "react";
import {
    useLoginMutation,
    useSignupMutation,
    useRequestLoginOtpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useLogoutMutation,
} from "../hooks/useAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Use TanStack Query hooks
    const loginMutation = useLoginMutation();
    const signupMutation = useSignupMutation();
    const requestOtpMutation = useRequestLoginOtpMutation();
    const verifyOtpMutation = useVerifyOtpMutation();
    const resendOtpMutation = useResendOtpMutation();
    const logoutMutation = useLogoutMutation();

    // Derived state
    // We check authentication based on whether we have a token or not
    // The actual user data will be handled by ProfileContext
    const isAuthenticated = !!localStorage.getItem("token");

    const loading =
        loginMutation.isPending ||
        signupMutation.isPending ||
        requestOtpMutation.isPending ||
        verifyOtpMutation.isPending ||
        resendOtpMutation.isPending ||
        logoutMutation.isPending;

    const error =
        loginMutation.error ||
        signupMutation.error ||
        requestOtpMutation.error ||
        verifyOtpMutation.error ||
        resendOtpMutation.error ||
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
    }, [logoutMutation]);

    const value = {
        loading,
        error: error ? (error.message || "An error occurred") : null,
        isAuthenticated,
        login,
        requestLoginOtp,
        signup,
        verifyOtp,
        resendOtp,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
