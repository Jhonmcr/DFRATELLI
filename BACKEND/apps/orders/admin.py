"""
Module: admin.py
App: orders
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Configuración del panel de administración de Django para la app orders.
    Registra los modelos Order, OrderItem y UserNotification para que sean
    gestionables desde el panel administrativo en /admin/.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.contrib import admin                        # Módulo del panel de administración de Django
from .models import Order, OrderItem, UserNotification  # Modelos de órdenes a registrar


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Configuración del modelo Order en el panel de administración."""
    list_display = ("id", "user", "status", "total", "created_at")  # Columnas visibles en la lista
    list_filter = ("status",)                                        # Filtro lateral por estado
    search_fields = ("user__email",)                                 # Búsqueda por email del usuario
    ordering = ("-created_at",)                                      # Órdenes más recientes primero


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Configuración del modelo OrderItem en el panel de administración."""
    list_display = ("id", "order", "product", "quantity", "price")  # Columnas visibles en la lista
    search_fields = ("product__name",)                              # Búsqueda por nombre del producto


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    """Configuración del modelo UserNotification en el panel de administración."""
    list_display = ("id", "user", "order", "is_read", "created_at")  # Columnas visibles en la lista
    list_filter = ("is_read",)                                        # Filtro por estado de lectura
    search_fields = ("user__email", "message")                        # Búsqueda por email o mensaje
