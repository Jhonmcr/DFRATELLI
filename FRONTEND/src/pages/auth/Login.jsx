/**
 * @file Login.jsx
 * @description Vista del formulario de Inicio de Sesión.
 * Recopila credenciales del usuario, envía el payload mediante `AuthContext`
 * y, tras un ingreso exitoso, redirige al usuario hacia el destino original
 * o la página de inicio.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login = () => {
  // ─── ESTADOS LOCALES & HOOKS GLOBALES ─────────────────────────────
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);                     // Estado del spinner en el botón principal
  
  const { login } = useAuth();        // Método asíncrono que negocia con el API
  const navigate = useNavigate();     // Redirecciones programáticas
  const location = useLocation();     // Acceso al estado de React Router (historail de páginas)

  // Recupera el intento de URL de destino si el usuario fue redirigido aquí a la fuerza (Ej. intentó ver el cart sin auth)
  const from = location.state?.from?.pathname || "/";

  // ─── MANEJADORES DE EVENTOS ───────────────────────────────────────

  /**
   * Actualización síncrona controlada por estado (Data Binding).
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Ejecuta el login consumiendo el contexto de autenticación,
   * despacha notificaciones visuales (toast) por posibles fallos
   * como contraseñas incorrectas y efectúa finalmente el redireccionamiento go-back.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene Action post del formulario HTML
    
    // Validación UI local antes de golpear el Backend
    if (!formData.email || !formData.password) {
      return toast.error("Por favor completa todos los campos", { icon: "✍️" });
    }

    setIsLoading(true);
    try {
      await login(formData);
      toast.success("¡Bienvenido de vuelta!", { icon: "👋" });
      navigate(from, { replace: true }); // Envía al usuario de donde vino (o a /), borrando /login del historial
    } catch (error) {
      console.error(error);
      toast.error(
          // Si el Backend Django arroja un mensaje de error legible (ej. Credenciales incorrectas) lo usa, si no asume error general
          error.response?.data?.detail || 
          error.response?.data?.error || 
          "Error de autenticación. Verifica tus datos."
      );
    } finally {
      setIsLoading(false); // Retira el Loader Spinner independientemente del success/fail
    }
  };

  // ─── RENDERIZADO VISUAL ───────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-start justify-center bg-amber-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ─── DECORACIÓN DE FONDO ABSTRACTA ─── */}
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-80 h-80 bg-[#5C3D11]/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* ─── CAJA DEL FORMULARIO ─── */}
      <div className="max-w-md w-full space-y-8 z-10">
        
        {/* Cabecera / Marca */}
        <div className="text-center">
          <Link to="/" className="inline-block group mx-auto mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 mx-auto shadow-xl shadow-amber-500/20 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="h-8 w-8 text-gray-900" />
            </div>
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Acceso a tu cuenta
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600">
            ¿Eres nuevo por aquí?{" "}
            <Link to="/register" className="font-medium text-amber-600 hover:text-orange-300 transition-colors">
              Crea tu cuenta gratis hoy mismo
            </Link>
          </p>
        </div>

        {/* Formulario Principal de Credenciales */}
        <form className="mt-8 bg-white backdrop-blur-md border border-amber-300 p-8 rounded-2xl shadow-2xl" onSubmit={handleSubmit}>
          <div className="space-y-6">
            
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ejemplo@dfratelli.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              autoFocus // Enfoca inmediato al cargar para acelerar UX
            />

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
              />
              {/* Opción de olvido (Funcional en el Backend pero asume existir la ruta /forgot-password) */}
              <div className="flex justify-end mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-medium text-gray-600 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              size="full"
              isLoading={isLoading} // Controla la transición a spinner rotatorio
              icon={!isLoading ? ArrowRight : null}
              className="group text-lg"
            >
              Iniciar Sesión
            </Button>
          </div>
          
          {/* Confianza Corporativa / Microcopy */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500 space-x-2">
            <ShieldCheck className="w-4 h-4 text-green-500/80" />
            <span>Tus datos están protegidos por encriptación avanzada.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
