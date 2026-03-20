"""
Module: permissions.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define clases de permisos personalizados para controlar el acceso
    a las operaciones del catálogo de productos según el rol del usuario.

    Permisos definidos:
    - IsAdminOrReadOnly: Lectura pública, escritura solo para ADMIN/SUPERADMIN.
    - IsSuperAdmin: Acceso exclusivo para usuarios con rol SUPERADMIN.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import permissions  # Clase base de permisos de DRF


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que permite lectura pública y escritura solo a administradores.

    - Métodos seguros (GET, HEAD, OPTIONS): acceso libre, incluso sin autenticación.
    - Métodos de escritura (POST, PUT, PATCH, DELETE): requieren autenticación
      y rol ADMIN o SUPERADMIN.
    """

    def has_permission(self, request, view):
        """
        Evalúa si el usuario tiene permiso para la acción solicitada.

        Args:
            request: Petición HTTP entrante.
            view: Vista que gestiona la petición.

        Returns:
            bool: True si el acceso está permitido, False en caso contrario.
        """
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS son métodos seguros
            return True                                  # Lectura abierta sin autenticación

        # Para escritura: requiere estar autenticado Y tener rol de admin
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'SUPERADMIN']


class IsSuperAdmin(permissions.BasePermission):
    """
    Permiso exclusivo para usuarios con rol SUPERADMIN.

    Restringe el acceso a operaciones críticas que solo el superadministrador
    del sistema puede realizar (como cambiar roles de otros usuarios).
    """

    def has_permission(self, request, view):
        """
        Evalúa si el usuario tiene el rol SUPERADMIN.

        Args:
            request: Petición HTTP entrante.
            view: Vista que gestiona la petición.

        Returns:
            bool: True solo si el usuario está autenticado y su rol es SUPERADMIN.
        """
        return request.user.is_authenticated and request.user.role == 'SUPERADMIN'
