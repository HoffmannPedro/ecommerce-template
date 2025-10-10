import './App.css'

import ProductList from './components/ProductList';
import Cart from './components/Cart';

export default function App() {

  return (
    <>
      <div className='bg-blue-500 text-white p-8 rounded-lg shadow-lg'>
        <h1>Ecommerce Template</h1>
          <ProductList />
          <Cart />
      </div>
    </>
  )
}
