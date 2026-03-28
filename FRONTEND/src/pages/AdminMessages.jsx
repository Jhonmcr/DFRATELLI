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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mensajes de Contacto</h1>
        <p className="text-white">Mensajes enviados por clientes a través del formulario de contacto.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 sm:h-[70vh] min-h-[500px]">
          {/* Left sidebar - message list */}
          <div className="w-full sm:w-44 md:w-56 lg:w-72 h-56 sm:h-auto flex-shrink-0 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-blue-800 bg-blue-950/50">
              <p className="text-sm font-bold text-white">
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
                    className={`w-full text-left p-3 border-b border-blue-800/50 transition-colors flex flex-col gap-1 ${
                      selected?.id === msg.id
                        ? 'bg-amber-500/10 border-l-2 border-l-amber-500'
                        : 'hover:bg-blue-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate font-medium ${!msg.is_read ? 'text-white' : 'text-blue-200/50'}`}>
                        {msg.name || msg.email}
                      </span>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-blue-200/50 truncate">{msg.subject}</p>
                    <p className="text-xs text-blue-200/30">{new Date(msg.created_at).toLocaleDateString('es-ES')}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right panel - message detail */}
          <div className="flex-1 min-h-[400px] max-h-[500px] sm:max-h-none sm:min-h-0 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl overflow-hidden flex flex-col">
            {selected ? (
              <>
                <div className="p-6 border-b border-blue-800 bg-blue-950/50">
                  <h2 className="text-xl font-bold text-white mb-3">{selected.subject}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-blue-200/70">
                    {selected.name && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-500" /> {selected.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-500" /> {selected.email}
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-amber-500" /> {selected.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      {new Date(selected.created_at).toLocaleString('es-ES')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {selected.is_read
                        ? <MailOpen className="w-4 h-4 text-green-400" />
                        : <Mail className="w-4 h-4 text-amber-400" />}
                      {selected.is_read ? 'Leído' : 'Sin leer'}
                    </span>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
                <div className="p-4 border-t border-blue-800/50 flex gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Responder por Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hola ${selected.name || ''}, recibimos tu mensaje sobre: ${selected.subject}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4" /> WhatsApp
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
