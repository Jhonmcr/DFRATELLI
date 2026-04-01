/**
 * @file AdminDashboard.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect, useContext } from 'react';
import { ShieldCheck, Users, Box, TrendingUp, Tag, Mail, Zap, ShoppingBag } from 'lucide-react';
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
    <div className="py-1 px-2 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Panel de Administración</h1>
        <p className="text-amber-600 font-medium">Bienvenido de vuelta, {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}. Nivel de acceso: <strong className="text-amber-700 underline">{user?.role}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-amber-100 rounded-2xl p-6 flex items-center gap-4 hover:border-amber-400 transition-all shadow-xl shadow-amber-900/10 group">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users className="w-6 h-6" /></div>
          <div>
            <h3 className="text-amber-600 text-xs font-bold uppercase tracking-wider">Usuarios Totales</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.total_users}</p>
          </div>
        </div>
        <div className="bg-white border border-amber-100 rounded-2xl p-6 flex items-center gap-4 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/5 group">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Box className="w-6 h-6" /></div>
          <div>
            <h3 className="text-amber-600 text-xs font-bold uppercase tracking-wider">Productos Activos</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.active_products}</p>
          </div>
        </div>
        <div className="bg-white border border-amber-100 rounded-2xl p-6 flex items-center gap-4 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/5 group">
          <div className="bg-green-50 p-4 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <h3 className="text-amber-600 text-xs font-bold uppercase tracking-wider">Ventas Confirmadas</h3>
            <p className="text-3xl font-bold text-slate-800">${stats.total_sales.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white border border-amber-100 rounded-2xl p-6 flex items-center gap-4 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/5 group">
          <div className="bg-red-50 p-4 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <h3 className="text-amber-600 text-xs font-bold uppercase tracking-wider">Notificaciones</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.critical_notifications}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-amber-100 rounded-2xl p-8 shadow-2xl">
         <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <Zap className="w-6 h-6 text-amber-500" /> Acceso Rápido
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/products" className="group p-5 text-center border border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center gap-2">
               <Box className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
               Gestionar Productos
            </Link>
            <Link to="/admin/orders" className="group p-5 text-center border border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center gap-2">
               <ShoppingBag className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
               Revisar Órdenes
            </Link>
            <Link to="/admin/brands" className="group p-5 text-center border border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center gap-2">
               <Tag className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
               Gestionar Marcas
            </Link>
            <Link to="/admin/messages" className="group p-5 text-center border border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center gap-2">
               <Mail className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
               Mensajes de Contacto
            </Link>
            <Link to="/admin/users" className="group p-5 text-center border border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center gap-2">
               <Users className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
               Ver Usuarios
            </Link>
            {user?.role === 'SUPERADMIN' && (
              <Link to="/admin/settings" className="group p-5 text-center border border-amber-400 bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex flex-col items-center gap-2">
                 <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 Configuraciones de Sistema
              </Link>
            )}
         </div>
      </div>
    </div>
  );
}
