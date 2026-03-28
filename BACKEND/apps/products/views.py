"""
Module: views.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Vistas de la API REST para la gestión del catálogo de productos.
    Implementa ViewSets para Brand, Category y Product con soporte completo
    de filtros, búsqueda textual y ordenamiento. Incluye también vistas
    para productos por categoría y el sistema de reseñas de usuarios.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import generics, viewsets, filters  # Vistas genéricas, ViewSets y backends de filtrado
from django_filters.rest_framework import DjangoFilterBackend  # Backend de filtrado avanzado con django-filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly  # Lectura pública, escritura solo autenticados

from .models import Product, Category, Review, Brand
from .serializers import (                             # Serializers para cada modelo
    ProductSerializer,
    CategorySerializer,
    ReviewSerializer,
    BrandSerializer
)
from .permissions import IsAdminOrReadOnly              # Permiso personalizado: lectura libre, escritura solo admins
from .filters import ProductFilter                     # Clase de filtro avanzado para productos

from django.db.models import Count  # Función de agregación para contar productos por categoría


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD sobre marcas (Brand).

    Endpoints generados automáticamente por el router:
        GET    /products/brands/       -> Listar marcas
        POST   /products/brands/       -> Crear marca (ADMIN/SUPERADMIN)
        GET    /products/brands/<id>/  -> Detalle de marca
        PUT    /products/brands/<id>/  -> Actualizar marca (ADMIN/SUPERADMIN)
        DELETE /products/brands/<id>/  -> Eliminar marca (ADMIN/SUPERADMIN)
    """

    queryset = Brand.objects.all().order_by("name")  # Marcas ordenadas alfabéticamente
    serializer_class = BrandSerializer               # Serializer para la representación JSON
    permission_classes = [IsAdminOrReadOnly]         # Lectura pública, escritura solo para admins


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD sobre categorías (Category).

    El queryset incluye una anotación con el conteo de productos por categoría,
    disponible como product_count en el serializer.

    Endpoints generados automáticamente por el router:
        GET    /products/categories/       -> Listar categorías con conteo de productos
        POST   /products/categories/       -> Crear categoría (ADMIN/SUPERADMIN)
        GET    /products/categories/<id>/  -> Detalle de categoría
        PUT    /products/categories/<id>/  -> Actualizar categoría (ADMIN/SUPERADMIN)
        DELETE /products/categories/<id>/  -> Eliminar categoría (ADMIN/SUPERADMIN)
    """

    # Anota cada categoría con la cantidad de productos que contiene
    queryset = Category.objects.annotate(product_count=Count('product')).order_by("name")
    serializer_class = CategorySerializer             # Serializer con product_count incluido
    permission_classes = [IsAdminOrReadOnly]          # Lectura pública, escritura solo para admins


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD sobre productos, con filtros avanzados.

    Soporta:
    - Filtros exactos por categoría, precio y oferta.
    - Búsqueda de texto en nombre y descripción.
    - Ordenamiento por precio, nombre o ID.
    - Filtros avanzados con rango de precios (ProductFilter).

    Endpoints generados automáticamente por el router:
        GET    /products/           -> Listar productos (con filtros)
        POST   /products/           -> Crear producto (ADMIN/SUPERADMIN)
        GET    /products/<id>/      -> Detalle de producto
        PUT    /products/<id>/      -> Actualizar producto (ADMIN/SUPERADMIN)
        DELETE /products/<id>/      -> Eliminar producto (ADMIN/SUPERADMIN)
    """

    queryset = Product.objects.all().order_by("name")  # Productos ordenados alfabéticamente
    serializer_class = ProductSerializer               # Serializer con categoría y reseñas anidadas
    permission_classes = [IsAdminOrReadOnly]           # Lectura pública, escritura solo para admins

    # Backends de filtrado que se aplicarán en orden
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ["category", "price", "is_on_sale"]  # Filtros exactos por campo
    search_fields = ["name", "description"]                  # Campos de búsqueda de texto libre
    ordering_fields = ["price", "name", "id"]                # Campos disponibles para ordenamiento
    filterset_class = ProductFilter                          # Clase de filtro avanzado (rango de precios)


class ProductsByCategoryView(generics.ListAPIView):
    """
    Vista GET: Lista todos los productos de una categoría específica.

    Endpoint: GET /products/category/<category_id>/products/
    Permiso: Público (sin autenticación requerida)
    """

    serializer_class = ProductSerializer  # Serializer con detalles completos del producto

    def get_queryset(self):
        """Filtra los productos por el ID de categoría pasado en la URL."""
        category_id = self.kwargs["category_id"]                    # Extrae el ID de categoría de la URL
        return Product.objects.filter(category_id=category_id)      # Filtra productos de esa categoría


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD sobre reseñas de productos (Review).

    Permite filtrar reseñas por producto. Al crear una reseña, el usuario
    se asigna automáticamente desde la sesión autenticada.

    Endpoints generados automáticamente por el router:
        GET    /products/reviews/            -> Listar reseñas (filtradas por ?product=<id>)
        POST   /products/reviews/            -> Crear reseña (autenticado)
        GET    /products/reviews/<id>/       -> Detalle de reseña
        PUT    /products/reviews/<id>/       -> Actualizar reseña
        DELETE /products/reviews/<id>/       -> Eliminar reseña
    """

    queryset = Review.objects.all()                        # Todas las reseñas del sistema
    serializer_class = ReviewSerializer                    # Serializer con datos del usuario incluidos
    permission_classes = [IsAuthenticatedOrReadOnly]       # Lectura pública, escritura requiere autenticación
    filter_backends = [DjangoFilterBackend]                # Filtrado por campos exactos
    filterset_fields = ['product']                         # Permite filtrar por ?product=<id>

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario autenticado al crear una reseña.

        Args:
            serializer: Serializer validado con los datos de la reseña.
        """
        serializer.save(user=self.request.user)  # Inyecta el usuario desde la petición
