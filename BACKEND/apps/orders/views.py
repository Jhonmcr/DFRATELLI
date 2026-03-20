"""
Module: views.py
App: orders
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Vistas de la API REST para la gestión de órdenes de compra.
    Incluye la creación de órdenes desde el carrito (con validación de stock
    y operación transaccional), el historial de órdenes, actualización de
    estados por administradores y el sistema de notificaciones al cliente.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework.views import APIView                      # Clase base para vistas genéricas
from rest_framework import generics                           # Vistas genéricas (ListAPIView, etc.)
from rest_framework.response import Response                  # Objeto de respuesta estándar de DRF
from rest_framework.permissions import IsAuthenticated        # Permiso: requiere autenticación
from django.db import transaction                             # Soporte para transacciones atómicas en DB
from rest_framework import status                             # Constantes de códigos de estado HTTP

from apps.cart.models import Cart, CartItem                   # Modelos del carrito para crear la orden
from .models import Order, OrderItem, UserNotification        # Modelos de órdenes y notificaciones
from .serializers import OrderSerializer                      # Serializer de órdenes para la respuesta JSON


class MyOrdersListView(generics.ListAPIView):
    """
    Vista GET: Lista las órdenes del usuario autenticado, ordenadas por fecha descendente.

    Endpoint: GET /orders/my-orders/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    serializer_class = OrderSerializer          # Serializer con ítems anidados
    permission_classes = [IsAuthenticated]      # Solo usuarios con sesión activa

    def get_queryset(self):
        """Filtra las órdenes para retornar solo las del usuario autenticado."""
        return Order.objects.filter(user=self.request.user).order_by("-created_at")  # Más recientes primero


