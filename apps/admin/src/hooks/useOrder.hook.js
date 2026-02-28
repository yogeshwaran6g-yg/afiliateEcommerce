import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderApiService from "../services/order.apiservice";

export const ORDERS_QUERY_KEY = ["orders"];
export const ORDER_DETAILS_QUERY_KEY = ["orderDetails"];
export const ORDER_PAYMENTS_QUERY_KEY = ["orderPayments"];

export const useOrders = (filters = {}) => {
    return useQuery({
        queryKey: [...ORDERS_QUERY_KEY, filters],
        queryFn: () => orderApiService.getOrders(filters),
    });
};

export const useOrderDetails = (orderId) => {
    return useQuery({
        queryKey: [ORDER_DETAILS_QUERY_KEY, orderId],
        queryFn: () => orderApiService.getOrderDetails(orderId),
        enabled: !!orderId,
    });
};

export const useApprovePaymentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, adminComment }) => orderApiService.approvePayment(orderId, adminComment),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAILS_QUERY_KEY, orderId] });
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
    });
};

export const useRejectPaymentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, reason }) => orderApiService.rejectPayment(orderId, reason),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAILS_QUERY_KEY, orderId] });
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
    });
};

export const useOrderPayments = (filters = {}) => {
    return useQuery({
        queryKey: [...ORDER_PAYMENTS_QUERY_KEY, filters],
        queryFn: () => orderApiService.getOrderPayments(filters),
    });
};

export const useAddOrderTrackingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, title, description }) => orderApiService.addOrderTracking(orderId, title, description),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: [ORDER_DETAILS_QUERY_KEY, orderId.toString()] });
        },
    });
};
