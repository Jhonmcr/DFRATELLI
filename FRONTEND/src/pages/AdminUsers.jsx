import React, { useState, useEffect, useContext } from 'react';
import { Users, Phone, Mail, Shield, Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('admin/users/')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de <span className="text-amber-500">Usuarios</span></h1>
        <p className="text-slate-400">Consulta la información de todos los usuarios registrados.</p>
      </div>

      <div className="flex gap-4 h-[70vh] min-h-[400px]">
        {/* Left: user list */}
        <div className="w-72 flex-shrink-0 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 text-gray-900 text-sm border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-500"
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
                className={`w-full text-left p-4 border-b border-slate-800 transition-colors ${selected?.id === u.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'hover:bg-slate-800/60'}`}
              >
                <p className="text-sm font-medium text-gray-900 truncate">{u.first_name} {u.last_name || u.username}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
                <div className="mt-1">{roleBadge(u.role)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: user detail */}
        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          {selected ? (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selected.first_name} {selected.last_name}</h2>
                  <p className="text-slate-400 text-sm">@{selected.username}</p>
                </div>
                <div className="ml-auto">{roleBadge(selected.role)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={<Mail className="w-4 h-4 text-amber-500" />} label="Email" value={selected.email} />
                <InfoRow icon={<Phone className="w-4 h-4 text-amber-500" />} label="Teléfono" value={selected.phone_number || '—'} />
                <InfoRow icon={<Shield className="w-4 h-4 text-amber-500" />} label="ID del sistema" value={String(selected.id)} />
                <InfoRow icon={<Shield className="w-4 h-4 text-amber-500" />} label="Código único" value={selected.unique_code} mono />
              </div>
              
              {currentUser?.role === 'SUPERADMIN' && selected.role !== 'SUPERADMIN' && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h3 className="text-gray-900 font-bold mb-4">Gestión de Acceso Rápida</h3>
                  <div className="flex gap-4">
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
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-500">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Selecciona un usuario para ver sus datos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">{icon}{label}</div>
      <p className={`text-gray-900 font-medium ${mono ? 'font-mono tracking-widest text-amber-400' : ''}`}>{value}</p>
    </div>
  );
}
