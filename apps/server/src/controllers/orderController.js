import * as orderService from '#services/orderService.js';
import { rtnRes, log } from '#utils/helper.js';

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            items, 
            totalAmount, 
            shippingAddress, 
            paymentMethod,
            paymentType,
            transactionReference,
            proofUrl,
            orderType 
        } = req.body;

        if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
            return rtnRes(res, 400, "Items, Total Amount, and Shipping Address are required");
        }

        // Allow non-activated users to create ACTIVATION orders only
        const effectiveOrderType = orderType || 'PRODUCT_PURCHASE';
        if (effectiveOrderType !== 'ACTIVATION' && (!req.user.is_active || req.user.account_activation_status !== 'ACTIVATED')) {
            return rtnRes(res, 403, "Your account is not activated. Please complete activation first.");
        }

        const order = await orderService.createOrder({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentType,
            transactionReference,
            proofUrl,
            orderType: orderType || 'PRODUCT_PURCHASE'
        });

        return rtnRes(res, 201, "Order created successfully", order);
    } catch (error) {
        log(`Order creation error: ${error.message}`, "error");
        if (error.message === "Insufficient wallet balance") {
            return rtnRes(res, 400, error.message);
        }
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
