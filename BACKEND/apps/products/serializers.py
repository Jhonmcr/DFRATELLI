"""
Module: serializers.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los serializers DRF para los modelos Brand, Category, Review y Product.
    Maneja la representación anidada de categorías y reseñas dentro de productos,
    incluyendo validaciones de datos y soporte para escritura por ID de categoría.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import serializers                  # Módulo de serialización de DRF
from .models import Product, Category, Review, Brand   # Modelos del catálogo de productos


class BrandSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Brand (marcas).

    Fields:
        id: Identificador de la marca.
        name: Nombre de la marca.
        image: URL de la imagen o logotipo de la marca.
    """

    class Meta:
        model = Brand                         # Modelo que se serializa
        fields = ["id", "name", "image"]      # Campos expuestos en la respuesta JSON


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Category (categorías).

    Incluye el campo calculado product_count que proviene de una anotación
    en el queryset de la vista (Count de productos).

    Fields:
        id: Identificador de la categoría.
        name: Nombre de la categoría.
        image: URL de la imagen representativa.
        product_count: Cantidad de productos en la categoría (anotado en vista).
    """

    product_count = serializers.IntegerField(read_only=True)  # Campo anotado en el queryset, no en el modelo

    class Meta:
        model = Category                                  # Modelo que se serializa
        fields = ["id", "name", "image", "product_count"]  # Campos expuestos en la respuesta JSON


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Review (reseñas de productos).

    Incluye campos de solo lectura para el nombre del usuario que hizo la reseña,
    obtenidos mediante source de los campos relacionados.

    Fields:
        id, user, user_name, user_last_name, product, rating, comment, created_at.
    """

    user_name = serializers.CharField(source='user.first_name', read_only=True)      # Nombre del usuario (solo lectura)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)  # Apellido del usuario (solo lectura)

    class Meta:
        model = Review                                                                            # Modelo que se serializa
        fields = ['id', 'user', 'user_name', 'user_last_name', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']  # El usuario se asigna desde la vista, no desde el cliente


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer principal para el modelo Product.

    Permite consultar el producto con la categoría y reseñas anidadas (GET),
    y asignar la categoría por su ID al crear o editar (POST/PUT).
    Incluye el precio con descuento (sale_price) como campo de solo lectura.

    Fields:
        id, name, description, price, stock, image, is_active,
        category (objeto anidado, solo lectura),
        category_id (ID para escritura),
        reviews (lista anidada, solo lectura),
        is_on_sale, discount_percentage, sale_price.
    """

    category = CategorySerializer(read_only=True)       # Objeto categoría completo para respuestas GET
    reviews = ReviewSerializer(many=True, read_only=True)  # Lista de reseñas anidada para respuestas GET

    # Campo de escritura: permite enviar solo el ID de la categoría al crear/editar
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),  # Valida que el ID exista en la BD
        source="category",               # Mapea internamente al campo category del modelo
        write_only=True                  # Solo aceptado en escritura (POST/PUT), no en respuestas
    )

    class Meta:
        model = Product               # Modelo que se serializa
        fields = [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "image",
            "is_active",
            "category",               # Solo lectura: objeto completo de categoría
            "category_id",            # Solo escritura: ID de la categoría
            "reviews",                # Solo lectura: lista de reseñas del producto
            "is_on_sale",
            "discount_percentage",
            "sale_price"              # Propiedad calculada del modelo
        ]
        read_only_fields = ["sale_price"]  # Se calcula automáticamente, no se acepta en escritura

    def validate_stock(self, value):
        """
        Valida que el stock del producto no sea negativo.

        Args:
            value (int): Valor del campo stock enviado en la petición.

        Raises:
            ValidationError: Si el stock es menor que cero.

        Returns:
            int: Valor de stock validado.
        """
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value  # Stock válido, lo retorna sin modificar
