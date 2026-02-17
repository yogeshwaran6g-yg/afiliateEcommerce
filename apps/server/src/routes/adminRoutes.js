import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authenticatorMiddleware.js';

const router = express.Router();

// Admin prefix routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/approve-payment', adminController.approvePayment);
router.post('/reject-payment', adminController.rejectPayment);

// Withdrawal approvals
router.post('/approve-withdrawal', adminController.approveWithdrawal);
router.post('/reject-withdrawal', adminController.rejectWithdrawal);

// Recharge approvals
router.post('/approve-recharge', adminController.approveRecharge);
router.post('/reject-recharge', adminController.rejectRecharge);

// Wallet transactions
router.get('/wallet-transactions', adminController.getWalletTransactions);

// Support Tickets
router.get('/tickets', adminController.getTickets);
router.post('/tickets/update-status', adminController.updateTicketStatus);

export default router;
