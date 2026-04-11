import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage so it survives page refreshes
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Automatically save to localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prevCart => {
            // Case 1: Check if ordering from a different kitchen
            if (prevCart.length > 0 && prevCart[0].kitchenId !== item.kitchenId) {
                alert('You can only order from one kitchen at a time.');
                return prevCart;
            }

            // Case 2: Same kitchen or empty cart
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                // Increment quantity
                return prevCart.map(cartItem => 
                    cartItem.id === item.id 
                        ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                        : cartItem
                );
            } else {
                // Add new item
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (id, change) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + change };
            }
            return item;
        }).filter(item => item.quantity > 0)); // Automatically remove if quantity hits 0
    };

    const removeItem = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Derived stats for the UI
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cart.length > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, updateQuantity, removeItem, clearCart, 
            cartCount, subtotal, deliveryFee, total 
        }}>
            {children}
        </CartContext.Provider>
    );
};