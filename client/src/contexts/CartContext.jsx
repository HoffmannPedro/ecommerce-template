import {createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = 1;

    // Función para fetch con reintentos}
    const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
        for (let i  = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP error : ${response.status}`);
                return await response.json();
            } catch (err) {
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw err;
                
            }
            
        }
    };

    // Cargar carrito al iniciar
    useEffect(() => {
        fetchWithRetry(`http://localhost:8080/api/cart/${userId}`)
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
                setError(`Fallo al cargar el carrito: ${err.message}`);
                setLoading(false);
            });
    }, []);

    // Agrega un producto al carrito
    const addToCart = async (product) => {
        try {
            const data = await fetchWithRetry(`http://localhost:8080/api/cart/${userId}/items`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ productId: product.id, quantity: 1 })
            });
            setCartItems(data.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
            setError(null);
        } catch (err) {
            setError(`Fallo al cargar el carrito: ${err.message}`);
        }
    };

    // Remueve una unidad de un producto del carrito
    const removeOne = async (productId) => {
        try {
            const data = await fetchWithRetry(`http://localhost:8080/api/cart/${userId}/items/${productId}/one`, {
                method: 'DELETE',
            });
            setCartItems(data.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    // Remueve todas las unidades de un producto del carrito
    const removeFromCart = async (productId) => {
        try {
            const data = await fetchWithRetry(`http://localhost:8080/api/cart/${userId}/items/${productId}`, {
                method: 'DELETE'
            });
            setCartItems(data.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price
                },
                quantity: item.quantity
            })));
            setError(null);
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
