/**
 * @file Navbar.jsx
 * @description Componente de navegación principal. Proporciona enlaces
 * de navegación, control del carrito de compras, y menú de usuario
 * dependiendo del estado de autenticación y rol (Cliente vs Admin).
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Package, ExternalLink, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  // Estado para controlar la visibilidad del menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Estado para detectar si la página ha hecho scroll (para cambiar estilo)
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();              // Obtiene la ruta actual
  const { user, logout } = useAuth();          // Contexto de autenticación
  const { cartCount, fetchCart } = useCart();  // Contexto del carrito

  // Efecto para actualizar el carrito si el usuario está logueado
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Efecto para escuchar el evento de scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Cambia el estado si el scroll supera los 20px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Limpieza del listener
  }, []);

  // Cierra el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Enlaces públicos y para clientes
  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/products" },
  ];

  // Enlaces exclusivos para administradores y superadministradores
  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Settings },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Órdenes", href: "/admin/orders", icon: ExternalLink },
  ];

  // Determina si el usuario actual tiene permisos de administrador
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#1a0f05]/95 backdrop-blur-md shadow-lg py-2 border-b border-[#5C3D11]/30" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo / Título de la marca */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-500 transition-all duration-300">
              DFRATELLI
            </span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Si es admin, muestra un enlace rápido al Panel de Control en lugar de todos los enlaces */}
            {isAdmin && (
               <Link
                 to="/admin/dashboard"
                 className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 font-medium transition-colors border border-orange-500/30 px-3 py-1 rounded-full bg-orange-500/10"
               >
                 <Settings className="h-4 w-4" />
                 <span>Panel Admin</span>
               </Link>
            )}
          </div>

          {/* Menú de Usuario (Desktop & Mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Ícono de Carrito (oculto para admins, ya que no compran) */}
            {!isAdmin && (
              <Link to="/cart" className="relative group text-gray-300 hover:text-orange-400 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#1a0f05] shadow-lg group-hover:bg-orange-400 transition-colors">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Opciones de perfil según estado de autenticación */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors">
                  <div className="bg-[#2a1b0a] p-1.5 rounded-full border border-[#5C3D11]">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm hidden lg:block">{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-red-400/10"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              // Botón de inicio de sesión para visitantes
              <Link
                to="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Ingresar
              </Link>
            )}
          </div>

          {/* Botón Hamburger para menú Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            {!isAdmin && (
              <Link to="/cart" className="relative text-gray-300">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#1a0f05]">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-orange-400 transition-colors p-1"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1a0f05] border-t border-[#5C3D11]/30">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-orange-400 hover:bg-[#2a1b0a] rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Enlaces de Admin en Mobile */}
            {isAdmin && (
              <div className="pt-4 mt-2 border-t border-[#5C3D11]/30">
                <p className="px-3 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">
                  Administración
                </p>
                {adminLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-3 py-3 text-base font-medium text-gray-300 hover:text-orange-400 hover:bg-[#2a1b0a] rounded-lg transition-colors"
                  >
                    <item.icon className="h-5 w-5 mr-3 text-orange-500" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Opciones de perfil en Mobile */}
            <div className="pt-4 mt-2 border-t border-[#5C3D11]/30">
              {user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-400 mb-2">
                    Conectado como <span className="font-medium text-white">{user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-3 text-base font-medium text-gray-300 hover:text-orange-400 hover:bg-[#2a1b0a] rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-3 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-center mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-lg font-medium shadow-lg shadow-orange-500/20"
                >
                  Ingresar a mi cuenta
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
