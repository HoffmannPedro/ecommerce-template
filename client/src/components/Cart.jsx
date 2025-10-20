import React from 'react';
import { useCart } from '../contexts/CartContext';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

function Cart() {
    const { cartItems, removeFromCart, removeOne, addToCart, loading, error } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (loading) {
        return (
            <div className='mt-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
                <p className="mt-4 text-gray-600">Cargando carrito...</p>
            </div>
        );
    } 
    if (error) {
        return (
            <div className='mt-8 p-6 border rounded-lg bg-red-50 max-w-2xl mx-auto text-center'>
                <p className="text-red-600 font-semibold">Error: {error}</p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="mt-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Carrito</h2>
                <p className="text-gray-600 text-center">Carrito vacío</p>
            </div>
        );
    }

    return (
        <div className="mt-8 p-6 border rounded-lg bg-gray-800 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Carrito</h2>
            <div className="overflow-x-auto text-left">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-700 text-left">
                            <th className="p-3 font-semibold">Producto</th>
                            <th className="p-3 font-semibold">Precio</th>
                            <th className="p-3 font-semibold">Cantidad</th>
                            <th className="p-3 font-semibold">Subtotal</th>
                            <th className="p-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.product.id} className="border-b">
                                <td className="p-3">{item.product.name}</td>
                                <td className="p-3">${item.product.price.toFixed(2)}</td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className="p-3">${(item.product.price * item.quantity).toFixed(2)}</td>
                                <td className="p-3 flex space-x-2">
                                    <ChevronDownIcon 
                                className='bg-yellow-500 text-black px-1 rounded hover:bg-yellow-600 cursor-pointer'
                                        onClick={() => removeOne(item.product.id)}
                                    />
                                    <ChevronUpIcon
                                className='bg-lime-500 text-black px-1 rounded hover:bg-yellow-600 cursor-pointer'
                                        onClick={() => addToCart(item.product)}
                                    />
                                    
                                    <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => removeFromCart(item.product.id)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-6 text-xl font-bold text-right">Total: ${totalPrice.toFixed(2)}</p>
        </div>
    );
}

export default Cart;