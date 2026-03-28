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
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1a0a00] border-t border-amber-900/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenedor principal del grid: 1 columna en móvil, 3 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Columna 1: Información de la marca */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-amber-500">
                DFRATELLI
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Herramientas de calidad profesional para todo tipo de proyectos.
              Construyendo el futuro juntos desde el primer clavo.
            </p>
            {/* Redes sociales */}
            <div className="flex space-x-4 pt-2">
              <a href="https://www.tiktok.com/@dfratelli_?_r=1&_t=ZS-94w1Y7kRPph" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-600 hover:-translate-y-1 transition-all duration-300">
                <SiTiktok className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/dfratelli_?igsh=eXUyeWl4Yzh3cWRl" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-600 hover:-translate-y-1 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/584129143109?text=Hola,%20me%20comunico%20desde%20la%20página%20web" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-600 hover:-translate-y-1 transition-all duration-300">
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces de navegación rápida */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-amber-600 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Inicio</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-amber-600 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Catálogo</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-amber-600 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Nosotros</Link>
              </li>
              <li>
                <Link to="/brands" className="text-slate-400 hover:text-amber-600 transition-colors text-sm hover:translate-x-1 inline-block transform duration-300">Marcas</Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Información de contacto */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <span className="text-slate-400 text-sm">Av. Andres Bello con Calle Norte. 23/2 Qta. Simita PB Urb. Mariperez.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-amber-500 mr-3" />
                <span className="text-slate-400 text-sm">+58 (412) 914-31-09</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-amber-500 mr-3" />
                <span className="text-slate-400 text-sm">Inversionesdfratelli@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador inferior y copyright */}
        <div className="border-t border-amber-900/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} INVERSIONES DFRATELLI C.A. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0"><a href="https://github.com/Jhonmcr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Programador - JMCR</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
