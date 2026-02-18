import express from 'express';
import orderController from '#controllers/orderController.js';
import { protect, checkActivated } from '#middlewares/authenticatorMiddleware.js';
import paymentUpload from '#middlewares/paymentUploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', checkActivated, paymentUpload.single('proof'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const proofUrl = `/uploads/payments/${req.file.filename}`;
    res.status(200).json({ proofUrl });
});

router.post('/', checkActivated, orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
