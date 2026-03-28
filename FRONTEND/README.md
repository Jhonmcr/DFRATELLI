# DFRATELLI - Ferretería E-Commerce (Frontend)

Este es el proyecto Frontend para el sistema de e-commerce y gestión administrativa de la Ferretería DFRATELLI. Ha sido construido utilizando **React** (Vite) y **TailwindCSS**, enfocado en brindar una experiencia de usuario responsiva, moderna y dinámica, tanto para clientes como para el personal administrativo.

> **Autor:** Jhon Michael Cariaco Rosales  
> **Email:** jhoncariaco@gmail.com  
> **GitHub:** [Jhonmcr](https://github.com/Jhonmcr)

## 📌 Características Principales
- **Autenticación Basada en Roles:** Acceso diferenciado para Usuarios (Clientes), Administradores y un SuperAdmin.
- **Catálogo Dinámico:** Filtrado de productos, vista por categorías y marcas, y sistema de favoritos.
- **Carrito y Compras:** Flujo transaccional completo con persistencia temporal.
- **Panel Administrativo (Dashboard):** Gestión completa del inventario (CRUD de productos y marcas), control y cambio de roles de usuario, revisión de órdenes y mensajería en tiempo real.
- **Estándares Visuales:** Sistema de temas personalizados utilizando TailwindCSS, animaciones ligeras con Framer Motion, e interfaces estilo "glassmorphism" modernas.

## 🚀 Instalación y Puesta en Marcha (Entorno Local)

Para ejecutar este proyecto en tu entorno de desarrollo, asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 16+ recomendada).

### 1. Clonar el repositorio y acceder a la carpeta
```bash
# Navega al directorio del frontend
cd FRONTEND
```

### 2. Instalar dependencias
Asegúrate de instalar todos los módulos descritos en el `package.json`:
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz de la carpeta `FRONTEND` e incluye las rutas de conexión al backend de Django. Ejemplo:
```env
VITE_API_URL=http://localhost:8000/api/
VITE_MEDIA_URL=http://localhost:8000
```
*(Asegúrate de que el backend de Django esté corriendo en paralelo en ese puerto si deseas conexión completa).*

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Esto desplegará la aplicación generalmente en `http://localhost:5173` (Vite). Podrás ver cualquier cambio que guardes en tiempo real gracias al Hot Module Replacement de Vite.

## 🛠️ Scripts Disponibles

En el directorio del proyecto, puedes correr:
- `npm run dev`: Inicia el modo desarrollo.
- `npm run build`: Compila la aplicación en un paquete listo para producción dentro de la carpeta `/dist`.
- `npm run preview`: Levanta el proyecto ya compilado para constatar que todo funcione correctamente como en producción.

## 📁 Estructura del Código

El código principal reside en `src/`:
- `/components`: Componentes aislados y reutilizables (Botones, Layouts, Tarjetas).
- `/context`: Manejadores de estado global (Autenticación, Carrito).
- `/pages`: Componentes de páginas completas ruteadas.
- `/services`: Configuraciones lógicas del cliente API (Axios).
