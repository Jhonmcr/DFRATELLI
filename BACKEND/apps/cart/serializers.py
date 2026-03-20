"""
Module: serializers.py
App: cart
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los serializers DRF para los modelos Cart y CartItem.
    Convierte instancias del modelo ORM a formatos JSON para la API REST,
    incluyendo el cálculo de subtotales por ítem y el total del carrito.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import serializers                         # Módulo de serialización de DRF
from .models import Cart, CartItem                            # Modelos locales del carrito
from apps.products.serializers import ProductSerializer       # Serializer anidado para mostrar info del producto


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo CartItem.

    Incluye la información completa del producto de forma anidada (solo lectura)
    y calcula el subtotal del ítem mediante un campo método.

    Fields:
        id: Identificador del ítem.
        product: Objeto completo del producto (anidado, solo lectura).
        quantity: Cantidad de unidades en el carrito.
        subtotal: Precio total del ítem (precio × cantidad).
    """

    product = ProductSerializer(read_only=True)                     # Muestra el producto completo, no solo su ID
    subtotal = serializers.SerializerMethodField()                  # Campo calculado (no existe en el modelo directamente)

    class Meta:
        model = CartItem                                            # Modelo que se serializa
        fields = ["id", "product", "quantity", "subtotal"]         # Campos expuestos en la respuesta JSON

    def get_subtotal(self, obj):
        """
        Calcula el subtotal delegando al método del modelo.

        Args:
            obj (CartItem): Instancia del ítem del carrito.

        Returns:
            Decimal: Resultado de precio × cantidad.
        """
        return obj.subtotal  # Llama a la propiedad @subtotal definida en el modelo


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Cart.

    Expone todos los ítems del carrito de forma anidada y calcula
    el total general usando un campo método.

    Fields:
        id: Identificador del carrito.
        items: Lista de ítems serializados con CartItemSerializer.
        total: Suma total de todos los subtotales del carrito.
    """

    items = CartItemSerializer(many=True, read_only=True)           # Lista de ítems del carrito (solo lectura)
    total = serializers.SerializerMethodField()                     # Total general calculado dinámicamente

    class Meta:
        model = Cart                                                # Modelo que se serializa
        fields = ["id", "items", "total"]                          # Campos expuestos en la respuesta JSON

    def get_total(self, obj):
        """
        Calcula el total del carrito delegando al método del modelo.

        Args:
            obj (Cart): Instancia del carrito.

        Returns:
            Decimal: Suma total de los subtotales de todos los ítems.
        """
        return obj.total  # Llama a la propiedad @total definida en el modelo Cart
