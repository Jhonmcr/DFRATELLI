/**
 * @file api.js
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globalmente (ej: Token Expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expirado o inválido. Cerrando sesión...");
      const hadToken = !!localStorage.getItem('accessToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Recargar la página limpia si teníamos token para que el Home y rutas públicas se rehagan sin token
      if (hadToken) {
         window.location.reload();
      }
      // La redirección a /login ya la manejan AdminRoute y PrivateRoute en App.jsx
    }
    return Promise.reject(error);
  }
);

export default api;
