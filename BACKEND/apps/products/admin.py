"""
Module: admin.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Configuración del panel de administración de Django para la app products.
    Registra los modelos Category y Product con columnas de visualización,
    filtros y búsqueda para facilitar la gestión desde /admin/.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.contrib import admin        # Módulo del panel de administración de Django
from .models import Category, Product   # Modelos del catálogo a registrar


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Configuración del modelo Category en el panel de administración."""
    list_display = ("id", "name")   # Columnas visibles en la lista de categorías
    search_fields = ("name",)       # Barra de búsqueda por nombre de categoría


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Configuración del modelo Product en el panel de administración."""
    list_display = ("id", "name", "price", "category", "stock", "is_active", "is_on_sale")  # Columnas visibles
    list_filter = ("category", "is_active", "is_on_sale")  # Filtros laterales
    search_fields = ("name",)                              # Búsqueda por nombre de producto
