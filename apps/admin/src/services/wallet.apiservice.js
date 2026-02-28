import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const walletApiService = {
    getWalletTransactions: async (filters = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.WALLET.TRANSACTIONS, filters);
            return data;
        } catch (error) {
            console.error('Error in walletApiService.getWalletTransactions:', error);
            throw error;
        }
    },

    getTransactionMetrics: async () => {
        try {
            const data = await api.get(API_ENDPOINTS.WALLET.METRICS);
            return data;
        } catch (error) {
            console.error('Error in walletApiService.getTransactionMetrics:', error);
            throw error;
        }
    }
};

export default walletApiService;
