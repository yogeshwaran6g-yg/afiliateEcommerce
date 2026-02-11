import { addToCart, getCart } from '../services/cartService.js';
import pool from '../config/db.js';
import { log } from '../utils/helper.js';

const testCart = async () => {
    try {
        log("Starting Cart Logic Test...", "info");

        // 1. Get or Create a test user
        const [[user]] = await pool.query('SELECT id FROM users LIMIT 1');
        if (!user) {
            log("No users found in database to test with", "error");
            return;
        }
        const userId = user.id;
        log(`Testing with User ID: ${userId}`, "info");

        // 2. Get or Create a test product
        const [[product]] = await pool.query('SELECT id FROM products LIMIT 1');
        if (!product) {
            log("No products found in database to test with", "error");
            return;
        }
        const productId = product.id;
        log(`Testing with Product ID: ${productId}`, "info");

        // 3. Add to Cart
        log("Adding product to cart...", "info");
        await addToCart(userId, productId, 2);

        // 4. Verify Cart is Active
        const cart = await getCart(userId);c
        log(`Cart retrieved. ID: ${cart.cartId}, Items: ${cart.items.length}`, "success");
        console.log("Cart Items:", cart.items);

        // 5. Simulate "Processed" cart (e.g. after order)
        log("Marking cart as processed...", "info");
        await pool.query('UPDATE carts SET status = "processed" WHERE id = ?', [cart.cartId]);

        // 6. Add again - should create a NEW cart
        log("Adding product again (should trigger new cart)...", "info");
        await addToCart(userId, productId, 1);

        // 7. Verify new cart created
        const newCart = await getCart(userId);
        log(`New Cart ID: ${newCart.cartId}`, "success");

        if (newCart.cartId !== cart.cartId) {
            log("PASSED: New active cart created because old one was processed", "success");
        } else {
            log("FAILED: New cart was not created", "error");
        }

        process.exit(0);
    } catch (error) {
        log(`Test Failed: ${error.message}`, "error");
        console.error(error);
        process.exit(1);
    }
};

testCart();
