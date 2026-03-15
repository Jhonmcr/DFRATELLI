from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    CategoryListView,
    ProductsByCategoryView
)

urlpatterns = [
    path("", ProductListView.as_view(), name="product_list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product_detail"),
    path("categories/", CategoryListView.as_view(), name="category_list"),
    path("categories/<int:category_id>/", ProductsByCategoryView.as_view(), name="products_by_category"),
]
