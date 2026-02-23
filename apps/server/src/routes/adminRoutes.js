import express from 'express';
import adminController from '../controllers/adminController.js';
import userNotificationController from '../controllers/userNotificationController.js';
import { protect, authorize } from '../middlewares/authenticatorMiddleware.js';
import popupBannerController from '../controllers/popupBannerController.js';

const router = express.Router();

// Admin prefix routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/approve-payment', adminController.approvePayment);
router.post('/reject-payment', adminController.rejectPayment);

// Dashboard Statistics
router.get('/stats', adminController.getDashboardStats);

// Withdrawal approvals
router.get('/withdrawals', adminController.getWithdrawals);
router.post('/approve-withdrawal', adminController.approveWithdrawal);
router.post('/reject-withdrawal', adminController.rejectWithdrawal);

// Recharge approvals
router.get('/recharges', adminController.getRecharges);
router.post('/approve-recharge', adminController.approveRecharge);
router.post('/reject-recharge', adminController.rejectRecharge);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.put('/users/:userId', adminController.updateUser);

// KYC management
router.get('/kyc', adminController.getKYCRecords);
router.put('/kyc/:userId', adminController.updateKYCStatus);

// Product management leveraging existing productController
import productController from '../controllers/productController.js';
import notificationController from '../controllers/notificationController.js';
import upload from '../middlewares/uploadMiddleware.js';

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', upload.array('images', 5), productController.createProduct);
router.put('/products/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Announcement/Notification management
router.get('/notifications', notificationController.getNotifications);
router.get('/notifications/:id', notificationController.getNotificationById);
router.post('/notifications', upload.single('image'), notificationController.createNotification);
router.put('/notifications/:id', upload.single('image'), notificationController.updateNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);
// Wallet transactions
router.get('/wallet-transactions', adminController.getWalletTransactions);
router.get('/transaction-metrics', adminController.getTransactionMetrics);

// Support Tickets
router.get('/tickets', adminController.getTickets);
router.post('/tickets/update-status', adminController.updateTicketStatus);

// Orders management
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.post('/orders/:id/tracking', adminController.addOrderTracking);
router.get('/order-payments', adminController.getOrderPayments);

// User Notifications management
router.get('/user-notifications', userNotificationController.getUserNotifications);
router.post('/user-notifications', userNotificationController.sendNotification);
router.post('/user-notifications/broadcast', userNotificationController.broadcastNotification);
router.put('/user-notifications/mark-as-read/:id', userNotificationController.markAsRead);
router.put('/user-notifications/mark-all-as-read', userNotificationController.markAllAsRead);
router.delete('/user-notifications/:id', userNotificationController.deleteNotification);

// Referral management
router.get('/users/:userId/referral-overview', adminController.getUserReferralOverview);
router.get('/users/:userId/team/:level', adminController.getTeamMembersByLevel);
// Popup Banners management


router.get('/popup-banners', popupBannerController.getAll);
router.post('/popup-banners', upload.single('logo'), popupBannerController.create);
router.put('/popup-banners/:id', upload.single('logo'), popupBannerController.update);
router.delete('/popup-banners/:id', popupBannerController.delete);

export default router;
