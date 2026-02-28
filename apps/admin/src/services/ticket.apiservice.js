import { api } from "../util/axios";
import { API_ENDPOINTS } from "../util/constants";

const ticketApiService = {
    getTickets: async (filters = {}) => {
        try {
            const data = await api.get(API_ENDPOINTS.TICKETS.BASE, { params: filters });
            return data.data;
        } catch (error) {
            console.error('Error in ticketApiService.getTickets:', error);
            throw error;
        }
    },

    updateTicketStatus: async (ticketId, status) => {
        try {
            const data = await api.post(API_ENDPOINTS.TICKETS.UPDATE_STATUS, { ticketId, status });
            return data.data;
        } catch (error) {
            console.error('Error in ticketApiService.updateTicketStatus:', error);
            throw error;
        }
    }
};

export default ticketApiService;
