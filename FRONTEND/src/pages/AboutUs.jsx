/**
 * @file AboutUs.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Target, Shield } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh] relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Conoce nuestra historia
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Nosotros</span>
        </h1>
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-2xl mx-auto text-lg">
          La excelencia ferretera al alcance de los profesionales. (Contenido demostrativo).
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#1a0a00] border border-amber-900/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
          <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
            Nuestra Misión
          </h2>
          <p className="text-white relative z-10 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {[
            { icon: Building2, title: "Infraestructura", desc: "Más de 5000m²" },
            { icon: Users, title: "Equipo", desc: "50+ Especialistas" },
            { icon: Target, title: "Objetivo", desc: "Calidad 100%" },
            { icon: Shield, title: "Garantía", desc: "Respaldo Total" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1a0a00] border border-amber-900/50 rounded-2xl p-6 text-center hover:border-amber-400 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.5)] group">
              <div className="bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-900/50 group-hover:bg-amber-900/30 transition-colors">
                <item.icon className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 mb-1">{item.title}</h3>
              <p className="text-white text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
