import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, UserPlus, AlertCircle, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', phone_number: '', role: 'CLIENT' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Registrar al usuario en el backend
      await api.post('auth/register/', formData);
      setSuccess('Usuario registrado con éxito. Iniciando sesión...');
      
      // 2. Opcional: Auto-login tras registro exitoso
      const loginResponse = await api.post('auth/login/', { email: formData.email, password: formData.password });
      login({ username: formData.email }, loginResponse.data.access, loginResponse.data.refresh);
      
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      if (err.response && err.response.data) {
        // Formatear los errores de serializer provistos por Django
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages || 'Error en el registro. Verifica los datos.');
      } else {
        setError('Error en el registro. Por favor intenta de nuevo.');
      }
    } finally {
      if(!success) setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-[80vh]">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-glass p-10 mt-10 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Crear <span className="text-amber-500">Cuenta</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            O <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">inicia sesión con tu cuenta existente</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 text-sm p-3 rounded-md flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Nombre"
                value={formData.first_name}
                onChange={handleChange}
              />
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Apellido"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Número de teléfono (Ej: +58424...)"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-700 bg-slate-800/50 text-gray-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900 transition-all shadow-neon disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-amber-700 group-hover:text-amber-800 transition-colors" aria-hidden="true" />
              </span>
              {loading ? 'Registrando...' : 'Registrar Cuenta'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
