/**
 * @file Footer.jsx
 * @description Componente pie de página de la aplicación.
 * Contiene enlaces útiles, información de contacto de la marca,
 * redes sociales y derechos de autor.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a0f05] border-t border-[#5C3D11]/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenedor principal del grid: 1 columna en móvil, 4 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Información de la marca */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                DFRATELLI
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Herramientas de calidad profesional para todo tipo de proyectos.
              Construyendo el futuro juntos desde el primer clavo.
            </p>
            {/* Redes sociales */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-orange-400 hover:-translate-y-1 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 hover:-translate-y-1 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 hover:-translate-y-1 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces de navegación rápida */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Inicio</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Catálogo</Link>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Nosotros (Próximamente)</span>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Distribuidores</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces de ayuda y soporte */}
          <div>
            <h3 className="text-white font-semibold mb-6">Soporte</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Mi Cuenta</span>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Envíos y Devoluciones</span>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Términos y Condiciones</span>
              </li>
              <li>
                <span className="text-gray-600 text-sm cursor-not-allowed">Política de Privacidad</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Información de contacto */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                <span className="text-gray-400 text-sm">Av. Principal Ferretera, Zona Industrial, Ciudad.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-400 text-sm">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-400 text-sm">contacto@dfratelli.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador inferior y copyright */}
        <div className="border-t border-[#5C3D11]/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} DFRATELLI. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Diseñado con excelencia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
