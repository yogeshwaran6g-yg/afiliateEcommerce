import { api } from "../util/axios";

const walletApiService = {
    getWalletTransactions: async (filters = {}) => {
        try {
            const data = await api.get("/admin/wallet-transactions", filters);
            return data;
        } catch (error) {
            console.error('Error in walletApiService.getWalletTransactions:', error);
            throw error;
        }
    },

    getTransactionMetrics: async () => {
        try {
            const data = await api.get("/admin/transaction-metrics");
            return data;
        } catch (error) {
            console.error('Error in walletApiService.getTransactionMetrics:', error);
            throw error;
        }
    }
};

export default walletApiService;
