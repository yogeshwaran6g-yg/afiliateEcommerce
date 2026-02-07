import express from 'express';
import commissionConfigRoutes from './commissionConfigRoutes.js';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import referralRoutes from './referralRoutes.js';

const router = express.Router();

router.use('/commission-config', commissionConfigRoutes);
router.use('/', userRoutes); // signup and global referral
router.use('/orders', orderRoutes);
router.use('/referral', referralRoutes);

export default router;
