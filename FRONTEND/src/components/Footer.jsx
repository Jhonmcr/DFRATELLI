import React from 'react';
import { Wrench, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold tracking-wider text-gray-900">
              D<span className="text-amber-500">FRATELLI</span>
            </span>
          </div>
          <p className="text-slate-400 max-w-sm">
            La ferretería del futuro. Proveendo herramientas y materiales para los constructores del mañana con tecnología de punta.
          </p>
        </div>
        <div>
          <h4 className="text-gray-900 font-semibold mb-6">Enlaces</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/catalog" className="hover:text-amber-500 transition-colors">Catálogo</Link></li>
            <li><Link to="/marcas" className="hover:text-amber-500 transition-colors">Marcas</Link></li>
            <li><Link to="/promotions" className="hover:text-amber-500 transition-colors">Promociones</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 font-semibold mb-6">Contacto</h4>
          <ul className="space-y-4 text-slate-400">
            <li>soporte@dfratelli.com</li>
            <li>+1 (555) 123-4567</li>
            <li>Av. Innovación 404, Tech City</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800/50 pt-8 text-center md:text-left text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>© 2026 DFRATELLI. Todos los derechos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center gap-1.5">
            <Github className="w-4 h-4" />
            GitHub del Desarrollador
          </a>
        </div>
      </div>
    </footer>
  );
}
