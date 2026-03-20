"""
Module: urls.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define las rutas URL del módulo de productos usando un DefaultRouter de DRF.
    Registra automáticamente los endpoints CRUD para categories, brands, reviews
    y products, más una ruta manual para filtrar productos por categoría.

    Endpoints principales generados:
        /products/                          -> CRUD de productos
        /products/categories/               -> CRUD de categorías
        /products/brands/                   -> CRUD de marcas
        /products/reviews/                  -> CRUD de reseñas
        /products/category/<id>/products/   -> Productos de una categoría

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.urls import path, include               # Funciones para definir rutas y sub-rutas
from rest_framework.routers import DefaultRouter    # Router que genera URLs CRUD automáticamente
from .views import (
    ProductViewSet,          # ViewSet: CRUD completo de productos
    CategoryViewSet,         # ViewSet: CRUD completo de categorías
    BrandViewSet,            # ViewSet: CRUD completo de marcas
    ProductsByCategoryView,  # Vista: lista productos de una categoría específica
    ReviewViewSet            # ViewSet: CRUD completo de reseñas
)

router = DefaultRouter()  # Crea un router que genera automáticamente los URLs estándar REST

# Registra cada ViewSet en el router con su prefijo de URL y nombre base
router.register(r"categories", CategoryViewSet, basename="category")  # /products/categories/
router.register(r"brands",     BrandViewSet,    basename="brand")     # /products/brands/
router.register(r"reviews",    ReviewViewSet,   basename="review")    # /products/reviews/
router.register(r"",           ProductViewSet,  basename="product")   # /products/ (debe ir al final)

urlpatterns = [
    # Ruta manual para filtrar productos por ID de categoría
    path("category/<int:category_id>/products/", ProductsByCategoryView.as_view(), name="products_by_category"),

    # Incluye todas las rutas generadas automáticamente por el router
    path("", include(router.urls)),
]
