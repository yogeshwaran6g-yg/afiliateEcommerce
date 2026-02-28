import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import rechargeApiService from "../services/recharge.apiservice";

export const RECHARGES_QUERY_KEY = ["recharges"];

/**
 * Hook to fetch recharges, optionally filtered by status.
 */
export const useRecharges = (status = null) => {
    return useQuery({
        queryKey: [...RECHARGES_QUERY_KEY, status || 'all'],
        queryFn: () => rechargeApiService.getRecharges(status),
        staleTime: 1000 * 60, // 1 minute
    });
};

/**
 * Hook to approve a recharge request.
 */
export const useApproveRechargeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, adminComment }) => rechargeApiService.approveRecharge(requestId, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RECHARGES_QUERY_KEY });
        },
    });
};

/**
 * Hook to reject a recharge request.
 */
export const useRejectRechargeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, adminComment }) => rechargeApiService.rejectRecharge(requestId, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RECHARGES_QUERY_KEY });
        },
    });
};
