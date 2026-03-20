/**
 * @file AdminLayout.jsx
 * @description Estructura base para el panel de administración
 */
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#1a0f05]">
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
