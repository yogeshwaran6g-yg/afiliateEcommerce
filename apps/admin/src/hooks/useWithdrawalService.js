import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import withdrawalApiService from "../services/withdrawal.apiservice";

export const WITHDRAWALS_QUERY_KEY = ["withdrawals"];

/**
 * Hook to fetch withdrawals, optionally filtered by status.
 */
export const useWithdrawals = (status = null) => {
    return useQuery({
        queryKey: [...WITHDRAWALS_QUERY_KEY, status || 'all'],
        queryFn: () => withdrawalApiService.getWithdrawals(status),
        staleTime: 1000 * 60, // 1 minute
    });
};

/**
 * Hook to approve a withdrawal request.
 */
export const useApproveWithdrawalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, adminComment }) => withdrawalApiService.approveWithdrawal(requestId, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WITHDRAWALS_QUERY_KEY });
        },
    });
};

/**
 * Hook to reject a withdrawal request.
 */
export const useRejectWithdrawalMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, adminComment }) => withdrawalApiService.rejectWithdrawal(requestId, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WITHDRAWALS_QUERY_KEY });
        },
    });
};
