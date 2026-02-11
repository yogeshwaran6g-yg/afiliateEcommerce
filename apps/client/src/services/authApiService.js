import { api } from "../util/axios";
import constants from "../config/constants";

const { auth: authEndpoints } = constants.endpoints;


const handleApiError = (error, context) => {
    // Error normalization is already handled by axios interceptor
    console.error(`${context} Error:`, error.message || error);
    throw error;
};


export const login = async (phone, password = null, otp = null) => {
    try {
        const response = await api.post(authEndpoints.login, { phone, password, otp });
        
        // Backend returns: { success, message, data: { user, token } }
        if (response.success && response.data?.token) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return response;
    } catch (error) {
        handleApiError(error, "Login");
    }
};


export const requestLoginOtp = async (phone) => {
    try {
        const response = await api.post(authEndpoints.login, { phone });
        return response;
    } catch (error) {
        handleApiError(error, "Request Login OTP");
    }
};


export const signup = async (userDetails) => {
    try {
        const response = await api.post(authEndpoints.signup, userDetails);
        return response;
    } catch (error) {
        handleApiError(error, "Signup");
    }
};


export const verifyOtp = async (userId, otp, purpose = 'signup') => {
    try {
        const response = await api.post(authEndpoints.verifyOtp, { userId, otp, purpose });

        if (response.success && response.data?.token) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response;
    } catch (error) {
        handleApiError(error, "OTP Verification");
    }
};


export const resendOtp = async (userId, phone, purpose) => {
    try {
        const response = await api.post(authEndpoints.resendOtp, { userId, phone, purpose });
        return response;
    } catch (error) {
        handleApiError(error, "Resend OTP");
    }
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
};


export const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};


export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export default {
    login,
    signup,
    requestLoginOtp,
    verifyOtp,
    resendOtp,
    logout,
    isAuthenticated,
    getCurrentUser
};
