/**
 * @file AdminMessages.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Phone, User, Clock, Inbox } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('contact/messages/');
      setMessages(res.data.results || res.data);
    } catch (err) {
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await api.patch(`contact/messages/${msg.id}/`, { is_read: true });
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch (err) {
        console.error('Error marking as read', err);
      }
    }
  };

  return (
    <div className="py-0 px-4 md:px-6 max-w-full mx-auto w-full flex-grow overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Mensajes de Contacto</h1>
        <p className="text-amber-600 font-bold text-lg">Administra y responde todas las consultas enviadas por tus clientes de forma rápida y profesional.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 sm:h-[70vh] min-h-[500px]">
          {/* Left sidebar - message list */}
          <div className="w-full sm:w-44 md:w-56 lg:w-72 h-56 sm:h-auto flex-shrink-0 bg-white border border-amber-100 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-amber-50 bg-amber-50/30">
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-600" />
                {messages.filter(m => !m.is_read).length} sin leer
              </p>
            </div>
            <div className="overflow-y-auto flex-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                  <Inbox className="w-10 h-10 mb-2" />
                  <p className="text-sm">No hay mensajes</p>
                </div>
              ) : (
                messages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left p-4 border-b border-amber-50 transition-all flex flex-col gap-1 ${
                      selected?.id === msg.id
                        ? 'bg-amber-50 border-l-4 border-l-amber-500'
                        : 'hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate font-bold ${!msg.is_read ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                        {msg.name || msg.email}
                      </span>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate ${!msg.is_read ? 'text-slate-600' : 'text-slate-400'}`}>{msg.subject}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{new Date(msg.created_at).toLocaleDateString('es-ES')}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right panel - message detail */}
          <div className="flex-1 min-h-[400px] max-h-[500px] sm:max-h-none sm:min-h-0 bg-white border border-amber-100 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {selected ? (
              <>
                <div className="p-6 border-b border-amber-50 bg-amber-50/20">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{selected.subject}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {selected.name && (
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                        <User className="w-4 h-4 text-amber-600" /> <span className="font-bold text-slate-800">{selected.name}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                      <Mail className="w-4 h-4 text-amber-600" /> <span className="font-bold text-slate-800">{selected.email}</span>
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                        <Phone className="w-4 h-4 text-amber-600" /> <span className="font-bold text-slate-800">{selected.phone}</span>
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${selected.is_read ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-100 border-amber-200 text-amber-700 font-bold'}`}>
                      {selected.is_read
                        ? <MailOpen className="w-4 h-4" />
                        : <Mail className="w-4 h-4 text-amber-600" />}
                      <span className="font-bold">{selected.is_read ? 'Leído' : 'Sin leer'}</span>
                    </span>
                  </div>
                </div>
                <div className="p-8 overflow-y-auto flex-1 bg-white">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">{selected.message}</p>
                </div>
                <div className="p-6 border-t border-amber-50 bg-slate-50 flex gap-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-slate-900/20"
                  >
                    <Mail className="w-5 h-5" /> Responder por Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hola ${selected.name || ''}, recibimos tu mensaje sobre: ${selected.subject}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-600/20"
                    >
                      <Phone className="w-5 h-5" /> WhatsApp
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <MailOpen className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Selecciona un mensaje para leerlo</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
