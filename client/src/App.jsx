import { Outlet, Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-gray-200 font-medium">
              Productos
            </Link>
            <Link to="/cart" className="hover:text-gray-200 font-medium">
              Carrito
            </Link>
          </div>

          <div>
            {user ? (
              <button
                onClick={logout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Cerrar sesión ({user.username})
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;