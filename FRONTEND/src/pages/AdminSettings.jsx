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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 whitespace-normal break-words">Configuraciones de Sistema</h1>
        <p className="text-white">Ajustes generales de la tienda (Solo SuperAdmin).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Store settings */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
             <Server className="w-6 h-6 text-amber-500" />
             <h2 className="text-xl font-bold text-white">Preferencias de Tienda</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Nombre de la Empresa</label>
              <input type="text" defaultValue="DFRATELLI" className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Moneda Principal</label>
              <select className="w-full px-4 py-2 bg-blue-950 border border-blue-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
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
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Consultar Código Único</h2>
          </div>
          <p className="text-blue-200/70 text-sm mb-6">Verifica a quién pertenece un Código Único de Usuario.</p>
          
          <form onSubmit={handleSearchUser} className="flex flex-col min-[430px]:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Ej: A1B2C3D4E5F6"
              value={uniqueCode}
              onChange={e => setUniqueCode(e.target.value.toUpperCase())}
              required
              className="w-full min-[430px]:flex-1 px-4 py-3 bg-blue-950 border border-blue-700 rounded-lg text-white font-mono placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            <p className="text-red-400 text-sm mt-2">{searchError}</p>
          )}

          {searchedUser && (
            <div className="mt-4 p-4 bg-blue-950/80 border border-blue-800 rounded-xl flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 overflow-hidden w-full">
                <p className="text-white font-bold truncate">{searchedUser.first_name} {searchedUser.last_name}</p>
                <p className="text-blue-200/70 text-sm truncate">{searchedUser.email}</p>
                <p className="text-blue-200/50 text-[10px] uppercase tracking-tighter sm:hidden">@{searchedUser.username}</p>
              </div>
              <div className="sm:ml-auto">
                <span className="px-2 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded border border-amber-400">
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
