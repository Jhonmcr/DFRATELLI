from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import CartSerializer
from apps.products.models import Product


def get_or_create_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_or_create_cart(self.request.user)


class AddToCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response({"error": "product_id es requerido"}, status=400)

        cart = get_or_create_cart(request.user)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=404)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        item.quantity += quantity
        item.save()

        return Response({"message": "Producto agregado al carrito"}, status=200)


class CartItemDetailView(generics.GenericAPIView):
    """
    Maneja la actualización de cantidad (PUT/PATCH) y eliminación (DELETE)
    de un ítem específico en el carrito.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        try:
            item = CartItem.objects.get(cart=cart, id=item_id)
            item.delete()
            return Response({"message": "Producto eliminado del carrito"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)

    def patch(self, request, item_id):
        return self.put(request, item_id)

    def put(self, request, item_id):
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response({"error": "quantity es requerido"}, status=400)

        quantity = int(quantity)

        if quantity < 1:
            return Response({"error": "La cantidad debe ser mayor o igual a 1"}, status=400)

        cart = get_or_create_cart(request.user)

        try:
            item = CartItem.objects.get(cart=cart, id=item_id)
            item.quantity = quantity
            item.save()
            return Response({"message": "Cantidad actualizada"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)
