import * as orderService from '#services/orderService.js';
import { rtnRes, log } from '#utils/helper.js';

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalAmount, shippingAddress, paymentStatus } = req.body;

        if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
            return rtnRes(res, 400, "Items, Total Amount, and Shipping Address are required");
        }

        const order = await orderService.createOrder({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentStatus
        });

        return rtnRes(res, 201, "Order created successfully", order);
    } catch (error) {
        log(`Order creation error: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getOrdersByUserId(userId);
        return rtnRes(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        log(`Error in getMyOrders: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = await orderService.getOrderById(orderId, userId);

        if (!order) {
            return rtnRes(res, 404, "Order not found");
        }

        return rtnRes(res, 200, "Order fetched successfully", order);
    } catch (error) {
        log(`Error in getOrderById: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export default {
    createOrder,
    getMyOrders,
    getOrderById
};
