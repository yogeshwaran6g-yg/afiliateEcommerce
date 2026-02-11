import express from 'express';
import profileController from '../controllers/profileController.js';
import { protect } from '../middlewares/authenticatorMiddleware.js';
import kycUpload from '../middlewares/kycUploadMiddleware.js';

const router = express.Router();

// All profile routes require authentication
router.use(protect);

router.get('/me', profileController.getMyProfile);
router.put('/personal', profileController.updatePersonal);
router.put('/identity', kycUpload.single('file'), profileController.updateIdentity);
router.put('/address', kycUpload.single('file'), profileController.updateAddress);
router.put('/bank', kycUpload.single('file'), profileController.updateBank);

export default router;
