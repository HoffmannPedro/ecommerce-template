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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
    <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Productos</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <li key={product.id} className="border p-4 rounded-lg shadow-md bg-white">
                    <h3 className="text-lg text-black font-semibold">{product.name}</h3>
                    <p className="text-gray-700">${product.price}</p>
                    <p className="text-gray-500 text-sm">Categoría: {product.categoryName}</p>
                    <button 
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
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