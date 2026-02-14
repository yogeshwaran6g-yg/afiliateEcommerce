export const constants = {
  endpointBase: import.meta.env.VITE_API_URL,
  endpoints: {
    auth: {
      login: "/api/v1/auth/login",
      signup: "/api/v1/auth/signup",
      requestOtp: "/api/v1/auth/request-otp",
      verifyOtp: "/api/v1/auth/verify-otp",
      resendOtp: "/api/v1/auth/resend-otp",
      logout: "/api/v1/auth/logout",
      forgotPassword: "/api/v1/auth/forgot-password",
      resetPassword: "/api/v1/auth/reset-password",
      profile: "/api/v1/auth/profile",
      completeRegistration: "/api/v1/auth/complete-registration",
    },
    categories: {
      base: "/api/v1/categories",
    },
    products: {
      base: "/api/v1/products",
    },
    profile: {
      base: "/api/v1/profile",
      me: "/api/v1/profile/me",
      personal: "/api/v1/profile/personal",
      identity: "/api/v1/profile/identity",
      address: "/api/v1/profile/address",
      bank: "/api/v1/profile/bank",
    },
    cart: {
      base: "/api/v1/cart",
      add: "/api/v1/cart/add",
      update: "/api/v1/cart/update",
      remove: "/api/v1/cart/remove",
    },
    notifications: {
      base: "/api/v1/notifications",
    },
    wallet: {
      base: "/api/v1/wallet",
      transactions: "/api/v1/wallet/transactions",
      withdraw: "/api/v1/wallet/withdraw",
      recharge: "/api/v1/wallet/recharge",
      withdrawals: "/api/v1/wallet/withdrawals",
      recharges: "/api/v1/wallet/recharges",
    },
    tickets: {
      base: "/api/v1/tickets",
      myTickets: "/api/v1/tickets/my-tickets",
    },
  },
};

export default constants;
