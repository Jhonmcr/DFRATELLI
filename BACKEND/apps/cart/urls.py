"""
Module: urls.py
App: cart
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define las rutas URL del módulo de carrito de compras.
    Mapea cada endpoint a su vista correspondiente para las
    operaciones de consulta, adición y modificación del carrito.

    Endpoints:
        GET  /cart/              -> Ver carrito del usuario autenticado
        POST /cart/items/        -> Agregar producto al carrito
        PUT  /cart/items/<id>/   -> Actualizar cantidad de un ítem
        DEL  /cart/items/<id>/   -> Eliminar un ítem del carrito

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.urls import path                   # Función para definir rutas URL
from .views import (
    CartDetailView,      # Vista para consultar el carrito completo
    AddToCartView,       # Vista para agregar productos al carrito
    CartItemDetailView,  # Vista para actualizar o eliminar ítems del carrito
)

urlpatterns = [
    # GET /cart/ - Obtiene el carrito completo del usuario autenticado
    path("", CartDetailView.as_view(), name="cart_detail"),

    # POST /cart/items/ - Agrega un producto al carrito
    path("items/", AddToCartView.as_view(), name="cart_item_add"),

    # PUT/PATCH/DELETE /cart/items/<item_id>/ - Actualiza cantidad o elimina un ítem
    path("items/<int:item_id>/", CartItemDetailView.as_view(), name="cart_item_detail"),
]
