/**
 * @file ProductDetail.jsx
 * @description Vista del Detalle Individual de un Producto.
 * Obtiene por URL paramétrica el ID del producto, consulta a la API DRF
 * todos sus datos (incluyendo categoría anidada), y permite agregarlo al carrito.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Package, Tag, Percent } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

const ProductDetail = () => {
  // ─── ESTADOS Y HOOKS DE ENRUTAMIENTO ──────────────────────────────
  
  const { id } = useParams();                            // Extrae el ':id' numérico de la URL actual
  const { addToCart } = useCart();                       // Expone el disparador del Contexto Carrito
  
  const [product, setProduct] = useState(null);          // Datos del modelo hidratados por API
  const [quantity, setQuantity] = useState(1);           // Control local del selector interactivo numérico antes del Add
  const [isLoading, setIsLoading] = useState(true);      // Loader
  const [error, setError] = useState(null);              // Error 404/500

  const API_URL = "http://127.0.0.1:8000";

  // ─── CICLO DE VIDA (DidMount) ─────────────────────────────────────
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar la información del producto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ─── MANEJADORES DE UI ───────────────────────────────────────────

  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < product.stock) setQuantity((q) => q + 1);
    if (type === "decrease" && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const formatPrice = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
        style: 'currency', currency: 'USD'
    });
  };

  // ─── RENDERIZADO: ESTADOS DE CARGA Y ERROR ───────────────────────
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-[#1a0f05]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#1a0f05] text-white">
        <Package className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Producto No Encontrado</h2>
        <p className="text-gray-400 mb-6">{error || "El artículo que buscas no existe o fue removido."}</p>
        <Link to="/products" className="text-orange-500 hover:text-orange-400 font-medium">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // ─── RENDERIZADO: PANTALLA PRINCIPAL (Product Detail Hero) ────────
  
  return (
    <div className="bg-[#1a0f05] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación tipo Migas de pan (Breadcrumb) retrocedible */}
        <Link to="/products" className="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-8 group font-medium">
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a todos los productos
        </Link>

        {/* Cajas Divisorias del Producto (Imagen Izq / Datos y Checkout Der) */}
        <div className="bg-[#2a1b0a] border border-[#5C3D11]/40 rounded-3xl p-6 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LADO IZQUIERDO: VISOR DE IMAGEN (Gallery Stand-in) */}
          <div className="bg-[#1a0f05] rounded-2xl border border-[#5C3D11]/30 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden group h-[400px] lg:h-[550px]">
            {/* Decal Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent z-0 pointer-events-none" />
            
            {product.image ? (
                <img
                    // Asegura soportar Rutas S3 vs Relativas locales de Django Media
                    src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <Package className="h-32 w-32 text-gray-700 relative z-10" />
            )}

            {/* Badges de Imágen Inferenciales */}
            <div className="absolute top-4 left-4 z-20 flex gap-2 flex-col">
                {product.is_on_sale && product.discount_percentage > 0 && (
                    <span className="bg-red-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-lg flex items-center">
                        <Percent className="h-4 w-4 mr-1" /> -{product.discount_percentage}% Descuento
                    </span>
                )}
                {product.stock <= 0 && (
                    <span className="bg-red-500/90 backdrop-blur-md text-white border border-red-600 px-3 py-1.5 rounded-lg text-sm font-bold uppercase shadow-lg shadow-red-500/20">
                    Temporalmente Agotado
                    </span>
                )}
            </div>
            {/* Categoría Tag Badge */}
            <div className="absolute top-4 right-4 z-20">
                <span className="bg-[#2a1b0a]/80 backdrop-blur-sm text-gray-300 border border-[#5C3D11] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center uppercase tracking-wide">
                    <Tag className="h-4 w-4 mr-2 text-orange-500" />
                    {product.category?.name || "Catálogo"}
                </span>
            </div>
          </div>

          {/* LADO DERECHO: INFO TEXTUAL Y CALL TO ACTION */}
          <div className="flex flex-col justify-center">
            
            {/* Etiquetado Estado (Activo/Inactivo del Backend) */}
            {!product.is_active && (
                <div className="mb-4 inline-block bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Producto Descontinuado o Pausado
                </div>
            )}

            {/* Nombre del Producto Monumental */}
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {product.name}
            </h1>
            
            {/* Box Precios Grandes */}
            <div className="mb-6 flex items-end">
              <span className="text-4xl lg:text-5xl font-black text-orange-500 tracking-tighter">
                {formatPrice(product.sale_price || product.price)}
              </span>
              {/* Descuento Tachado */}
              {(product.is_on_sale && product.discount_percentage > 0) && (
                <div className="ml-4 pb-1">
                    <span className="text-xl text-gray-500 line-through font-semibold bg-gray-900/50 px-2 py-1 rounded">
                        {formatPrice(product.price)}
                    </span>
                </div>
              )}
            </div>

            {/* Párrafo Narrativo descriptivo largo */}
            <div className="prose prose-invert prose-orange max-w-none text-gray-300 leading-relaxed mb-8">
              <p className="text-lg">
                  {product.description || "Este equipo industrial cuenta con los más altos estándares de calidad, asegurando rendimiento impecable y durabilidad a largo plazo en condiciones exigentes de trabajo."}
              </p>
            </div>

            {/* Borde sutil divisor */}
            <div className="border-t border-[#5C3D11]/30 my-8 py-8">
                
                {/* Zona Togleadora de Acción Compra o Bloqueo Stock */}
                {product.stock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    
                    {/* Input Number Customizado (Resta y Suma) */}
                    <div className="flex items-center h-14 bg-[#1a0f05] rounded-xl border border-[#5C3D11]/80 w-full sm:w-auto overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        className="px-5 h-full text-gray-400 hover:text-white hover:bg-[#2a1b0a] transition-colors"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <div className="flex-1 sm:w-16 text-center font-bold text-white text-xl border-x border-[#5C3D11]/30">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        className="px-5 h-full text-gray-400 hover:text-white hover:bg-[#2a1b0a] transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Submit Button Al Contexto */}
                    <Button
                      onClick={handleAddToCart}
                      size="full"
                      icon={ShoppingCart}
                      className="h-14 sm:w-auto sm:flex-1 text-lg"
                      disabled={!product.is_active} // Cuelga botón si Admin pausó de emergencia
                    >
                      Añadir al Carrito
                    </Button>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-red-400 font-bold mb-1">Sin Unidades Disponibles</p>
                    <p className="text-red-400/80 text-sm">Vuelve pronto, repodremos inventario en breve.</p>
                  </div>
                )}
                
                {/* Stock Visible */}
                <p className="text-sm text-gray-500 mt-4 text-center sm:text-left">
                  {product.stock > 0 
                    ? `Disponibilidad: ${product.stock} unidades en almacén`
                    : 'Inventario agotado actualmente'}
                </p>
            </div>

            {/* Características de Confianza Base DRF (Iconos Decorativos Fijos) */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex items-center p-4 bg-[#1a0f05] rounded-xl border border-[#5C3D11]/30">
                <ShieldCheck className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <h4 className="text-white font-medium text-sm">Garantía Premium</h4>
                  <p className="text-gray-500 text-xs">Protección total de fábrica</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-[#1a0f05] rounded-xl border border-[#5C3D11]/30">
                <Truck className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <h4 className="text-white font-medium text-sm">Envío Asegurado</h4>
                  <p className="text-gray-500 text-xs">A todo el territorio</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
