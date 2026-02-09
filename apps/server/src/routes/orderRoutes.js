import express from 'express';
import orderController from '#controller/orderController.js';

const router = express.Router();

router.post('/', orderController.createOrder);

export default router;
