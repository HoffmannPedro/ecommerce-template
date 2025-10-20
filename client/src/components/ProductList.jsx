import { useEffect, useState } from 'react';
import {useCart} from '../contexts/CartContext.jsx';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const {addToCart} = useCart();

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then(response => {
                if (!response.ok) throw new Error('Error fetching products');
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
        return (
            <div className="mt-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto text-center">
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
                <div className="mt-4 text-gray-600">Cargando productos...</div>;
            </div>
        )
    }
    if (error) {
        return (
            <div className="mt-8 p-6 border rounded-lg bg-red-50 max-w-2xl mx-auto text-center">
                <div className="text-red-600 font-semibold">Error: {error}</div>;
                <button 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick ={() => window.location.reload()}
                >
                    Reintentar
                </button>
            </div>
        );
    }


    return (
    <div className="p-6 mt-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Productos</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
                <li key={product.id} className="border rounded-lg shadow p-4 bg-white hover:shadow-xl transition-shadow">
                    <img 
                        src={product.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={product.name} 
                        className='w-full h-48 object-cover rounded mb-4'
                    />
                    <h3 className="text-lg text-black font-semibold">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                    <p className="text-gray-500">Categoría: {product.categoryName}</p>
                    <button 
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" 
                        onClick={() => addToCart(product)}
                    >
                        Agregar al carrito
                    </button>
                </li>
            ))}
        </ul>
    </div>
);
}