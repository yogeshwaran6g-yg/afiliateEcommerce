import express from 'express';
import orderController from '#controllers/orderController.js';
import { protect, checkActivated } from '#middlewares/authenticatorMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(checkActivated);

router.post('/', orderController.createOrder);

export default router;
