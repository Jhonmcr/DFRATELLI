import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get('products/brands/');
      setBrands(res.data.results || res.data);
    } catch (error) {
      console.error("Error cargando marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  const API_URL = "http://127.0.0.1:8000";
  return (
    <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh] relative">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Calidad Certificada
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Marcas</span>
        </h1>
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-2xl mx-auto text-lg">
          Trabajamos únicamente con fabricantes líderes a nivel mundial para garantizar el éxito de tus proyectos.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-20 px-4 max-w-5xl mx-auto">
          {brands.map((brand, index) => (
            <motion.div 
              key={brand.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
              className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer flex items-center justify-center bg-transparent transition-all duration-500 hover:z-10"
            >
              {/* Efecto de resplandor futurista detrás del logo en el hover */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500 rounded-3xl blur-xl" />
              
              <div className="relative w-full h-full flex items-center justify-center p-6 z-10 transition-transform duration-700 ease-out group-hover:scale-110">
                {brand.image ? (
                  <img 
                    src={brand.image.startsWith('http') ? brand.image : `${API_URL}${brand.image}`} 
                    alt={brand.name} 
                    className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_20px_20px_rgba(245,158,11,0.3)] transition-all duration-700"
                  />
                ) : (
                  <span className="text-7xl font-black text-white/10 group-hover:text-amber-500/80 transition-all duration-700 drop-shadow-2xl">
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Nombre revelado al hacer hover, como un HUD futurista */}
              <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-950 tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                  {brand.name}
                </span>
              </div>
            </motion.div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-10">
              No hay marcas registradas en el sistema todavía.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
