import express from 'express';
import userNotificationController from '#src/controllers/userNotificationController.js';
import { protect } from '#middlewares/authenticatorMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', userNotificationController.getNotifications);
router.get('/unread-count', userNotificationController.getUnreadCount);
router.put('/mark-as-read/:id', userNotificationController.markAsRead);
router.put('/mark-all-as-read', userNotificationController.markAllAsRead);

export default router;
