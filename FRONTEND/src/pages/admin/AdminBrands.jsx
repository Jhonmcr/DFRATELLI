import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get('products/brands/');
      setBrands(res.data.results || res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la lista de marcas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('El nombre es obligatorio');
    
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      const loadingToast = toast.loading('Guardando marca...');
      await api.post('products/brands/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.dismiss(loadingToast);
      toast.success('Marca agregada exitosamente');
      setName('');
      setImage(null);
      // reset file input
      document.getElementById('brandImageInput').value = '';
      fetchBrands();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Hubo un error al guardar la marca');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás extremadamente seguro de eliminar esta marca? Esto podría afectar a los productos asociados.')) return;
    try {
      await api.delete(`products/brands/${id}/`);
      toast.success('Marca eliminada con éxito');
      fetchBrands();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la marca');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h1>
        <p className="text-gray-600 mt-2">Agrega, visualiza o elimina las marcas de tus productos desde aquí.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Nueva Marca</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Marca</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Ej: Dewalt, Truper, Makita..."
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo (Opcional)</label>
            <input 
              type="file" 
              id="brandImageInput"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" /> Agregar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Marcas Registradas</h2>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
            {brands.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No hay marcas registradas en el catálogo.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {brands.map(brand => (
              <li key={brand.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {brand.image ? (
                      <img 
                        src={brand.image.startsWith('http') ? brand.image : `${API_URL}${brand.image}`} 
                        alt={brand.name} 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold text-xl">{brand.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
                    <p className="text-xs text-gray-500">ID: {brand.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(brand.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Eliminar Marca"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
