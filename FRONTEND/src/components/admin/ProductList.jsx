/**
 * @file ProductList.jsx
 * @description Componente de lista de productos para el panel de administración.
 * Permite a los administradores visualizar el catálogo, y contiene los botones
 * de acción para editar, agregar o eliminar (CRUD de productos del lado del cliente).
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Edit, Trash2, Plus, Search, Tag, DollarSign, Package, Percent } from "lucide-react";
import toast from "react-hot-toast";

const ProductList = () => {
    // ─── ESTADOS DEL COMPONENTE ──────────────────────────────────────────────
    const [products, setProducts] = useState([]);         // Lista de productos obtenidos de la API
    const [searchTerm, setSearchTerm] = useState("");     // Término de búsqueda filtrable localmente
    const [isLoading, setIsLoading] = useState(true);     // Estado de carga inicial
    
    // Variables por defecto pre-llenadas para cuando necesites simular la edición de categorías
    const API_URL = "http://127.0.0.1:8000";

    // ─── EFECTOS DE CICLO DE VIDA ─────────────────────────────────────────────
    useEffect(() => {
        fetchProducts(); // Carga la lista al montar el componente
    }, []);

    // ─── MÉTODOS DE DATOS Y EVENTOS ───────────────────────────────────────────
    
    /**
     * Obtiene la lista de todos los productos consultando la API.
     * Soporta manejo de errores a través de react-hot-toast.
     */
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/products/");
            setProducts(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            toast.error("Error al cargar los productos");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Elimina un producto por su identificador numérico.
     * Pide confirmación nativa del navegador antes de realizar la petición DELETE final.
     * 
     * @param {number} productId Identificador del producto
     */
    const handleDelete = async (productId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
            try {
                await api.delete(`/products/${productId}/`);
                toast.success("Producto eliminado exitosamente");
                fetchProducts(); // Refresca grilla para remover elemento localmente
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                toast.error("Hubo un problema al eliminar el producto");
            }
        }
    };

    /**
     * Formatea un número al sistema monetario local o de dólares.
     * 
     * @param {number|string} amount Monto a parsear
     * @returns {string} Precio formateado
     */
    const formatPrice = (amount) => {
        return parseFloat(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    };

    // Filtra productos basándose en el query ingresado en el buscador local
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // ─── RENDER ──────────────────────────────────────────────────────────────
    
    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center bg-amber-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header de la sección */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pb-4 border-b border-amber-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        Gestión de Productos
                        <span className="ml-3 bg-amber-500/20 text-amber-600 py-0.5 px-2.5 rounded-full text-sm border border-amber-500/30">
                            {products.length}
                        </span>
                    </h2>
                    <p className="text-gray-600 mt-1">Administra el inventario, precios y detalles de artículos.</p>
                </div>
                
                {/* 
                  Nota: El botón a continuación debería en el sistema real, 
                  abrir un MODAL o llevar a otra ruta de agregación (/admin/products/new). 
                  Se mantiene el UI aquí por escalabilidad de la estructura. 
                */}
                <button
                    className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg shadow-lg shadow-amber-500/20 transition-all"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            {/* Barra de utilidades: Búsqueda */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-amber-200 shadow-inner">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-600" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg bg-amber-50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors sm:text-sm"
                    />
                </div>
            </div>

            {/* Grid de Productos - Diseño responsivo (Cards en vez de Table) */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border border-amber-200 overflow-hidden flex flex-col hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
                            
                            {/* Imagen del producto en S3 o default */}
                            <div className="h-48 bg-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
                                {product.image ? (
                                    <img 
                                        src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
                                        alt={product.name} 
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <Package className="h-16 w-16 text-gray-600" />
                                )}
                                
                                {/* Badge de On Sale */}
                                {product.is_on_sale && product.discount_percentage > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
                                        <Percent className="h-3 w-3 mr-0.5" />
                                        {product.discount_percentage}% OFF
                                    </div>
                                )}
                                
                                {/* Badge de Stock */}
                                {product.stock <= 0 ? (
                                    <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded uppercase shadow-lg border border-red-600">
                                        Agotado
                                    </div>
                                ) : product.stock < 10 ? (
                                    <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded uppercase shadow-lg border border-yellow-600">
                                        Bajo ({product.stock})
                                    </div>
                                ) : null}
                            </div>
                            
                            {/* Información Card Inferior */}
                            <div className="p-5 flex-1 flex flex-col">
                                {/* Estado Activo / Inactivo */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {product.category?.name || "Sin categoría"}
                                    </span>
                                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${product.is_active ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} title={product.is_active ? 'Activo' : 'Inactivo'} />
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" title={product.name}>
                                    {product.name}
                                </h3>
                                
                                <div className="mt-auto pt-4 border-t border-amber-200 flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Precio / Stock</p>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold text-amber-600">
                                                {formatPrice(product.sale_price !== undefined ? product.sale_price : product.price)}
                                            </span>
                                            {/* Muestra info precio viejo tachado si aplica */}
                                            {product.is_on_sale && product.discount_percentage > 0 && (
                                                <span className="text-sm line-through text-gray-500 ml-2">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-gray-700 flex items-center justify-end">
                                            <Package className="h-4 w-4 mr-1 text-gray-500" />
                                            {product.stock} ud.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Botones de acción (Aparecen on hover en desktop, siempre en mobile) */}
                            <div className="bg-amber-50 px-4 py-3 flex justify-between border-t border-amber-300 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 flex items-center justify-center py-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded mr-2 transition-colors">
                                    <Edit className="h-4 w-4 mr-1.5" />
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 flex items-center justify-center py-1.5 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-amber-200">
                    <Search className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
                    <p className="mt-1 text-gray-600">Ajusta tu búsqueda o agrega nuevos productos al catálogo.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
