import express from 'express';
import notificationController from '#controllers/notificationController.js';

import { protect, authorize } from '#middlewares/authenticatorMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('ADMIN'), notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id', protect, authorize('ADMIN'), notificationController.updateNotification);
router.delete('/:id', protect, authorize('ADMIN'), notificationController.deleteNotification);

export default router;
