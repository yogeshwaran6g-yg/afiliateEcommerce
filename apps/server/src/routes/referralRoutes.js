import express from 'express';
import { protect, checkActivated } from '#src/middlewares/authenticatorMiddleware.js';
import referalController from '#controllers/referalController.js';

const router = express.Router();

router.use(protect);
router.use(checkActivated);

router.post('/create', referalController.createReferral);
router.get('/overview', referalController.getUserReferralOverview);
router.get('/direct', referalController.getDirectReferrals);
router.get('/team-members/:level', referalController.getTeamMembersByLevel);
router.get('/tree', referalController.getNetworkTree);

export default router;
