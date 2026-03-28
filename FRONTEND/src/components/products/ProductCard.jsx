/**
 * @file ProductCard.jsx
 * @description Tarjeta visual individual para mostrar un resumen de un producto en el catálogo.
 * Exhibe nombre, información de stock, imagen, precio (con o sin descuento),
 * y un botón directo para enviar al carrito.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, PackageOpen, Percent } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";

/**
 * @param {Object} props
 * @param {Object} props.product Datos del producto provenientes de la API de Django DRF.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Método del contexto para agregar al carrito backend/local

  // Constante de base URL de la API (útil si las imágenes no traen ruta absoluta http://)
  const API_URL = import.meta.env.VITE_MEDIA_URL || "http://127.0.0.1:8000";

  return (
    <div className="bg-[#1a0a00] border border-amber-900/50 rounded-xl overflow-hidden hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 group flex flex-col h-full cursor-pointer">
      
      {/* ─── SECCIÓN SUPERIOR: IMAGEN E INDICADORES ─────────────────── */}
      <Link to={`/products/${product.id}`} className="relative h-56 bg-slate-800 flex items-center justify-center p-6 overflow-hidden">
        {/* Renderiza imagen o icono de caja si no hay imagen asignada */}
        {product.image ? (
          <img
            // Verifica si product.image ya incluye 'http://' (ej. S3 Object URL)
            src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <PackageOpen className="h-20 w-20 text-gray-700 group-hover:scale-110 transition-transform duration-500" />
        )}

        {/* Overlay difuminado al hacer hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>

        {/* Cintas (Badges) flotantes encima de la imagen */}
        <div className="absolute top-3 right-3">
            {/* Cinta de Descuento (Si está en oferta y tiene % mayor a 0) */}
            {product.is_on_sale && product.discount_percentage > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-500/20 flex items-center transform transition-transform group-hover:scale-105">
                    {product.discount_percentage}% OFF
                </div>
            )}
        </div>

        <div className="absolute top-3 left-3">
            {/* Cinta de Estado de Inventario */}
            {product.stock <= 0 ? (
                <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm">
                Agotado
                </span>
            ) : product.stock < 10 ? (
                <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm">
                ¡Últimos {product.stock}!
                </span>
            ) : null}
        </div>
      </Link>

      {/* ─── SECCIÓN INFERIOR: DETALLES Y ACCIÓN ────────────────────── */}
      <div className="p-5 flex flex-col flex-grow relative">
        
        {/* Borde sutil superior en la info card */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5C3D11]/50 to-transparent"></div>

        {/* Categoría (Nombre opcional mapeado si existe la relación) */}
        <div className="text-amber-500/80 text-xs font-bold uppercase tracking-wider mb-2">
          {product.category?.name || "Herramientas"}
        </div>
        
        {/* Título clickeable que lleva al detalle */}
        <Link to={`/products/${product.id}`} className="transition-colors">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Espaciador flexible para asegurar que precios y botón queden siempre al fondo */}
        <div className="flex-grow"></div>

        <div className="mt-4 pt-4 border-t border-amber-900/50 flex items-end justify-between">
          
          {/* Bloque Precio */}
          <div>
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Precio Final</p>
            <div className="flex flex-col">
              {/* Toma el sale_price dictaminado por Backend si existe descuento, si no el normal */}
              <span className="text-2xl font-extrabold text-amber-400">
                ${product.sale_price !== undefined ? product.sale_price : product.price}
              </span>
              
              {/* Oculto a menos que haya promo, tacha el viejo */}
              {product.is_on_sale && product.discount_percentage > 0 && (
                <span className="text-sm line-through text-gray-500">
                  ${product.price}
                </span>
              )}
            </div>
          </div>
          
          {/* Botón Carrito */}
          <Button
            size="sm"
            onClick={() => addToCart(product.id, 1)}
            disabled={product.stock <= 0} // Deshabilita pulsación y oscurece el botón si stock==0
            icon={ShoppingCart}
            className={
                product.stock <= 0 
                ? "bg-slate-800 text-slate-500 border-none w-full" 
                : "bg-amber-500 hover:bg-amber-400 text-slate-900 border-none shadow-neon"
            }
          >
            {product.stock <= 0 ? "" : "Agregar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

