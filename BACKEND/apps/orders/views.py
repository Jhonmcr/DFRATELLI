from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from rest_framework import status

from apps.cart.models import Cart, CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer

class MyOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user).first()

        if not cart or cart.items.count() == 0:
            return Response({"error": "El carrito está vacío"}, status=400)

        # 1. Validación Previa (Fail Fast)
        items = cart.items.all()
        for item in items:
            if item.quantity > item.product.stock:
                return Response(
                    {"error": f"Stock insuficiente para el producto: {item.product.name}"}, 
                    status=400
                )

        # 2. Creación Transaccional
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                total=cart.total
            )

            for item in items:
                # Descontar stock
                item.product.stock -= item.quantity
                item.product.save()

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)


class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solamente devuelve las órdenes pertenecientes al usuario autenticado.
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not request.user.is_staff:
            return Response({"error": "No autorizado"}, status=403)

        order = Order.objects.filter(pk=pk).first()
        if not order:
            return Response({"error": "Orden no encontrada"}, status=404)

        new_status = request.data.get("status")
        valid_statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

        if new_status not in valid_statuses:
            return Response({"error": "Estado inválido"}, status=400)

        order.status = new_status
        order.save()

        return Response({"message": "Estado actualizado correctamente"})

class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Order.objects.none()
        return Order.objects.all().order_by("-created_at")
