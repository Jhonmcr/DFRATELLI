import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, ShoppingCart, Menu, X, User, LogOut, Bell } from 'lucide-react';
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
    // Fetch Categories
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

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('admin/stats/');
          setNotifications(res.data.critical_notifications || 0);
          setNotifData(res.data);
        } catch (error) {
          console.error("Error fetching notifications", error);
        }
      };
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const handleNotificationClick = async (link) => {
    // 1. Close dropdown
    setShowDropdown(false);
    
    // 2. Optimistically clear the critical notification badge locally
    setNotifications(0);
    
    // 3. Inform the backend to mark them as read
    try {
      await api.post('admin/stats/');
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
    
    // Note: We deliberately do NOT clear the `notifData.notifications_list` here 
    // because we want the history to remain visible the next time the user clicks 
    // the bell, even though the red unread badge will be gone.
  };

  return (
    <nav className="fixed w-full z-50 bg-[#1a0a00] border-b border-orange-900/30 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <Link to="/" className="flex items-center gap-2 cursor-pointer group">
        <Wrench className="w-8 h-8 text-amber-500 group-hover:rotate-12 transition-transform" />
        <span className="text-2xl font-bold tracking-wider text-white">
          D<span className="text-amber-500">FRATELLI</span>
        </span>
      </Link>
      
      <div className="hidden md:flex gap-8 font-medium tracking-wide items-center">
        <Link to="/products" className={`transition-colors ${isActive('/products') && !location.search.includes('category') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Productos</Link>
        
        {/* Categorías Dropdown */}
        <div className="relative" onMouseLeave={() => setShowCategoryMenu(false)}>
          <button 
            onMouseEnter={() => setShowCategoryMenu(true)}
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`transition-colors flex items-center gap-1 ${showCategoryMenu || location.search.includes('category') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}
          >
            Categorías
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          
          {showCategoryMenu && categories.length > 0 && (
            <div className="absolute top-full left-0 pt-4 w-56 z-50 transition-all">
              <div className="bg-[#1a0a00] border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex flex-col">
                  {categories.slice(0, 10).map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/products?category=${cat.id}`}
                      onClick={() => setShowCategoryMenu(false)}
                      className="px-4 py-3 hover:bg-amber-900/30 text-slate-300 hover:text-amber-400 border-b border-amber-900/30 transition-colors flex items-center gap-3"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/promotions" className={`transition-colors ${isActive('/promotions') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Promociones</Link>
        <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Servicios</Link>
        <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Contacto</Link>
        {user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' ? (
          <Link to="/admin" className={`transition-colors ${isActive('/admin') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>
            Panel Admin
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications Bell for Admins */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
              className="relative text-slate-300 hover:text-amber-400 transition-colors group focus:outline-none"
            >
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {showDropdown && notifData && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                   <h4 className="text-white font-bold">Notificaciones</h4>
                   <p className="text-xs text-slate-400">Tienes {notifications} alertas pendientes</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {(!notifData?.notifications_list || notifData.notifications_list.length === 0) ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        No hay notificaciones en el historial.
                      </div>
                    ) : (
                      <div className="flex flex-col">
                         {notifData?.notifications_list && notifData.notifications_list.map((notif) => (
                           <Link key={notif.id} to={notif.link} onClick={() => handleNotificationClick(notif.link)} className="p-4 hover:bg-slate-800/80 transition-colors border-b border-slate-800 flex items-start gap-3 cursor-pointer">
                             <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                               <Bell className="w-4 h-4" />
                             </div>
                             <div>
                               <p className="text-sm text-white font-medium">{notif.title}</p>
                               <p className="text-xs text-slate-400 mt-1">{notif.description}</p>
                             </div>
                           </Link>
                         ))}
                      </div>
                    )}
                </div>
                <Link to="/admin" onClick={() => setShowDropdown(false)} className="block p-3 text-center text-sm text-amber-500 hover:text-amber-400 hover:bg-slate-800/50 transition-colors font-medium border-t border-slate-800 cursor-pointer">
                  Ir al Dashboard
                </Link>
              </div>
            )}
          </div>
        )}

        <Link to="/cart" className="relative text-slate-300 hover:text-amber-400 transition-colors group">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
            0
          </span>
        </Link>
        
        {user ? (
          <button onClick={logout} className="text-slate-300 hover:text-amber-400 transition-colors group relative" title="Cerrar Sesión">
            <LogOut className="w-6 h-6" />
          </button>
        ) : (
          <Link to="/login" className="text-slate-300 hover:text-amber-400 transition-colors group relative" title="Iniciar Sesión">
            <User className="w-6 h-6" />
          </Link>
        )}

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-300 focus:outline-none">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ─── MOBILE MENU ─── */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1a0a00] border-t border-amber-900/30 flex flex-col p-4 shadow-xl z-40">
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-amber-900/30 ${isActive('/products') && !location.search.includes('category') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Productos</Link>
          <div className="py-4 border-b border-amber-900/30">
            <span className="text-slate-500 font-semibold mb-2 block uppercase text-xs tracking-wider">Categorías</span>
            <div className="flex flex-col gap-3 pl-4">
              {categories.slice(0, 5).map((cat) => (
                <Link key={cat.id} to={`/products?category=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400 text-sm">{cat.name}</Link>
              ))}
            </div>
          </div>
          <Link to="/promotions" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-amber-900/30 ${isActive('/promotions') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Promociones</Link>
          <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-amber-900/30 ${isActive('/services') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Servicios</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-amber-900/30 ${isActive('/contact') ? 'text-amber-500 font-bold' : 'text-slate-300 hover:text-amber-400'}`}>Contacto</Link>
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-amber-900/30 text-amber-500 font-bold">Panel Admin</Link>
          )}
        </div>
      )}
    </nav>
  );
}
