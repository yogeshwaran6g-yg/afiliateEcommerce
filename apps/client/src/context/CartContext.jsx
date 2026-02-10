import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Constants for calculation
    const shipping = 12.00;
    const taxRate = 0.08;

    // Load cart on mount
    useEffect(() => {
        const loadCart = async () => {
            const items = await cartService.getCart();
            setCartItems(items);
            setIsLoading(false);
        };
        loadCart();
    }, []);

    // Add item
    const addToCart = useCallback(async (product, quantity = 1) => {
        const updatedItems = await cartService.addToCart(product, quantity);
        setCartItems([...updatedItems]);
    }, []);

    // Remove item
    const removeFromCart = useCallback(async (productId) => {
        const updatedItems = await cartService.removeFromCart(productId);
        setCartItems([...updatedItems]);
    }, []);

    // Update quantity (delta)
    const updateQuantity = useCallback(async (productId, delta) => {
        const updatedItems = await cartService.updateQuantity(productId, delta);
        setCartItems([...updatedItems]);
    }, []);

    // Set quantity
    const setQuantity = useCallback(async (productId, quantity) => {
        const updatedItems = await cartService.setQuantity(productId, quantity);
        setCartItems([...updatedItems]);
    }, []);

    // Clear cart
    const clearCart = useCallback(async () => {
        const updatedItems = await cartService.clearCart();
        setCartItems([...updatedItems]);
    }, []);

    // Calculations
    const subtotal = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [cartItems]);

    const tax = useMemo(() => subtotal * taxRate, [subtotal]);
    const total = useMemo(() => subtotal + shipping + tax, [subtotal, tax]);
    const totalPV = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.pv * item.quantity), 0),
        [cartItems]);

    const totalItemsCount = useMemo(() =>
        cartItems.reduce((sum, item) => sum + item.quantity, 0),
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
        totalPV,
        totalItemsCount,
        shipping,
        taxRate
    }), [
        cartItems, isLoading, addToCart, removeFromCart, updateQuantity,
        setQuantity, clearCart, subtotal, tax, total, totalPV, totalItemsCount
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
