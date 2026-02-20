import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import cartService from "../services/cartService";
import settingsService from "../services/settingsService";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [shipping, setShipping] = useState(12.00);
    const [taxRate, setTaxRate] = useState(0.08);

    // Load cart and settings when authentication status changes
    useEffect(() => {
        const loadCartAndSettings = async () => {
            if (!isAuthenticated) {
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // Fetch cart items and shipping settings in parallel
                const [cartResponse, shippingResponse] = await Promise.all([
                    cartService.getCart(),
                    settingsService.getShippingSettings().catch(() => ({ success: false }))
                ]);

                setCartItems(Array.isArray(cartResponse) ? cartResponse : []);

                if (shippingResponse?.success && shippingResponse?.data) {
                    setShipping(shippingResponse.data.shipping_cost);
                }
            } catch (error) {
                console.error("Failed to load cart or settings:", error);
                setCartItems([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadCartAndSettings();
    }, [isAuthenticated, user]);

    // Add item
    const addToCart = useCallback(async (product, quantity = 1) => {
        if (!isAuthenticated) {
            toast.warning("Please login to add items to cart");
            return;
        }
        try {
            const updatedItems = await cartService.addToCart(product, quantity);
            setCartItems([...updatedItems]);
        } catch (error) {
            console.error("Add to cart failed:", error);
            toast.error(error.message || "Failed to add item to cart");
        }
    }, [isAuthenticated]);

    // Remove item
    const removeFromCart = useCallback(async (productId) => {
        try {
            const updatedItems = await cartService.removeFromCart(productId);
            setCartItems([...updatedItems]);
        } catch (error) {
            console.error("Remove from cart failed:", error);
        }
    }, []);

    // Update quantity (delta)
    const updateQuantity = useCallback(async (productId, delta) => {
        try {
            const updatedItems = await cartService.updateQuantity(productId, delta);
            setCartItems([...updatedItems]);
        } catch (error) {
            console.error("Update quantity failed:", error);
        }
    }, []);

    // Set quantity
    const setQuantity = useCallback(async (productId, quantity) => {
        try {
            const updatedItems = await cartService.setQuantity(productId, quantity);
            setCartItems([...updatedItems]);
        } catch (error) {
            console.error("Set quantity failed:", error);
        }
    }, []);

    // Clear cart
    const clearCart = useCallback(async () => {
        try {
            const updatedItems = await cartService.clearCart();
            setCartItems([...updatedItems]);
        } catch (error) {
            console.error("Clear cart failed:", error);
        }
    }, []);

    // Calculations - ensure numbers are handled correctly
    const subtotal = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity || 0)), 0),
        [cartItems]);

    const tax = useMemo(() => subtotal * taxRate, [subtotal]);
    const total = useMemo(() => subtotal + shipping + tax, [subtotal, tax, shipping]);


    const totalItemsCount = useMemo(() =>
        cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0),
        [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        totalItemsCount,
        shipping,
        taxRate
    }), [
        cartItems, isLoading, addToCart, removeFromCart, updateQuantity,
        setQuantity, clearCart, subtotal, tax, total, totalItemsCount, shipping
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
