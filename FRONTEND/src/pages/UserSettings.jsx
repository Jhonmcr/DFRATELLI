/**
 * @file UserSettings.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

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
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="px-6 md:px-12 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Configuración de Cuenta</h1>
          <p className="text-slate-500 font-medium">Gestiona tu seguridad y consulta tu información de usuario.</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <User className="w-6 h-6 text-amber-500" /> Información de Cuenta
          </h2>
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Nombre Completo</p>
              <p className="text-slate-900 font-bold text-lg">{profile.first_name || profile.username} {profile.last_name || ''}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Nombre de Usuario</p>
              <p className="text-slate-900 font-bold text-lg">@{profile.username || '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Email</p>
              <p className="text-slate-900 font-bold text-lg">{profile.email}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Teléfono</p>
              <p className="text-slate-900 font-bold text-lg">{profile.phone_number || '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Rol</p>
              <span className="px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-full text-xs font-bold w-fit block">{profile.role}</span>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1 text-[10px]">Código de Identificación</p>
              <div className="flex items-center gap-2">
                <code className="text-amber-600 font-mono font-bold text-lg">{profile.unique_code}</code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-amber-50 rounded-xl transition-colors text-amber-500"
                  title="Copiar código"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse h-24 bg-slate-800 rounded-lg" />
        )}
      </div>

        {/* Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <KeyRound className="w-6 h-6 text-amber-500" /> Seguridad
          </h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder="Contraseña actual"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
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
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
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
            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold px-6 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Shield className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
