import express from 'express';
import authController from '#controllers/authController.js';
import { protect, authorize } from "#src/middlewares/authenticatorMiddleware.js";
import paymentUpload from '#src/middlewares/paymentUploadMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected Routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.post('/complete-registration', protect, paymentUpload.single('proof'), authController.completeRegistration);
router.put('/update-password', protect, authController.updatePassword);


export default router;
