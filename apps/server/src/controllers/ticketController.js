import * as ticketService from '../services/ticketService.js';
import { rtnRes, log } from '../utils/helper.js';

const createTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, subject, description } = req.body;

        let image = null;
        if (req.file) {
            image = `/uploads/tickets/${req.file.filename}`;
        } else if (req.files && req.files.length > 0) {
            // If multiple files were uploaded, take the first one for the 'image' column
            image = `/uploads/tickets/${req.files[0].filename}`;
        }

        const ticketId = await ticketService.createTicket(userId, {
            category,
            subject,
            description,
            image
        });

        return rtnRes(res, 201, "Ticket created successfully", { ticketId });
    } catch (error) {
        log(`Error in createTicket: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await ticketService.getTicketsByUserId(userId);
        return rtnRes(res, 200, "Tickets fetched successfully", tickets);
    } catch (error) {
        log(`Error in getMyTickets: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export default {
    createTicket,
    getMyTickets
};
