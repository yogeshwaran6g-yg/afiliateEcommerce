import express from 'express';
import authController from '#controllers/authController.js';
import { protect, authorize } from "#src/middlewares/authenticatorMiddleware.js"

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// Protected Routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);


export default router;
