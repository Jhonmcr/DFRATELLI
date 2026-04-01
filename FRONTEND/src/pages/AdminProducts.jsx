/**
 * @file AdminProducts.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Productos Filtrados (Aplicando la búsqueda)
  const filteredProducts = products.filter(p => 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    is_active: true,
    is_on_sale: false,
    discount_percentage: 0
  });
  const [categorySearch, setCategorySearch] = useState('');
  const [error, setError] = useState('');

  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('products/'),
        api.get('products/categories/') // Asumiendo que esta ruta existe o ajustarla
      ]);
      setProducts(prodRes.data.results || prodRes.data);
      setCategories(catRes.data.results || catRes.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      // Fallback si la ruta de categorias es otra, solo cargar productos
      try {
         const prodOnly = await api.get('products/');
         setProducts(prodOnly.data.results || prodOnly.data);
      } catch(e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenModal = (product = null) => {
    setError('');
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category ? product.category.id : '',
        is_active: product.is_active !== undefined ? product.is_active : true,
        is_on_sale: product.is_on_sale || false,
        discount_percentage: product.discount_percentage || 0
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '', is_active: true, is_on_sale: false, discount_percentage: 0 });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('stock', formData.stock);
    submitData.append('is_active', formData.is_active);
    submitData.append('is_on_sale', formData.is_on_sale);
    submitData.append('discount_percentage', formData.discount_percentage);
    if (formData.category) submitData.append('category_id', formData.category);
    if (imageFile) submitData.append('image', imageFile);

    try {
      if (editingId) {
        await api.patch(`products/${editingId}/`, submitData, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('products/', submitData, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchProductsAndCategories(); // Refresh list
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar el producto. Verifica los datos e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await api.post('products/categories/', { name: newCategoryName });
      setCategories([...categories, res.data]);
      setFormData({ ...formData, category: res.data.id });
      setNewCategoryName('');
      setIsCreatingCategory(false);
      // Notify Navbar to refresh category list
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    } catch (err) {
      console.error(err);
      setError('Error al crear la categoría. Podría ya existir.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await api.delete(`products/${id}/`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error al eliminar", err);
        alert("Ocurrió un error al intentar eliminar el producto.");
      }
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;
  }

  return (
    <div className="py-0 px-4 md:px-6 max-w-full mx-auto w-full relative overflow-x-hidden">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2 whitespace-normal break-words">Gestionar Productos</h1>
          <p className="text-amber-600 font-bold">Gestiona y actualiza tu catálogo de productos con precisión y facilidad.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input 
             type="text" 
             placeholder="Buscar producto por nombre..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="px-4 py-2 w-full sm:w-64 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder-slate-400 shadow-sm"
          />
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all shadow-neon flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* ── TABLA: visible ≥ 768px ── */}
      <div className="hidden md:block bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-2xl p-0 pt-1">
        {/* Contenedor Scroll Interno */}
        <div className="overflow-y-auto max-h-[65vh] p-4 pt-0">
          <table className="w-full text-left border-collapse min-w-[600px] relative">
            <thead className="sticky top-0 bg-white backdrop-blur-md z-10 border-b border-amber-100 shadow-sm">
              <tr className="text-slate-900 font-black uppercase text-[11px] tracking-widest border-b-2 border-amber-100/50">
                <th className="py-4 px-4 font-medium">Producto</th>
                <th className="py-4 px-4 font-medium">Precio</th>
                <th className="py-4 px-4 font-medium">Estado</th>
                <th className="py-4 px-4 font-medium">Stock</th>
                <th className="py-4 px-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No hay productos que coincidan con la búsqueda.</td></tr>
              ) : filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-amber-600" />
                      )}
                   </div>
                   <div>
                     <span className="text-slate-800 font-bold block whitespace-normal break-words leading-tight">{product.name}</span>
                     <span className="text-slate-700 font-bold text-sm line-clamp-1 italic">{product.description}</span>
                   </div>
                </td>
                <td className="py-4 px-4">
                  {product.is_on_sale && product.discount_percentage > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-slate-500 line-through text-sm">${product.price}</span>
                      <span className="text-amber-600 font-bold">${product.sale_price}</span>
                    </div>
                  ) : (
                    <span className="text-slate-700 font-bold">${product.price}</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {product.is_active ? (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-bold uppercase">Activo</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold uppercase">Pausado</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {product.stock > 0 ? (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-sm">{product.stock} disponibles</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-sm font-medium">Agotado</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-800 hover:text-amber-600 transition-colors" title="Editar"><Edit className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-800 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* ── CARDS: visible < 768px ── */}
      <div className="md:hidden flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white border border-amber-100 rounded-xl shadow-lg">No hay productos que coincidan con la búsqueda.</div>
        ) : filteredProducts.map(product => (
          <div key={product.id} className="bg-white border border-amber-100 rounded-xl p-4 flex items-center gap-3 hover:bg-amber-50/50 transition-colors shadow-xl">
            {/* Imagen */}
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-5 h-5 text-amber-500" />
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="text-slate-800 font-bold block whitespace-normal break-words text-sm leading-tight">{product.name}</span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {product.is_on_sale && product.discount_percentage > 0 ? (
                  <span className="text-amber-700 font-bold text-sm">${product.sale_price}</span>
                ) : (
                  <span className="text-slate-700 font-medium text-sm">${product.price}</span>
                )}
                {product.stock > 0 ? (
                  <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-xs">{product.stock} disp.</span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-xs font-medium">Agotado</span>
                )}
                {product.is_active ? (
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-bold uppercase">Activo</span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-bold uppercase">Pausado</span>
                )}
              </div>
            </div>
            {/* Acciones */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Editar"><Edit className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/50 p-3 rounded-md flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </div>
                )}
                
                <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Nombre del Producto *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Descripción</label>
                    <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-400 resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Precio *</label>
                      <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Stock *</label>
                      <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          name="is_active" 
                          id="is_active"
                          checked={formData.is_active} 
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          className="w-4 h-4 text-green-500 bg-slate-900 border-slate-700 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-white cursor-pointer">Producto Activo / Visible</label>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${formData.is_active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {formData.is_active ? 'Visible en tienda' : 'Oculto / Pausado'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        name="is_on_sale" 
                        checked={formData.is_on_sale} 
                        onChange={(e) => setFormData({...formData, is_on_sale: e.target.checked})}
                        className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 rounded focus:ring-amber-500 focus:ring-2"
                      />
                      <label className="text-sm font-bold text-amber-600 cursor-pointer" onClick={() => setFormData({...formData, is_on_sale: !formData.is_on_sale})}>Activar Oferta en este Producto</label>
                    </div>

                    {formData.is_on_sale && (
                      <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Porcentaje (%)</label>
                          <input 
                            type="number" 
                            name="discount_percentage" 
                            min="0" 
                            max="100" 
                            value={formData.discount_percentage} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2 bg-slate-900 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Precio Final</label>
                          <div className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-bold flex items-center h-[42px]">
                            ${formData.price ? (formData.price - (formData.price * (formData.discount_percentage || 0) / 100)).toFixed(2) : "0.00"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Categoría</label>
                    <div className="flex gap-2">
                      {isCreatingCategory ? (
                        <>
                          <input 
                            type="text" 
                            value={newCategoryName} 
                            onChange={(e) => setNewCategoryName(e.target.value)} 
                            placeholder="Nombre de la categoría"
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-400" 
                          />
                          <button 
                            type="button" 
                            onClick={handleCreateCategory}
                            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-lg transition-colors whitespace-nowrap"
                          >
                            Añadir
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsCreatingCategory(false)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                         <div className="flex flex-col gap-2 w-full">
                           <input 
                             type="text" 
                             placeholder="🔍 Buscar categoría..." 
                             value={categorySearch}
                             onChange={(e) => setCategorySearch(e.target.value)}
                             className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white text-sm"
                           />
                           <div className="max-h-40 overflow-y-auto bg-slate-800/30 border border-slate-700 rounded-lg p-1 custom-scrollbar">
                             {categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 ? (
                               <div className="py-2 px-3 text-slate-500 text-sm">No se encontraron categorías.</div>
                             ) : categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                               <button
                                 key={cat.id}
                                 type="button"
                                 onClick={() => setFormData({ ...formData, category: cat.id })}
                                 className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                                   formData.category === cat.id 
                                     ? 'bg-amber-500 text-slate-900 font-bold' 
                                     : 'text-slate-300 hover:bg-slate-700'
                                 }`}
                               >
                                 {cat.name}
                                 {formData.category === cat.id && <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>}
                               </button>
                             ))}
                           </div>
                           <button 
                             type="button" 
                             onClick={() => setIsCreatingCategory(true)}
                             className="w-full px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                           >
                             <Plus className="w-4 h-4" /> Crear Nueva Categoría
                           </button>
                         </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Imagen del Producto</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-amber-500/20 file:text-amber-500 hover:file:bg-amber-500/30 transition-all cursor-pointer" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-2 border border-slate-600 rounded-lg text-white hover:text-white hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" form="productForm" disabled={isSubmitting} className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors shadow-neon disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900"></div> Guardando...</> : editingId ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
