import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProductList() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar productos');
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-8">Cargando productos...</div>;
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

    const handleAdd = (product) => {
        if (!isAuthenticated()) {
            alert('Iniciá sesión para agregar al carrito');
            navigate('login');
            return;
        }
        addToCart(product);
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Categoría: {product.categoryName}
                        </p>

                        <button
                            onClick={() => handleAdd(product)}
                            disabled={!isAuthenticated()}
                            className={`w-full py-2 px-4 rounded ${
                                isAuthenticated()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isAuthenticated() ? 'Agregar al Carrito' : 'Iniciar sesión'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;