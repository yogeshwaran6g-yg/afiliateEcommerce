import express from 'express';
import * as cartController from '#controllers/cartController.js';
import { protect, checkActivated } from '#middlewares/authenticatorMiddleware.js';

const router = express.Router();

router.use(protect);
// Removed checkActivated to allow unactivated users to add items to cart (e.g. activation package)

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
