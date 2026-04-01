/**
 * @file AdminBrands.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Package, Edit2, X, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImage, setNewBrandImage] = useState(null);
  const [creating, setCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const fileInputRefs = useRef({});

  const fetchBrands = async () => {
    try {
      const res = await api.get('products/brands/');
      setBrands(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleCreate = async () => {
    if (!newBrandName.trim()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', newBrandName);
    if (newBrandImage) {
      formData.append('image', newBrandImage);
    }

    try {
      const res = await api.post('products/brands/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBrands([...brands, res.data]);
      setNewBrandName('');
      setNewBrandImage(null);
      setCreating(false);
      toast.success('Marca creada exitosamente');
    } catch (err) {
      toast.error('Error al crear marca. Ya puede existir.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta marca?')) return;
    try {
      await api.delete(`products/brands/${id}/`);
      setBrands(brands.filter(b => b.id !== id));
      toast.success('Marca eliminada');
    } catch (err) {
      toast.error('Error al eliminar la marca');
    }
  };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await api.patch(`products/brands/${id}/`, { name: editName });
      setBrands(brands.map(b => b.id === id ? res.data : b));
      setEditingId(null);
      toast.success('Marca renombrada');
    } catch (err) {
      toast.error('Error al renombrar la marca');
    }
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.patch(`products/brands/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBrands(brands.map(b => b.id === id ? res.data : b));
      toast.success('Imagen actualizada');
    } catch (err) {
      toast.error('Error al subir imagen');
    }
  };

  return (
    <div className="py-1 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Marcas</h1>
          <p className="text-white">Agrega, edita o elimina marcas y sube imágenes para cada una.</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-3 rounded-xl transition-all shadow-neon"
        >
          <Plus className="w-5 h-5" /> Nueva Marca
        </button>
      </div>

      {/* New Brand Form */}
      {creating && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
          <input
            autoFocus
            type="text"
            placeholder="Nombre de la marca..."
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="flex-1 w-full flex items-center justify-center gap-2 bg-slate-800 border border-dashed border-slate-600 p-3 rounded-lg cursor-pointer hover:border-amber-500 transition-colors text-slate-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              <Upload className="w-4 h-4 flex-shrink-0" />
              {newBrandImage ? newBrandImage.name : "Seleccionar Imagen"}
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => setNewBrandImage(e.target.files[0])} 
              />
            </label>

            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleCreate} 
                disabled={isSubmitting}
                className="flex-1 sm:flex-none justify-center bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:opacity-50 text-slate-900 font-bold px-5 py-3 rounded-lg transition-colors flex items-center gap-1 min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900"></div>
                ) : (
                  <><Check className="w-5 h-5" /> Guardar</>
                )}
              </button>
              <button 
                onClick={() => { setCreating(false); setNewBrandName(''); setNewBrandImage(null); }} 
                disabled={isSubmitting}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-xl">Aún no hay marcas registradas.</p>
          <p className="text-slate-600 mt-2">Presiona "Nueva Marca" para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[70vh] pr-2 -mr-2 pb-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="group relative bg-slate-800/60 border border-slate-600 hover:border-amber-500/40 rounded-xl overflow-hidden transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                {/* Image area */}
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                  {/* Upload Image Button */}
                  <button
                    onClick={() => fileInputRefs.current[brand.id]?.click()}
                    className="absolute top-3 right-3 bg-slate-900/70 hover:bg-amber-500 text-white hover:text-slate-900 p-2.5 rounded-full backdrop-blur-sm border border-slate-700 transition-all shadow-md opacity-0 group-hover:opacity-100"
                    title="Cambiar imagen"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file" accept="image/*" className="hidden"
                    ref={el => fileInputRefs.current[brand.id] = el}
                    onChange={(e) => handleImageUpload(brand.id, e.target.files[0])}
                  />
                </div>

                {/* Brand info + actions */}
                <div className="p-4">
                  {editingId === brand.id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(brand.id)}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button onClick={() => handleRename(brand.id)} className="bg-green-500 hover:bg-green-400 text-slate-900 p-2 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white truncate">{brand.name}</h3>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => { setEditingId(brand.id); setEditName(brand.name); }}
                          className="text-slate-500 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                          title="Renombrar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
