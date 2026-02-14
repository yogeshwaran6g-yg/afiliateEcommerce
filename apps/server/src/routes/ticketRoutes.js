import express from 'express';
import ticketController from '../controllers/ticketController.js';
import { protect } from '../middlewares/authenticatorMiddleware.js';
import ticketUpload from '../middlewares/ticketUploadMiddleware.js';

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

router.post('/', ticketUpload.array('attachments', 5), ticketController.createTicket);
router.get('/my-tickets', ticketController.getMyTickets);

export default router;
