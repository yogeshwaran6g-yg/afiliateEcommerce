import pool from '#config/db.js';
import { log } from '#utils/helper.js';


export const getOrCreateActiveCart = async (userId, connection) => {
    if (!userId) {
        return {
            code: 400,
            success: false,
            message: "Internal Error"
        }
    }
    const db = connection || pool;

    // Check for existing active cart
    const [carts] = await db.query(
        'SELECT id, status FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
    );

    if (carts.length > 0 && carts[0].status === 'active') {
        return carts[0];
    }

    // If no cart or latest is processed, create a new active cart
    log(`Creating new active cart for user ${userId}`, "info");
    const [result] = await db.query(
        'INSERT INTO carts (user_id, status) VALUES (?, ?)',
        [userId, 'active']
    );

    return { id: result.insertId, status: 'active' };
};


export const addToCart = async (userId, productId, quantity = 1) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const activeCart = await getOrCreateActiveCart(userId, connection);
        const cartId = activeCart.id;

        // Check if item already exists in the cart
        const [existingItems] = await connection.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (existingItems.length > 0) {
            // Update quantity
            const newQuantity = existingItems[0].quantity + quantity;
            await connection.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItems[0].id]
            );
            log(`Updated quantity for product ${productId} in cart ${cartId}`, "info");
        } else {
            // Insert new item
            await connection.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
            log(`Added product ${productId} to cart ${cartId}`, "info");
        }

        await connection.commit();
        return { success: true, cartId };
    } catch (error) {
        await connection.rollback();
        log(`Error in addToCart: ${error.message}`, "error");
        throw error;
    } finally {
        connection.release();
    }
};


export const getCart = async (userId) => {
    try {
        if (!userId) {
            return {
                code: 400,
                success: false,
                message: "Internal Error"
            }
        }
        const activeCart = await getOrCreateActiveCart(userId);
        const cartId = activeCart.id;

        const [items] = await pool.query(
            `SELECT ci.id as cart_item_id, ci.product_id, ci.quantity, 
                    p.name, p.slug, p.sale_price, p.images, p.stock, p.pv
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        return {
            cartId,
            userId,
            items: items.map(item => ({
                ...item,
                images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
            }))
        };
    } catch (error) {
        console.log(error);
        return {
            code: 400,
            success: false,
            message: "Internal Error"
        }
    }
};


export const updateCartItem = async (userId, productId, quantity) => {
    const activeCart = await getOrCreateActiveCart(userId);
    const cartId = activeCart.id;

    if (quantity <= 0) {
        return removeFromCart(userId, productId);
    }

    const [result] = await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Product not found in cart');
    }

    return { success: true };
};


export const clearCart = async (userId) => {
    const activeCart = await getOrCreateActiveCart(userId);
    const cartId = activeCart.id;

    await pool.query(
        'DELETE FROM cart_items WHERE cart_id = ?',
        [cartId]
    );

    return { success: true };
};


export const removeFromCart = async (userId, productId) => {
    const activeCart = await getOrCreateActiveCart(userId);
    const cartId = activeCart.id;

    const [result] = await pool.query(
        'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Product not found in cart');
    }

    return { success: true };
};