/**
 * @file Input.jsx
 * @description Componente de campo de texto reutilizable.
 * Incluye soporte para íconos alineados a la izquierda, etiquetas (labels)
 * y visualización de mensajes de error de validación.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";

/**
 * @param {Object} props
 * @param {string} [props.label] Texto descriptivo sobre el campo de entrada.
 * @param {string} [props.error] Mensaje de validación que torna el borde rojo y aparece debajo.
 * @param {React.ElementType} [props.icon] Ícono (ej. de Lucide) que aparece en la parte izquierda del input.
 * @param {string} [props.className=""] Clases adicionales de Tailwind para el contenedor padre.
 */
const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  ...props // Engloba value, onChange, type, placeholder, name, etc.
}) => {
  return (
    <div className={`w-full ${className}`}>
        
      {/* ─── ETIQUETA (LABEL) ────────────────────────────────── */}
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      {/* ─── CONTENEDOR RELATIVO (INPUT + ÍCONO) ─────────────── */}
      <div className="relative">
        
        {/* Ícono a la izquierda (Opcional) */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Si hay error el icono se torna rojo claro, sino naranja tenue */}
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-orange-500/70'}`} />
          </div>
        )}

        {/* Input Text / Email / Password */}
        <input
          {...props}
          className={`
            block w-full rounded-lg bg-[#1a0f05] text-white
            ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5
            border transition-colors duration-200 outline-none
            placeholder-gray-600
            ${
              error
                ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500" // Estado de error
                : "border-[#5C3D11]/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 hover:border-[#5C3D11]" // Estado normal
            }
            ${props.disabled ? "opacity-60 cursor-not-allowed bg-[#1a0f05]/50" : ""}
          `}
        />
      </div>

      {/* ─── MENSAJE DE ERROR ────────────────────────────────── */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {error}
        </p>
      )}
      
    </div>
  );
};

export default Input;
