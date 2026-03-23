import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, MessageSquare, Instagram, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Contact() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ subject: '', message: '', email: '', phone: '', name: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Endpoint a crear en backend
      await api.post('contact/messages/', formData);
      setStatus('success');
      setFormData({ subject: '', message: '', email: '', phone: '', name: '' });
    } catch (error) {
       console.error("Contacto error:", error);
       setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh] relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Comunícate con Nosotros
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
          Estamos aquí para <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Ayudarte</span>
        </h1>
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 max-w-2xl mx-auto text-lg">
          ¿Dudas sobre un producto, cotizaciones de gran volumen o soporte técnico? Déjanos tu mensaje y nuestro equipo se comunicará a la brevedad.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-[#1a0a00] border border-amber-900/50 hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-2xl p-8 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6">Información de Contacto</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-amber-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Dirección Principal</h4>
                  <p className="text-white">Av. Las Industrias, Galpón 45<br/>Zona Industrial, DFRATELLI.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-amber-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Líneas de Atención</h4>
                  <p className="text-white">Ventas: +58 (212) 555-0100<br/>Soporte: +58 (212) 555-0101</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-amber-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Correo Electrónico</h4>
                  <p className="text-white">ventas@dfratelli.com<br/>soporte@dfratelli.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a0a00] border border-amber-900/50 hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-2xl p-8 transition-all duration-300">
             <h3 className="text-xl font-bold text-white mb-4">Horario de Atención</h3>
             <ul className="space-y-2 text-white">
               <li className="flex justify-between"><span>Lunes a Viernes:</span> <span className="text-white font-medium">8:00 AM - 5:00 PM</span></li>
               <li className="flex justify-between"><span>Sábados:</span> <span className="text-white font-medium">9:00 AM - 2:00 PM</span></li>
               <li className="flex justify-between"><span>Domingos:</span> <span className="text-amber-500 font-medium">Cerrado</span></li>
             </ul>
          </div>

          <div className="bg-[#1a0a00] border border-amber-900/50 hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-2xl p-8 transition-all duration-300">
             <h3 className="text-xl font-bold text-white mb-6">Redes Sociales y Chat App</h3>
             <div className="flex flex-col gap-4">
                <a href="https://wa.me/584242334809?text=Hola,%20me%20comunico%20desde%20la%20página%20web" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group">
                   <div className="bg-green-500/10 p-3 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-slate-900 transition-colors">
                      <MessageSquare className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">WhatsApp Business</h4>
                      <p className="text-sm text-white">Atención directa e inmediata</p>
                   </div>
                   <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-green-500 transition-colors" />
                </a>

                <a href="https://t.me/dfratelli" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                   <div className="bg-blue-500/10 p-3 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
                      <MessageSquare className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Canal de Telegram</h4>
                      <p className="text-sm text-white">Canal y chat de soporte</p>
                   </div>
                   <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                </a>

                <a href="https://instagram.com/dfratelli" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-pink-500/50 transition-all group">
                   <div className="bg-pink-500/10 p-3 rounded-lg text-pink-500 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                      <Instagram className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">Instagram</h4>
                      <p className="text-sm text-white">Catálogo visual y noticias</p>
                   </div>
                   <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-pink-500 transition-colors" />
                </a>
             </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#1a0a00] border border-amber-900/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <h3 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h3>
          
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageSquare className="w-16 h-16 text-amber-500/30 mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Chat de Administrador</h4>
              <p className="text-slate-400">Los mensajes de clientes aparecen en el Panel de Administración en la sección de notificaciones.</p>
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
               <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
               <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
               <p className="text-slate-400">Gracias por escribirnos. Nuestro equipo te responderá lo antes posible.</p>
               <button 
                 onClick={() => setStatus('idle')}
                 className="mt-6 px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
               >
                 Enviar otro mensaje
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-md flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  No pudimos enviar tu mensaje en este momento. Intenta comunicarte al teléfono directamente.
                </div>
              )}

              <div>
                <input
                  type="text" id="name" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
                  placeholder="Tu Nombre (Ej: Juan Pérez)"
                />
              </div>

              <div>
                <input
                  type="email" id="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
                  placeholder="Tu Correo Electrónico"
                />
              </div>

              <div>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
                  placeholder="Teléfono (Opcional)"
                />
              </div>

              <div>
                <input
                  type="text" id="subject" name="subject" required
                  value={formData.subject} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
                  placeholder="Asunto (Cotización, Soporte, Reclamo...)"
                />
              </div>

              <div>
                <textarea
                  id="message" name="message" required rows="5"
                  value={formData.message} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all resize-none"
                  placeholder="Mensaje (Escribe tu requerimiento detallado aquí...)"
                ></textarea>
              </div>

              <button
                type="submit" disabled={status === 'loading'}
                className="w-full flex items-center justify-center py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all shadow-neon disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Enviando...' : (<><Send className="w-5 h-5 mr-2" />Enviar Mensaje</>)}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

