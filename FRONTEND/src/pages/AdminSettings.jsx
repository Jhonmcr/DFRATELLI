import React, { useState } from 'react';
import { Settings, Save, Server, Shield, UserCog, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [uniqueCode, setUniqueCode] = useState('');
  const [newRole, setNewRole] = useState('ADMIN');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const handleRoleChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const res = await api.post('admin/role-change/', { unique_code: uniqueCode, role: newRole });
      setResult({ success: true, message: res.data.message, user: res.data.user });
      toast.success(res.data.message);
      setUniqueCode('');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al cambiar el rol';
      setResult({ success: false, message: errMsg });
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Configuraciones de <span className="text-amber-500">Sistema</span></h1>
        <p className="text-slate-400">Ajustes avanzados y gestión de roles (Solo SuperAdmin).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Store settings */}
        <div className="bg-glass border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
             <Server className="w-6 h-6 text-amber-500" />
             <h2 className="text-xl font-bold text-white">Preferencias de Tienda</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nombre de la Empresa</label>
              <input type="text" defaultValue="DFRATELLI" className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Moneda Principal</label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white">
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

        {/* Role Management */}
        <div className="bg-glass border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Cambio de Rol</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">Cambia el rol de un usuario usando su Código Único (visible en Configuración de Cuenta del usuario).</p>
          <form onSubmit={handleRoleChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Código Único del Usuario</label>
              <input
                type="text"
                placeholder="Ej: A1B2C3D4E5F6"
                value={uniqueCode}
                onChange={e => setUniqueCode(e.target.value.toUpperCase())}
                required
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nuevo Rol</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="CLIENT">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            {result && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${result.success ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {result.success && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <span>{result.message}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={saving || !uniqueCode.trim()}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition-all text-sm"
            >
              <Shield className="w-4 h-4" />
              {saving ? 'Actualizando...' : 'Cambiar Rol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
