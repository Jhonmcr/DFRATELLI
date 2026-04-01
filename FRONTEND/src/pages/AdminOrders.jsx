/**
 * @file AdminOrders.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get('orders/admin/all/');
      setOrders(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`orders/${orderId}/update-status/`, { status: newStatus });
      toast.success(`Orden actualizada a: ${newStatus === 'DELIVERED' ? 'Completada' : newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error al actualizar el estado de la orden');
    }
  };

  const handleStatusChange = async (orderId, e) => {
    const newStatus = e.target.value;
    await handleUpdateStatus(orderId, newStatus);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;
  }

  return (
    <div className="py-0 px-4 md:px-6 max-w-full mx-auto w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Órdenes de Compra</h1>
        <p className="text-amber-600 font-bold text-lg">Monitorea y gestiona todos los pedidos realizados por tus clientes de forma eficiente.</p>
      </div>

      <div className="hidden md:block bg-white border border-amber-100 rounded-2xl p-6 overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-amber-100 text-slate-900 font-black uppercase text-[11px] tracking-widest">
              <th className="py-4 px-4 font-medium min-w-[120px]"># Orden</th>
              <th className="py-4 px-4 font-medium">Fecha</th>
              <th className="py-4 px-4 font-medium">Estado</th>
              <th className="py-4 px-4 font-medium text-right">Total</th>
              <th className="py-4 px-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">No hay órdenes registradas.</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                   </div>
                   <span className="text-slate-800 font-bold tracking-wider">ORD-{order.id.toString().padStart(3, '0')}</span>
                </td>
                <td className="py-4 px-4 text-slate-700 font-bold text-sm">
                   {new Date(order.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="py-2 px-4">
                   <select
                     value={order.status}
                     onChange={(e) => handleStatusChange(order.id, e)}
                     className={`px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                       order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                       order.status === 'PAID' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                       order.status === 'SHIPPED' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                       order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                       'bg-amber-100 text-amber-700 border border-amber-200'
                     }`}
                    >
                     <option value="PENDING" className="bg-white text-slate-800">Pendiente</option>
                     <option value="PAID" className="bg-white text-slate-800">Pagada</option>
                     <option value="SHIPPED" className="bg-white text-slate-800">Enviada</option>
                     <option value="DELIVERED" className="bg-white text-slate-800">Completada</option>
                     <option value="CANCELLED" className="bg-white text-slate-800">Cancelada</option>
                   </select>
                </td>
                <td className="py-4 px-4 text-right text-slate-700 font-bold">${parseFloat(order.total).toFixed(2)}</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-2 text-amber-600 hover:text-amber-400 hover:scale-110 transition-all" title="Ver Detalle">
                    <Eye className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── CARDS: visible < 768px ── */}
      <div className="md:hidden flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white border border-amber-100 rounded-2xl shadow-lg">No hay órdenes registradas.</div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white border border-amber-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-amber-50/50 transition-colors shadow-xl">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-800 font-bold text-sm block tracking-wider">ORD-{order.id.toString().padStart(3, '0')}</span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-slate-700 font-bold text-[10px]">{new Date(order.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                  order.status === 'PAID' ? 'bg-blue-500/10 text-blue-600' :
                  order.status === 'SHIPPED' ? 'bg-purple-500/10 text-purple-600' :
                  order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600' :
                  'bg-amber-500/10 text-amber-600'
                }`}>{order.status === 'DELIVERED' ? 'Completada' : order.status === 'PAID' ? 'Pagada' : order.status === 'SHIPPED' ? 'Enviada' : order.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente'}</span>
                <span className="text-amber-700 font-extrabold text-sm">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e)}
                className="text-[10px] px-2 py-1 bg-white border border-amber-200 rounded font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="PENDING">Pendiente</option>
                <option value="PAID">Pagada</option>
                <option value="SHIPPED">Enviada</option>
                <option value="DELIVERED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
              <button onClick={() => setSelectedOrder(order)} className="p-2 text-amber-600 hover:text-amber-500 transition-colors" title="Ver Detalle">
                <Eye className="w-5 h-5"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white border border-amber-100 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-amber-50 bg-amber-50/30">
                <h2 className="text-2xl font-bold text-slate-800">Detalles de la Orden <span className="text-amber-700">ORD-{selectedOrder.id.toString().padStart(3, '0')}</span></h2>
                 <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-amber-100">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Código Único</p>
                     <p className="text-slate-700 font-bold text-lg">{selectedOrder.codigo_cliente_real || 'Cargando ID...'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Teléfono Contacto</p>
                     <p className="text-slate-700 font-bold">{selectedOrder.telefono_cliente_real || 'Cargando Teléfono...'}</p>
                  </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-amber-100 pb-2 flex items-center gap-2">
                     <ShoppingBag className="w-5 h-5 text-amber-700" /> Artículos Adquiridos
                   </h3>
                   <div className="space-y-3">
                     {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map(item => (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-amber-50 shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-amber-50 rounded-xl overflow-hidden flex-shrink-0 flex justify-center items-center border border-amber-100">
                                  {item.product?.image ? (
                                     <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                                  ) : (
                                     <Package className="w-6 h-6 text-amber-400" />
                                  )}
                               </div>
                               <div>
                                 <p className="text-slate-800 font-bold leading-tight">{item.product?.name || 'Producto sin nombre'}</p>
                                 <p className="text-xs text-slate-500 font-medium mt-1">Cant: {item.quantity} x <span className="text-amber-600 font-bold">${parseFloat(item.price).toFixed(2)}</span></p>
                               </div>
                            </div>
                            <div className="flex flex-col items-end border-t sm:border-0 border-slate-50 pt-3 sm:pt-0">
                              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1 sm:hidden">Subtotal</p>
                              <p className="text-slate-900 font-black text-xl sm:text-lg">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))
                     ) : (
                       <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-xl italic">No hay detalles de artículos disponibles.</p>
                     )}
                   </div>
                </div>

                <div className="flex justify-between items-center bg-amber-500 text-white p-6 rounded-2xl shadow-lg shadow-amber-900/20">
                   <p className="font-bold uppercase tracking-widest text-xs opacity-90">Total Liquidado</p>
                   <p className="text-3xl font-black">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                </div>

              </div>
              <div className="p-6 border-t border-amber-50 bg-slate-50 flex justify-end">
                 <button onClick={() => setSelectedOrder(null)} className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-slate-900/20">
                  Cerrar
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
