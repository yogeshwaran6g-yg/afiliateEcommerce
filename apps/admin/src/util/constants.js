export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
    },
    ANNOUNCEMENTS: {
        BASE: "/admin/notifications",
        BY_ID: (id) => `/admin/notifications/${id}`,
    },
    CATEGORIES: {
        BASE: "/categories",
        BY_ID: (id) => `/categories/${id}`,
    },
    COMMISSION: {
        CONFIG: "/commission-config",
    },
    ORDERS: {
        BASE: "/admin/orders",
        BY_ID: (id) => `/admin/orders/${id}`,
        APPROVE_PAYMENT: "/admin/approve-payment",
        REJECT_PAYMENT: "/admin/reject-payment",
        TRACKING: (id) => `/admin/orders/${id}/tracking`,
        PAYMENTS: "/admin/order-payments",
    },
    POPUP: {
        BASE: "/admin/popup-banners",
        BY_ID: (id) => `/admin/popup-banners/${id}`,
    },
    PRODUCTS: {
        BASE: "/admin/products",
        BY_ID: (id) => `/admin/products/${id}`,
    },
    RECHARGE: {
        BASE: "/admin/recharges",
        APPROVE: "/admin/approve-recharge",
        REJECT: "/admin/reject-recharge",
    },
    STATS: {
        DASHBOARD: "/admin/stats",
    },
    USERS: {
        BASE: "/admin/users",
        BY_ID: (id) => `/admin/users/${id}`,
        KYC: "/admin/kyc",
        KYC_BY_ID: (id) => `/admin/kyc/${id}`,
        REFERRAL_OVERVIEW: (id) => `/admin/users/${id}/referral-overview`,
        TEAM_MEMBERS: (id, level) => `/admin/users/${id}/team/${level}`,
    },
    USER_NOTIFICATIONS: {
        ADMIN: "/admin/user-notifications",
        BROADCAST: "/admin/user-notifications/broadcast",
        MARK_AS_READ: (id) => `/admin/user-notifications/mark-as-read/${id}`,
        MARK_ALL_AS_READ: "/admin/user-notifications/mark-all-as-read",
        MY: "/user-notifications",
        MY_MARK_AS_READ: (id) => `/user-notifications/mark-as-read/${id}`,
        MY_MARK_ALL_AS_READ: "/user-notifications/mark-all-as-read",
    },
    WALLET: {
        TRANSACTIONS: "/admin/wallet-transactions",
        METRICS: "/admin/transaction-metrics",
    },
    WITHDRAWAL: {
        BASE: "/admin/withdrawals",
        APPROVE: "/admin/approve-withdrawal",
        REJECT: "/admin/reject-withdrawal",
    },
    TICKETS: {
        BASE: "/admin/tickets",
        UPDATE_STATUS: "/admin/tickets/update-status",
    },
};
