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

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Timer, Award } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from '../../assets/brand/logo-dfratelli.png'; // Logotipo principal

const Hero = () => {
  return (
    // Contenedor principal con fondo Naranja oscuro / Marrón nocturno simulando el tema oscuro original
    <div className="relative min-h-[90vh] flex items-center justify-center bg-[#2c1200] overflow-hidden pt-20">
      
      {/* ───── START DECORACIONES DE FONDO ───── */}
      {/* Círculo difuminado superior / primario */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      {/* Círculo difuminado inferior / secundario */}
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#5C3D11]/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Patrón de cuadrícula tenue en el fondo para añadir textura */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#FF8C00 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>
      {/* ───── END DECORACIONES DE FONDO ───── */}

      {/* Contenedor de contenido centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Grid de dos columnas en desktop, una en mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Lado Izquierdo: Textos y Botón (Animación secuencial) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}      // Estado inicial (oculto)
            animate={{ opacity: 1, x: 0 }}        // Estado final (visible)
            transition={{ duration: 0.8 }}        // Duración de la animación
            className="text-center lg:text-left pt-10 lg:pt-0"
          >
            {/* Tagline / Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-amber-600 text-sm font-medium tracking-wide">Calidad Profesional</span>
            </div>
            
            {/* Título Principal */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Construye Mejor. <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Construye Fuerte.
              </span>
            </h1>
            
            {/* Subtítulo / Descripción */}
            <p className="text-lg md:text-xl text-amber-100/80 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Equipamiento y herramientas industriales de alta gama para proyectos que exigen la máxima precisión, durabilidad y rendimiento.
            </p>
            
            {/* Botones de CTA (Call To Action) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl overflow-hidden shadow-lg shadow-amber-500/20 transition-all duration-300 w-full sm:w-auto flex justify-center items-center"
              >
                {/* Efecto de brillo en hover (pseudo-elemento animado) */}
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative flex items-center">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Beneficios rápidos (Iconos con texto) */}
            <div className="mt-12 pt-8 border-t border-orange-900/40 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
                <ShieldCheck className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Garantía Total</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
                <Timer className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Envío Rápido</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-amber-50/90">
                <Award className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Marca Líder</span>
              </div>
            </div>
          </motion.div>

          {/* Lado Derecho: Logotipo de la Marca CUADRADO ANIMADO */}
          <div className="flex justify-center items-center h-full relative mt-10 lg:mt-0">
            <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center">
              
              {/* Cuadro exterior rotando */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 opacity-30 border-[3px] border-amber-500 rounded-3xl"
              ></motion.div>
              
              {/* Cuadro interior rotando inverso */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute inset-6 opacity-50 border-[4px] border-orange-500 rounded-[2rem]"
              ></motion.div>
              
              {/* Logo Redondeado completamente que sube y baja */}
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] shadow-[0_0_80px_rgba(255,140,0,0.6)] bg-[#1a0f05] backdrop-blur-sm border-2 border-amber-500/60 rounded-full overflow-hidden flex items-center justify-center"
              >
                <img 
                  src={BrandLogo}
                  alt="DFRATELLI Logo Oficial" 
                  className="w-full h-full object-contain scale-110 rounded-full"
                />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
