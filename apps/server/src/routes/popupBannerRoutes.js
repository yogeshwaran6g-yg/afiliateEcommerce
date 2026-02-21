import express from 'express';
import popupBannerController from '#src/controllers/popupBannerController.js';
import { protect } from '#middlewares/authenticatorMiddleware.js';

const router = express.Router();

// Protected - only logged-in users can see popup
router.use(protect);
router.get('/active', popupBannerController.getActive);

export default router;
