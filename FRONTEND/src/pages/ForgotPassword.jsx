import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Backend expects {"email": "user@example.com"}
      await api.post('auth/password-reset-request/', { email });
      setStatus('success');
      setMessage('Te hemos enviado un enlace al correo para recuperar tu cuenta. (Si es desarrollo, verifica la consola del Django backend)');
    } catch (err) {
      setStatus('error');
      if (err.response && err.response.data) {
        const errorMsgs = Object.values(err.response.data).flat().join(' ');
        setMessage(errorMsgs || 'No se pudo enviar el correo de recuperación.');
      } else {
        setMessage('Ocurrió un error. Por favor, intenta de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-[80vh]">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-[80px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-glass p-10 mt-10 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-white mb-2">
            Recuperar <span className="text-amber-500">Acceso</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl text-center space-y-4"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-green-400 font-medium">{message}</p>
            <Link to="/login" className="inline-block mt-4 text-slate-300 hover:text-white underline decoration-slate-500 hover:decoration-white transition-all">
              Volver al inicio de sesión
            </Link>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Ingresa tu correo registrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900 transition-all shadow-neon disabled:opacity-70"
            >
              {status === 'loading' ? 'Enviando...' : (
                <>
                  Enviar Instrucciones
                  <ArrowRight className="ml-2 w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
               <Link to="/login" className="text-sm text-slate-400 hover:text-amber-500 transition-colors">
                 Cancelar y volver
               </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
