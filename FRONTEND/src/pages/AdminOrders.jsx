import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, X } from 'lucide-react';
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
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Órdenes de <span className="text-amber-500">Compra</span></h1>
        <p className="text-slate-400">Revisa y gestiona los pedidos realizados por los clientes.</p>
      </div>

      <div className="bg-glass border border-slate-800 rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-4 px-4 font-medium min-w-[120px]"># Orden</th>
              <th className="py-4 px-4 font-medium">Fecha</th>
              <th className="py-4 px-4 font-medium">Estado</th>
              <th className="py-4 px-4 font-medium text-right">Total</th>
              <th className="py-4 px-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">No hay órdenes registradas.</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                   </div>
                   <span className="text-gray-900 font-medium">ORD-00{order.id}</span>
                </td>
                <td className="py-4 px-4 text-slate-400">
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
                       'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                     }`}
                   >
                     <option value="PENDING" className="bg-slate-800 text-gray-900">Pendiente</option>
                     <option value="PAID" className="bg-slate-800 text-gray-900">Pagada</option>
                     <option value="SHIPPED" className="bg-slate-800 text-gray-900">Enviada</option>
                     <option value="DELIVERED" className="bg-slate-800 text-gray-900">Completada</option>
                     <option value="CANCELLED" className="bg-slate-800 text-gray-900">Cancelada</option>
                   </select>
                </td>
                <td className="py-4 px-4 text-right text-gray-900 font-bold">${parseFloat(order.total).toFixed(2)}</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Ver Detalle">
                    <Eye className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de la Orden <span className="text-amber-500">ORD-00{selectedOrder.id}</span></h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                     <p className="text-sm text-slate-400 mb-1">ID Cliente</p>
                     <p className="text-gray-900 font-medium">#{selectedOrder.user}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                     <p className="text-sm text-slate-400 mb-1">Fecha de Registro</p>
                     <p className="text-gray-900 font-medium">{new Date(selectedOrder.created_at).toLocaleString('es-ES')}</p>
                  </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-slate-800 pb-2">Artículos Adquiridos</h3>
                   <div className="space-y-3">
                     {selectedOrder.items && selectedOrder.items.length > 0 ? (
                       selectedOrder.items.map(item => (
                         <div key={item.id} className="flex justify-between items-center bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0 flex justify-center items-center">
                                 {item.product_image ? (
                                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                 ) : (
                                    <ShoppingBag className="w-5 h-5 text-slate-500" />
                                 )}
                              </div>
                              <div>
                                <p className="text-gray-900 font-medium">{item.product_name}</p>
                                <p className="text-sm text-slate-400">Cant: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                              </div>
                           </div>
                           <p className="text-amber-500 font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                         </div>
                       ))
                     ) : (
                       <p className="text-slate-500 text-sm">No hay detalles de artículos disponibles.</p>
                     )}
                   </div>
                </div>

                <div className="flex justify-between items-center bg-amber-500/10 p-4 rounded-lg border border-amber-500/30 mt-4">
                   <p className="text-slate-300">Total Liquidado</p>
                   <p className="text-2xl font-bold text-amber-500">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                </div>

              </div>
              <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-900 font-bold rounded-lg transition-colors">
                  Cerrar
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
