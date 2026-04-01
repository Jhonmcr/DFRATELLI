"""
Module: serializers.py
App: orders
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los serializers DRF para los modelos Order y OrderItem.
    Convierte los datos de órdenes al formato JSON para la API REST,
    incluyendo los ítems de forma anidada con su información de producto.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import serializers                      # Módulo de serialización de DRF
from .models import Order, OrderItem                       # Modelos de órdenes locales
from apps.products.serializers import ProductSerializer    # Serializer anidado para incluir datos del producto


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo OrderItem.

    Incluye los datos completos del producto de forma anidada (solo lectura)
    y calcula el subtotal del ítem usando un campo método.

    Fields:
        id: Identificador del ítem de orden.
        product: Objeto completo del producto (anidado, solo lectura).
        quantity: Cantidad de unidades compradas.
        price: Precio unitario al momento de la compra (histórico).
        subtotal: Resultado de price × quantity.
    """

    product = ProductSerializer(read_only=True)             # Objeto producto completo embebido (no solo el ID)
    subtotal = serializers.SerializerMethodField()          # Campo calculado: no existe en el modelo directamente

    class Meta:
        model = OrderItem                                   # Modelo que se serializa
        fields = ["id", "product", "quantity", "price", "subtotal"]  # Campos expuestos en la respuesta

    def get_subtotal(self, obj):
        """
        Calcula el subtotal del ítem de orden.

        Args:
            obj (OrderItem): Instancia del ítem de orden.

        Returns:
            Decimal: Resultado del método subtotal() del modelo.
        """
        return obj.subtotal()  # Llama al método subtotal() definido en el modelo OrderItem


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Order.

    Expone todos los campos de la orden incluyendo los ítems serializados
    de forma anidada con sus detalles de producto.

    Fields:
        id: Identificador único de la orden.
        status: Estado actual de la orden (PENDING, PAID, SHIPPED, etc.).
        total: Monto total de la orden.
        items: Lista de ítems de la orden (anidada con OrderItemSerializer).
        created_at: Fecha y hora de creación de la orden.
    """

    items = OrderItemSerializer(many=True, read_only=True)  # Lista de ítems anidada (solo lectura)
    codigo_cliente_real = serializers.SerializerMethodField()
    telefono_cliente_real = serializers.SerializerMethodField()

    class Meta:
        model = Order                                              # Modelo que se serializa
        fields = [
            "id", "status", "total", "items", "created_at",
            "codigo_cliente_real", "telefono_cliente_real"
        ]

    def get_codigo_cliente_real(self, obj):
        """Retorna el código único del usuario de forma segura."""
        try:
            return obj.user.unique_code if obj.user and obj.user.unique_code else "SIN_CODIGO"
        except:
            return "ERROR_VINCULO"

    def get_telefono_cliente_real(self, obj):
        """Retorna el teléfono del usuario de forma segura."""
        try:
            return obj.user.phone_number if obj.user and obj.user.phone_number else "NO_REGISTRADO"
        except:
            return "ERROR_VINCULO"
