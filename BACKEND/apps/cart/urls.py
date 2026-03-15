from django.urls import path
from .views import (
    CartDetailView,
    AddToCartView,
    RemoveFromCartView,
    UpdateCartItemView,
)

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart_detail"),
    path("add/", AddToCartView.as_view(), name="cart_add"),
    path("remove/", RemoveFromCartView.as_view(), name="cart_remove"),
    path("update/", UpdateCartItemView.as_view(), name="cart_update"),
]
