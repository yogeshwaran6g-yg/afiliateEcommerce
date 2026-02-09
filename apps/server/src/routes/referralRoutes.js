import express from 'express';
import passport from 'passport';
import referalController from '#controller/referalController.js';

const router = express.Router();

router.post('/create', referalController.createReferral);
router.post('/distribute-commissions', referalController.distributeCommissions);
router.get('/overview', passport.authenticate('jwt', { session: false }), referalController.getUserReferralOverview);

export default router;
