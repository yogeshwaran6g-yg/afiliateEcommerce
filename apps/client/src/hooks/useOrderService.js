import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getMyOrders,
    getOrderById,
    createOrder
} from "../services/orderService";

export const ORDER_QUERY_KEY = ["orders"];

export const useGetMyOrders = () => {
    return useQuery({
        queryKey: ORDER_QUERY_KEY,
        queryFn: () => getMyOrders(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useGetOrderById = (id) => {
    return useQuery({
        queryKey: [...ORDER_QUERY_KEY, id],
        queryFn: () => getOrderById(id),
        enabled: !!id,
    });
};

export const useCreateOrderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderData) => createOrder(orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
        },
    });
};
