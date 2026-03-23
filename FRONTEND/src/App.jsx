import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

// ─── CONTEXTOS Y SEGURIDAD ──────────────────────────────────────
import { useAuth } from "./context/AuthContext";

// ─── COMPONENTES BASE (Layout) ──────────────────────────────────
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ─── PÁGINAS PRINCIPALES DEL CLIENTE ────────────────────────────
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Promotions from "./pages/Promotions";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Brands from "./pages/Brands";
import AboutUs from "./pages/AboutUs";

// ─── PÁGINAS DE GESTIÓN DE CUENTA ────────────────────────────────
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

// ─── PÁGINAS DEL PANEL DE CONTROL EMPRESARIAL (BACKOFFICE) ───────
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminBrands from "./pages/admin/AdminBrands";

import AdminMessages from "./pages/AdminMessages";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";

/**
 * HOC protector de rutas Privadas (Solo Administradores)
 */
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Cargando...</div>;
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
    return isAdmin ? children : <Navigate to="/login" replace />;
};

/**
 * HOC protector para Usuarios Logueados Básicos.
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/about" element={<AboutUs />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Protegidas (Requieren Login) */}
          <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/checkout-success" element={
              <PrivateRoute><CheckoutSuccess /></PrivateRoute>
          } />

          {/* Rutas Protegidas (Solo Admin) */}
          <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
          }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Ruta 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          duration: 4000,
          style: {
              background: '#fffbeb',
              color: '#1f2937',
              border: '1px solid rgba(245,158,11,0.5)'
          }
        }} 
      />
    </div>
  );
}

export default App;
