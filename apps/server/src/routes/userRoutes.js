import express from 'express';
import userController from '#controllers/userController.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.get('/referral/global', userController.getGlobalReferralId);

export default router;
