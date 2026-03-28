/**
 * @file AdminUsers.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect, useContext } from 'react';
import { Users, Phone, Mail, Shield, Search, ArrowUpCircle, ArrowDownCircle, UserPlus, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  
  // Create Admin Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('admin/users/')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (targetUser, newRole) => {
    try {
      const res = await api.post('admin/role-change/', { unique_code: targetUser.unique_code, role: newRole });
      toast.success(res.data.message);
      // Actualizar estado local
      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
      if (selected?.id === targetUser.id) {
         setSelected({ ...selected, role: newRole });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar rol');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('admin/users/create/', newAdmin);
      toast.success('Administrador creado con éxito');
      setShowCreateModal(false);
      setNewAdmin({ email: '', username: '', first_name: '', last_name: '', phone_number: '', password: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${targetUser.email}?`)) return;
    
    try {
      await api.delete(`admin/users/${targetUser.id}/`);
      toast.success('Usuario eliminado correctamente');
      setUsers(prev => prev.filter(u => u.id !== targetUser.id));
      if (selected?.id === targetUser.id) setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.username}`.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const styles = {
      CLIENT: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      ADMIN: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      SUPERADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles[role] || ''}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="py-0 px-4 md:px-6 max-w-full mx-auto w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-white">Consulta la información de todos los usuarios registrados.</p>
        </div>
        {currentUser?.role === 'SUPERADMIN' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/20"
          >
            <UserPlus className="w-5 h-5" /> Nuevo Administrador
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:h-[70vh] min-h-[500px]">
        {/* Left: user list */}
        <div className="w-full sm:w-44 md:w-56 lg:w-72 h-56 sm:h-auto flex-shrink-0 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-blue-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-blue-950 text-white text-sm border border-blue-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-blue-300/40"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-amber-500" /></div>
            ) : filtered.map(u => (
              <button
                key={u.id}
                onClick={() => setSelected(u)}
                className={`w-full text-left p-4 border-b border-blue-800/50 transition-colors ${selected?.id === u.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'hover:bg-blue-800/30'}`}
              >
                <p className="text-sm font-medium text-white truncate">{u.first_name} {u.last_name || u.username}</p>
                <p className="text-xs text-blue-200/50 truncate">{u.email}</p>
                <div className="mt-1">{roleBadge(u.role)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: user detail */}
        <div className="flex-1 min-h-[400px] max-h-[500px] sm:max-h-none sm:min-h-0 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl overflow-hidden overflow-y-auto">
          {selected ? (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selected.first_name} {selected.last_name}</h2>
                  <p className="text-blue-200/70 text-sm">@{selected.username}</p>
                </div>
                <div className="ml-auto">{roleBadge(selected.role)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={<Mail className="w-4 h-4 text-amber-500" />} label="Email" value={selected.email} />
                <InfoRow icon={<Phone className="w-4 h-4 text-amber-500" />} label="Teléfono" value={selected.phone_number || '—'} />
                <InfoRow icon={<Shield className="w-4 h-4 text-amber-500" />} label="ID del sistema" value={String(selected.id)} />
                <InfoRow icon={<Shield className="w-4 h-4 text-amber-500" />} label="Código único" value={selected.unique_code} mono />
              </div>
              
              {currentUser?.role === 'SUPERADMIN' && selected.id !== currentUser.id && (
                <div className="mt-8 pt-6 border-t border-blue-800/50">
                  <h3 className="text-white font-bold mb-4">Gestión de Acceso y Cuenta</h3>
                  <div className="flex gap-4">
                    {selected.role !== 'SUPERADMIN' && (
                      <>
                        {selected.role === 'CLIENT' ? (
                          <button 
                            onClick={() => handleRoleChange(selected, 'ADMIN')}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold rounded-lg transition-colors text-sm"
                          >
                            <ArrowUpCircle className="w-4 h-4" /> Hacer Administrador
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRoleChange(selected, 'CLIENT')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold rounded-lg transition-colors text-sm"
                          >
                            <ArrowDownCircle className="w-4 h-4" /> Quitar Admin (Hacer Cliente)
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDeleteUser(selected)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-lg transition-colors text-sm ml-auto"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar Usuario
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-blue-200/40">
              <Users className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Selecciona un usuario para ver sus datos</p>
            </div>
          )}
        </div>
      </div>
      <CreateAdminModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAdmin}
        formData={newAdmin}
        setFormData={setNewAdmin}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function CreateAdminModal({ isOpen, onClose, onSave, formData, setFormData, isSubmitting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <UserPlus className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Nuevo Administrador</h2>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-white">Nombre</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-white">Apellido</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-white">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Nombre de Usuario</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Teléfono</label>
            <input 
              type="tel"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
              placeholder="Ej. +58 412 0000000"
              value={formData.phone_number}
              onChange={e => setFormData({...formData, phone_number: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-white">Contraseña</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900"></div> Creando...</> : 'Crear Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }) {
  return (
    <div className="bg-blue-950/50 border border-blue-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-blue-200/60 text-xs mb-2">{icon}{label}</div>
      <p className={`text-white font-medium ${mono ? 'font-mono tracking-widest text-amber-400' : ''}`}>{value}</p>
    </div>
  );
}
