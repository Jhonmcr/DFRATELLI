from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite acceso de lectura a cualquier usuario (incluso no autenticado),
    pero restringe la creación, edición y eliminación a usuarios con rol ADMIN o SUPERADMIN.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'SUPERADMIN']

class IsSuperAdmin(permissions.BasePermission):
    """
    Permiso exclusivo para SUPERADMIN.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SUPERADMIN'
