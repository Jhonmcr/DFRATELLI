from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from core.views import health_check

# Autenticación
from apps.users.views import (
    RegisterView,
    LoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    AdminStatsView,
    ChangePasswordView,
    UserProfileView,
    UserListView,
    RoleChangeView,
    AdminUserCreateView,
    UserDeleteView,
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health_check"),

    # ---------------------------
    # 🔐 AUTENTICACIÓN JWT
    # ---------------------------
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/change-password/", ChangePasswordView.as_view(), name="change_password"),
    
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin_stats"),
    path("api/admin/users/", UserListView.as_view(), name="admin_users"),
    path("api/admin/users/create/", AdminUserCreateView.as_view(), name="admin_user_create"),
    path("api/admin/users/<int:pk>/", UserDeleteView.as_view(), name="admin_user_delete"),
    path("api/admin/role-change/", RoleChangeView.as_view(), name="role_change"),
    path("api/profile/", UserProfileView.as_view(), name="user_profile"),

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
    path("api/contact/", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
