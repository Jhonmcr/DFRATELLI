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


class RemoveFromCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        if not product_id:
            return Response({"error": "product_id es requerido"}, status=400)

        cart = get_or_create_cart(request.user)

        try:
            item = CartItem.objects.get(cart=cart, product_id=product_id)
            item.delete()
            return Response({"message": "Producto eliminado del carrito"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)


class UpdateCartItemView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity")

        if not product_id or quantity is None:
            return Response({"error": "product_id y quantity son requeridos"}, status=400)

        quantity = int(quantity)

        if quantity < 1:
            return Response({"error": "La cantidad debe ser mayor o igual a 1"}, status=400)

        cart = get_or_create_cart(request.user)

        try:
            item = CartItem.objects.get(cart=cart, product_id=product_id)
            item.quantity = quantity
            item.save()
            return Response({"message": "Cantidad actualizada"}, status=200)
        except CartItem.DoesNotExist:
            return Response({"error": "Producto no está en el carrito"}, status=404)
