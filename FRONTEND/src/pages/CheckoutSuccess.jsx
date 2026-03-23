/**
 * @file CheckoutSuccess.jsx
 * @description Pantalla estática de Confirmación tras compra exitosa.
 * Es el landing page final del flujo del carrito de compras. Ofrece botones
 * contextuales de retorno a órdenes o catálogo.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

const CheckoutSuccess = () => {
  // A veces la data de la orden viaja a través del State del Router `navigate('/success', { state: { orderId: 123 } })`
  const location = useLocation();
  const orderData = location.state?.order;

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center pt-20 px-4">
      
      {/* ─── CAJA DIÁLOGO ─── */}
      <div className="bg-white border border-green-500/30 p-10 md:p-14 rounded-3xl text-center max-w-xl w-full shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
        
        {/* Glow verde atrás del icono */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/30 relative z-10">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">¡Compra Exitosa!</h2>
        
        <div className="mb-8">
            <p className="text-gray-700 text-lg mb-2">
                Tu solicitud ha sido procesada correctamente en nuestro sistema.
            </p>
            {/* Si enviamos ID o total por estado lo ilustramos */}
            {orderData && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm">
                    <p className="text-gray-600">Número de Orden de Seguimiento:</p>
                    <p className="text-gray-900 font-mono font-bold text-lg">#{String(orderData.id).padStart(6, '0')}</p>
                </div>
            )}
            <p className="text-gray-500 text-sm mt-4">
                En breve recibirás un correo electrónico confirmando el pago y los detalles del envío a la dirección suministrada en tu cuenta.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10 w-full">
          
          <Link to="/profile?tab=orders" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full">
              Revisar mis pedidos
            </Button>
          </Link>
          
          <Link to="/products" className="w-full sm:w-auto">
            <Button variant="primary" icon={ArrowRight} className="w-full">
              Seguir explorando
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
