/**
 * @file Cart.jsx
 * @description Vista del Carrito de Compras del Usuario.
 * Muestra los artículos añadidos, sus subtotales, permite gestionar (cambiar cantidad o eliminar)
 * y resume el ticket de compra enviando el checkout hacia el backend al confirmar.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const Cart = () => {
  // Extrae de los Contextos Globales el estado y las mecánicas 
  const { cart, removeFromCart, updateItemQuantity, checkout } = useCart();
  const { user } = useAuth();
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_MEDIA_URL || "http://127.0.0.1:8000";

  /**
   * Procesa la solicitud delegada al backend de Confirmación/Generación de Orden
   */
  const handleCheckout = async () => {
    try {
      await checkout();                   // Vacía carrito remoto y genera Orden en BD
      navigate("/profile?tab=orders");    // Redirige al panel tab de órdenes del cliente en su perfil
    } catch (error) {
      // Los errores (ej. stock insuficiente) ya son handled por los toasts del CartContext
      console.error("Falló el checkout en UI");
    }
  };

  /**
   * Formateador auxiliar del componente para UI monetaria (USD)
   */
  const formatPrice = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // ─── EARLY RETURNS DE RENDERIZADO ──────────────────────────────────

  // Si no está el usuario Auth bloquea la ruta y le pide que ingrese
  if (!user) {
    return (
      <div className="bg-amber-50 min-h-[80vh] flex items-center justify-center pt-28 px-4">
        <div className="bg-white border border-amber-300 p-10 rounded-2xl text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200">
            <ShoppingBag className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceso Requerido</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Necesitas iniciar sesión en tu cuenta para poder gestionar tu carrito de compras y ver los productos guardados.
          </p>
          <div className="space-y-4">
            <Link to="/login" className="block w-full">
               <Button variant="primary" size="full" className="w-full">
                 Iniciar Sesión
               </Button>
            </Link>
            <Link to="/register" className="block w-full">
                <Button variant="outline" size="full" className="w-full">
                   Crear una cuenta
                </Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si la sesión es válida pero el Backend retorna un carrito con arr vacío `cart.items === 0` o un `null` en el carrito persistible local
  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-amber-50 min-h-[80vh] flex flex-col items-center justify-center pt-28 px-4">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border border-amber-300 shadow-inner mb-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <ShoppingBag className="h-16 w-16 text-amber-500/50" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Tu carrito está vacío</h2>
        <p className="text-gray-600 text-lg mb-10 text-center max-w-md">
          Aún no has agregado ninguna herramienta o material a tu carrito de compras.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" icon={ArrowRight}>
            Volver al Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  // ─── RENDER PRINCIPAL ──────────────────────────────────────────────

  return (
    <div className="bg-amber-50 min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Cabecera Título */}
        <div className="flex items-center space-x-4 mb-10 border-b border-amber-200 pb-6">
            <div className="bg-amber-500 p-3 rounded-lg shadow-lg shadow-amber-500/20">
                <ShoppingBag className="text-gray-900 h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Carrito de Compras</h1>
                <p className="text-amber-600 mt-1 font-medium">{cart.items.reduce((acc, item) => acc + item.quantity, 0)} artículo(s) seleccionados</p>
            </div>
        </div>

        {/* Layout Dividido 2-Column Desktop: Resumen Izq / Recibo Der */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
          {/* LADO IZQUIERDO: DETALLE ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabecera de Columna Semántica para Lector UI */}
            <div className="bg-white text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3 rounded-t-xl hidden sm:grid sm:grid-cols-12 gap-4 border-b border-amber-200">
                <div className="col-span-6">Producto</div>
                <div className="col-span-3 text-center">Cantidad</div>
                <div className="col-span-3 text-right">Subtotal</div>
            </div>

            {/* Mapeo del Array que llega desde el Serializer */}
            {cart.items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-amber-300 rounded-xl p-4 sm:p-6 shadow-md hover:border-amber-500/30 transition-colors flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center"
              >
                {/* 1. Descripción visual del Item (Izquierda col 1 a 6) */}
                <div className="col-span-6 flex items-center w-full">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-amber-50 rounded-lg border border-amber-200 p-2 overflow-hidden flex items-center justify-center relative">
                    {/* Badge Sale si el Contexto inyecta producto en promo */}
                    {item.product.is_on_sale && item.product.discount_percentage > 0 && (
                        <div className="absolute top-0 right-0 bg-red-500 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10">
                            -{item.product.discount_percentage}%
                        </div>
                    )}
                    <img
                      src={item.product.image?.startsWith('http') ? item.product.image : `${API_URL}${item.product.image}`}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <Link to={`/products/${item.product.id}`} className="block text-lg font-bold text-gray-900 hover:text-amber-600 transition-colors mb-1">
                        {item.product.name}
                    </Link>
                    
                    {/* Subprecio por unidad aclaratorio */}
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-amber-600 font-semibold">{formatPrice(item.product.sale_price || item.product.price)}</span>
                        {(item.product.is_on_sale && item.product.discount_percentage > 0) && (
                            <span className="text-gray-500 line-through text-sm">{formatPrice(item.product.price)}</span>
                        )}
                        <span className="text-gray-600 text-sm">c/u</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 flex items-center font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Eliminar
                    </button>
                  </div>
                </div>

                {/* 2. Botones Incrementador (Centro col 7 a 9) */}
                <div className="col-span-3 flex justify-center w-full sm:w-auto border-t border-b border-amber-200 sm:border-0 py-4 sm:py-0">
                  <div className="flex items-center bg-amber-50 rounded-xl border border-amber-200 p-1 shadow-inner">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1} // No bajar de 1, es preferible "eliminar" para ir a 0
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-gray-900 font-bold text-lg select-none">
                        {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      // Validación contra el stock tope que haya en BD
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Total Final del Ítem (Derecha col 10 a 12) */}
                <div className="col-span-3 text-right w-full sm:w-auto">
                    <div className="sm:hidden text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Subtotal Item</div>
                    <span className="text-xl font-bold text-gray-900">
                        {formatPrice(item.subtotal)}
                    </span>
                </div>
              </div>
            ))}
            
            {/* Continuar Comprando Ghost Button */}
            <div className="pt-4">
                <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-amber-600 font-medium transition-colors">
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Seguir explorando
                </Link>
            </div>
          </div>

          {/* LADO DERECHO: CONSOLIDADOR ORDER CHECKOUT SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xl sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                  Resumen de Compra
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal parcial</span>
                  <span className="font-medium text-gray-900">{formatPrice(cart.total)}</span>
                </div>
                {/* Desglose ilustrativo (pueden venir del server después) */}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Descuentos aplicados</span>
                  <span className="text-green-400">Incluidos en precios</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Costo de envío estimado</span>
                  <span>Por calcular</span>
                </div>
              </div>
              
              <div className="border-t border-amber-300 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total Final</span>
                  <div className="text-right">
                      <span className="text-3xl font-extrabold text-amber-500 block leading-none">{formatPrice(cart.total)}</span>
                      <span className="text-xs text-gray-500 relative top-1">Impuestos incluidos si aplican</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                size="full" 
                onClick={handleCheckout} 
                className="w-full shadow-amber-500/25 flex items-center justify-center"
              >
                Procesar Orden Seguro <ShieldCheck className="ml-2 h-5 w-5" />
              </Button>

              <div className="mt-6 flex justify-center space-x-2">
                  {/* Decorativos de Tarjetas */}
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-gray-900 uppercase opacity-50">VISA</div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-gray-900 uppercase opacity-50">MC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
