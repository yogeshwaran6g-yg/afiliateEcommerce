import { useQuery } from "@tanstack/react-query";
import walletApiService from "../services/wallet.apiservice";

export const WALLET_TRANSACTIONS_QUERY_KEY = ["walletTransactions"];
export const WALLET_METRICS_QUERY_KEY = ["walletMetrics"];

export const useWalletTransactions = (filters = {}) => {
    return useQuery({
        queryKey: [...WALLET_TRANSACTIONS_QUERY_KEY, filters],
        queryFn: () => walletApiService.getWalletTransactions(filters),
    });
};

export const useTransactionMetrics = () => {
    return useQuery({
        queryKey: WALLET_METRICS_QUERY_KEY,
        queryFn: walletApiService.getTransactionMetrics,
    });
};
