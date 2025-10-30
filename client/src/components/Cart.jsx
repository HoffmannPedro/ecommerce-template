import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
    const { cartItems, removeOne, removeFromCart, loading, error } = useCart();

    if (loading) {
        return <div className="text-center mt-8">Cargando carrito...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-red-600">
                Error: {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const total = cartItems.reduce((sum, item) =>
        sum + item.product.price * item.quantity, 0
    );

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-8">
                <p className="text-xl mb-4">Tu carrito está vacío</p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Ir a Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Tu Carrito</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {cartItems.map(item => (
                    <div
                        key={item.product.id}
                        className="flex justify-between items-center p-4 border-b"
                    >
                        <div className="flex-1">
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-gray-600">${item.product.price.toFixed(2)} c/u</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => removeOne(item.product.id)}
                                className="bg-yellow-500 text-white w-8 h-8 rounded hover:bg-yellow-600"
                            >
                                −
                            </button>

                            <span className="font-medium w-8 text-center">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="bg-red-600 text-white w-8 h-8 rounded hover:bg-red-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}

                <div className="p-4 bg-gray-50">
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    to="/"
                    className="bg-gray-600 text-white px-6 py-2 rounded mr-4 hover:bg-gray-700"
                >
                    Seguir Comprando
                </Link>
                <button
                    onClick={() => window.location.reload()} // Refresca para limpiar (próximo paso: limpiar carrito)
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                    Limpiar Carrito
                </button>
            </div>
        </div>
    );
}

export default Cart;