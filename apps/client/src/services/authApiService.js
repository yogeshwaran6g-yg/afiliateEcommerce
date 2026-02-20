import { api } from "../util/axios";
import constants from "../config/constants";

const { auth: authEndpoints } = constants.endpoints;


const handleApiError = (error, context) => {
    // Error normalization is already handled by axios interceptor
    console.error(`${context} Error:`, error.message || error);
    throw error;
};


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
        handleApiError(error, "Login");
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


export const forgotPassword = async (phone) => {
    try {
        const response = await api.post(authEndpoints.forgotPassword, { phone });
        return response;
    } catch (error) {
        handleApiError(error, "Forgot Password");
    }
};


export const resetPassword = async (userId, otp, newPassword) => {
    try {
        const response = await api.post(authEndpoints.resetPassword, { userId, otp, newPassword });
        return response;
    } catch (error) {
        handleApiError(error, "Reset Password");
    }
};

export const updatePassword = async (oldPassword, newPassword) => {
    try {
        const response = await api.put(authEndpoints.updatePassword, { oldPassword, newPassword });
        return response;
    } catch (error) {
        handleApiError(error, "Update Password");
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

        // Debug log to verify FormData contents before sending
        // console.log("Sending registration FormData:");
        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
        // }

        const response = await api.post(authEndpoints.completeRegistration || '/auth/complete-registration', formData);
        return response;
    } catch (error) {
        handleApiError(error, "Complete Registration");
    }
};

export const cancelRegistration = async () => {
    try {
        const response = await api.post(authEndpoints.cancelRegistration || '/api/v1/auth/cancel-registration');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to cancel registration' };
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
