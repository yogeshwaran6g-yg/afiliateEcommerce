import express from 'express';
import authController from '#controllers/authController.js';
import { protect, authorize} from "#src/middlewares/authenticatorMiddleware.js"
import passport from 'passport';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// Protected Routes
router.get('/profile',protect ,authController.getProfile);
router.put('/profile',protect ,authorize("ADMIN"), authController.updateProfile);


export default router;
