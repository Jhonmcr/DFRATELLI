/**
 * @file Profile.jsx
 * @description Vista del Perfil de Usuario.
 * Permite a usuarios visualizar sus datos base, cuenta (Roles) y lo más
 * importante, cambiar entre pestañas de navegación interna como 
 * Historial de Compras, Notificaciones del Sistema y Ajustes visuales.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { User, Package, Settings, Bell, Clock, CreditCard, ExternalLink, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profile = () => {
    // ─── DEPENDENCIAS DE CONTEXTO E HISTORIAL ────────────────────────
    
    const { user, logout } = useAuth();                  // Info de JWT desencriptada limitadamente
    const [searchParams, setSearchParams] = useSearchParams(); // Leer ?tab=orders, etc.
    const navigate = useNavigate();

    // ─── MANEJADORES DE ESTADO (Carga Diferida por Componentes) ──────
    
    // Tab de navegación activa en el panel Izquierdo ('profile', 'orders', 'notifications')
    const activeTab = searchParams.get('tab') || 'profile';

    // Estados para Historiales Locales (Data Backend)
    const [orders, setOrders] = useState([]);                  // Array de ordenes creadas
    const [stats, setStats] = useState(null);                  // Stats extraídas de su profile completo api
    const [fullProfile, setFullProfile] = useState(null);      // Objeto completo /users/profile/ (con name, phone, codigo, etc)
    const [isLoadingData, setIsLoadingData] = useState(true);

    // ─── EJECUCIÓN DEL CICLO DE VIDA (DidMount && DidUpdate) ─────────

    useEffect(() => {
        // Redirige a Login si burla la UI protegida tecleando /profile en barra manualmente
        if (!user) {
            navigate("/login");
            return;
        }
        
        // Pide los datos duros
        fetchUserData();
    }, [user, navigate]);

    // ─── CONSULTAS DE RED (APIs) ─────────────────────────────────────

    /**
     * Orquestador que realiza consultas en paralelo (Promise.all) para
     * nutrir al perfil con datos de facturación e identificadores completos.
     */
    const fetchUserData = async () => {
        setIsLoadingData(true);
        try {
            // Requiere autenticación Bearer por su token JWT almacenado.
            // Si el token expira dentro de request (401), el interceptor en api.js lo manejaría.
            const [profileRes, ordersRes] = await Promise.all([
                api.get("/users/profile/"),     // Datos PII del cliente
                api.get("/orders/my-orders/")   // Relacional History Histórico
            ]);
            
            setFullProfile(profileRes.data);
            setOrders(ordersRes.data);
            
            // Computa rápidamente sumatorias para mostrar en el Top Card
            const totalSpent = ordersRes.data.reduce((sum, order) => sum + parseFloat(order.total), 0);
            setStats({
                totalOrders: ordersRes.data.length,
                totalSpent: totalSpent
            });

        } catch (error) {
            console.error("Error cargando dashboard del perfil:", error);
            // Considerar auto-logout si el error en /profile es un 401 severo (Bloqueo de cuenta remota)
        } finally {
            setIsLoadingData(false);
        }
    };

    // ─── UTILIDADES GRÁFICAS DEL COMPONENTE ─────────────────────────

    const formatPrice = (amount) => {
        return parseFloat(amount).toLocaleString('en-US', {
            style: 'currency', currency: 'USD'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    /**
     * Devuelve una pildora visual de status tailwind coloreada 
     * emparejando la Key recibida del Backend DRF choice list.
     */
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':   return "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50";
            case 'PAID':      return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
            case 'SHIPPED':   return "bg-orange-500/20 text-orange-400 border border-orange-500/50";
            case 'DELIVERED': return "bg-green-500/20 text-green-400 border border-green-500/50";
            case 'CANCELLED': return "bg-red-500/20 text-red-500 border border-red-500/50";
            default:          return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': 'Pendiente', 'PAID': 'Pagada', 'SHIPPED': 'Enviada', 
            'DELIVERED': 'Entregada', 'CANCELLED': 'Cancelada'
        };
        return labels[status] || status;
    };


    // ─── RENDERIZADOS CONDICIONALES SECCIONALES ─────────────────────

    // Sub-renderizado de Pestaña "Información y Perfil" (Tab = 'profile')
    const renderProfileTab = () => (
        <div className="bg-[#2a1b0a] border border-[#5C3D11]/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#5C3D11]/30 pb-4">Detalles de la Cuenta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 text-gray-300">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Correo Electrónico</p>
                        <p className="font-medium text-white text-lg bg-[#1a0f05] px-4 py-3 rounded-lg border border-[#5C3D11]/50">{fullProfile?.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nombre de Usuario</p>
                        <p className="font-medium text-white text-lg bg-[#1a0f05] px-4 py-3 rounded-lg border border-[#5C3D11]/50">{fullProfile?.username || user?.username}</p>
                    </div>
                </div>

                <div className="space-y-6 text-gray-300">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tipo de Membresía</p>
                        <div className="bg-[#1a0f05] px-4 py-3 rounded-lg border border-[#5C3D11]/50 flex items-center justify-between">
                            <span className="font-medium text-white text-lg capitalize">{fullProfile?.role?.toLowerCase() || 'Cliente'}</span>
                            <ShieldCheck className={`h-5 w-5 ${(fullProfile?.role === 'ADMIN' || fullProfile?.role === 'SUPERADMIN') ? 'text-orange-500' : 'text-gray-500'}`} />
                        </div>
                    </div>
                    {/* Exclusivo código para personal administrativo corporativo */}
                    {(fullProfile?.role === 'ADMIN' || fullProfile?.role === 'SUPERADMIN') && fullProfile?.unique_code && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">Código Identificador Corporativo</p>
                            <p className="font-mono text-orange-400 bg-orange-900/10 px-4 py-3 rounded-lg border border-orange-500/30 font-bold uppercase tracking-[0.2em]">
                                {fullProfile.unique_code}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#5C3D11]/30">
                <p className="text-gray-400 text-sm mb-4">La modificación de perfil y contraseñas está sujeta a verificación de seguridad bidireccional.</p>
                <div className="flex gap-4">
                    <button disabled className="px-6 py-2.5 bg-[#1a0f05] text-gray-500 border border-[#5C3D11]/30 rounded-lg cursor-not-allowed">Editar Información</button>
                    <button disabled className="px-6 py-2.5 bg-[#1a0f05] text-gray-500 border border-[#5C3D11]/30 rounded-lg cursor-not-allowed">Cambiar Contraseña</button>
                </div>
            </div>
        </div>
    );

    // Sub-renderizado de Pestaña "Historial de Compras" (Tab = 'orders')
    const renderOrdersTab = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Mis Compras</h3>
            {orders.length === 0 ? (
                <div className="bg-[#2a1b0a] border border-[#5C3D11]/30 rounded-2xl p-12 text-center shadow-inner">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-xl text-white font-medium mb-2">Aún no tienes historial de compras</p>
                    <p className="text-gray-400">Cuando realices compras aparecerán aquí listadas y documentadas.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-[#2a1b0a] border border-[#5C3D11]/50 rounded-xl p-5 shadow-sm hover:border-orange-500/30 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 border-b border-[#5C3D11]/30 pb-4 mb-4">
                                <div>
                                    <span className="text-gray-400 text-sm font-medium">Orden <span className="text-white font-mono">#{order.id.toString().padStart(5, '0')}</span></span>
                                    <div className="text-white font-medium mt-1 flex items-center text-sm">
                                        <Clock className="w-3.5 h-3.5 text-gray-500 mr-2" />
                                        {formatDate(order.created_at)}
                                    </div>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className={`px-3 py-1 text-xs font-bold rounded shadow-sm ${getStatusStyle(order.status)} uppercase tracking-wider`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Extracto condensado de Items (Máx 2 visibles para ahorrar alto de bloque) */}
                            <div className="space-y-2 mb-4">
                                {order.items.slice(0, 2).map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="text-gray-300 flex items-center">
                                            <span className="bg-[#1a0f05] text-gray-400 px-2 py-0.5 rounded mr-3 border border-[#5C3D11]">x{item.quantity}</span>
                                            {item.product?.name || 'Recurso Histórico Eliminado'}
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <p className="text-xs text-orange-500 font-medium cursor-pointer">+ {order.items.length - 2} items adicionales... (ver detalle completo)</p>
                                )}
                            </div>

                            <div className="flex justify-between items-end pt-4 bg-[#1a0f05] -mx-5 -mb-5 px-5 py-4 rounded-b-xl border-t border-[#5C3D11]/50">
                                <button className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-1"/> Soporte
                                </button>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block mb-0.5 uppercase tracking-widest font-bold">Total Cancelado</span>
                                    <span className="text-xl font-bold text-white">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // ─── VISUAL MASTER: Loading Wrapper y Estructura Dashboard ══════════════
    
    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-[#1a0f05] flex justify-center items-center pt-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a0f05] min-h-screen pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. Header (Banner Bienvenida e Indicadores Rápidos) */}
                <div className="bg-[#2a1b0a] border border-[#5C3D11]/50 rounded-2xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none">
                        <Activity className="w-64 h-64 text-orange-500" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end z-10 relative">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                                Hola, <span className="text-orange-500">{fullProfile?.first_name || fullProfile?.username || 'Usuario'}</span>
                            </h1>
                            <p className="text-gray-400">Panel administrativo personal y preferencias de tu cuenta.</p>
                        </div>

                        {/* Ticker / Recuento resumido para clientes (Incentiva recompra) */}
                        <div className="mt-6 md:mt-0 flex gap-4">
                            <div className="bg-[#1a0f05] border border-[#5C3D11]/50 px-5 py-3 rounded-xl min-w-[120px]">
                                <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Órdenes Realizadas</span>
                                <span className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</span>
                            </div>
                            <div className="bg-[#1a0f05] border border-orange-500/30 px-5 py-3 rounded-xl min-w-[140px]">
                                <span className="block text-xs text-orange-500/70 font-bold uppercase tracking-wider mb-1">Total Histórico</span>
                                <span className="text-2xl font-bold text-orange-500">{formatPrice(stats?.totalSpent || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Grid de Navegación + Tab Content (Layout 3:9) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Barra de Menú lateral Izquierda (Sidebar) */}
                    <div className="lg:col-span-1 space-y-2">
                        <button
                            onClick={() => setSearchParams({ tab: 'profile' })}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#2a1b0a] text-gray-400 hover:bg-[#3a2610] hover:text-white border border-[#5C3D11]/30'}`}
                        >
                            <User className="w-5 h-5 mr-3" /> <span className="font-medium">Mi Cuenta</span>
                        </button>
                        
                        <button
                            onClick={() => setSearchParams({ tab: 'orders' })}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#2a1b0a] text-gray-400 hover:bg-[#3a2610] hover:text-white border border-[#5C3D11]/30'}`}
                        >
                            <Package className="w-5 h-5 mr-3" /> <span className="font-medium">Historial de Órdenes</span>
                        </button>
                        
                        <button
                            onClick={() => setSearchParams({ tab: 'notifications' })}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#2a1b0a] text-gray-400 hover:bg-[#3a2610] hover:text-white border border-[#5C3D11]/30'}`}
                        >
                            <Bell className="w-5 h-5 mr-3" /> <span className="font-medium">Notificaciones</span>
                        </button>

                        <button
                            className="w-full flex items-center px-4 py-3 rounded-xl bg-[#2a1b0a] text-gray-400 border border-[#5C3D11]/30 opacity-50 cursor-not-allowed mt-4"
                            disabled
                        >
                            <Settings className="w-5 h-5 mr-3" /> <span className="font-medium">Ajustes Web</span>
                        </button>
                        
                        {/* El Logout cierra la sesión y redibujará el Effect forzandolo a expulsar al Login Screen */}
                        <div className="pt-8 border-t border-[#5C3D11]/30 mt-8">
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 font-medium"
                            >
                                Cerrar Sesión Segura
                            </button>
                        </div>
                    </div>

                    {/* Contenido / Vista central del Tab */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && renderProfileTab()}
                        {activeTab === 'orders' && renderOrdersTab()}
                        {activeTab === 'notifications' && (
                            <div className="bg-[#2a1b0a] border border-[#5C3D11]/30 rounded-2xl p-12 text-center shadow-inner">
                                <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-xl text-white font-medium mb-2">No hay notificaciones nuevas</p>
                                <p className="text-gray-400">Te avisaremos sobre envíos de tus compras o cambios en cuenta.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
