import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

/**
 * Creates a new support ticket.
 * @param {FormData} formData - The ticket data including attachments.
 */
export const createTicket = async (formData) => {
    try {
        const response = await api.post(constants.endpoints.tickets.base, formData);
        return response;
    } catch (error) {
        handleServiceError(error, "Create Ticket");
    }
};

/**
 * Fetches user's tickets.
 */
export const getMyTickets = async () => {
    try {
        const response = await api.get(constants.endpoints.tickets.myTickets);
        return response;
    } catch (error) {
        handleServiceError(error, "Get My Tickets");
    }
};

const ticketService = {
    createTicket,
    getMyTickets,
};

export default ticketService;
