/**
 * @file App.jsx
 * @description Punto de entrada principal y Enrutador (Router) de React.
 * Configura los Context Providers globales, define las Rutas de navegación URL, 
 * renderiza Menú y Pie de página constantes, y aloja de forma invisible a React Toast.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Librería de notificaciones Push

// ─── CONTEXTOS (Estado Global Auth y Carrito) ──────────────────────
import { useAuth } from "./context/AuthContext";

// ─── COMPONENTES BASE A TODA PANTALLA (Layouting) ────────────────
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ─── PÁGINAS PRINCIPALES DEL CLIENTE ─────────────────────────────
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";

// ─── PÁGINAS DE GESTIÓN DE CUENTA ──────────────────────────────────
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

// ─── PÁGINAS DEL PANEL DE CONTROL EMPRESARIAL (BACKOFFICE) ───────
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

/**
 * Higher Order Component (HOC) protector de rutas Privadas de sistema.
 * Solo deja pasar al Dashboard a la cuenta con Roll ADMIN o SUPERADMIN.
 * Si alguien escribe en la barra /admin sin sesión es botado a /login.
 * 
 * @param {Object} props Componente hijo envuelto
 */
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Cargando la bóveda...</div>; // TODO: Cambiar por componente spinner base
    
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
    return isAdmin ? children : <Navigate to="/login" replace />;
};

/**
 * Higher Order Component protector para Usuarios Logueados Básicos.
 * Ejemplo: Checkout Carrito o Perfil.
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return null; // Previene flasheo
    
    return user ? children : <Navigate to="/login" replace />;
};

/**
 * Componente Raíz de inicialización
 */
function App() {
  return (
    // Fondo del cuerpo HTML base para todo el domReact
    <div className="min-h-screen bg-[#1a0f05] flex flex-col font-sans">
            
            <Navbar />

            {/* Expansor del Contenedor Principal. Toma todo el alto posible minus Footer y Navbar.*/}
            <main className="flex-grow">
              <Routes>
                
                {/* ─── RUTAS PÚBLICAS Y CLIENTES (Visibles a internet libre) ─── */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ─── RUTAS PROTEGIDAS CLIENTES (Req. Inicio Sesión) ───────── */}
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/checkout-success" element={
                    <PrivateRoute>
                        <CheckoutSuccess />
                    </PrivateRoute>
                } />

                {/* ─── RUTAS DEL BACKOFFICE / CMS DE LA TIENDA (Req. Cargo Adm) */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                     {/* 
                         Layout Anidado: Renderizan dentro de <Outlet /> de AdminLayout 
                         Toman como prefijo base la rama padre '/admin/'
                     */}
                    <Route index element={<Navigate to="/admin/dashboard" replace />} /> {/* Redirect default root de tab */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                </Route>

                {/* ─── Ruta Fallback / Capturadora para errores 404 Ciega ─── */}
                {/* TODO: Se recomienda crear un componente 404 Not Found Screen bonito */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/*
              Inyector de componente de notificaciones visuales superpuestas global.
              Queda oculto hasta que hacemos `toast.success()`
            */}
            <Toaster 
              position="bottom-right" 
              toastOptions={{ 
                duration: 4000,
                style: {
                    background: '#2a1b0a',
                    color: '#fff',
                    border: '1px solid rgba(92, 61, 17, 0.5)'
                }
              }} 
            />
          </div>
  );
}

export default App;
