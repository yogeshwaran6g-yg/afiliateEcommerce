import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authenticatorMiddleware.js';

const router = express.Router();

// Admin prefix routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/approve-payment', adminController.approvePayment);
router.post('/reject-payment', adminController.rejectPayment);

export default router;
