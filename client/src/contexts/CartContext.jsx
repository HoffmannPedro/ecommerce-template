import {createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = 1;

    // Cargar carrito al iniciar
    useEffect(() => {
        fetch(`http://localhost:8080/api/cart/${userId}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar el carrito');
                return response.json();
            })
            .then(data => {
                setCartItems(data.items.map(item => ({
                    product: {
                        id: item.productId,
                        name: item.productName,
                        price: item.price
                    },
                    quantity: item.quantity
                })));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Agrega un producto al carrito
    const addToCart = async (product) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${userId}/items`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ productId: product.id, quantity: 1 })
            });
            if (!response.ok) throw new Error('Error al agregar al carrito');
            const updatedCart = await response.json();
            setCartItems(updatedCart.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
        } catch (err) {
            setError(err.message);
        }
    };

    // Remueve una unidad de un producto del carrito
    const removeOne = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${userId}/items/${productId}/one`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar una unidad');
            const updatedCart = await response.json();
            setCartItems(updatedCart.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
        } catch (err) {
            setError(err.message);
        }
    }

    // Remueve todas las unidades de un producto del carrito
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${userId}/items/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar del carrito');
            const updatedCart = await response.json();
            setCartItems(updatedCart.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeOne, loading, error }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
