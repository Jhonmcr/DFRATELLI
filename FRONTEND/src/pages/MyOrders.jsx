import React, { useState, useEffect, useContext } from 'react';
import { ShoppingBag, CheckCircle, Clock, XCircle, Package, Bell } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientNotifs, setClientNotifs] = useState([]);

  useEffect(() => {
    if (user?.isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const response = await api.get('orders/');
          setOrders(response.data.results || response.data);
        } catch (error) {
           console.error("Error fetching my orders", error);
           toast.error("Ocurrió un error al cargar tus compras.");
        } finally {
          setLoading(false);
        }
      };

      const fetchAndClearNotifications = async () => {
        try {
          const res = await api.get('orders/notifications/');
          if (res.data.count > 0) {
            setClientNotifs(res.data.notifications);
            // Mark all as read immediately
            await api.post('orders/notifications/');
          }
        } catch (err) {
          console.error("Error fetching client notifications", err);
        }
      };

      fetchOrders();
      fetchAndClearNotifications();
    }
  }, [user]);

  if (!user?.isAuthenticated) {
     return <Navigate to="/login" />;
  }


  const getStatusBadge = (status) => {
    switch(status) {
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/>Completada</span>;
      case 'PAID':
        return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/>Pagada</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Package className="w-3 h-3"/>Enviada</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/>Cancelada</span>;
      default:
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/>En Proceso</span>;
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-5xl mx-auto w-full flex-grow">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis <span className="text-amber-500">Compras</span></h1>
        <p className="text-slate-400">Historial de tus órdenes y estado de procesamiento.</p>
      </div>

      {/* Client notifications banner */}
      {clientNotifs.length > 0 && (
        <div className="mb-6 space-y-3">
          {clientNotifs.map(notif => (
            <div key={notif.id} className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/40 rounded-xl p-4">
              <Bell className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300 text-sm">{notif.message}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-glass border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
           <ShoppingBag className="w-16 h-16 text-slate-600 mb-4" />
           <h3 className="text-2xl font-bold text-gray-900 mb-2">Aún no tienes compras</h3>
           <p className="text-slate-400">Cuando realices tú primer pedido aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
             <div key={order.id} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-amber-500/30">
                <div className="bg-slate-800/50 p-4 md:p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Orden <span className="text-amber-500">#ORD-00{order.id}</span></h2>
                      <p className="text-sm text-slate-400">Realizada el: {new Date(order.created_at).toLocaleString('es-ES')}</p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(order.status)}
                      <p className="text-2xl font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</p>
                   </div>
                </div>
                <div className="p-4 md:p-6">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Artículos</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {order.items && order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                           <div className="w-12 h-12 bg-slate-800 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.product_image ? (
                                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-slate-500" />
                              )}
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-gray-900 font-medium truncate" title={item.product_name}>{item.product_name}</p>
                              <p className="text-sm text-amber-500">Cant: {item.quantity}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                   {order.status === 'PENDING' && (
                     <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                       <a 
                         href={`https://wa.me/584242334809?text=Hola,%20acabo%20de%20realizar%20la%20orden%20%23ORD-00${order.id}%20por%20un%20valor%20de%20$${parseFloat(order.total).toFixed(2)}.%20Aún%20deseo%20confirmar%20el%20pago.`}
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-sm px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg transition-colors font-medium flex items-center gap-2"
                       >
                         Contactar Soporte por WhatsApp para Pagar
                       </a>
                     </div>
                   )}
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
