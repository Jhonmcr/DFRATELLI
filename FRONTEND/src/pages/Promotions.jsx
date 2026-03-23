import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Tag, ShoppingCart, ArrowRight, Search, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function Promotions() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchPromotions = async () => {
        try {
          setLoading(true);
          const params = { is_on_sale: true };
          if (searchTerm) params.search = searchTerm;
          if (minPrice) params.price_min = minPrice;
          if (maxPrice) params.price_max = maxPrice;
          
          const res = await api.get('products/', { params }); 
          setPromotions(res.data.results || res.data);
        } catch (err) {
          console.error("Error fetching promotions:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPromotions();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, minPrice, maxPrice]);

  return (
    <div className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Ahorra Más
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Nuestras Mejores <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Ofertas</span>
          </h1>
          <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-xl text-lg">
            Equipa tu taller u obra con herramientas y materiales de primera calidad al mejor precio del mercado.
          </p>
        </motion.div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
             <input 
               type="text" 
               placeholder="Buscar ofertas..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
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
                    className="text-xs text-slate-400 hover:text-gray-900 transition-colors"
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
        <div className="flex justify-center items-center h-40">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-20 bg-white border border-amber-200 rounded-2xl">
          <Tag className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay promociones activas</h2>
          <p className="text-slate-400 mb-6">Actualmente no tenemos productos en oferta, vuelve pronto o visita nuestro catálogo principal.</p>
          <Link to="/catalog" className="inline-flex items-center px-6 py-3 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors shadow-neon">
            Ir al Catálogo <ArrowRight className="ml-2 w-5 h-5"/>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {promotions.map((product) => (
             <motion.div 
               key={product.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               onClick={() => navigate(`/product/${product.id}`)}
               className="group bg-[#1a0a00] border border-amber-900/50 rounded-2xl overflow-hidden hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 relative cursor-pointer flex flex-col"
             >
               {/* Badge de Oferta */}
               <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full z-10 shadow-neon">
                 -{product.discount_percentage}% OFF
               </div>
               
               <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-800">
                  <img src={product.image || 'https://images.unsplash.com/photo-1540104539504-6fdf39634e38?q=80&w=2000&auto=format&fit=crop'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
               </div>
               <div className="p-6 relative flex flex-col flex-grow">
                 <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">{product.name}</h3>
                 <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                 <div className="flex items-center justify-between mt-auto">
                   <div className="flex flex-col">
                      <p className="text-slate-500 text-sm line-through">${Number(product.price).toFixed(2)}</p>
                      <p className="text-amber-400 font-bold text-2xl">${Number(product.sale_price).toFixed(2)}</p>
                   </div>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       addToCart(product.id, 1);
                     }}
                     disabled={product.stock === 0}
                     className={`p-3 rounded-xl transition-all ${
                       product.stock > 0 
                         ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-neon' 
                         : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                     }`}
                   >
                     <ShoppingCart className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
