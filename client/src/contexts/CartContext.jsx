import {createContext, useContext, useState} from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            
            if (existingItem) {
                return prevCart.map(item => 
                    item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1}
                    : item
                );
            }
            return [...prevCart, {product, quantity: 1}];
        });
    };

    const removeOne = (productId) => {
        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === productId);

            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item => 
                    item.product.id === productId 
                    ? {...item, quantity: item.quantity - 1}
                    : item
                );
            }
            else {
                console.log("Removing item completely");
                return prevCart.filter(item => item.product.id !== productId);
            }
        })
    }

    const removeFromCart = (productId) => {
        setCartItems(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeOne}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
