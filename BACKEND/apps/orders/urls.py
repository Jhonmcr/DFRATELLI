"""
Module: urls.py
App: orders
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define las rutas URL del módulo de órdenes de compra.
    Incluye endpoints para clientes (consultar historial, crear orden, notificaciones)
    y para administradores (ver todas las órdenes, actualizar estados).

    Endpoints:
        GET    /orders/                  -> Historial de órdenes del usuario
        POST   /orders/create/           -> Crear una nueva orden desde el carrito
        GET    /orders/my-orders/        -> Lista de órdenes del usuario autenticado
        GET    /orders/<pk>/             -> Detalle de una orden específica
        PATCH  /orders/<pk>/update-status/ -> Actualizar estado (ADMIN/SUPERADMIN)
        GET    /orders/admin/all/        -> Todas las órdenes (ADMIN/SUPERADMIN)
        GET    /orders/notifications/    -> Notificaciones no leídas del cliente
        POST   /orders/notifications/    -> Marcar notificaciones como leídas

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.urls import path  # Función para definir rutas URL
from .views import (
    MyOrdersListView,          # Vista: lista de órdenes del usuario autenticado
    CreateOrderView,           # Vista: crear una nueva orden desde el carrito
    OrderHistoryView,          # Vista: historial de órdenes del usuario
    OrderDetailView,           # Vista: detalle de una orden específica
    UpdateOrderStatusView,     # Vista: actualizar estado de una orden (admin)
    AdminOrderListView,        # Vista: listar todas las órdenes (admin)
    ClientNotificationsView,   # Vista: notificaciones de estado para el cliente
)

urlpatterns = [
    # GET /orders/ - Historial completo de órdenes del usuario autenticado
    path("", OrderHistoryView.as_view(), name="order_history"),

    # POST /orders/create/ - Convierte el carrito actual en una orden
    path("create/", CreateOrderView.as_view(), name="create_order"),

    # GET /orders/my-orders/ - Lista de órdenes recientes del usuario
    path("my-orders/", MyOrdersListView.as_view(), name="my-orders"),

    # GET /orders/<pk>/ - Detalle de una orden específica del usuario
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),

    # PATCH /orders/<pk>/update-status/ - Cambia el estado de una orden (solo ADMIN/SUPERADMIN)
    path("<int:pk>/update-status/", UpdateOrderStatusView.as_view(), name="order-update-status"),

    # GET /orders/admin/all/ - Lista todas las órdenes del sistema (solo ADMIN/SUPERADMIN)
    path("admin/all/", AdminOrderListView.as_view(), name="admin-orders"),

    # GET/POST /orders/notifications/ - Consulta y marca como leídas las notificaciones del cliente
    path("notifications/", ClientNotificationsView.as_view(), name="client-notifications"),
]
