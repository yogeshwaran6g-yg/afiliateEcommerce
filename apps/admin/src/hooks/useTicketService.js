import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ticketApiService from "../services/ticket.apiservice";

export const TICKETS_QUERY_KEY = ["tickets"];

/**
 * Hook to fetch support tickets.
 */
export const useTickets = (filters = {}) => {
    return useQuery({
        queryKey: [...TICKETS_QUERY_KEY, filters],
        queryFn: () => ticketApiService.getTickets(filters),
    });
};

/**
 * Hook to update ticket status.
 */
export const useUpdateTicketStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, status }) => ticketApiService.updateTicketStatus(ticketId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
        },
    });
};
