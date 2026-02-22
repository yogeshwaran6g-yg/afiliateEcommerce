import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { auth: authEndpoints } = constants.endpoints;

export const login = async (phone, password) => {
    try {
        const response = await api.post(authEndpoints.login, { phone, password });

        // Backend returns: { success, message, data: { user, token } }
        if (response.success && response.data?.token) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response;
    } catch (error) {
        handleServiceError(error, "Login");
    }
};

export const signup = async (userDetails) => {
    try {
        const response = await api.post(authEndpoints.signup, userDetails);
        return response;
    } catch (error) {
        handleServiceError(error, "Signup");
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
        handleServiceError(error, "OTP Verification");
    }
};

export const resendOtp = async (userId, phone, purpose) => {
    try {
        const response = await api.post(authEndpoints.resendOtp, { userId, phone, purpose });
        return response;
    } catch (error) {
        handleServiceError(error, "Resend OTP");
    }
};

export const forgotPassword = async (phone) => {
    try {
        const response = await api.post(authEndpoints.forgotPassword, { phone });
        return response;
    } catch (error) {
        handleServiceError(error, "Forgot Password");
    }
};

export const resetPassword = async (userId, otp, newPassword) => {
    try {
        const response = await api.post(authEndpoints.resetPassword, { userId, otp, newPassword });
        return response;
    } catch (error) {
        handleServiceError(error, "Reset Password");
    }
};

export const updatePassword = async (oldPassword, newPassword) => {
    try {
        const response = await api.put(authEndpoints.updatePassword, { oldPassword, newPassword });
        return response;
    } catch (error) {
        handleServiceError(error, "Update Password");
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

export const completeRegistration = async (registrationData) => {
    try {
        const formData = new FormData();
        Object.keys(registrationData).forEach(key => {
            if (registrationData[key] !== null && registrationData[key] !== undefined) {
                formData.append(key, registrationData[key]);
            }
        });

        const response = await api.post(authEndpoints.completeRegistration, formData);
        return response;
    } catch (error) {
        handleServiceError(error, "Complete Registration");
    }
};

export const cancelRegistration = async (userId = null) => {
    try {
        const endpoint = userId ? authEndpoints.cancelSignup : authEndpoints.cancelRegistration;
        const data = userId ? { userId } : {};
        const response = await api.post(endpoint, data);
        return response;
    } catch (error) {
        handleServiceError(error, "Cancel Registration");
    }
};

export default {
    login,
    signup,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    isAuthenticated,
    getCurrentUser,
    completeRegistration,
    cancelRegistration
};
