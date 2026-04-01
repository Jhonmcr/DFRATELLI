/**
 * @file AdminLayout.jsx
 * @description Componente/Módulo de la Ferretería DFRATELLI.
 * 
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

/**
/**
 * @file AdminLayout.jsx
 * @description Estructura base para el panel de administración
 */
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-100 pt-24 text-slate-800">
      <main className="flex-1 w-full max-w-full p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
