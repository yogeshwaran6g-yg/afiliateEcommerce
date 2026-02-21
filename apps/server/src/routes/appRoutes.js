import express from 'express';
import commissionConfigRoutes from './commissionConfigRoutes.js';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import referralRoutes from './referralRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import profileRoutes from './profileRoutes.js';
import cartRoutes from './cartRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userNotificationRoutes from './userNotificationRoutes.js';
import walletRoutes from './walletRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import popupBannerRoutes from './popupBannerRoutes.js';

const router = express.Router();

router.use('/commission-config', commissionConfigRoutes);
router.use('/users', userRoutes); // Changed from / to /users to avoid conflict if any, but plan said /auth.
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/referral', referralRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/profile', profileRoutes);
router.use('/cart', cartRoutes);
router.use('/notifications', notificationRoutes);
router.use('/user-notifications', userNotificationRoutes);
router.use('/wallet', walletRoutes);
router.use('/tickets', ticketRoutes);
router.use('/settings', settingsRoutes);
router.use('/popup-banners', popupBannerRoutes);

export default router;

