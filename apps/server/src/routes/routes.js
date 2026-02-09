import express from 'express';
import commissionConfigRoutes from './commissionConfigRoutes.js';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import referralRoutes from './referralRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/commission-config', commissionConfigRoutes);
router.use('/users', userRoutes); // Changed from / to /users to avoid conflict if any, but plan said /auth.
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/referral', referralRoutes);

export default router;