class CreateOrderView(APIView):
    """
    Vista POST: Convierte el carrito activo del usuario en una orden de compra.

    Proceso:
    1. Valida que el carrito no esté vacío.
    2. Verifica que haya stock suficiente para todos los productos (Fail Fast).
    3. Crea la orden y sus ítems dentro de una transacción atómica.
    4. Descuenta el stock de cada producto.
    5. Vacía el carrito al finalizar.

    Endpoint: POST /orders/create/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    permission_classes = [IsAuthenticated]  # Solo usuarios con sesión activa pueden crear órdenes

    def post(self, request):
        """Maneja la solicitud POST para crear una orden desde el carrito."""
        user = request.user                                    # Usuario que realiza la compra
        cart = Cart.objects.filter(user=user).first()          # Obtiene el carrito del usuario

        if not cart or cart.items.count() == 0:                # Valida que el carrito no esté vacío
            return Response({"error": "El carrito está vacío"}, status=400)

        # ── Fase 1: Validación previa de stock (Fail Fast) ──────────────────────────
        items = cart.items.all()                               # Obtiene todos los ítems del carrito
        for item in items:
            if item.quantity > item.product.stock:             # Verifica stock antes de procesar
                return Response(
                    {"error": f"Stock insuficiente para el producto: {item.product.name}"},
                    status=400
                )

        # ── Fase 2: Creación transaccional de la orden ──────────────────────────────
        with transaction.atomic():                             # Todo o nada: si algo falla, se revierte
            order = Order.objects.create(
                user=user,
                total=cart.total                               # Fija el total al momento de la compra
            )

            for item in items:
                item.product.stock -= item.quantity            # Descuenta el stock del producto
                item.product.save()                            # Persiste el stock actualizado

                OrderItem.objects.create(                      # Crea el ítem de orden con precio histórico
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price                   # Precio guardado al momento de comprar
                )

            cart.items.all().delete()                          # Vacía el carrito tras confirmar la orden

        serializer = OrderSerializer(order)                    # Serializa la orden recién creada
        return Response(serializer.data, status=201)           # 201 Created: orden generada exitosamente


class OrderHistoryView(generics.ListAPIView):
    """
    Vista GET: Retorna el historial completo de órdenes del usuario autenticado.

    Endpoint: GET /orders/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra y retorna solo las órdenes pertenecientes al usuario autenticado."""
        return Order.objects.filter(user=self.request.user).order_by("-created_at")  # Más recientes primero


class OrderDetailView(generics.RetrieveAPIView):
    """
    Vista GET: Retorna el detalle de una orden específica del usuario.

    El filtro por usuario evita que un cliente acceda a órdenes de otros usuarios.

    Endpoint: GET /orders/<pk>/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Restringe el queryset a las órdenes del usuario autenticado."""
        return Order.objects.filter(user=self.request.user)  # Aislamiento por usuario


class UpdateOrderStatusView(APIView):
    """
    Vista PATCH: Actualiza el estado de una orden y notifica al cliente.

    Solo los usuarios con rol ADMIN o SUPERADMIN pueden actualizar estados.
    Al cambiar el estado, se crea automáticamente una UserNotification para el cliente.

    Endpoint: PATCH /orders/<pk>/update-status/
    Permiso: Usuario autenticado con rol ADMIN o SUPERADMIN.
    """

    permission_classes = [IsAuthenticated]  # Se valida el rol manualmente dentro del método

    def patch(self, request, pk):
        """
        Actualiza el estado de una orden.

        Args:
            request: Petición HTTP con el nuevo estado en el body.
            pk (int): ID de la orden a actualizar.

        Returns:
            Response: Mensaje de éxito (200) o error (403/404/400).
        """
        if request.user.role not in ['ADMIN', 'SUPERADMIN']:     # Solo admins pueden actualizar estados
            return Response({"error": "No autorizado"}, status=403)

        order = Order.objects.filter(pk=pk).first()              # Busca la orden por PK
        if not order:
            return Response({"error": "Orden no encontrada"}, status=404)

        new_status = request.data.get("status")                  # Nuevo estado enviado en el body
        valid_statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]  # Estados permitidos

        if new_status not in valid_statuses:                      # Valida que el estado sea válido
            return Response({"error": "Estado inválido"}, status=400)

        order.status = new_status                                 # Asigna el nuevo estado
        order.save()                                              # Persiste el cambio en la base de datos

        # Mapeo de estados en clave inglesa a etiquetas en español para la notificación
        status_labels = {
            "PENDING":   "Pendiente",
            "PAID":      "Pagada",
            "SHIPPED":   "Enviada",
            "DELIVERED": "Entregada / Completada",
            "CANCELLED": "Cancelada"
        }
        label = status_labels.get(new_status, new_status)        # Obtiene la etiqueta legible del estado

        # Crea la notificación para el propietario de la orden
        UserNotification.objects.create(
            user=order.user,                                      # Destinatario: dueño de la orden
            order=order,
            message=f"Tu orden #{order.id} ha sido actualizada a: {label}."  # Mensaje descriptivo
        )

        return Response({"message": "Estado actualizado correctamente"})


class AdminOrderListView(generics.ListAPIView):
    """
    Vista GET: Lista todas las órdenes del sistema para los administradores.

    Si el usuario no tiene rol de ADMIN o SUPERADMIN, retorna un queryset vacío.

    Endpoint: GET /orders/admin/all/
    Permiso: Usuario autenticado con rol ADMIN o SUPERADMIN.
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna todas las órdenes solo si el usuario es administrador."""
        if self.request.user.role not in ['ADMIN', 'SUPERADMIN']:  # Verifica el rol del usuario
            return Order.objects.none()                            # Retorna queryset vacío si no es admin
        return Order.objects.all().order_by("-created_at")         # Todas las órdenes, más recientes primero


class ClientNotificationsView(APIView):
    """
    Vista para gestionar las notificaciones del cliente.

    GET:  Retorna el conteo y la lista de notificaciones no leídas del usuario.
    POST: Marca todas las notificaciones del usuario como leídas.

    Endpoint: GET/POST /orders/notifications/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    permission_classes = [IsAuthenticated]  # Solo usuarios con sesión activa

    def get(self, request):
        """
        Retorna las notificaciones no leídas con su conteo.

        Returns:
            Response: Diccionario con count (int) y notifications (list).
        """
        notifs = UserNotification.objects.filter(user=request.user, is_read=False)  # Solo no leídas
        count = notifs.count()                                                       # Cantidad de no leídas
        # Construye la lista de datos de cada notificación
        data = [
            {
                "id": n.id,
                "message": n.message,
                "order_id": n.order_id,
                "created_at": str(n.created_at)
            }
            for n in notifs
        ]
        return Response({"count": count, "notifications": data})

    def post(self, request):
        """
        Marca todas las notificaciones del usuario como leídas.

        Returns:
            Response: Mensaje de confirmación.
        """
        UserNotification.objects.filter(user=request.user, is_read=False).update(is_read=True)  # Actualización masiva
        return Response({"message": "Notificaciones marcadas como leídas."})
