import express from 'express';
import notificationController from '#controllers/notificationController.js';

const router = express.Router();

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

export default router;
