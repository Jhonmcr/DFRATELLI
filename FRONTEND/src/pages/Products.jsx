/**
 * @file Products.jsx
 * @description Vista del Catálogo de Productos general.
 * Incluye un listado dinámico de categorías seleccionables, caja de búsqueda, 
 * y la grilla de productos correspondientes a los filtros establecidos.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Hook para leer parámetros de la URL (?category=...etc)
import { Search, SlidersHorizontal, PackageX, Filter } from "lucide-react";
import api from "../services/api";

// Componentes modulares
import ProductCard from "../components/products/ProductCard";
import CategoryList from "../components/products/CategoryList";

const Products = () => {
  // ─── ESTADOS GLOBALES DE LA PÁGINA ──────────────────────────────────
  const [products, setProducts] = useState([]);                      // Array maestro de productos en pantalla
  const [isLoading, setIsLoading] = useState(true);                  // Estado de red
  const [searchParams, setSearchParams] = useSearchParams();         // Hook para modificar y leer query params

  // ─── FILTROS Y BÚSQUEDA ─────────────────────────────────────────────
  
  // Extrae el ID de categoría de la URL como numérico (o null si no hay)
  const categoryParam = searchParams.get("category");
  const parsedCategory = categoryParam ? parseInt(categoryParam, 10) : null;
  
  // Estado para la categoría seleccionada (Sincronizado con la URL)
  const [selectedCategory, setSelectedCategory] = useState(parsedCategory);
  
  // Estado local para la búsqueda de texto
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados para filtro de precios
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // ─── EFECTOS DE CICLO DE VIDA ───────────────────────────────────────

  // Sincroniza el state local de Categoría si el usuario llega con URL prefijada o usa flechas del navegador
  useEffect(() => {
    setSelectedCategory(parsedCategory);
  }, [parsedCategory]);

  // Se ejecuta cada vez que cambia la categoría seleccionada o el motor arranca
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // ─── MÉTODOS Y SERVICIOS ────────────────────────────────────────────

  /**
   * Obtiene los productos aplicando la categoría seleccionada si fuese aplicable.
   */
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = "products/";
      
      // Construye URL opcional para delegar el filtrado al Backend Django (Filtro por categoría exacto)
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el clic en una categoría de la barra horizontal (CategoryList).
   * Alterne entre seleccionar y deseleccionar.
   * Modifica la URL a través de SetSearchParams para que la vista sea persistible vía Link Copying.
   * 
   * @param {number} categoryId ID único de la categoría elegida
   */
  const handleSelectCategory = (categoryId) => {
    if (selectedCategory === categoryId) {
      // Si ya estaba seleccionada, la deselecciona (limpia filtro)
      setSelectedCategory(null);
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      // Selecciona la nueva categoría y la anexa a la barra de direcciones
      setSelectedCategory(categoryId);
      setSearchParams({ category: categoryId });
    }
  };

  /**
   * Filtrado en memoria (Local) sobre la lista ya traída.
   * Compara el nombre o la descripción en caso de contar con ella.
   */
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const finalPrice = product.sale_price !== undefined && product.sale_price !== null ? product.sale_price : product.price;
    const matchesMin = minPrice ? finalPrice >= Number(minPrice) : true;
    const matchesMax = maxPrice ? finalPrice <= Number(maxPrice) : true;
    return matchesSearch && matchesMin && matchesMax;
  });

  // ─── RENDERIZADO ────────────────────────────────────────────────────

  return (
    <div className="bg-transparent min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Principal y Barra de Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Productos</span>
            </h1>
            <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-xl text-lg">
              Encuentra las herramientas y materiales que necesitas para tu próximo gran proyecto.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
               <input 
                 type="text" 
                 placeholder="Buscar productos..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white focus:outline-none focus:border-amber-500 transition-colors"
               />
               <Search className="w-4 h-4 text-white absolute left-3 top-3" />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`p-2 rounded-lg border transition-colors ${showFilters || minPrice || maxPrice ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50'}`}
                title="Filtrar por precio"
              >
                <Filter className="w-5 h-5" />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 origin-top-right">
                  <h4 className="text-white font-bold mb-4 text-sm">Filtrar por Precio</h4>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 mb-1 block">Min ($)</label>
                      <input 
                        type="number" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 mb-1 block">Max ($)</label>
                      <input 
                        type="number" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-500" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); setShowFilters(false); }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Limpiar
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="text-xs bg-amber-500 text-slate-900 px-4 py-2 rounded font-bold hover:bg-amber-400 shadow-neon"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── METAA DEL GRID O RESULTADOS VACÍOS ────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
               {/* Contador de resultados */}
               <span className="text-gray-600 text-sm font-medium">
                 Mostrando <span className="text-gray-900">{filteredProducts.length}</span> resultados
               </span>
            </div>
            
            {/* Grilla visual de tarjetas individuales. 1x Phone -> 2x Tablet -> 3x Laptop -> 4x Desktop */}
            <div className="overflow-y-auto max-h-[75vh] pr-2 -mr-2 pb-8 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State en caso de fallar coincidencias */
          <div className="text-center py-20 bg-white border border-amber-200 rounded-2xl mt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 border border-amber-200 mb-6">
                <PackageX className="h-10 w-10 text-amber-500/60" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              No tenemos artículos que coincidan con tu búsqueda actual o filtro. Intenta utilizar términos más generales o limpia los filtros.
            </p>
            <button 
                onClick={() => {
                    setSearchQuery("");
                    if (selectedCategory) handleSelectCategory(selectedCategory);
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-gray-900 bg-amber-600 hover:bg-orange-700 transition"
            >
                Restablecer Búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
