/**
 * @file AuthContext.jsx
 * @description Proveedor de contexto global para la autenticación de usuarios.
 * Maneja el estado de la sesión, tokens JWT, datos del perfil (decodificados
 * en el frontend o vía API), y funciones de login, registro y logout,
 * exponiendo todo a cualquier componente que consuma useAuth().
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";                 // Notificaciones emergentes
import { jwtDecode } from "jwt-decode";              // Decodificador de Payload JWT
import api from "../services/api";                   // Instancia preconfigurada de Axios

// Creación del Contexto de React
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ─── ESTADOS GLOBALES ───────────────────────────────────────────
    const [user, setUser] = useState(null);         // Obj usuario ({ id, email, role, etc. }) o null si no hay sesión
    const [loading, setLoading] = useState(true);     // Estado de carga inicial resolviendo tokens almacenados

    // ─── CICLO DE VIDA (Al montar la app) ───────────────────────────
    useEffect(() => {
        // Intenta recuperar los tokens de `localStorage` de sesiones previas
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
            try {
                // Decodifica el token sin hacer petición a red
                // El backend DRF fue configurado para incrustar { email, role, first_name } en el token
                const decodedUser = jwtDecode(accessToken);
                setUser(decodedUser);
            } catch (error) {
                console.error("Token de acceso inválido o corrupto:", error);
                // Si el token falló, limpia el storage para obligar re-autenticación
                logoutContextOnly();
            }
        }
        
        setLoading(false); // Quita pantalla de carga aunque no haya usuario (es visitante)
    }, []);

    // ─── MÉTODOS DE AUTENTICACIÓN ───────────────────────────────────

    /**
     * Realiza petición POST para inicio de sesión en el backend.
     * Si es exitosa, guarda tokens en LocalStorage, decodifica claims del usuario,
     * inyecta el token en la instancia global de axios, e hidrata el estado local.
     * 
     * @async
     * @param {Object} credentials - Credenciales de acceso
     * @param {string} credentials.email - Correo electrónico
     * @param {string} credentials.password - Contraseña plana
     * @returns {Object} Respuesta completa del servidor
     */
    const login = async (credentials) => {
        try {
            const response = await api.post("auth/login/", credentials);
            
            // Extracción de tokens generados por SimpleJWT (Backend DRF)
            const { access, refresh } = response.data;

            // Persistencia en navegador (Evita perder sesión en recargas de página F5)
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            // Se configura el token Bearer en los headers axios para peticiones subsecuentes
            api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

            // Actualiza el Contexto para disparar el re-render total de la UI protegida
            const decodedUser = jwtDecode(access);
            setUser(decodedUser);

            return response; // Para callbacks .then() en el componente View
        } catch (error) {
            console.error("Login failed:", error.response?.data || error);
            throw error; // Para atraparlo y mostrar Toast en el frontend
        }
    };

    /**
     * Realiza registro y opcionalmente inicia sesión inmediatamente.
     * 
     * @async
     * @param {Object} userData - Payload del formulario de registro
     */
    const register = async (userData) => {
        try {
            const response = await api.post("auth/register/", userData);
            return response;
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error);
            throw error;
        }
    };

    /**
     * Cierra la sesión activa actual borrando credenciales en memoria y disco.
     * 
     * Nota: No hay blacklisting de tokens backend configurado localmente; 
     * borrar de LocalStorage es suficiente para invalidar la sesión frontend.
     */
    const logout = () => {
        // Limpieza de tokens del navegador
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Limpieza de headers interceptor
        delete api.defaults.headers.common["Authorization"];
        
        // Limpieza del estado para componentes anidados
        setUser(null);
        
        toast.success("Sesión cerrada");
    };

    /**
     * Método interno usado por el Effect por si un token crashea la decodificación.
     * Es idéntico a `logout` pero no activa la notificación Toast ruidosa al montar.
     */
    const logoutContextOnly = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    // ─── PROVEEDOR ──────────────────────────────────────────────────
    return (
        // Value expone var y metodos globalmente
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {/* Si aún no resuelvo el token, renderiza un fallback en vez de flasheos */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el AuthContext fácilmente.
 * Lanza error si se intenta invocar fuera del AuthProvider.
 * 
 * @returns {Object} { user, login, register, logout, loading }
 */
export { AuthContext };
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
