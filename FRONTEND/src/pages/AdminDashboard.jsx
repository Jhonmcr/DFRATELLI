import React, { useState, useEffect, useContext } from 'react';
import { ShieldCheck, Users, Box, TrendingUp, Tag, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_users: 0,
    active_products: 0,
    total_sales: 0,
    critical_notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('admin/stats/');
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Panel de <span className="text-amber-500">Administración</span></h1>
        <p className="text-slate-400">Bienvenido de vuelta, {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}. Nivel de acceso: <strong className="text-amber-400">{user?.role}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-glass border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
          <div className="bg-amber-500/10 p-4 rounded-full text-amber-500"><Users className="w-6 h-6" /></div>
          <div>
            <h3 className="text-slate-400 text-sm">Usuarios Totales</h3>
            <p className="text-3xl font-bold text-white">{stats.total_users}</p>
          </div>
        </div>
        <div className="bg-glass border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
          <div className="bg-amber-500/10 p-4 rounded-full text-amber-500"><Box className="w-6 h-6" /></div>
          <div>
            <h3 className="text-slate-400 text-sm">Productos Activos</h3>
            <p className="text-3xl font-bold text-white">{stats.active_products}</p>
          </div>
        </div>
        <div className="bg-glass border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
          <div className="bg-amber-500/10 p-4 rounded-full text-amber-500"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <h3 className="text-slate-400 text-sm">Ventas Confirmadas</h3>
            <p className="text-3xl font-bold text-white">${stats.total_sales.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-glass border border-slate-800 rounded-xl p-6 flex items-center gap-4 hover:border-red-500/30 transition-colors">
          <div className="bg-red-500/10 p-4 rounded-full text-red-500"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <h3 className="text-slate-400 text-sm">Notificaciones</h3>
            <p className="text-3xl font-bold text-white">{stats.critical_notifications}</p>
          </div>
        </div>
      </div>

      <div className="bg-glass border border-slate-800 rounded-xl p-6">
         <h2 className="text-2xl font-bold text-white mb-6">Acceso Rápido</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/products" className="py-4 text-center border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
               Gestionar Productos
            </Link>
            <Link to="/admin/orders" className="py-4 text-center border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
               Revisar Órdenes
            </Link>
            <Link to="/admin/brands" className="py-4 flex items-center justify-center gap-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
               <Tag className="w-4 h-4" /> Gestionar Marcas
            </Link>
            <Link to="/admin/messages" className="py-4 flex items-center justify-center gap-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
               <Mail className="w-4 h-4" /> Mensajes de Contacto
            </Link>
            <Link to="/admin/users" className="py-4 flex items-center justify-center gap-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
               <Users className="w-4 h-4" /> Ver Usuarios
            </Link>
            {user?.role === 'SUPERADMIN' && (
              <Link to="/admin/settings" className="py-4 text-center border border-amber-600/50 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 font-medium rounded-lg transition-colors shadow-neon block">
                 Configuraciones de Sistema
              </Link>
            )}
         </div>
      </div>
    </div>
  );
}
