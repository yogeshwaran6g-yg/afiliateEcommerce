import * as orderService from '#service/orderService.js';
import { rtnRes, log } from '#utils/helper.js';

const createOrder = async (req, res) => {
    try {
        const { userId, amount, status } = req.body;

        if (!userId || !amount) {
            return rtnRes(res, 400, "User ID and Amount are required");
        }

        const order = await orderService.createOrder({ userId, amount, status });

        return rtnRes(res, 201, "Order created successfully", order);
    } catch (error) {
        log(`Order creation error: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export default {
    createOrder
};
