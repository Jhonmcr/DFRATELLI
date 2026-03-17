from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Autenticación
from apps.users.views import (
    RegisterView,
    LoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # ---------------------------
    # 🔐 AUTENTICACIÓN JWT
    # ---------------------------
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ---------------------------
    # 🔐 RECUPERACIÓN DE CONTRASEÑA
    # ---------------------------
    path("api/auth/password-reset-request/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("api/auth/password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    # ---------------------------
    # 🛒 RUTAS DEL PROYECTO
    # ---------------------------
    path("api/cart/", include("apps.cart.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/products/", include("apps.products.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
