import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Upload } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Brands() {
  const { user } = useContext(AuthContext);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef({});

  const fetchBrands = async () => {
    try {
      const res = await api.get('products/brands/');
      setBrands(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.patch(`products/brands/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBrands(brands.map(b => b.id === id ? res.data : b));
      toast.success('Imagen de marca actualizada');
    } catch (err) {
      console.error(err);
      toast.error('Error al subir imagen');
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Nuestras <span className="text-amber-500">Marcas</span></h1>
        <p className="text-slate-400">Las mejores marcas de herramientas y materiales de construcción al alcance de tu mano.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl">No hay marcas registradas aún.</p>
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <p className="text-sm mt-2 text-amber-500">Puedes agregar marcas desde el panel de administración.</p>
          )}
        </div>
      ) : (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none' }}>
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              whileHover={{ scale: 1.02 }}
              className="group relative h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 w-64 md:w-80 snap-center border border-slate-800"
            >
              {brand.image ? (
                <img src={brand.image} alt={brand.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-slate-700">
                  <Package className="w-16 h-16 text-slate-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full z-20 pointer-events-none">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-md">{brand.name}</h3>
              </div>

              {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRefs.current[brand.id]?.click(); }}
                    className="bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-900 p-2 rounded-full backdrop-blur-sm border border-slate-700 transition-colors shadow-lg"
                    title="Actualizar Imagen"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file" accept="image/*" className="hidden"
                    ref={el => fileInputRefs.current[brand.id] = el}
                    onChange={(e) => handleImageUpload(brand.id, e.target.files[0])}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
