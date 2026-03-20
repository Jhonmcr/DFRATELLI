"""
Module: permissions.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretelli

Descripción:
    Define clases de permisos personalizados para el módulo de usuarios.
    Controla el acceso a operaciones administrativas según el rol del usuario
    autenticado en el sistema.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework.permissions import BasePermission  # Clase base de permisos de DRF


class IsAdminOrSuperAdmin(BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol ADMIN o SUPERADMIN.

    Usado para proteger vistas de gestión que requieren privilegios
    de administrador pero no necesariamente de superadministrador.
    """

    def has_permission(self, request, view):
        """
        Verifica que el usuario autenticado tenga rol de administrador.

        Args:
            request: Petición HTTP entrante.
            view: Vista que gestiona la petición.

        Returns:
            bool: True si el usuario está autenticado y su rol es ADMIN o SUPERADMIN.
        """
        return request.user.is_authenticated and request.user.role in ["ADMIN", "SUPERADMIN"]


class IsSuperAdmin(BasePermission):
    """
    Permiso exclusivo para usuarios con rol SUPERADMIN.

    Protege operaciones críticas como el cambio de roles de otros usuarios,
    que solo el superadministrador del sistema puede realizar.
    """

    def has_permission(self, request, view):
        """
        Verifica que el usuario autenticado tenga rol de superadministrador.

        Args:
            request: Petición HTTP entrante.
            view: Vista que gestiona la petición.

        Returns:
            bool: True solo si el usuario está autenticado y su rol es SUPERADMIN.
        """
        return request.user.is_authenticated and request.user.role == "SUPERADMIN"
