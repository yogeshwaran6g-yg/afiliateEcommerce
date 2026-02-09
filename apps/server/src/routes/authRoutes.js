import express from 'express';
import authController from '#controller/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// Protected Routes
router.get('/profile', passport.authenticate('jwt', { session: false }), authController.getProfile);
router.put('/profile', passport.authenticate('jwt', { session: false }), authController.updateProfile);

export default router;
