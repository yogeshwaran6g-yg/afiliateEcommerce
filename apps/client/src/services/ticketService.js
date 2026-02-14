import { api as axiosInstance } from "../util/axios";
import constants from "../config/constants";

/**
 * Creates a new support ticket.
 * @param {FormData} formData - The ticket data including attachments.
 */
const createTicket = async (formData) => {
    return await axiosInstance.post(constants.endpoints.tickets.base, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/**
 * Fetches user's tickets.
 */
const getMyTickets = async () => {
    return await axiosInstance.get(constants.endpoints.tickets.myTickets);
};

const ticketService = {
    createTicket,
    getMyTickets,
};

export default ticketService;
