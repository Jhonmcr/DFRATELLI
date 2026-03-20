"""
Module: models.py
App: cart
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los modelos de base de datos para el carrito de compras.
    Incluye el modelo Cart (carrito por usuario) y CartItem (ítem individual
    dentro del carrito), con cálculo automático de subtotales y totales.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.db import models          # Módulo base de modelos de Django
from django.conf import settings       # Acceso a configuraciones del proyecto (AUTH_USER_MODEL)
from apps.products.models import Product  # Modelo de producto para relaciones FK


class Cart(models.Model):
    """
    Modelo que representa el carrito de compras de un usuario.

    Cada usuario tiene exactamente un carrito (relación OneToOne).
    El total se calcula dinámicamente sumando los subtotales de sus ítems.

    Attributes:
        user (OneToOneField): Usuario propietario del carrito.
        created_at (DateTimeField): Fecha y hora de creación del carrito.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,   # Referencia al modelo de usuario configurado
        on_delete=models.CASCADE,   # Si el usuario se elimina, el carrito también
        related_name="cart"         # Permite acceder al carrito desde el usuario: user.cart
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Se establece automáticamente al crear

    @property
    def total(self):
        """
        Calcula el total del carrito sumando los subtotales de todos los ítems.

        Returns:
            Decimal: Suma de los subtotales de cada ítem en el carrito.
        """
        return sum(item.subtotal for item in self.items.all())  # Itera todos los ítems y suma

    def __str__(self):
        """Representación legible del carrito para el panel de admin."""
        return f"Carrito de {self.user.email}"


class CartItem(models.Model):
    """
    Modelo que representa un ítem (producto + cantidad) dentro de un carrito.

    Permite almacenar qué producto fue agregado y en qué cantidad.
    El subtotal se calcula multiplicando precio × cantidad.

    Attributes:
        cart (ForeignKey): Carrito al que pertenece este ítem.
        product (ForeignKey): Producto asociado al ítem.
        quantity (PositiveIntegerField): Cantidad de unidades del producto.
    """

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,  # Si el carrito se elimina, sus ítems también
        related_name="items"       # Permite acceder a los ítems: cart.items.all()
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE   # Si el producto se elimina, el ítem también
    )
    quantity = models.PositiveIntegerField(default=1)  # Mínimo 1 unidad por defecto

    @property
    def subtotal(self):
        """
        Calcula el subtotal de este ítem (precio × cantidad).

        Returns:
            Decimal: Precio del producto multiplicado por la cantidad.
        """
        return self.product.price * self.quantity  # Precio base sin descuentos

    def __str__(self):
        """Representación legible del ítem para el panel de admin."""
        return f"{self.quantity} x {self.product.name}"
