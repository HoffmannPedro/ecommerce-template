import React from 'react'
import { useCart } from '../contexts/CartContext.jsx';

export default function Cart() {

    const { cartItems, removeFromCart } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className='mt-4 p-4 border rounded bg-gray-100'>
                <h2 className='text-xl font-bold mb-2'>Carrito</h2>
                <p>Carrito vacío</p>
            </div>
        );
    }
    return (
        <div className='mt-4 p-4 border rounded bg-gray-100'>
            <h2 className='text-xl font-bold mb-2'>Carrito</h2>
            <ul className='space-y-2'>
                {cartItems.map(item => (
                    <li key={item.product.id} className='flex justify-between items-center'>
                        <span>{item.product.name} - ${item.product.price} x {item.quantity}</span>
                        <button 
                            className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600'
                            onClick={() => removeFromCart(item.product.id)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
            <p className='mt-4 text-lg font-bold'>Total: {totalPrice.toFixed(2)}</p>
        </div>
    )
}
