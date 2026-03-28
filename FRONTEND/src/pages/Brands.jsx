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

  const API_URL = "http://127.0.0.1:8000";          // URL base harcodeada para render de medias sin path absoluto
  
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
              key={brand.id || index}               // Key única de React basada en ID o fallback al índice
              initial={{ opacity: 0, y: 20 }}       // Animación de entrada inicial: oculto y más abajo
              animate={{ opacity: 1, y: 0 }}        // Animación de entrada final: visible en posición 0
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }} // Efecto en cascada ("stagger") multiplicando delay por índice
              className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer flex items-center justify-center bg-transparent transition-all duration-500 hover:z-10" // Contenedor interactivo que se eleva en Z al pasar el ratón
            >
              {/* Efecto de resplandor futurista detrás del logo en el hover */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500 rounded-3xl blur-xl" /> {/* Blur ámbar dinámico */}
              
              <div className="relative w-full h-full flex items-center justify-center p-6 z-10 transition-transform duration-700 ease-out group-hover:scale-110"> {/* Zoom in de +10% en hover de larga duración cronometrada */}
                {brand.image ? (                    // Operador ternario interior: Si hay imagen, muéstrala. Si no, muestra la inicial.
                  <img 
                    src={brand.image.startsWith('http') ? brand.image : `${API_URL}${brand.image}`} // Valida si la ruta es absoluta o relativa al backend local
                    alt={brand.name}                // Atributo ALT descriptivo
                    className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_20px_20px_rgba(245,158,11,0.3)] transition-all duration-700" // Sombra base vs Sombra ámbar en hover
                  />
                ) : (
                  <span className="text-7xl font-black text-white/10 group-hover:text-amber-500/80 transition-all duration-700 drop-shadow-2xl"> {/* Fallback si no hay logo: Texto inmenso */}
                    {brand.name.charAt(0)}          // Obtiene la primera letra de la marca
                  </span>
                )}
              </div>

              {/* Nombre revelado al hacer hover (PC) o permanente (Móvil) */}
              <div className="absolute bottom-4 left-0 right-0 text-center opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20"> {/* Responsive state on Touch vs Hover on Desktop */}
                <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-950 tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]"> {/* Estilo de texto metálico futurista */}
                  {brand.name}                      // Etiqueta del nombre de la marca
                </span>
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
