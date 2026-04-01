"""
Module: views.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Vistas de la API REST para el sistema de gestión de usuarios y autenticación.
    Implementa:
    - Registro de cuenta para nuevos clientes.
    - Autenticación JWT (Login).
    - Flujo completo de recuperación de contraseña (solicitud por email y confirmación).
    - Cambio de contraseña para usuarios autenticados.
    - Consulta de perfil del usuario actual.
    - Gestión avanzada para administradores (listar usuarios, ver estadísticas de dashboard).
    - Gestión exclusiva para superadministradores (cambio de roles).

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import generics, status               # Vistas genéricas y códigos de estado
from rest_framework.response import Response              # Respuesta estándar HTTP de DRF
from rest_framework.views import APIView                  # Base para vistas personalizadas
from rest_framework.permissions import IsAuthenticated, AllowAny  # Permisos
from .permissions import IsAdminOrSuperAdmin, IsSuperAdmin  # Permisos personalizados del sistema
from django.core.exceptions import PermissionDenied          # Manejo de denegación de permisos
from rest_framework_simplejwt.views import TokenObtainPairView       # Vista base para obtención de JWT
from django.db.models import Sum                          # Función de agregación para sumar totales
from django.contrib.auth.hashers import check_password    # Utilidad para validar hashes de contraseñas

# Modelos importados para las métricas del panel de administración
from apps.products.models import Product
from apps.orders.models import Order
from core.models import ContactMessage
from .models import User

# Serializers validados de usuario
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

from django.core.mail import send_mail  # Utilidad de Django para el envío de correos electrónicos
from django.conf import settings        # Configuraciones globales (para EMAIL_HOST_USER)


class RegisterView(generics.CreateAPIView):
    """
    Vista POST: Registra a un nuevo usuario (cliente) en el sistema.

    Endpoint: POST /users/register/
    Permiso: Público
    """
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    """
    Vista POST: Inicia sesión validando credenciales y retornando un JWT.

    El Token devuelto incluye custom claims (email, rol, nombre).

    Endpoint: POST /users/login/
    Permiso: Público
    """
    serializer_class = LoginSerializer


class PasswordResetRequestView(generics.GenericAPIView):
    """
    Vista POST: Inicia el flujo de recuperación de contraseña.

    Valida que el email exista, genera un token temporal y envía un
    correo electrónico con el enlace de recuperación al usuario.

    Endpoint: POST /users/password-reset/
    Permiso: Público
    """

    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        """Maneja la solicitud de restablecimiento y envía el correo."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token, user = serializer.save()  # Genera el token y obtiene la instancia de usuario

        # Mensaje simplificado con el código de 6 caracteres
        message_body = f"Tu código de recuperación para DFRATELLI es: {token}\n\nIntroduce este código en la página de recuperación para establecer tu nueva contraseña.\n\nEste código expirará en 30 minutos."

        # Envío del correo electrónico con manejo de errores para evitar crash 500
        try:
            send_mail(
                subject="Código de Recuperación - DFRATELLI",
                message=message_body,
                from_email=settings.EMAIL_HOST_USER,  # Remitente configurado globalmente
                recipient_list=[user.email],          # Lista de destinatarios
            )
        except Exception as e:
            # Si el SMTP falla, devolvemos un 500 JSON pero con los headers de CORS ya puestos
            return Response(
                {"error": "El servidor de correo no está respondiendo. Por favor intente más tarde."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"message": "Se envió un correo con instrucciones."}, status=200)


class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Vista POST: Confirma y efectúa el cambio de contraseña usando un token.

    Valida que el token emitido sea verídico y no haya expirado, y actualiza
    la contraseña del usuario eliminando posteriormente el token usado.

    Endpoint: POST /users/password-reset-confirm/
    Permiso: Público
    """

    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        """Procesa la confirmación del nuevo password."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Persiste la nueva contraseña y quema el token

        return Response({"message": "Contraseña actualizada correctamente."}, status=200)


class ChangePasswordView(APIView):
    """
    Vista POST: Cambia la contraseña para un usuario con su sesión activa.

    El usuario debe proporcionar su contraseña actual para poder asignar una nueva,
    como medida de seguridad.

    Endpoint: POST /users/change-password/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Valida password actual y registra password nuevo."""
        user = request.user
        old_password = request.data.get('old_password')  # Contraseña anterior
        new_password = request.data.get('new_password')  # Contraseña deseada

        if not old_password or not new_password:
            return Response({"error": "Debes proveer contraseña actual y nueva."}, status=400)

        if not user.check_password(old_password):        # Validación de seguridad
            return Response({"error": "La contraseña actual es incorrecta."}, status=400)

        if len(new_password) < 6:                        # Validación mínima de seguridad del nuevo password
            return Response({"error": "La nueva contraseña debe tener al menos 6 caracteres."}, status=400)

        user.set_password(new_password)  # Hashea la nueva contraseña
        user.save()                      # Persiste en DB
        return Response({"message": "Contraseña cambiada correctamente."})


class UserProfileView(APIView):
    """
    Vista GET: Obtiene la información del perfil del usuario logueado.

    Endpoint: GET /users/profile/
    Permiso: Usuario autenticado (IsAuthenticated)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Devuelve los datos expuestos públicamente relativos al User."""
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "role": user.role,
            "unique_code": user.unique_code,  # Necesario para el contexto de roles Admin
        })


