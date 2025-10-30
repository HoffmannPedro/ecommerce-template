import { useState } from "react";
import api from "../services/api";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // LOGIN
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.login(username, password);
            localStorage.setItem('token', token);  // Guardamos el JWT en localStorage
            setUser({ username });                 // Estado: Usuario logueado
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // REGISTER
    const register = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.register(username, password);
            localStorage.setItem('token', token);
            setUser({ username});
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // ESTÁ AUTENTICADO ?
    const isAuthenticated = () => !!localStorage.getItem('token');

    return {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
        error
    }
}

export default useAuth;