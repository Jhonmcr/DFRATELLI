"""
Module: models.py
App: products
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los modelos de base de datos para el catálogo de productos.
    Incluye Brand (marcas), Category (categorías), Product (productos con
    descuentos) y Review (reseñas de clientes con puntaje y comentario).

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.db import models  # Módulo base de modelos de Django


class Brand(models.Model):
    """
    Modelo que representa una marca de productos.

    Attributes:
        name (CharField): Nombre único de la marca.
        image (ImageField): Imagen o logotipo de la marca (opcional).
    """

    name = models.CharField(max_length=100, unique=True)              # Nombre de marca, debe ser único
    image = models.ImageField(upload_to="brands/", null=True, blank=True)  # Imagen opcional de la marca

    def __str__(self):
        """Representación legible de la marca para el panel de admin."""
        return self.name


class Category(models.Model):
    """
    Modelo que representa una categoría de productos.

    Attributes:
        name (CharField): Nombre único de la categoría.
        image (ImageField): Imagen representativa de la categoría (opcional).
    """

    name = models.CharField(max_length=100, unique=True)                  # Nombre de categoría, debe ser único
    image = models.ImageField(upload_to="categories/", null=True, blank=True)  # Imagen opcional de la categoría

    def __str__(self):
        """Representación legible de la categoría para el panel de admin."""
        return self.name


class Product(models.Model):
    """
    Modelo principal que representa un producto del catálogo.

    Soporta descuentos: si is_on_sale=True y discount_percentage > 0,
    la propiedad sale_price calcula automáticamente el precio con descuento.

    Attributes:
        name (CharField): Nombre del producto.
        description (TextField): Descripción detallada del producto.
        price (DecimalField): Precio base del producto.
        stock (PositiveIntegerField): Unidades disponibles en inventario.
        category (ForeignKey): Categoría a la que pertenece el producto.
        image (ImageField): Imagen del producto (opcional).
        is_active (BooleanField): Indica si el producto está visible en el catálogo.
        is_on_sale (BooleanField): Indica si el producto tiene descuento activo.
        discount_percentage (PositiveIntegerField): Porcentaje de descuento (0-100).
    """

    name = models.CharField(max_length=200)                           # Nombre descriptivo del producto
    description = models.TextField(blank=True)                        # Descripción larga, puede estar vacía
    price = models.DecimalField(max_digits=10, decimal_places=2)      # Precio base con hasta 2 decimales
    stock = models.PositiveIntegerField(default=0)                    # Inventario disponible, mínimo 0
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,  # Si la categoría se elimina, el producto queda sin categoría (null)
        null=True
    )
    image = models.ImageField(upload_to="products/", null=True, blank=True)  # Imagen del producto en S3
    is_active = models.BooleanField(default=True)                     # True: visible en el catálogo
    is_on_sale = models.BooleanField(default=False)                   # True: tiene descuento activo
    discount_percentage = models.PositiveIntegerField(
        default=0,
        help_text="Porcentaje de descuento (0-100)"                   # Indicación para el panel de admin
    )
    total_sold = models.PositiveIntegerField(default=0)               # Acumulado de ventas completadas

    @property
    def sale_price(self):
        """
        Calcula el precio con descuento aplicado.

        Si el producto no está en oferta, retorna el precio base sin modificar.

        Returns:
            Decimal: Precio con descuento si aplica, o precio base en caso contrario.
        """
        if self.is_on_sale and self.discount_percentage > 0:         # Verifica que el descuento sea válido
            discount = (self.price * self.discount_percentage) / 100  # Calcula el monto del descuento
            return round(self.price - discount, 2)                    # Resta el descuento y redondea a 2 decimales
        return self.price  # Sin descuento, retorna el precio original

    def __str__(self):
        """Representación legible del producto para el panel de admin."""
        return self.name


class Review(models.Model):
    """
    Modelo que representa una reseña de un cliente sobre un producto.

    Cada reseña incluye una calificación del 1 al 5 y un comentario textual.
    Las reseñas se listan ordenadas de más reciente a más antigua.

    Attributes:
        product (ForeignKey): Producto que se está reseñando.
        user (ForeignKey): Usuario que escribió la reseña.
        rating (IntegerField): Calificación del 1 (mínimo) al 5 (máximo).
        comment (TextField): Texto de la reseña.
        created_at (DateTimeField): Fecha de publicación de la reseña.
    """

    product = models.ForeignKey(
        Product,
        related_name='reviews',     # Acceso inverso: product.reviews.all()
        on_delete=models.CASCADE    # Si el producto se elimina, sus reseñas también
    )
    user = models.ForeignKey(
        'users.User',               # Referencia en cadena para evitar importación circular
        on_delete=models.CASCADE    # Si el usuario se elimina, sus reseñas también
    )
    rating = models.IntegerField(default=5)   # Escala del 1 al 5 (5 por defecto)
    comment = models.TextField()              # Texto libre de la reseña
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de publicación, inmutable

    class Meta:
        ordering = ['-created_at']  # Reseñas más recientes primero en todos los querysets

    def __str__(self):
        """Representación legible de la reseña para el panel de admin."""
        return f"{self.user} - {self.product.name} ({self.rating} stars)"

