/**
 * @file Register.jsx
 * @description Pantalla de registro para nuevos usuarios.
 * Recoge información de cuenta y perfil, validando contraseñas, 
 * y llama al método `register` del AuthContext. Tras confirmar cuenta en DB, 
 * auto-loguea al usuario para optimizar su experiencia de embarque (onboarding).
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Lock, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Register = () => {
  // ─── ESTADOS Y HOOKS DE NAVEGACIÓN ───────────────────────────────
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",  // Opcional en UI pero previsto por el Serializer DRF
    last_name: "",   // Opcional
    password: "",
    confirm_password: "", // Estrictamente local, se tira antes de enviar al backend
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const { register, login } = useAuth(); // register() para crear, login() para reingreso inmediato
  const navigate = useNavigate();

  // ─── MANEJADORES DE INTERACTIVIDAD ───────────────────────────────

  /**
   * Actualización sincronizada con el modelo local de estado
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Valida paridad de contraseñas localmente. Delega la creación de cuenta
   * al backend remitiendo la payload, e inmediatamente inicia sesión de vuelta (Auto-Login).
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación UI Previa: Evitar tráfico inútil si fallan contraseñas
    if (formData.password !== formData.confirm_password) {
      return toast.error("Las contraseñas no coinciden", { icon: "🔒" });
    }

    if (formData.password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    setIsLoading(true);
    
    // Preparación de Payload: Se sustrae 'confirm_password' ya que no pertenece a la tabla DB
    const { confirm_password, ...submitData } = formData;
    
    try {
      // 1. Envía el intento de registro
      await register(submitData);
      
      // 2. Notificación en pantalla
      toast.success("Cuenta creada exitosamente. ¡Bienvenido!");
      
      // 3. Auto-Login silencioso para ahorrar clicks al nuevo usuario
      await login({ 
          email: formData.email, 
          password: formData.password 
      });
      
      // 4. Redirige a Homepage (o redirigir a Onboarding)
      navigate("/");
      
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.email?.[0] 
                        || error.response?.data?.username?.[0]
                        || error.response?.data?.error
                        || "No se pudo crear la cuenta. Verifica tus datos.";
      toast.error(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── ESTRUCTURA DE COMPONENTE VISUAL ─────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0f05] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
      {/* ─── FONDOS / GRADIENTES ABSTRACTOS ─── */}
      <div className="absolute top-0 left-0 -ml-40 -mt-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mr-40 -mb-20 w-80 h-80 bg-[#5C3D11]/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-8 z-10 relative">
        <div className="text-center">
          <Link to="/" className="inline-block group mx-auto mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 mx-auto shadow-xl shadow-orange-500/20 group-hover:-translate-y-1 transition-transform">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Únete a DFRATELLI
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 bg-[#2a1b0a]/80 backdrop-blur-md border border-[#5C3D11]/50 p-8 rounded-2xl shadow-2xl" onSubmit={handleSubmit}>
          
          <div className="space-y-5">
            {/* Grid dual para Nombres Optativos */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nombre"
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Opcional"
                    value={formData.first_name}
                    onChange={handleChange}
                />
                <Input
                    label="Apellido"
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Opcional"
                    value={formData.last_name}
                    onChange={handleChange}
                />
            </div>

            <Input
              label="Nombre de Usuario"
              id="username"
              name="username"
              type="text"
              required
              placeholder="Ej. JuanPerez99"
              value={formData.username}
              onChange={handleChange}
              icon={User}
            />

            <Input
              label="Correo Electrónico"
              id="email"
              name="email"
              type="email"
              required
              placeholder="ejemplo@dfratelli.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
            />

            <Input
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
            />

            <Input
              label="Confirmar Contraseña"
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              placeholder="Repite la contraseña"
              value={formData.confirm_password}
              onChange={handleChange}
              icon={ShieldCheck}
            />
          </div>

          <div className="mt-8 pt-4 border-t border-[#5C3D11]/30">
            <Button
              type="submit"
              variant="primary"
              size="full"
              isLoading={isLoading}
              icon={!isLoading ? ArrowRight : null}
              className="group text-lg"
            >
              Completar Registro
            </Button>
          </div>
          
          <div className="mt-6 text-center text-xs justify-center text-gray-500">
            Al registrarte confirmas que aceptas nuestros <br/>
            <a href="#" className="underline hover:text-orange-500">Términos del Servicio</a> y <a href="#" className="underline hover:text-orange-500">Privacidad</a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
