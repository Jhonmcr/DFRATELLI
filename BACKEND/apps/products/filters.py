"""
Module: filters.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define el filtro avanzado para el modelo Product usando django-filters.
    Permite filtrar el catálogo por rango de precios (precio mínimo y máximo),
    categoría y si el producto está en oferta.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

import django_filters       # Librería de filtros avanzados para Django/DRF
from .models import Product  # Modelo de producto a filtrar


class ProductFilter(django_filters.FilterSet):
    """
    Clase de filtro avanzado para el modelo Product.

    Permite a los clientes de la API filtrar productos usando parámetros
    de query string como ?price_min=100&price_max=500&is_on_sale=true.

    Filters:
        price_min (NumberFilter): Filtra productos con precio >= al valor indicado.
        price_max (NumberFilter): Filtra productos con precio <= al valor indicado.
        category (campo automático): Filtra por ID exacto de categoría.
        is_on_sale (campo automático): Filtra productos en oferta (true/false).
    """

    # Filtro de precio mínimo: retorna productos con precio mayor o igual al valor
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")

    # Filtro de precio máximo: retorna productos con precio menor o igual al valor
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product                                        # Modelo sobre el que se aplican los filtros
        fields = ["category", "price_min", "price_max", "is_on_sale"]  # Parámetros de filtrado disponibles
