import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // CARGAR CARRITO AL INICIAR
    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await api.getCart();
                setCartItems(
                    data.items.map(item => ({
                        product: {
                            id: item.productId,
                            name: item.productName,
                            price: item.price
                        },
                        quantity: item.quantity
                    }))
                );
                setLoading(false);
            } catch (err) {
                setError('No se pudo cargar el carrito');
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    // AGREGAR AL CARRITO
    const addToCart = async (product) => {
        try {
            const data = await api.addItem(product.id, 1);
            setCartItems(
                data.items.map(item => ({
                    product: {
                        id: item.productId,
                        name: item.productName,
                        price: item.price
                    },
                    quantity: item.quantity
                }))
            );
        } catch (err) {
            setError('Error al agregar al carrito');
        }
    };

    // QUITAR UNA UNIDAD
    const removeOne = async (productId) => {
        try {
            const data = await api.removeOne(productId);
            setCartItems(
                data.items.map(item => ({
                    product: {
                        id: item.productId,
                        name: item.productName,
                        price: item.price
                    },
                    quantity: item.quantity
                }))
            );
        } catch (err) {
            setError('Error al quitar unidad');
        }
    };

    // QUITAR TODO
    const removeFromCart = async (productId) => {
        try {
            const data = await api.removeItem(productId);
            setCartItems(
                data.items.map(item => ({
                    product: {
                        id: item.productId,
                        name: item.productName,
                        price: item.price
                    },
                    quantity: item.quantity
                }))
            );
        } catch (err) {
            setError('Error al eliminar del carrito');
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeOne,
                removeFromCart,
                loading,
                error
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);