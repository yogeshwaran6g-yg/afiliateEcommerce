import express from 'express';
import settingsController from '#controllers/settingsController.js';
import { protect } from '../middlewares/authenticatorMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/withdrawal', settingsController.getWithdrawalSettings);
router.get('/shipping', settingsController.getShippingSettings);

export default router;
