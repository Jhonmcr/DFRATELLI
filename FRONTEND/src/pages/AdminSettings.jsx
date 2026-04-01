/**
 * @file AdminSettings.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Save, Server, Search, User as UserIcon } from 'lucide-react';
import api from '../services/api';


export default function AdminSettings() {
  // Estado para Código Único
  const [uniqueCode, setUniqueCode] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');


  const handleSearchUser = async (e) => {
    e.preventDefault();
    if (!uniqueCode.trim()) return;
    
    setSearchLoading(true);
    setSearchError('');
    setSearchedUser(null);
    try {
      // Usamos el endpoint de admin users que ya tenemos, y filtramos los resultados localmente
      // (ya que no creamos un endpoint específico de búsqueda por código único, usamos el listado general)
      const res = await api.get('admin/users/');
      
      // DRF list views might return an array or a paginated object { results: [...] }
      const users = Array.isArray(res.data) ? res.data : (res.data.results || []);
      
      const found = users.find(u => u.unique_code === uniqueCode.toUpperCase());
      
      if (found) {
        setSearchedUser(found);
      } else {
        setSearchError('Usuario no encontrado con ese código.');
      }
    } catch (err) {
      setSearchError('Error al buscar usuario.');
    } finally {
      setSearchLoading(false);
    }
  };
  return (
    <div className="py-0 px-4 md:px-6 max-w-full mx-auto w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2 whitespace-normal break-words">Configuraciones de Sistema</h1>
        <p className="text-amber-600 font-bold text-lg">Ajustes generales de la tienda y control de acceso exclusivo para SuperAdmin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Store settings */}
        <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-amber-50 rounded-xl">
                <Server className="w-6 h-6 text-amber-600" />
             </div>
             <h2 className="text-xl font-bold text-slate-800">Preferencias de Tienda</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Nombre de la Empresa</label>
              <input type="text" defaultValue="DFRATELLI" className="w-full px-4 py-2 bg-white border border-amber-100 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Moneda Principal</label>
              <select className="w-full px-4 py-2 bg-white border border-amber-100 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="USD">USD ($)</option>
                <option value="VES">VES (Bs)</option>
              </select>
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </div>

        {/* Consultar Código Único */}
        <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Search className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Consultar Código Único</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm mb-6">Verifica a quién pertenece un Código Único de Usuario.</p>
          
          <form onSubmit={handleSearchUser} className="flex flex-col min-[430px]:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Ej: A1B2C3D4E5F6"
              value={uniqueCode}
              onChange={e => setUniqueCode(e.target.value.toUpperCase())}
              required
              className="w-full min-[430px]:flex-1 px-4 py-3 bg-white border border-amber-100 rounded-lg text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={searchLoading || !uniqueCode.trim()}
              className="w-full min-[430px]:w-auto justify-center bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            >
              Buscar
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 font-bold text-sm mt-2">{searchError}</p>
          )}

          {searchedUser && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left transition-all">
              <div className="w-12 h-12 rounded-full bg-white border border-amber-200 flex items-center justify-center flex-shrink-0 animate-pulse">
                <UserIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 overflow-hidden w-full">
                <p className="text-slate-800 font-bold truncate text-lg">{searchedUser.first_name} {searchedUser.last_name}</p>
                <p className="text-slate-500 text-sm truncate font-medium">{searchedUser.email}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-tighter sm:hidden">@{searchedUser.username}</p>
              </div>
              <div className="sm:ml-auto">
                <span className="px-3 py-1 bg-amber-600 text-slate-900 text-xs font-bold rounded-lg border border-amber-400 shadow-md">
                  {searchedUser.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
