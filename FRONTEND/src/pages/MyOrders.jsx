/**
 * @file MyOrders.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect, useContext } from 'react';
import { ShoppingBag, CheckCircle, Clock, XCircle, Package, Bell, Send } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientNotifs, setClientNotifs] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await api.get('orders/');
          const data = response.data.results || response.data;
          setOrders(data);
          if (data.length > 0) {
            setSelectedOrder(data[0]);
          }
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/>Completada</span>;
      case 'PAID':
        return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/>Pagada</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Package className="w-3 h-3"/>Enviada</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/>Cancelada</span>;
      default:
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/>En Proceso</span>;
    }
  };

  return (
    <div className="py-12 px-4 md:px-12 max-w-7xl mx-auto w-full flex-grow flex flex-col pt-28">
      <div className="mb-8 pl-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis <span className="text-amber-500">Compras</span></h1>
        <p className="text-slate-400">Historial de tus órdenes y estado de procesamiento.</p>
      </div>

      {clientNotifs.length > 0 && (
        <div className="mb-6 space-y-3 px-2">
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
           <ShoppingBag className="w-16 h-16 text-slate-600 mb-4" />
           <h3 className="text-2xl font-bold text-gray-900 mb-2">Aún no tienes compras</h3>
           <p className="text-slate-400">Cuando realices tú primer pedido aparecerá aquí.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[70vh] min-h-[500px]">
          {/* Sidebar - Lista de Órdenes */}
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col border-r border-slate-700 bg-slate-900/40">
             <div className="p-5 border-b border-slate-800 bg-slate-800/20">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <ShoppingBag className="w-3 h-3 text-amber-500" /> Historial ({orders.length})
               </p>
             </div>
             <div className="overflow-y-auto flex-1 custom-scrollbar">
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-6 border-b border-slate-800 transition-all flex flex-col gap-2 ${
                      selectedOrder?.id === order.id
                        ? 'bg-amber-500/5'
                        : 'hover:bg-slate-800/30'
                    } group relative`}
                  >
                    {selectedOrder?.id === order.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    )}
                    <div className="flex justify-between items-center mb-1">
                       <span className={`text-sm font-black tracking-tight ${selectedOrder?.id === order.id ? 'text-amber-500' : 'text-gray-900'}`}>
                         #ORD-00{order.id}
                       </span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase">
                         {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                       </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {getStatusBadge(order.status)}
                      <span className="text-sm font-bold text-gray-900">
                        ${parseFloat(order.total).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Panel de Detalle */}
          <div className="flex-1 flex flex-col relative bg-slate-900/20">
            {selectedOrder ? (
              <>
                {/* Header del Detalle */}
                <div className="p-8 md:p-10 border-b border-slate-800 bg-slate-800/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Pedido <span className="text-amber-500">#ORD-00{selectedOrder.id}</span></h2>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        Generada el {new Date(selectedOrder.created_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Inversión Total</p>
                      <p className="text-5xl font-black text-amber-500 tracking-tighter shadow-text">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                   </div>
                </div>

                {/* Lista de Productos del Detalle */}
                <div className="p-8 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                     <Package className="w-4 h-4 text-amber-500" /> Detalle de Mercancía
                   </h4>
                   <div className="grid grid-cols-1 gap-4">
                     {selectedOrder.items && selectedOrder.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center gap-8 bg-slate-800/10 p-6 rounded-3xl border border-slate-800/50 hover:border-amber-500/20 transition-all group">
                           <div className="w-24 h-24 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-3 overflow-hidden border border-slate-700/50 group-hover:border-amber-500/30 transition-all shadow-xl">
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" title={item.product.name} />
                              ) : (
                                <ShoppingBag className="w-10 h-10 text-slate-700 opacity-20" />
                              )}
                           </div>
                           <div className="flex-1 text-center sm:text-left">
                              <p className="text-2xl font-black text-gray-900 mb-1 leading-tight">{item.product?.name || 'Producto'}</p>
                              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 opacity-70 line-clamp-2">
                                {item.product?.description || 'Sin especificaciones técnicas disponibles.'}
                              </p>
                              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                <span className="text-[10px] font-bold text-slate-400 px-3 py-1.5 bg-slate-800/40 rounded-full border border-slate-700/50 uppercase tracking-widest">Cant: <strong className="text-amber-500">{item.quantity}</strong></span>
                                <span className="text-[10px] font-bold text-slate-400 px-3 py-1.5 bg-slate-800/40 rounded-full border border-slate-700/50 uppercase tracking-widest">Precio: <strong className="text-gray-900">${parseFloat(item.price).toFixed(2)}</strong></span>
                              </div>
                           </div>
                           <div className="text-right mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto">
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Importe Bruto</p>
                              <p className="text-3xl font-black text-gray-900 tracking-tighter">${(item.quantity * item.price).toFixed(2)}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                </div>

                {/* Footer del Detalle - Acciones de Pago */}
                {selectedOrder.status === 'PENDING' && (
                  <div className="p-8 md:p-10 border-t border-slate-800 bg-slate-800/20 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                      <div className="text-center lg:text-left flex items-start gap-6">
                         <div className="bg-amber-500 text-slate-900 p-4 rounded-3xl mt-1 hidden sm:block shadow-amber-500/20 shadow-lg">
                            <Clock className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">Esperando Confirmación</p>
                            <p className="text-sm text-slate-400 max-w-lg leading-relaxed font-medium">Hemos recibido tu solicitud. Para habilitar la facturación y el despacho inmediato, por favor reporta tu comprobante de pago vía WhatsApp.</p>
                         </div>
                      </div>
                      <a 
                        href={`https://wa.me/584242334809?text=Hola,%20acabo%20de%20realizar%20la%20orden%20%23ORD-00${selectedOrder.id}%20por%20un%20valor%20de%20$${parseFloat(selectedOrder.total).toFixed(2)}.%20Deseo%20confirmar%20el%20pago.`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full lg:w-auto px-10 py-5 bg-green-500 hover:bg-green-400 text-slate-900 font-black rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] flex items-center justify-center gap-4 text-xl uppercase tracking-tighter"
                      >
                        Validar Pago Ahora <Send className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-12 text-center">
                <div className="w-32 h-32 bg-slate-800/30 rounded-full flex items-center justify-center mb-8 border border-slate-700/50">
                  <ShoppingBag className="w-16 h-16 opacity-10" />
                </div>
                <h3 className="text-2xl font-black opacity-20 uppercase tracking-[0.3em] mb-2">Selección Requerida</h3>
                <p className="text-sm font-bold opacity-10 uppercase tracking-widest">Elige un pedido del historial para visualizar su trazabilidad</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
