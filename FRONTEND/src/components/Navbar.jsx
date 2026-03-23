import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Search, ShoppingCart, Menu, User, LogOut, Bell, ChevronDown, X, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifData, setNotifData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('products/categories/');
        setCategories(res.data.results || res.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();

    // Re-fetch when a new category is created from AdminProducts
    const handleCategoriesUpdated = () => fetchCategories();
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
  }, []);

  useEffect(() => {
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get('admin/stats/');
        const newStats = res.data;
        setNotifData(newStats);

        // Check against localStorage to see if there are NEW items since last seen
        const lastSeen = JSON.parse(localStorage.getItem('adminLastSeenStats')) || { unread_messages: 0, pending_orders: 0 };
        
        let newNotifsCount = 0;
        // Solo alertamos si el numero actual es MAYOR al ultimo que vimos
        if (newStats.unread_messages > lastSeen.unread_messages) {
           newNotifsCount += (newStats.unread_messages - lastSeen.unread_messages);
        }
        if (newStats.pending_orders > lastSeen.pending_orders) {
           newNotifsCount += (newStats.pending_orders - lastSeen.pending_orders);
        }
        
        setNotifications(newNotifsCount);

      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]); 

  const handleNotificationClick = async () => {
    setShowDropdown(false);
    setNotifications(0);
    
    // Save current counts to localStorage as "seen"
    if (notifData) {
       localStorage.setItem('adminLastSeenStats', JSON.stringify({
          unread_messages: notifData.unread_messages || 0,
          pending_orders: notifData.pending_orders || 0
       }));
    }

    try {
      await api.post('admin/stats/');
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  return (
    <nav className="absolute w-full z-50 bg-glass py-4 px-4 sm:px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-2 cursor-pointer group relative z-50">
        <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 group-hover:rotate-12 transition-transform shrink-0" />
        <span className="text-lg sm:text-2xl font-bold tracking-wider text-gray-900 truncate max-w-[120px] sm:max-w-none">
          D<span className="text-amber-500">FRATELLI</span>
        </span>
      </Link>
      
      <div className="hidden lg:flex items-center gap-8 text-slate-300 font-medium tracking-wide">
        <Link to="/catalog" className="hover:text-amber-400 transition-colors">Catálogo</Link>
        
        {/* Dropdown Categorías */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer">
            Categorías <ChevronDown className="w-4 h-4" />
          </span>
          
          <div className="absolute top-full left-0 mt-0 pt-2 w-48 z-50 transition-all duration-200 origin-top opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
             <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-2">
               {categories.length > 0 ? categories.map((cat) => (
                 <Link 
                   key={cat.id} 
                   to={`/catalog?category=${cat.id}`}
                   className="block px-4 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                 >
                   {cat.name}
                 </Link>
               )) : (
                 <div className="px-4 py-2 text-sm text-slate-500">Sin categorías disponibles</div>
               )}
             </div>
          </div>
        </div>

        <Link to="/promotions" className="hover:text-amber-400 transition-colors">Promociones</Link>
        <Link to="/services" className="hover:text-amber-400 transition-colors">Servicios</Link>
        <Link to="/contact" className="hover:text-amber-400 transition-colors">Contacto</Link>
        {user?.isAuthenticated && user?.role === 'CLIENT' && (
          <Link to="/mis-compras" className="hover:text-amber-400 transition-colors">Mis Compras</Link>
        )}
        {/* Role-based Admin Link */}
        {user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' ? (
          <Link to="/admin" className="hover:text-amber-400 transition-colors">
            Panel Admin
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 relative z-50">
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-gray-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {showDropdown && notifData && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                   <h4 className="text-gray-900 font-bold">Notificaciones</h4>
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
                               <p className="text-sm text-gray-900 font-medium">{notif.title}</p>
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

        {/* Cart - only for non-admin users */}
        {(!user?.role || user?.role === 'CLIENT') && (
        <Link to="/cart" className="relative text-slate-300 hover:text-amber-400 transition-colors group">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
            {cartCount}
          </span>
        </Link>
        )}
        
        {user ? (
          <>
            <Link to="/configuracion" className="text-slate-300 hover:text-amber-400 transition-colors" title="Configuración de Cuenta">
              <Settings className="w-6 h-6" />
            </Link>
            <button onClick={handleLogout} className="text-slate-300 hover:text-amber-400 transition-colors group relative" title="Cerrar Sesión">
              <LogOut className="w-6 h-6" />
            </button>
          </>
        ) : (
          <Link to="/login" className="text-slate-300 hover:text-amber-400 transition-colors group relative" title="Iniciar Sesión">
            <User className="w-6 h-6" />
          </Link>
        )}

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="lg:hidden text-slate-300 hover:text-amber-400 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Popup */}
      <div className={`absolute top-full right-4 sm:right-6 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-40 transition-all duration-300 origin-top-right lg:hidden overflow-hidden ${isMobileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
         <div className="flex flex-col p-4 max-h-[75vh] overflow-y-auto">
            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-amber-400 transition-colors p-3 rounded-lg hover:bg-slate-800 border-b border-slate-800/50">Catálogo</Link>
            
            <div className="flex flex-col py-3 border-b border-slate-800/50">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-wider px-3 mb-2">Categorías</span>
              <div className="flex flex-col gap-1 px-3">
                {categories.length > 0 ? categories.map(cat => (
                  <Link key={cat.id} to={`/catalog?category=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-slate-400 hover:text-amber-400 transition-colors py-2 px-3 rounded hover:bg-slate-800/50">
                    {cat.name}
                  </Link>
                )) : (
                  <span className="text-sm text-slate-500 px-3 py-2">Sin categorías</span>
                )}
              </div>
            </div>

            <Link to="/promotions" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-amber-400 transition-colors p-3 rounded-lg hover:bg-slate-800 border-b border-slate-800/50">Promociones</Link>
            <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-amber-400 transition-colors p-3 rounded-lg hover:bg-slate-800 border-b border-slate-800/50">Servicios</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-amber-400 transition-colors p-3 rounded-lg hover:bg-slate-800 border-b border-slate-800/50">Contacto</Link>
            
            {user?.isAuthenticated && user?.role === 'CLIENT' && (
              <Link to="/mis-compras" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-amber-500 hover:text-amber-400 transition-colors p-3 rounded-lg hover:bg-slate-800 border-b border-slate-800/50">Mis Compras</Link>
            )}

            {user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' ? (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors p-3 rounded-lg mt-2 text-center shadow-neon">Panel Admin</Link>
            ) : null}
         </div>
      </div>
    </nav>
  );
}
