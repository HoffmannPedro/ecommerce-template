import './App.css'

import ProductList from './components/ProductList';

function App() {

  return (
    <>
      <div className='bg-blue-500 text-white p-8 rounded-lg shadow-lg'>
        <h1>Ecommerce Template</h1>
          <ProductList />
      </div>
    </>
  )
}

export default App
