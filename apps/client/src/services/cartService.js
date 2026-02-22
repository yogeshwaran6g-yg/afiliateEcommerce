import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { cart: cartEndpoints } = constants.endpoints;

const cartService = {
    // Get all cart items from backend
    async getCart() {
        try {
            const response = await api.get(cartEndpoints.base);
            if (response.success && response.data && Array.isArray(response.data.items)) {
                // Map backend fields to frontend expected fields
                return response.data.items.map(item => ({
                    ...item,
                    id: item.product_id, // Map product_id to id for local consistency
                    price: parseFloat(item.sale_price) || 0, // Map sale_price to price
                    image: item.images && item.images.length > 0 ? item.images[0] : "", // Use first image
                }));
            }
            return [];
        } catch (error) {
            handleServiceError(error, "Get Cart");
        }
    },

    // Add item to cart on backend
    async addToCart(product, quantity = 1) {
        try {
            const response = await api.post(cartEndpoints.add, {
                productId: product.id,
                quantity: quantity
            });

            if (response.success) {
                return await this.getCart();
            }
            throw new Error(response.message || "Failed to add to cart");
        } catch (error) {
            handleServiceError(error, "Add to Cart");
        }
    },

    // Remove item from cart on backend
    async removeFromCart(productId) {
        try {
            const response = await api.delete(cartEndpoints.remove(productId));
            if (response.success) {
                return await this.getCart();
            }
            throw new Error(response.message || "Failed to remove from cart");
        } catch (error) {
            handleServiceError(error, "Remove from Cart");
        }
    },

    // Update item quantity on backend
    async updateQuantity(productId, delta) {
        try {
            const items = await this.getCart();
            const item = items.find(i => i.id === productId);
            if (item) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return await this.setQuantity(productId, newQuantity);
            }
            return items;
        } catch (error) {
            handleServiceError(error, "Update Quantity");
        }
    },

    // Set absolute quantity on backend
    async setQuantity(productId, quantity) {
        try {
            const response = await api.put(cartEndpoints.update, {
                productId: productId,
                quantity: Math.max(1, quantity)
            });
            if (response.success) {
                return await this.getCart();
            }
            throw new Error(response.message || "Failed to update quantity");
        } catch (error) {
            handleServiceError(error, "Set Quantity");
        }
    },

    // Clear cart
    async clearCart() {
        try {
            const response = await api.delete(cartEndpoints.base);
            if (response.success) {
                return [];
            }
            throw new Error(response.message || "Failed to clear cart");
        } catch (error) {
            handleServiceError(error, "Clear Cart");
        }
    }
};

export default cartService;
