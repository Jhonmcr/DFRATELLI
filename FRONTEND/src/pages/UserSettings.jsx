import React, { useState, useEffect, useContext } from 'react';
import { KeyRound, Eye, EyeOff, Copy, CheckCircle, Shield, User, Hash } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function UserSettings() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('profile/').then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const handleCopyCode = () => {
    if (profile?.unique_code) {
      navigator.clipboard.writeText(profile.unique_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    setSaving(true);
    try {
      await api.post('auth/change-password/', { old_password: oldPassword, new_password: newPassword });
      toast.success('Contraseña cambiada correctamente');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuración <span className="text-amber-500">de Cuenta</span></h1>
        <p className="text-slate-400">Gestiona tu contraseña y consulta tu información de usuario.</p>
      </div>

      {/* User Info Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-500" /> Información de Cuenta
        </h2>
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Nombre</p>
              <p className="text-gray-900 font-medium">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Teléfono</p>
              <p className="text-gray-900 font-medium">{profile.phone_number || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Rol</p>
              <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">{profile.role}</span>
            </div>
          </div>
        ) : (
          <div className="animate-pulse h-16 bg-slate-800 rounded-lg" />
        )}
      </div>

      {/* Unique Code Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Hash className="w-5 h-5 text-amber-500" /> Tu Código de Identificación
        </h2>
        <p className="text-slate-400 text-sm mb-4">Este código único te identifica en el sistema. El administrador puede usarlo para cambiar tu rol.</p>
        {profile ? (
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-slate-800 text-amber-400 font-mono text-lg tracking-[0.3em] px-4 py-3 rounded-xl border border-slate-700">
              {profile.unique_code}
            </code>
            <button
              onClick={handleCopyCode}
              className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-slate-300"
              title="Copiar código"
            >
              {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="animate-pulse h-12 bg-slate-800 rounded-xl" />
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-500" /> Cambiar Contraseña
        </h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder="Contraseña actual"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Shield className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
