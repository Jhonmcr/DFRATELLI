"""
Module: admin.py
App: cart
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Configuración del panel de administración de Django para la app cart.
    Registra los modelos Cart y CartItem para que sean gestionables
    desde el panel administrativo de Django (/admin/).

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.contrib import admin   # Módulo del panel de administración de Django
from .models import Cart, CartItem  # Modelos del carrito a registrar


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Configuración del modelo Cart en el panel de administración."""
    list_display = ("id", "user", "created_at")   # Columnas visibles en la lista
    search_fields = ("user__email",)              # Búsqueda por email del usuario


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Configuración del modelo CartItem en el panel de administración."""
    list_display = ("id", "cart", "product", "quantity")  # Columnas visibles en la lista
    list_filter = ("product",)                            # Filtros laterales por producto
