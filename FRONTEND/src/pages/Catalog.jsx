import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ShoppingCart, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { addToCart } = useContext(CartContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const params = {};
          if (categoryParam) {
            params.category = categoryParam;
          }
          if (searchTerm) {
            params.search = searchTerm;
          }
          if (minPrice) params.price_min = minPrice;
          if (maxPrice) params.price_max = maxPrice;
          const response = await api.get('products/', { params });
          // Handle paginated response if applicable, otherwise assume array
          setProducts(response.data.results || response.data);
        } catch (err) {
          setError('Error al cargar productos. El servidor podría estar inactivo.');
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, 500); // Debounce 500ms
    
    return () => clearTimeout(timer);
  }, [categoryParam, searchTerm, minPrice, maxPrice]);

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Catálogo de <span className="text-amber-500">Productos</span></h1>
          <p className="text-slate-400">Herramientas y materiales de calidad premium para tus proyectos.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
             <input 
               type="text" 
               placeholder="Buscar productos..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
             />
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center">
          <Info className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-glass rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/30 transition-colors group flex flex-col h-full cursor-pointer"
            >
              <div className="h-48 bg-slate-900 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">Sin Imagen</div>
                )}
                <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-1 rounded text-xs font-bold text-amber-500 border border-amber-500/20">
                  Stock: {product.stock}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  {product.is_on_sale && product.discount_percentage > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 line-through">${Number(product.price).toFixed(2)}</span>
                      <span className="text-xl font-bold text-amber-400">${Number(product.sale_price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-amber-400">${Number(product.price).toFixed(2)}</span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id, 1);
                    }}
                    disabled={product.stock === 0}
                    className={`p-2 rounded-lg transition-colors border ${
                      product.stock > 0 
                        ? 'bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-900 border-amber-500/30' 
                        : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
               No hay productos disponibles en este momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
