import express from 'express';
import orderController from '#controllers/orderController.js';
import { protect, checkActivated } from '#middlewares/authenticatorMiddleware.js';
import paymentUpload from '#middlewares/paymentUploadMiddleware.js';
import { rtnRes } from '#utils/helper.js';

const router = express.Router();

router.use(protect);

router.post('/upload', paymentUpload.single('proof'), (req, res) => {
    if (!req.file) {
        return rtnRes(res, 400, "No file uploaded");
    }
    const proofUrl = `/uploads/payments/${req.file.filename}`;
    return rtnRes(res, 200, "File uploaded successfully", { proofUrl });
});

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
