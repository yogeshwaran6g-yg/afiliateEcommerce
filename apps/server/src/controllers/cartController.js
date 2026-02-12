import * as cartService from '#services/cartService.js';
import { rtnRes } from '#utils/helper.js';

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return rtnRes(res, 400, "unable to find userID")
        }
        const cart = await cartService.getCart(userId);
        return rtnRes(res, 200, 'Cart retrieved successfully', cart);
    } catch (error) {
        return rtnRes(res, 500, error.message);
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId) {
            return rtnRes(res, 400, 'Product ID is required');
        }

        const result = await cartService.addToCart(userId, productId, quantity || 1);
        return rtnRes(res, 200, 'Product added to cart', result);
    } catch (error) {
        return rtnRes(res, 500, error.message);
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return rtnRes(res, 400, 'Product ID and quantity are required');
        }

        const result = await cartService.updateCartItem(userId, productId, quantity);
        return rtnRes(res, 200, 'Cart item updated', result);
    } catch (error) {
        return rtnRes(res, 500, error.message);
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        if (!productId) {
            return rtnRes(res, 400, 'Product ID is required');
        }

        const result = await cartService.removeFromCart(userId, productId);
        return rtnRes(res, 200, 'Product removed from cart', result);
    } catch (error) {
        return rtnRes(res, 500, error.message);
    }
};
