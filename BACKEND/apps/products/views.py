from rest_framework import generics, viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsAdminOrReadOnly
from .filters import ProductFilter
# from .filters import ProductFilter  # opcional si usas filtros avanzados


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    # 🔥 Filtros y búsqueda
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Filtros exactos
    filterset_fields = ["category", "price"]

    # Búsqueda por texto
    search_fields = ["name", "description"]

    # Ordenamiento
    ordering_fields = ["price", "name", "id"]
    
    # Filtro Avanzado
    filterset_class = ProductFilter


class ProductsByCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs["category_id"]
        return Product.objects.filter(category_id=category_id)
