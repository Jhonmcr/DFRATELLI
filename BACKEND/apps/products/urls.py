from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CategoryViewSet,
    ProductsByCategoryView
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"", ProductViewSet, basename="product")

urlpatterns = [
    path("categories/<int:category_id>/", ProductsByCategoryView.as_view(), name="products_by_category"),
    path("", include(router.urls)),
]
