/**
 * @file Button.jsx
 * @description Componente botón reutilizable con múltiples variantes de estilos.
 * Soporta estados de carga (spinner in-line) y deshabilitado, además de íconos
 * opcionales alineados a la izquierda.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children Contenido interno del botón (texto/elementos).
 * @param {string} [props.variant="primary"] Variante visual ('primary', 'secondary', 'outline', 'ghost', 'danger').
 * @param {string} [props.size="md"] Tamaño del botón ('sm', 'md', 'lg', 'full').
 * @param {boolean} [props.isLoading=false] Muestra spinner de carga y deshabilita clics.
 * @param {boolean} [props.disabled=false] Deshabilita el botón visual y funcionalmente.
 * @param {React.ElementType} [props.icon] Componente de icono (ej. Lucide) a renderizar antes del texto.
 * @param {string} [props.className=""] Clases adicionales de Tailwind para sobreescribir estilos.
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props // Recibe onClick, type, etc.
}) => {
  // ─── MAPEO DE ESTILOS (Tailwind) ──────────────────────────────────────────

  // Tamaños estandarizados para padding, texto y altura
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-bold",
    full: "w-full px-4 py-3 text-base font-bold",
  };

  // Variantes de diseño (Primary utiliza el gradiente naranja de la marca)
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20 border border-orange-500/50",
    secondary:
      "bg-[#2a1b0a] hover:bg-[#3a2610] text-orange-400 border border-[#5C3D11] shadow-md",
    outline:
      "bg-transparent hover:bg-orange-500/10 text-orange-500 border-2 border-orange-500",
    ghost: 
      "bg-transparent hover:bg-[#2a1b0a] text-gray-300 hover:text-white border-transparent",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30",
  };

  // Clases base comunes a todos los botones
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg transition-all duration-300 transform active:scale-[0.98] outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#1a0f05]";
  
  // Clases cuando está deshabilitado o cargando (opacidad reducida, cursor prohibido)
  const disabledClasses = "opacity-50 cursor-not-allowed transform-none active:scale-100 hover:shadow-none";

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseClasses} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${disabled || isLoading ? disabledClasses : "hover:-translate-y-0.5"} 
        ${className}
      `}
      {...props}
    >
      {/* 
        Manejo de estado isLoading: Renderiza el spinner de Lucide (Loader2) rotando,
        el icono proporcionado, o nada antes del contenido principal (children).
      */}
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={`mr-2 ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />
      ) : null}
      
      {/* Contenido (Texto por lo general) */}
      {children}
    </button>
  );
};

export default Button;
