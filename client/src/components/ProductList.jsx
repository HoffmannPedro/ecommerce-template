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

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;


    return (
    <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Productos</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <li key={product.id} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                    <img 
                        src={product.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={product.name} 
                        className='w-full h-48 object-cover rounded mb-4'
                    />
                    <h3 className="text-lg text-black font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                    <p className="text-gray-500 text-sm mb-4">Categoría: {product.categoryName}</p>
                    <button 
                        className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" 
                        onClick={() => addToCart(product)}
                    >
                        Agregar al Carrito
                    </button>
                </li>
            ))}
        </ul>
    </div>
);
}