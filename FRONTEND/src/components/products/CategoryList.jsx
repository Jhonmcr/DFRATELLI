/**
 * @file CategoryList.jsx
 * @description Listado visual de categorías en el frontend, típicamente usado
 * en el inicio de la navegación de Catálogo. Obtiene las categorías de la API 
 * y las muestra como tarjetas clickeables con contador de productos.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Wrench, ChevronRight } from "lucide-react";

/**
 * @param {Object} props
 * @param {Function} [props.onSelectCategory] Callback opcional para cuando se hace click si se maneja estado padre.
 * @param {string} [props.selectedCategory] ID de la categoría actualmente seleccionada si existe.
 */
const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);      // Array vacío inicial de categorias
  const [isLoading, setIsLoading] = useState(true);      // Estado de loading spinner

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    // Hook que ejecuta el fetch inmediato al montar componente.
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products/categories/");
        setCategories(response.data); // Data viene serializada del Django DRF
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false); // Apaga loading no importa el outcome
      }
    };

    fetchCategories();
  }, []);

  // Early return UI si aún está cargando JSON
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Early return si Django la base de datos no arrojó ninguna categoría (Lista vacía)
  if (categories.length === 0) {
    return (
      <div className="text-center p-8 bg-[#1a0f05] border border-[#5C3D11]/30 rounded-xl">
        <Wrench className="h-8 w-8 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No hay categorías disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          // El click maneja la redirección manual o pasa el evento si está embebido en una página de filtro
          to={`/products?category=${category.id}`} 
          onClick={(e) => {
            if (onSelectCategory) {
              e.preventDefault(); // Previene navegación si el padre asume el control
              onSelectCategory(category.id);
            }
          }}
          className={`
            group bg-[#2a1b0a] border rounded-xl overflow-hidden shadow-md hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-1
            ${selectedCategory === category.id 
                ? 'border-orange-500 ring-1 ring-orange-500' // Está clickeado
                : 'border-[#5C3D11]/50 hover:border-orange-500/50' // Deseleccionado normal
            }
          `}
        >
          {/* Box de Imagen de categoría */}
          <div className="h-24 bg-[#1a0f05] flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b0a] to-transparent opacity-50 z-10"></div>
            {category.image ? (
              <img
                src={category.image.startsWith('http') ? category.image : `${API_URL}${category.image}`}
                alt={category.name}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 z-0"
              />
            ) : (
              // Ícono Wrench fallback si de casualidad no hay logo asignado
              <Wrench className="h-10 w-10 text-orange-500/50 group-hover:text-orange-500 transition-colors z-0" />
            )}
          </div>
          
          {/* Título de la Categoría y Cantidad contenida */}
          <div className="p-3 bg-[#2a1b0a] flex items-center justify-between">
            <div className="overflow-hidden">
                <h3 className="font-semibold text-white text-sm truncate group-hover:text-orange-400 transition-colors">
                {category.name}
                </h3>
                {/* 
                  El Backend CategorySerializer anota un "product_count" en tiempo real 
                  si configuramos `annotate(product_count=Count('product'))`. 
                */}
                <p className="text-xs text-gray-500">
                    {category.product_count !== undefined 
                        ? `${category.product_count} items` 
                        : "Ver más"}
                </p>
            </div>
            {/* Flecha microinteracción hover */}
            <div className="h-6 w-6 rounded-full bg-[#1a0f05] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                <ChevronRight className="h-3 w-3 text-orange-500" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
