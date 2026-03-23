/**
 * @file AdminProducts.jsx
 * @description Gestión de productos admin
 */
import React from 'react';
import ProductList from '../../components/admin/ProductList';

const AdminProducts = () => {
  return (
    <div className="text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>
      <ProductList />
    </div>
  );
};

export default AdminProducts;
