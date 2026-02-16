import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import walletService from "../services/walletService";
import authService from "../services/authApiService";

export const WALLET_KEYS = {
  wallet: ["wallet"],
  transactions: ["wallet", "transactions"],
  withdrawals: ["wallet", "withdrawals"],
  recharges: ["wallet", "recharges"],
};

/**
 * Hook to fetch the current user's wallet info.
 */
export const useWallet = () => {
  const isAuthenticated = authService.isAuthenticated();
  return useQuery({
    queryKey: WALLET_KEYS.wallet,
    queryFn: async () => {
      const response = await walletService.getWallet();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch wallet transactions.
 */
export const useTransactions = (limit = 10, offset = 0) => {
  const isAuthenticated = authService.isAuthenticated();
  return useQuery({
    queryKey: [
      ...WALLET_KEYS.transactions,
      { limit, offset, searchTerm, status, type },
    ],
    queryFn: async () => {
      const response = await walletService.getTransactions(limit, offset);
      return response.data; // Now returns { transactions, pagination }
    },
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};

/**
 * Hook for creating a withdrawal request.
 */
export const useWithdrawMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalData) =>
      walletService.createWithdrawRequest(withdrawalData),
    onSuccess: () => {
      // Invalidate wallet and withdrawal history
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.wallet });
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.withdrawals });
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.transactions });
    },
  });
};

/**
 * Hook for creating a recharge request.
 */
export const useRechargeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rechargeData) =>
      walletService.createRechargeRequest(rechargeData),
    onSuccess: () => {
      // Invalidate recharge history
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.recharges });
    },
  });
};

/**
 * Hook to fetch withdrawal requests.
 */
export const useWithdrawalRequests = (status) => {
  const isAuthenticated = authService.isAuthenticated();
  return useQuery({
    queryKey: [...WALLET_KEYS.withdrawals, { status }],
    queryFn: async () => {
      const response = await walletService.getWithdrawalRequests(status);
      return response.data;
    },
    enabled: isAuthenticated,
  });
};

/**
 * Hook to fetch recharge requests.
 */
export const useRechargeRequests = (status) => {
  const isAuthenticated = authService.isAuthenticated();
  return useQuery({
    queryKey: [...WALLET_KEYS.recharges, { status }],
    queryFn: async () => {
      const response = await walletService.getRechargeRequests(status);
      return response.data;
    },
    enabled: isAuthenticated,
  });
};
