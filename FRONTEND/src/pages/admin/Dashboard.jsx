/**
 * @file Dashboard.jsx
 * @description Panel principal de administración
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="text-gray-900 max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
      <p className="text-gray-600 mb-8">Bienvenido al panel de control corporativo. Selecciona un módulo para gestionar.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/products" className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-amber-500 transition-all flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Productos</h2>
          <p className="text-sm text-gray-500 mt-2">Gestiona el inventario, categorías y precios.</p>
        </Link>

        <Link to="/admin/brands" className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-blue-500 transition-all flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Marcas</h2>
          <p className="text-sm text-gray-500 mt-2">Agrega o elimina marcas aliadas para el catálogo.</p>
        </Link>

        <Link to="/admin/orders" className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-green-500 transition-all flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Pedidos</h2>
          <p className="text-sm text-gray-500 mt-2">Revisa, aprueba y despacha las órdenes entrantes.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
