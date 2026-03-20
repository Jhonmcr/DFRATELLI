"""
Module: admin.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Configuración del panel de administración de Django para la app users.
    Registra el modelo User personalizado extendiendo BaseUserAdmin de Django,
    añadiendo soporte para roles, búsqueda avanzada y organización por fieldsets.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.contrib import admin                            # Módulo del panel de administración de Django
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin  # Admin base para modelos de usuario
from .models import User                                    # Modelo de usuario personalizado


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Configuración del modelo User personalizado en el panel de administración.

    Extiende BaseUserAdmin para soportar el login por email, visualización de roles
    y la creación de usuarios desde el panel con los campos correctos.
    """

    # Columnas visibles en la lista de usuarios del panel admin
    list_display = ("email", "username", "role", "is_active", "is_staff")

    # Filtros laterales disponibles en la lista
    list_filter = ("role", "is_active", "is_staff")

    # Campos por los que se puede buscar en la barra de búsqueda
    search_fields = ("email", "username")

    # Ordenamiento predeterminado de la lista por email
    ordering = ("email",)

    # Organización de campos en la vista de edición de un usuario existente
    fieldsets = (
        (None,                    {"fields": ("email", "password")}),         # Credenciales de acceso
        ("Información personal",  {"fields": ("username",)}),                # Datos básicos del usuario
        ("Permisos",              {"fields": ("role", "is_active", "is_staff", "is_superuser")}),  # Control de acceso
        ("Fechas importantes",    {"fields": ("last_login",)}),              # Historial de actividad
    )

    # Organización de campos en el formulario de creación de un nuevo usuario
    add_fieldsets = (
        (None, {
            "classes": ("wide",),   # Estilo visual amplio para el formulario
            "fields": ("email", "username", "role", "password1", "password2"),  # Campos requeridos al crear
        }),
    )

    filter_horizontal = ()  # Sin filtros de relaciones Many-to-Many en horizontal (no aplica aquí)
