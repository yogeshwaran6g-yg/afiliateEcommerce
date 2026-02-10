/**
 * Cart Service
 * Handles shopping cart persistence and logic.
 * Currently using localStorage to emulate a backend API.
 */

const CART_STORAGE_KEY = "afiliate_cart_items";

const cartService = {
    // Get all cart items
    async getCart() {
        try {
            const items = localStorage.getItem(CART_STORAGE_KEY);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error("Get Cart Error:", error);
            return [];
        }
    },

    // Save cart items
    async saveCart(items) {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error("Save Cart Error:", error);
            return false;
        }
    },

    // Add item to cart
    async addToCart(product, quantity = 1) {
        const items = await this.getCart();
        const existingItemIndex = items.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            items[existingItemIndex].quantity += quantity;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                sku: product.sku || `SKU-${product.id}`, // Fallback if SKU is missing
                price: parseFloat(product.sale_price) || 0,
                pv: product.pv || 0,
                image: product.image || (product.images ? JSON.parse(product.images)[0] : ""),
                quantity: quantity
            });
        }

        await this.saveCart(items);
        return items;
    },

    // Remove item from cart
    async removeFromCart(productId) {
        const items = await this.getCart();
        const filteredItems = items.filter(item => item.id !== productId);
        await this.saveCart(filteredItems);
        return filteredItems;
    },

    // Update item quantity
    async updateQuantity(productId, delta) {
        const items = await this.getCart();
        const itemIndex = items.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            items[itemIndex].quantity = Math.max(1, items[itemIndex].quantity + delta);
            await this.saveCart(items);
        }
        return items;
    },

    // Set absolute quantity
    async setQuantity(productId, quantity) {
        const items = await this.getCart();
        const itemIndex = items.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            items[itemIndex].quantity = Math.max(1, quantity);
            await this.saveCart(items);
        }
        return items;
    },

    // Clear cart
    async clearCart() {
        await this.saveCart([]);
        return [];
    }
};

export default cartService;
