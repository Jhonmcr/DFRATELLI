"""
Module: models.py
App: orders
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los modelos de base de datos para el sistema de órdenes de compra.
    Incluye Order (cabecera de la orden), OrderItem (línea de detalle por producto)
    y UserNotification (notificaciones de cambio de estado para el cliente).

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.db import models           # Módulo base de modelos de Django
from django.conf import settings       # Acceso a AUTH_USER_MODEL del proyecto
from apps.products.models import Product  # Modelo de producto para relaciones FK


class Order(models.Model):
    """
    Modelo que representa una orden de compra generada por un usuario.

    Almacena el estado, el total y las fechas de la orden. Cada orden
    pertenece a un único usuario y puede tener múltiples ítems (OrderItem).

    Attributes:
        STATUS_CHOICES (list): Estados válidos del ciclo de vida de la orden.
        user (ForeignKey): Usuario que realizó la compra.
        status (CharField): Estado actual de la orden.
        total (DecimalField): Monto total de la orden.
        created_at (DateTimeField): Fecha de creación de la orden.
        updated_at (DateTimeField): Fecha de última modificación.
    """

    # Opciones de estado que puede tener una orden durante su ciclo de vida
    STATUS_CHOICES = [
        ("PENDING",   "Pendiente"),   # Orden creada, sin confirmar pago
        ("PAID",      "Pagada"),      # Pago confirmado
        ("SHIPPED",   "Enviada"),     # Orden despachada al cliente
        ("DELIVERED", "Entregada"),   # Orden recibida por el cliente
        ("CANCELLED", "Cancelada"),   # Orden anulada
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Referencia dinámica al modelo de usuario
        on_delete=models.CASCADE,  # Si el usuario se elimina, sus órdenes también
        related_name="orders"      # Acceso inverso: user.orders.all()
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,    # Restringe los valores al conjunto definido
        default="PENDING"          # Una nueva orden comienza en estado PENDING
    )
    total = models.DecimalField(max_digits=10, decimal_places=2)  # Total con hasta 10 dígitos y 2 decimales
    created_at = models.DateTimeField(auto_now_add=True)           # Se registra al crear, nunca se modifica
    updated_at = models.DateTimeField(auto_now=True)               # Se actualiza automáticamente en cada save()

    def __str__(self):
        """Representación legible de la orden para el panel de admin."""
        return f"Orden #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    """
    Modelo que representa un ítem (producto + cantidad + precio) dentro de una orden.

    El precio se guarda al momento de la compra para preservar el historial,
    independientemente de cambios futuros en el precio del producto.

    Attributes:
        order (ForeignKey): Orden a la que pertenece este ítem.
        product (ForeignKey): Producto comprado.
        quantity (PositiveIntegerField): Cantidad de unidades compradas.
        price (DecimalField): Precio unitario al momento de la compra (histórico).
    """

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,  # Si la orden se elimina, sus ítems también
        related_name="items"       # Acceso inverso: order.items.all()
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT   # Protege el producto: no se puede eliminar si tiene órdenes
    )
    quantity = models.PositiveIntegerField()                                  # Unidades compradas
    price = models.DecimalField(max_digits=10, decimal_places=2)              # Precio histórico (al momento de comprar)

    def subtotal(self):
        """
        Calcula el subtotal de este ítem de orden.

        Returns:
            Decimal: Precio histórico multiplicado por la cantidad comprada.
        """
        return self.price * self.quantity  # Usa el precio guardado, no el precio actual del producto

    def __str__(self):
        """Representación legible del ítem para el panel de admin."""
        return f"{self.quantity} x {self.product.name}"


class UserNotification(models.Model):
    """
    Modelo que almacena notificaciones de cambio de estado de órdenes para los clientes.

    Cuando un administrador actualiza el estado de una orden, se crea una notificación
    que el cliente puede consultar desde su panel de usuario.

    Attributes:
        user (ForeignKey): Usuario destinatario de la notificación.
        order (ForeignKey): Orden relacionada con la notificación.
        message (TextField): Texto descriptivo del cambio de estado.
        is_read (BooleanField): Indica si el usuario ya leyó la notificación.
        created_at (DateTimeField): Fecha y hora de creación de la notificación.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,       # Si el usuario se elimina, sus notificaciones también
        related_name="notifications"    # Acceso inverso: user.notifications.all()
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,       # Si la orden se elimina, sus notificaciones también
        related_name="notifications"    # Acceso inverso: order.notifications.all()
    )
    message = models.TextField()                        # Mensaje descriptivo del cambio de estado
    is_read = models.BooleanField(default=False)        # False por defecto: empieza como no leída
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de generación de la notificación

    class Meta:
        ordering = ["-created_at"]  # Las notificaciones más recientes aparecen primero

    def __str__(self):
        """Representación legible de la notificación para el panel de admin."""
        return f"Notif -> {self.user.email}: {self.message[:40]}"  # Muestra solo los primeros 40 caracteres
