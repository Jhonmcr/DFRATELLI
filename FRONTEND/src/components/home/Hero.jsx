/**
 * @file Hero.jsx
 * @description Componente de la sección principal (Hero) de la página de inicio.
 * Muestra el logotipo circular de la marca con efectos de resplandor, 
 * un mensaje de bienvenida y un botón de llamada a la acción (Call to Action).
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react"; // React y soporte de JSX
import { Link } from "react-router-dom"; // Enrutador del frontend para navegación
import { ArrowRight, ShieldCheck, Timer, Award } from "lucide-react"; // Iconos vectoriales
import { motion } from "framer-motion"; // Librería de animaciones fluidas
import BrandLogo from '../../assets/brand/logo-dfratelli.png'; // Logotipo principal importado

const Hero = () => { // Declaración del componente funcional Hero
  return ( // Inicia el renderizado del componente
    // Contenedor principal con fondo oscuro simulando la identidad y abriendo contexto a pantalla completa
    <div className="relative min-h-screen lg:h-screen flex items-center justify-center bg-[#2c1200] overflow-hidden pt-20 pb-48 sm:pb-52 lg:py-0">
      
      {/* Círculo difuminado superior / primario */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Círculo difuminado inferior / secundario */}
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#5C3D11]/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Patrón de cuadrícula tenue en el fondo para añadir textura visual o grid cyberpunk */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" // Cubre todo el área de forma invisible a clicks
        style={{ // Estilos inline dinámicos
          backgroundImage: 'radial-gradient(#FF8C00 1px, transparent 1px)', // Generación de puntos naranja en fondo
          backgroundSize: '32px 32px' // Zoom y tamaño del espaciado del grid de untos
        }}
      ></div>

      {/* Contenedor de contenido centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-[-20px] lg:mt-0">
        {/* Grid de dos columnas en desktop, una en mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-8 items-center">
          
          {/* Lado Izquierdo: Textos y Botón (Animación secuencial) */}
          <motion.div // Componente div animado provisto por framer-motion
            initial={{ opacity: 0, x: -50 }}      // Estado inicial (oculto y desplazado a la izquierda)
            animate={{ opacity: 1, x: 0 }}        // Estado final (visible en su posición original)
            transition={{ duration: 0.8 }}        // Duración de la animación (0.8 segundos)
            className="text-center lg:text-left pt-10 lg:pt-0" // Centrado en móviles, alineado a la izquierda en PC, padding superior dinámico
          >
            {/* Tagline / Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6"> {/* Placa ovalada de "Calidad" */}
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span> {/* Pildora parpadeante de notificación */}
              <span className="text-amber-600 text-sm font-medium tracking-wide">Calidad Profesional</span> {/* Texto del badge en color ámbar */}
            </div>
            
            {/* Título Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-4"> {/* Estructura del H1 con tamaños dinámicos */}
              Construye Mejor. <br className="hidden md:block"/> {/* Salto de línea oculto en móviles y visible en pantallas grandes */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"> {/* Gradiente de texto con estilo clip usando background */}
                Construye Fuerte.
              </span>
            </h1>
            
            {/* Subtítulo / Descripción */}
            <p className="text-base sm:text-lg lg:text-xl text-amber-100/80 mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"> {/* Párrafo descriptivo con lectura calmada */}
              Equipamiento y herramientas industriales de alta gama para proyectos que exigen la máxima precisión, durabilidad y rendimiento.
            </p>
            
            {/* Botones de CTA (Call To Action) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"> {/* Flexbox en columna (móvil) o fila (PC) */}
              <Link // Link de React-Router para navegación SPA sin refresco
                to="/products" // Destino de este botón CTA (Catálogo global)
                className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl overflow-hidden shadow-lg shadow-amber-500/20 transition-all duration-300 w-full sm:w-auto flex justify-center items-center" // Clases de Tailwind de interactividad y estilo de cristal ámbar
              >
                {/* Efecto de brillo en hover (pseudo-elemento animado) */}
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div> {/* Brillo oblicuo estilo "swipe" en hover via animaciones de Tailwind */}
                <span className="relative flex items-center"> {/* Contenedor relative para quedar por encima de elementos absolute con su z-index nativo */}
                  Explorar Catálogo {/* Texto estático del botón */}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /> {/* Icono de flecha con leve traslación a la derecha en hover */}
                </span>
              </Link>
            </div>

          </motion.div>

          {/* Lado Derecho: Logotipo de la Marca CUADRADO ANIMADO */}
          <div className="flex justify-center items-center h-full relative mt-10 lg:mt-0"> {/* Contenedor Flexbox para centrar el elemento */}
            <div className="relative w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] lg:w-[360px] lg:h-[360px] xl:w-[420px] xl:h-[420px] flex items-center justify-center"> {/* Caja responsiva que rige el tamaño total de la animación */}
              
              {/* Cuadro exterior rotando */}
              <motion.div 
                animate={{ rotate: 360 }} // Gira 360 grados completos
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }} // Bucle infinito, movimiento constante sin aceleración
                className="absolute inset-0 opacity-30 border-[3px] border-amber-500 rounded-3xl" // Borde fijo simulando un marco exterior
              ></motion.div>
              
              {/* Cuadro interior rotando inverso */}
              <motion.div 
                animate={{ rotate: -360 }} // Gira en sentido contrario
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }} // Más rápido que el exterior para contraste visual
                className="absolute inset-4 sm:inset-6 opacity-50 border-[2px] sm:border-[4px] border-orange-500 rounded-[1.5rem] sm:rounded-[2rem]" // Marco más pequeño e interno
              ></motion.div>
              
              {/* Logo Redondeado completamente que sube y baja */}
              <motion.div
                animate={{ y: [-15, 15, -15] }} // Animación de flotabilidad (arriba y abajo)
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} // Movimiento suave de ida y vuelta
                className="relative z-10 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] lg:w-[280px] lg:h-[280px] xl:w-[320px] xl:h-[320px] shadow-[0_0_80px_rgba(255,140,0,0.6)] bg-[#1a0f05] backdrop-blur-sm border-2 border-amber-500/60 rounded-full overflow-hidden flex items-center justify-center" // Esfera central con sombra brillante (Holo-glow)
              >
                <img 
                  src={BrandLogo} // Origen de la imagen importada
                  alt="DFRATELLI Logo Oficial" // Texto alternativo para accesibilidad y SEO
                  className="w-full h-full object-contain scale-110 rounded-full" // Ajuste perfecto de la imagen dentro de la esfera
                />
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* ───── START BARRA DE BENEFICIOS FULL-WIDTH AL FONDO ───── */}
      <div className="absolute bottom-0 left-0 w-full bg-[#1a0f05]/60 backdrop-blur-md border-t border-orange-900/20 py-8 z-20"> {/* Barra oscura fijada al fondo de la pantalla inicial */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Contenedor que alínea la barra con los textos de arriba */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8"> {/* Layout de cuadrícula equilibrada para 3 items */}
            {/* Ítem 1: Garantía */}
            <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
              <ShieldCheck className="h-6 w-6 text-amber-500 mr-3" /> {/* Icono de escudo de chequeo */}
              <span className="text-sm md:text-base font-semibold tracking-wider uppercase">Garantía Total</span>
            </div>
            {/* Ítem 2: Envíos */}
            <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
              <Timer className="h-6 w-6 text-amber-500 mr-3" /> {/* Icono de cronómetro */}
              <span className="text-sm md:text-base font-semibold tracking-wider uppercase">Envío Rápido</span>
            </div>
            {/* Ítem 3: Prestigio comercial */}
            <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
              <Award className="h-6 w-6 text-amber-500 mr-3" /> {/* Icono representativo de medalla / premio */}
              <span className="text-sm md:text-base font-semibold tracking-wider uppercase">Marca Líder</span>
            </div>
          </div>
        </div>
      </div>
      {/* ───── END BARRA DE BENEFICIOS FULL-WIDTH AL FONDO ───── */}

    </div>
  );
};

export default Hero;
