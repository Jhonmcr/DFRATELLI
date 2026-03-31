/**
 * @file Navbar.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, ShoppingCart, Menu, X, User, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifData, setNotifData] = useState(null);
  
  // Categorías Dropdown State
  const [categories, setCategories] = useState([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('products/categories/');
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error("Error fetching categories in Navbar", err);
      }
    };
    fetchCats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('admin/stats/');
      setNotifications(res.data.critical_notifications || 0);
      setNotifData(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = async (link) => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);

    try {
      await api.post('admin/stats/');
      // Refresh count to show remaining alerts (like pending orders)
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[#1a0a00] border-b border-orange-900/30 py-3 min-[1150px]:py-3 xl:py-4 px-3 sm:px-4 min-[1150px]:px-6 xl:px-12 flex justify-between items-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-1 sm:gap-2 cursor-pointer group relative z-50 shrink-0">
        <Wrench className="w-5 h-5 min-[1150px]:w-6 min-[1150px]:h-6 xl:w-8 xl:h-8 text-amber-500 group-hover:rotate-12 transition-transform" />
        <span className="text-base min-[1150px]:text-lg xl:text-2xl font-bold tracking-wider text-white whitespace-nowrap">
          D<span className="text-amber-500">FRATELLI</span>
        </span>
      </Link>
      
      {/* DESKTOP NAVIGATION LINKS — visible from 1024px, compact until 1150px */}
      <div className="hidden lg:flex items-center gap-5 min-[1100px]:gap-5 xl:gap-8 text-[12px] min-[1050px]:text-sm xl:text-medium font-medium tracking-wide">
        <Link to="/products" className={`transition-colors whitespace-nowrap ${isActive('/products') && !location.search.includes('category') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Productos</Link>
        
        {/* Categorías Dropdown */}
        <div className="relative" onMouseLeave={() => setShowCategoryMenu(false)}>
          <button 
            onMouseEnter={() => setShowCategoryMenu(true)}
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`transition-colors flex items-center gap-0.5 whitespace-nowrap ${showCategoryMenu || location.search.includes('category') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}
          >
            Categorías <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          
          {showCategoryMenu && categories.length > 0 && (
            <div className="absolute top-full left-0 pt-3 w-48 z-50">
              <div className="bg-[#1a0a00] border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex flex-col">
                  {categories.slice(0, 10).map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/products?category=${cat.id}`}
                      onClick={() => setShowCategoryMenu(false)}
                      className="px-4 py-2.5 hover:bg-amber-900/30 text-amber-200 hover:text-amber-400 border-b border-amber-900/30 transition-colors text-sm"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/promotions" className={`transition-colors whitespace-nowrap ${isActive('/promotions') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Promociones</Link>
        <Link to="/services" className={`transition-colors whitespace-nowrap ${isActive('/services') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Servicios</Link>
        <Link to="/contact" className={`transition-colors whitespace-nowrap ${isActive('/contact') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Contacto</Link>
        
        {user && user.role === 'CLIENT' && (
          <Link to="/my-orders" className={`transition-colors whitespace-nowrap ${isActive('/my-orders') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Mis Compras</Link>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <Link to="/admin" className={`transition-colors whitespace-nowrap ${isActive('/admin') ? 'text-amber-500 font-bold' : 'text-amber-200 hover:text-amber-400'}`}>Panel Admin</Link>
        )}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-3 min-[1150px]:gap-5 xl:gap-6 relative z-50">
        
        {/* Notifications — desktop only (min-[480px]) */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <div className="hidden min-[480px]:block relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="relative text-amber-200 hover:text-amber-400 transition-colors focus:outline-none"
            >
              <Bell className="w-5 h-5 xl:w-6 xl:h-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {showDropdown && notifData && (
              <div className="absolute right-0 mt-3 w-72 bg-[#1a0a00] border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-amber-900/30 bg-amber-900/10">
                   <h4 className="text-amber-500 font-bold">Notificaciones</h4>
                   <p className="text-xs text-amber-200/60">Tienes {notifications} alertas pendientes</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {(!notifData?.notifications_list || notifData.notifications_list.length === 0) ? (
                      <div className="p-6 text-center text-amber-200/40 text-sm">
                        No hay notificaciones en el historial.
                      </div>
                    ) : (
                      <div className="flex flex-col">
                         {notifData?.notifications_list && notifData.notifications_list.map((notif) => (
                           <Link key={notif.id} to={notif.link} onClick={() => handleNotificationClick(notif.link)} className="p-4 hover:bg-amber-900/20 transition-colors border-b border-amber-900/30 flex items-start gap-3 cursor-pointer">
                             <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                               <Bell className="w-4 h-4" />
                             </div>
                             <div>
                               <p className="text-sm text-white font-medium">{notif.title}</p>
                               <p className="text-xs text-amber-200/60 mt-1">{notif.description}</p>
                             </div>
                           </Link>
                         ))}
                      </div>
                    )}
                </div>
                <Link to="/admin" onClick={() => setShowDropdown(false)} className="block p-3 text-center text-sm text-amber-500 hover:text-amber-400 hover:bg-amber-900/20 transition-colors font-medium border-t border-amber-900/30 cursor-pointer">
                  Ir al Dashboard
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Cart — hidden below 480px */}
        {(!user?.role || user?.role === 'CLIENT') && (
          <Link to="/cart" className="hidden min-[480px]:block relative text-amber-200 hover:text-amber-400 transition-colors group">
            <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6" />
            <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
              0
            </span>
          </Link>
        )}
        
        {/* Settings + Logout — hidden below 480px */}
        {user ? (
          <div className="hidden min-[480px]:flex items-center gap-2 min-[1150px]:gap-3 xl:gap-6">
            <Link to="/settings" className={`transition-colors ${isActive('/settings') ? 'text-amber-500' : 'text-amber-200 hover:text-amber-400'}`} title="Ajustes de Cuenta">
              <Settings className="w-5 h-5 xl:w-6 xl:h-6" />
            </Link>
            <button onClick={handleLogout} className="text-amber-200 hover:text-amber-400 transition-colors" title="Cerrar Sesión">
              <LogOut className="w-5 h-5 xl:w-6 xl:h-6" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="hidden min-[480px]:block text-amber-200 hover:text-amber-400 transition-colors" title="Iniciar Sesión">
            <User className="w-5 h-5 xl:w-6 xl:h-6" />
          </Link>
        )}

        {/* Hamburger — visible below 1024px */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="lg:hidden text-amber-200 hover:text-amber-400 transition-colors p-1"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* ─── MOBILE MENU DRAWER ─── */}
      <div className={`absolute top-full right-0 w-full sm:w-80 sm:right-4 mt-2 bg-[#1a0a00] border border-amber-900/30 sm:rounded-2xl shadow-2xl z-40 transition-all duration-300 origin-top-right lg:hidden overflow-hidden ${isMobileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="flex flex-col p-4 max-h-[85vh] overflow-y-auto">
          
          {/* Quick Actions */}
          <div className="min-[480px]:hidden grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-amber-900/30">
            {(!user?.role || user?.role === 'CLIENT') && (
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-amber-900/20 rounded-xl text-amber-500 font-bold text-sm">
                <ShoppingCart className="w-4 h-4" /> Carrito
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-sm">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-amber-500 rounded-xl text-slate-900 font-bold col-span-2">
                <User className="w-4 h-4" /> Iniciar Sesión
              </Link>
            )}
            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && notifications > 0 && notifData?.notifications_list && (
              <div className="col-span-2 mt-2">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2 px-1">
                  <Bell className="w-4 h-4" /> Notificaciones ({notifications})
                </div>
                {notifications > 0 && notifData?.notifications_list && (
                  <div className="flex flex-col gap-2 mt-2">
                    {notifData.notifications_list.map((notif) => (
                      <Link 
                        key={notif.id} 
                        to={notif.link} 
                        onClick={() => handleNotificationClick(notif.link)}
                        className="flex items-start gap-3 p-3 bg-amber-900/40 rounded-xl border border-amber-500/30"
                      >
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-amber-500">{notif.title}</p>
                          <p className="text-xs text-amber-200/70">{notif.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-amber-200 hover:text-amber-400 p-3 rounded-lg hover:bg-amber-900/20 border-b border-amber-900/20">Productos</Link>
          
          <div className="flex flex-col py-3 border-b border-amber-900/20">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider px-3 mb-2">Categorías</span>
            <div className="flex flex-col gap-1 px-3">
              {categories.length > 0 ? categories.slice(0, 8).map(cat => (
                <Link key={cat.id} to={`/products?category=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-amber-200/70 hover:text-amber-400 py-1.5 px-3 rounded hover:bg-amber-900/20">
                  {cat.name}
                </Link>
              )) : (
                <span className="text-sm text-amber-200/40 px-3 py-2">Sin categorías</span>
              )}
            </div>
          </div>

          <Link to="/promotions" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-amber-200 hover:text-amber-400 p-3 rounded-lg hover:bg-amber-900/20 border-b border-amber-900/20">Promociones</Link>
          <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-amber-200 hover:text-amber-400 p-3 rounded-lg hover:bg-amber-900/20 border-b border-amber-900/20">Servicios</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-amber-200 hover:text-amber-400 p-3 rounded-lg hover:bg-amber-900/20 border-b border-amber-900/20">Contacto</Link>
          
          {user && user.role === 'CLIENT' && (
            <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-amber-500 p-3 rounded-lg hover:bg-amber-900/20 border-b border-amber-900/20">Mis Compras</Link>
          )}

          {user && (
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="min-[480px]:hidden flex items-center gap-3 text-base font-medium text-amber-200 hover:text-amber-400 p-3 rounded-lg hover:bg-amber-900/20 mt-1">
              <Settings className="w-4 h-4 text-amber-500" /> Ajustes de Cuenta
            </Link>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 p-4 rounded-xl mt-4 text-center shadow-lg shadow-amber-500/20">Panel Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
