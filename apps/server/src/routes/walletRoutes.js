import express from 'express';
import walletController from '#controllers/walletController.js';
import withdrawalController from '#controllers/withdrawalController.js';
import rechargeController from '#controllers/rechargeController.js';
import paymentUpload from '#middlewares/paymentUploadMiddleware.js';
import passport from 'passport';

const router = express.Router();

// All wallet routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', walletController.getWallet);
router.get('/transactions', walletController.getTransactions);

// Request routes
router.post('/withdraw', withdrawalController.createRequest);
router.post('/recharge', paymentUpload.single('proof'), rechargeController.createRequest);

// Status routes (optional but helpful)
router.get('/withdrawals', withdrawalController.getRequests);
router.get('/recharges', rechargeController.getRequests);

export default router;
