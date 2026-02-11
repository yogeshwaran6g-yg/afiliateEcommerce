

export const constants = {
    endpointBase: "http://localhost:8000",
    endpoints: {
        auth: {
            login: "/auth/login",
            signup: "/auth/signup",
            requestOtp: "/auth/request-otp",
            verifyOtp: "/auth/verify-otp",
            resendOtp: "/auth/resend-otp",
            logout: "/auth/logout",
            forgotPassword: "/auth/forgot-password",
            resetPassword: "/auth/reset-password",
        }
    }
}

export default constants