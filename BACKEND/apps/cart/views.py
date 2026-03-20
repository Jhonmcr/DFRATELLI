"""
Module: views.py
App: cart
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Vistas de la API REST para el módulo de carrito de compras.
    Implementa operaciones de lectura, adición, actualización y eliminación
    de ítems en el carrito del usuario autenticado.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import generics, status         # Clases genéricas y códigos de estado HTTP
from rest_framework.response import Response        # Objeto de respuesta estándar de DRF
from rest_framework.permissions import IsAuthenticated  # Permiso: solo usuarios autenticados

from .models import Cart, CartItem                  # Modelos del carrito
from .serializers import CartSerializer             # Serializer del carrito completo
from apps.products.models import Product            # Modelo de producto para buscar por ID


def get_or_create_cart(user):
    """
    Obtiene el carrito del usuario o lo crea si no existe.

    Esta función auxiliar centraliza la lógica de acceso al carrito,
    evitando duplicar código en múltiples vistas.

    Args:
        user: Instancia del usuario autenticado.

    Returns:
        Cart: Carrito existente o recién creado para el usuario.
    """
    cart, created = Cart.objects.get_or_create(user=user)  # Busca o crea el carrito del usuario
    return cart  # Retorna el carrito (nuevo o existente)


class CartDetailView(generics.RetrieveAPIView):
    """
    Vista GET: Retorna el carrito completo del usuario autenticado.

    Endpoint: GET /cart/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    serializer_class = CartSerializer           # Serializer que incluye ítems y total
    permission_classes = [IsAuthenticated]      # Solo usuarios con sesión activa pueden acceder

    def get_object(self):
        """Obtiene o crea el carrito del usuario que realiza la petición."""
        return get_or_create_cart(self.request.user)  # Delega a la función auxiliar


class AddToCartView(generics.GenericAPIView):
    """
    Vista POST: Agrega un producto al carrito del usuario autenticado.

    Si el producto ya existe en el carrito, incrementa su cantidad.
    Si no existe, lo crea con la cantidad indicada.

    Endpoint: POST /cart/items/
    Permiso: Usuario autenticado (IsAuthenticated)

    Body JSON:
        product_id (int): ID del producto a agregar.
        quantity (int): Cantidad de unidades a agregar (default: 1).
    """

    permission_classes = [IsAuthenticated]  # Solo usuarios con sesión activa

    def post(self, request):
        """Maneja la solicitud POST para agregar un producto al carrito."""
        product_id = request.data.get("product_id")           # Lee el ID del producto del cuerpo de la petición
        quantity = int(request.data.get("quantity", 1))        # Lee la cantidad; usa 1 si no se especifica

        if not product_id:                                     # Valida que el product_id sea obligatorio
            return Response({"error": "product_id es requerido"}, status=400)

        cart = get_or_create_cart(request.user)                # Obtiene o crea el carrito del usuario

        try:
            product = Product.objects.get(id=product_id)      # Busca el producto en la base de datos
        except Product.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=404)  # Producto no existe

        # Obtiene o crea el ítem del carrito para ese producto; inicia con cantidad 0 para sumar después
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": 0})

        item.quantity += quantity   # Incrementa la cantidad (suma si ya existía)
        item.save()                 # Persiste el cambio en la base de datos

        return Response({"message": "Producto agregado al carrito"}, status=200)


class CartItemDetailView(generics.GenericAPIView):
    """
    Vista para actualizar cantidad (PUT/PATCH) o eliminar (DELETE) un ítem del carrito.

    Solo permite operar sobre ítems que pertenezcan al carrito del usuario autenticado,
    evitando acceso cruzado entre usuarios.

    Endpoint: PUT/PATCH/DELETE /cart/items/<item_id>/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    permission_classes = [IsAuthenticated]  # Solo usuarios con sesión activa

    def delete(self, request, item_id):
        """
        Elimina completamente un ítem del carrito.

        Args:
            request: Petición HTTP entrante.
            item_id (int): ID del ítem a eliminar.

        Returns:
            Response: Mensaje de éxito (200) o error (404).
        """
        cart = get_or_create_cart(request.user)  # Obtiene el carrito del usuario
        try:
            item = CartItem.objects.get(cart=cart, id=item_id)  # Busca el ítem dentro del carrito del usuario
            item.delete()                                        # Elimina el ítem de la base de datos
            return Response({"message": "Producto eliminado del carrito"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)  # Ítem no encontrado

    def patch(self, request, item_id):
        """Alias de PUT para permitir actualizaciones parciales (PATCH)."""
        return self.put(request, item_id)  # Redirige a la lógica de PUT

    def put(self, request, item_id):
        """
        Actualiza la cantidad de un ítem en el carrito.

        Args:
            request: Petición HTTP con la nueva cantidad en el body.
            item_id (int): ID del ítem a actualizar.

        Returns:
            Response: Mensaje de éxito (200) o error (400/404).
        """
        quantity = request.data.get("quantity")  # Lee la nueva cantidad del body

        if quantity is None:                     # La cantidad es un campo obligatorio
            return Response({"error": "quantity es requerido"}, status=400)

        quantity = int(quantity)   # Convierte a entero para validación numérica

        if quantity < 1:           # Valida que la cantidad sea al menos 1
            return Response({"error": "La cantidad debe ser mayor o igual a 1"}, status=400)

        cart = get_or_create_cart(request.user)  # Obtiene el carrito del usuario

        try:
            item = CartItem.objects.get(cart=cart, id=item_id)  # Busca el ítem en el carrito del usuario
            item.quantity = quantity                             # Asigna la nueva cantidad
            item.save()                                         # Persiste el cambio
            return Response({"message": "Cantidad actualizada"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)
