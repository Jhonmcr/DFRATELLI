from django.urls import path
from .views import (
    CartDetailView,
    AddToCartView,
    CartItemDetailView,
)

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart_detail"),
    
    # Items manipulations
    path("items/", AddToCartView.as_view(), name="cart_item_add"),
    path("items/<int:item_id>/", CartItemDetailView.as_view(), name="cart_item_detail"),
]
