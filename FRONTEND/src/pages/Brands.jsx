/**
 * @file Brands.jsx
 * @description Componente de vista pública para las marcas aliadas.
 * Muestra una cuadrícula dinámica con todas las marcas provenientes
 * de la API y ofrece animaciones fluidas de entrada y efecto hover.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'; // Hooks básicos de estado y ciclo de vida
import { motion } from 'framer-motion';             // Librería nativa para animaciones declarativas
import api from '../services/api';                  // Instancia preconfigurada de Axios

export default function Brands() {                  // Componente funcional exportado por defecto
  const [brands, setBrands] = useState([]);         // Estado que mantiene el array de marcas devuelto por la API
  const [loading, setLoading] = useState(true);     // Estado que maneja la pantalla de carga (spinner)

  useEffect(() => {                                 // Hook para lanzar acciones secundarias post-montaje
    fetchBrands();                                  // Llama la función de recuperación de datos
  }, []);                                           // Array vacío indica que se ejecuta solo 1 vez

  const fetchBrands = async () => {                 // Función asincrónica para fetchear marcas
    try {
      const res = await api.get('products/brands/');  // Solicitud GET al endpoint 'products/brands/'
      setBrands(res.data.results || res.data);      // Si viene paginado usa 'results', sino usa 'res.data'
    } catch (error) {
      console.error("Error cargando marcas:", error); // Imprime el error por consola en caso de fallo
    } finally {
      setLoading(false);                            // Quita la pantalla de carga sin importar éxito/error
    }
  };

  const API_URL = import.meta.env.VITE_MEDIA_URL || "http://127.0.0.1:8000";          // URL base harcodeada para render de medias sin path absoluto
  
  return (                                          // Inicia la renderización de la interfaz
    <div className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh] relative"> {/* Contenedor base de la sección con padding adaptativo */}
      {/* Decoración circular de fondo, estilo destello */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" /> 

      <motion.div                                   // Titular animado de la página usando framer-motion
        initial={{ opacity: 0, y: -20 }}            // Inicia invisible y levemente más arriba
        animate={{ opacity: 1, y: 0 }}              // Termina opaco en su posición final
        className="text-center mb-16"               // Centra el contenido textual con margen inferior
      >
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block"> {/* Subtítulo complementario estilo label */}
          Calidad Certificada
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"> {/* H1 cabecera general */}
          Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Marcas</span> {/* Keyword con color gradiente cortado texto */}
        </h1>
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-2xl mx-auto text-lg"> {/* Párrafo introductorio de contexto */}
          Trabajamos únicamente con fabricantes líderes a nivel mundial para garantizar el éxito de tus proyectos.
        </p>
      </motion.div>

      {loading ? (                                  // Operador ternario: Si loading es true, muestra un spinner
        <div className="flex justify-center items-center py-20"> {/* Contenedor centrado para el estado de carga */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div> {/* Spinner giratorio ámbar */}
        </div>
      ) : (                                         // Si loading es false, muestra la cuadrícula interactiva
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-20 px-4 max-w-5xl mx-auto"> {/* Grid responsiva (2 cols en móvil, 4 en LG) */}
          {brands.map((brand, index) => (           // Itera sobre el arreglo de marcas retornadas
            <motion.div 
              key={brand.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Contenedor de Imagen de Marca */}
              <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex items-center justify-center p-8 transition-all duration-500 group-hover:shadow-2xl group-hover:border-amber-500/30">
                {/* Resplandor intero en hover */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-500" />
                
                {brand.image ? (
                  <img 
                    src={brand.image.startsWith('http') ? brand.image : `${API_URL}${brand.image}`}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <span className="text-6xl font-black text-slate-100 group-hover:text-amber-500/20 transition-all duration-700">
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Nombre de la Marca debajo de la caja */}
              <div className="mt-6 text-center">
                <span className="text-sm font-extrabold text-blue-900 tracking-widest uppercase transition-colors group-hover:text-amber-600 block">
                  {brand.name}
                </span>
                <div className="h-1 w-0 group-hover:w-full bg-amber-500 transition-all duration-500 mx-auto mt-1 rounded-full"></div>
              </div>
            </motion.div>
          ))}
          {brands.length === 0 && (                 // Short-circuit render: Si no hay array disponible, mostrar un estado vacío
            <div className="col-span-full text-center text-slate-400 py-10"> {/* Ocupa todas las columnas del grid */}
              No hay marcas registradas en el sistema todavía.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