class UserListView(APIView):
    """
    Vista GET: Listado de todo el directorio de usuarios de la base de datos.

    Endpoint: GET /users/list/
    Permiso: Requerido IsAdminUser (is_staff=True interno de Django)
    """

    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        """Recupera la tabla completa de cuentas."""
        # Filtra y extrae solo campos necesarios para no exponer contraseñas hasheadas
        users = User.objects.all().order_by('-id').values(
            'id', 'email', 'username', 'first_name', 'last_name',
            'phone_number', 'role', 'unique_code'
        )
        return Response(list(users))


class RoleChangeView(APIView):
    """
    Vista POST: Exclusiva para modificar privilegios inter-admin (Cambio de rol).

    Debe ejecutarse por un usuario de perfil 'SUPERADMIN'. Su mecánica
    está orientada a actualizar un rol usando un unique_code particular.

    Endpoint: POST /users/role-change/
    Permiso: Usuario autenticado con aserción explícita de SUPERADMIN en su role.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Ejecuta transferencia o remoción de rol para subordinados."""
        if request.user.role != 'SUPERADMIN':  # Control de acceso en vista para mayor severidad
            return Response({"error": "Solo el superadmin puede cambiar roles."}, status=403)

        unique_code = request.data.get('unique_code')
        new_role = request.data.get('role')

        if not unique_code or not new_role:
            return Response({"error": "Debes proveer unique_code y role."}, status=400)

        if new_role not in ['CLIENT', 'ADMIN', 'SUPERADMIN']:  # Permite escalaciones completas
            return Response({"error": "Role inválido. Usa CLIENT, ADMIN o SUPERADMIN."}, status=400)

        try:
            target_user = User.objects.get(unique_code=unique_code)  # Adquirimos el user por su hash público
        except User.DoesNotExist:
            return Response({"error": "No se encontró ningún usuario con ese código."}, status=404)

        if target_user.role == 'SUPERADMIN':  # Previene autoborrado o motín de permisos
            return Response({"error": "No puedes cambiar el rol de otro superadmin."}, status=403)

        target_user.role = new_role  # Ejecuta la modificación en el model layer
        target_user.save()
        return Response({
            "message": f"Rol actualizado a {new_role} para {target_user.email}.",
            "user": {"email": target_user.email, "role": target_user.role}
        })


class AdminUserCreateView(generics.CreateAPIView):
    """
    Vista POST: Permite al SUPERADMIN crear nuevos usuarios con el rol de ADMIN.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # Validación de seguridad a nivel de método
        if self.request.user.role != 'SUPERADMIN':
            raise PermissionDenied("Solo el superadmin puede crear administradores.")
        # Se obtiene el rol desde el JSON enviado o se usa ADMIN por defecto
        role = self.request.data.get('role', 'ADMIN')
        if role not in ['ADMIN', 'SUPERADMIN']:
             role = 'ADMIN'
        serializer.save(role=role)


class UserDeleteView(generics.DestroyAPIView):
    """
    Vista DELETE: Permite al SUPERADMIN eliminar un usuario por su ID.
    Previene el borrado de otros SUPERADMINS.
    """
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def perform_destroy(self, instance):
        # Validación: Solo SUPERADMIN borra, y no puede borrarse a sí mismo ni a otros SUPERADMINS
        if self.request.user.role != 'SUPERADMIN' or instance.role == 'SUPERADMIN':
            raise PermissionDenied("Acción no permitida.")
        instance.delete()


class AdminStatsView(APIView):
    """
    Vista GET/POST: Gestor telemétrico para el Dashboard de Administrador (KPIs).

    GET agrupa totales de facturación, usuarios activos, ventas consolidadas
    y alarmas críticas (Bandeja / Órdenes nuevas).

    POST proporciona la facilidad de silenciar (marcar como leídos) la bandeja de mensajes.

    Endpoint: GET/POST /users/admin/stats/
    Permiso: Requerido IsAdminUser (is_staff=True interno de Django)
    """

    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        """Agrupa métricas de negocio para dashboard superior de ventas."""
        # 1. Indicadores Base Totales
        total_users = User.objects.count()
        active_products = Product.objects.count()  # Contamos todos los productos en el sistema

        # 2. Total Facturado (Agrupando todo lo que ya no es PENDING ni está CANCELADO)
        paid_orders = Order.objects.exclude(status__in=['PENDING', 'CANCELLED'])
        total_sales = paid_orders.aggregate(total=Sum('total'))['total'] or 0

        # 3. Alertas / Call to Actions / Cargas de trabajo
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        pending_orders = Order.objects.filter(status='PENDING').count()

        # 4. Acumulador Crítico Top Bar
        critical_notifications = unread_messages + pending_orders

        # 5. Lista de Desglose de Notificaciones
        notifications_list = []
        if unread_messages > 0:
            notifications_list.append({
                "id": "msg",
                "title": "Nuevos Mensajes",
                "description": f"Tienes {unread_messages} mensajes de contacto sin leer.",
                "link": "/admin/messages"
            })
        if pending_orders > 0:
            notifications_list.append({
                "id": "ord",
                "title": "Nuevas Órdenes",
                "description": f"Tienes {pending_orders} órdenes pendientes por revisar.",
                "link": "/admin/orders"
            })

        # Encapsulación de JSON de salida general Payload
        return Response({
            'total_users': total_users,
            'active_products': active_products,
            'total_sales': float(total_sales),
            'critical_notifications': critical_notifications,
            'unread_messages': unread_messages,
            'pending_orders': pending_orders,
            'notifications_list': notifications_list
        })

    def post(self, request):
        """Permite blanquear las alertas de la bandeja de entrada como visualizadas."""
        ContactMessage.objects.filter(is_read=False).update(is_read=True)
        return Response({"message": "Notificaciones marcadas como leídas."}, status=200)
