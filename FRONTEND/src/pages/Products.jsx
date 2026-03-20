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
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
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
      let url = "/products/";
      
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
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── RENDERIZADO ────────────────────────────────────────────────────

  return (
    <div className="bg-[#1a0f05] min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Principal */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Encuentra las herramientas y materiales que necesitas para tu próximo gran proyecto.
          </p>
        </div>

        {/* ─── BARRA DE HERRAMIENTAS DIRECTAS (Búsqueda + Filtro UI) ─── */}
        <div className="bg-[#2a1b0a] border border-[#5C3D11]/50 p-4 rounded-2xl mb-10 shadow-lg shadow-orange-500/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Input de Búsqueda de Texto en Tiempo Real */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-orange-500/70" />
            </div>
            <input
              type="text"
              placeholder="Buscar herramientas, marcas, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#1a0f05] border border-[#5C3D11]/70 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Botón visual meramente demostrativo de Filtros */}
          <button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#1a0f05] border border-[#5C3D11]/70 hover:border-orange-500/50 text-gray-300 px-6 py-3 rounded-xl transition-colors">
            <SlidersHorizontal className="h-5 w-5 text-orange-500" />
            <span>Más Filtros</span>
          </button>
        </div>

        {/* ─── FILTRO HORIZONTAL POR CATEGORÍAS ──────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Categorías</h2>
            {selectedCategory && (
              <button 
                onClick={() => handleSelectCategory(selectedCategory)} // Invierte para deseleccionar
                className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
              >
                Limpiar Filtro
              </button>
            )}
          </div>
          
          {/* Listado dinámico de componentes Linkeables Category */}
          <CategoryList 
            onSelectCategory={handleSelectCategory} 
            selectedCategory={selectedCategory} 
          />
        </div>

        {/* ─── METAA DEL GRID O RESULTADOS VACÍOS ────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
               {/* Contador de resultados */}
               <span className="text-gray-400 text-sm font-medium">
                 Mostrando <span className="text-white">{filteredProducts.length}</span> resultados
               </span>
            </div>
            
            {/* Grilla visual de tarjetas individuales. 1x Phone -> 2x Tablet -> 3x Laptop -> 4x Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State en caso de fallar coincidencias */
          <div className="text-center py-20 bg-[#2a1b0a] border border-[#5C3D11]/30 rounded-2xl mt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a0f05] border border-[#5C3D11] mb-6">
                <PackageX className="h-10 w-10 text-orange-500/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron productos</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              No tenemos artículos que coincidan con tu búsqueda actual o filtro. Intenta utilizar términos más generales o limpia los filtros.
            </p>
            <button 
                onClick={() => {
                    setSearchQuery("");
                    if (selectedCategory) handleSelectCategory(selectedCategory);
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 transition"
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
