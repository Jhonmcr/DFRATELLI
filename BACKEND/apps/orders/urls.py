from django.urls import path
from .views import MyOrdersListView, CreateOrderView, OrderHistoryView, OrderDetailView, UpdateOrderStatusView, AdminOrderListView

urlpatterns = [
    path("", OrderHistoryView.as_view(), name="order_history"),
    path("create/", CreateOrderView.as_view(), name="create_order"),
    path("my-orders/", MyOrdersListView.as_view(), name="my-orders"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/update-status/", UpdateOrderStatusView.as_view(), name="order-update-status"),
    path("admin/all/", AdminOrderListView.as_view(), name="admin-orders"),
]
