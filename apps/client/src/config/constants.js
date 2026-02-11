

export const constants = {
    endpointBase: "http://localhost:8000",
    endpoints:{
        auth: {
            login: "/api/v1/auth/login",
            signup: "/api/v1/auth/signup",
            requestOtp: "/api/v1/auth/request-otp",
            verifyOtp: "/api/v1/auth/verify-otp",
            resendOtp: "/api/v1/auth/resend-otp",
            logout: "/api/v1/auth/logout",
        }
    }
}

export default constants