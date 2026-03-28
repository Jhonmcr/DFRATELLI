/**
 * @file Home.jsx
 * @description Vista principal (Página de Inicio).
 * Combina el Hero banner de la marca con una sección de productos
 * destacados. Presenta la paleta de colores corporativa (Naranjas/Cafés)
 * y el logotipo oficial de DFRATELLI.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/products/ProductCard";
import Hero from "../components/home/Hero";

const Home = () => {
  // ─── ESTADOS LOCALES ──────────────────────────────────────────────
  const [featuredProducts, setFeaturedProducts] = useState([]); // Lista de productos destacados
  const [categories, setCategories] = useState([]);             // Lista reducida de categorías para display
  const [isLoading, setIsLoading] = useState(true);             // Estado de carga inicial de las peticiones

  /* 
   * Se comenta la constante API_URL debido a que las operaciones con
   * baseURL las maneja ahora la instancia `api` de axios por medio de su config.
   * const API_URL = "http://127.0.0.1:8000"; 
   */

  // ─── EFECTOS DE CICLO DE VIDA ─────────────────────────────────────
  useEffect(() => {
    // Al montar el componente, dispara la carga paralela de datos base
    fetchInitialData();
  }, []);

  /**
   * Carga concurrentemente productos y categorías para ahorrar tiempos de red.
   */
  const fetchInitialData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products/"),
        api.get("/products/categories/"),
      ]);

      // Filtrar y establecer productos destacados (ej. los primeros 4 o los que están en oferta)
      const products = productsRes.data;
      const featured = products
        .filter((p) => p.is_on_sale || p.stock > 10) // Criterio arbitrario de "destacado" temporal
        .slice(0, 4);

      setFeaturedProducts(featured);              // Actualiza vista Productos
      setCategories(categoriesRes.data.slice(0, 4)); // Muestra hasta las 4 categorías clave
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false); // Retira el loading spinner
    }
  };

  // ─── RENDERIZADOS CONDICIONALES Y ESTRUCTURA ──────────────────────
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a0a00]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a0a00] min-h-screen">
        
      {/* ─── COMPONENTE HERO ────────────────────────────────────────── */}
      <Hero />

      {/* ─── SECCIÓN: EXPLORAR POR CATEGORÍA ────────────────────────── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header de la Sección */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-amber-50 mb-2">Explorar por Categoría</h2>
              <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
            </div>
            
            <Link
              to="/products"
              className="hidden sm:flex items-center text-amber-500 hover:text-orange-300 font-medium transition-colors group"
            >
              Ver Todas
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid de Píldoras/Tarjetas de Categorías Minimalistas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-white border border-amber-200 p-6 rounded-xl hover:border-amber-500/50 hover:shadow-lg transition-all text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-amber-500 transition-all duration-300">
                   {category.image ? (
                        <img 
                          src={category.image} /* En DRF actual podría ya venir absoluta */
                          alt={category.name} 
                          className="w-10 h-10 object-contain drop-shadow" 
                        />
                   ) : (
                        <Wrench className="h-8 w-8 text-amber-500/70 group-hover:text-amber-500" />
                   )}
                </div>
                <h3 className="text-gray-900 font-medium group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN: PRODUCTOS DESTACADOS ──────────────────────────── */}
      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header de la Sección */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados y Más Vendidos</h2>
              <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors group"
            >
              Catálogo Completo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid de Tarjetas de Productos (Reutilizando ProductCard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* CTA Mobile: Ver catálogo (Solo visible en pantallas pequeñas) */}
          <div className="mt-10 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-amber-500 text-amber-600 font-medium rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-all w-full"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
