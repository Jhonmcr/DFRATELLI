"""
Module: serializers.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los serializers para el sistema de autenticación y gestión de usuarios.
    Incluye serializers para registro, login con JWT personalizado, y los flujos
    de solicitud y confirmación de recuperación de contraseña.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from rest_framework import serializers                                    # Módulo de serialización de DRF
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # Serializer base para JWT
from django.utils import timezone                                         # Manejo de fechas con zona horaria
from datetime import timedelta                                            # Cálculo de tiempos relativos (expiración)

from .models import User, PasswordResetToken                              # Modelos del módulo de usuarios


# ──────────────────────────────────────────────────────────────────────────────
# REGISTRO
# ──────────────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.

    Maneja la validación y creación de usuarios usando el manager personalizado,
    que genera automáticamente el unique_code y hashea la contraseña.

    Fields:
        id, email, username, first_name, last_name, phone_number, password (write-only), role.
    """

    password = serializers.CharField(write_only=True)  # Solo aceptado en escritura, nunca devuelto en respuestas

    class Meta:
        model = User                                                           # Modelo que se serializa
        fields = ("id", "email", "username", "first_name", "last_name", "phone_number", "password", "role")

    def create(self, validated_data):
        """
        Crea un nuevo usuario usando el manager personalizado.

        Args:
            validated_data (dict): Datos validados del formulario de registro.

        Returns:
            User: Instancia del usuario recién creado.
        """
        user = User.objects.create_user(                       # Llama al manager para hashear contraseña y generar código
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            role=validated_data.get("role", "CLIENT"),         # CLIENT por defecto si no se especifica
        )
        user.first_name = validated_data.get("first_name", "")     # Asigna nombre si fue proporcionado
        user.last_name = validated_data.get("last_name", "")       # Asigna apellido si fue proporcionado
        user.phone_number = validated_data.get("phone_number", "") # Asigna teléfono si fue proporcionado
        user.save()                                                 # Persiste los campos adicionales
        return user


# ──────────────────────────────────────────────────────────────────────────────
# LOGIN (JWT usando email)
# ──────────────────────────────────────────────────────────────────────────────

class LoginSerializer(TokenObtainPairSerializer):
    """
    Serializer de login que extiende TokenObtainPairSerializer para incluir
    datos del usuario en el payload del JWT.

    Agrega al token: email, role, first_name y last_name del usuario,
    permitiendo al frontend recuperar la información de sesión sin peticiones adicionales.
    """

    @classmethod
    def get_token(cls, user):
        """
        Genera el token JWT con claims personalizados del usuario.

        Args:
            user (User): Instancia del usuario que inicia sesión.

        Returns:
            Token: JWT con los datos del usuario en el payload.
        """
        token = super().get_token(user)     # Genera el token base con los claims estándar
        token["email"] = user.email         # Agrega el email al payload del JWT
        token["role"] = user.role           # Agrega el rol para control de acceso en el frontend
        token["first_name"] = user.first_name  # Agrega el nombre para personalización en UI
        token["last_name"] = user.last_name    # Agrega el apellido para personalización en UI
        return token

    def validate(self, attrs):
        """
        Valida las credenciales de login usando email y contraseña.

        A diferencia del comportamiento por defecto (que usa username),
        este método busca el usuario por email primero y luego valida la contraseña.

        Args:
            attrs (dict): Diccionario con email y password del formulario.

        Raises:
            ValidationError: Si el email no está registrado o la contraseña es incorrecta.

        Returns:
            dict: Datos validados con el token de acceso y refresco.
        """
        email = attrs.get("email")        # Extrae el email de los datos de entrada
        password = attrs.get("password")  # Extrae la contraseña de los datos de entrada

        try:
            user = User.objects.get(email=email)  # Busca el usuario por email en la BD
        except User.DoesNotExist:
            raise serializers.ValidationError("Email no registrado")  # Email no existe

        if not user.check_password(password):  # Verifica la contraseña contra el hash almacenado
            raise serializers.ValidationError("Contraseña incorrecta")

        attrs["username"] = user.email   # Necesario para compatibilidad con TokenObtainPairSerializer
        return super().validate(attrs)   # Llama al método padre para generar los tokens JWT


# ──────────────────────────────────────────────────────────────────────────────
# RECUPERACIÓN DE CONTRASEÑA - SOLICITUD
# ──────────────────────────────────────────────────────────────────────────────

class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para la solicitud de recuperación de contraseña.

    Valida que el email exista en el sistema y crea un token temporal
    con 30 minutos de vigencia para el restablecimiento.
    """

    email = serializers.EmailField()  # Campo de email con validación de formato

    def validate_email(self, value):
        """
        Verifica que el email esté registrado en el sistema.

        Args:
            value (str): Email enviado en la solicitud.

        Raises:
            ValidationError: Si no existe ningún usuario con ese email.

        Returns:
            str: Email validado.
        """
        try:
            User.objects.get(email=value)           # Verifica que el email exista
        except User.DoesNotExist:
            raise serializers.ValidationError("No existe un usuario con este email.")
        return value  # Email válido, lo retorna sin modificar

    def save(self):
        """
        Crea y retorna el token de recuperación de contraseña.

        Returns:
            tuple: (token_str, user_instance) para usar en la vista al enviar el email.
        """
        email = self.validated_data["email"]                   # Obtiene el email validado
        user = User.objects.get(email=email)                   # Obtiene la instancia del usuario

        token = PasswordResetToken.generate_token()            # Genera un token hexadecimal único
        expires_at = timezone.now() + timedelta(minutes=30)    # El token expira en 30 minutos

        PasswordResetToken.objects.create(                     # Persiste el token en la base de datos
            user=user,
            token=token,
            expires_at=expires_at                              # Registra la fecha de expiración
        )

        return token, user  # Retorna el token y el usuario para que la vista envíe el email


# ──────────────────────────────────────────────────────────────────────────────
# RECUPERACIÓN DE CONTRASEÑA - CONFIRMACIÓN
# ──────────────────────────────────────────────────────────────────────────────

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmar el restablecimiento de contraseña.

    Valida el token de recuperación (existencia y vigencia), extrae el usuario
    asociado y actualiza la contraseña de forma segura.
    """

    token = serializers.CharField()                   # Token de recuperación enviado por el usuario
    password = serializers.CharField(write_only=True)  # Nueva contraseña (nunca se devuelve en respuesta)

    def validate(self, attrs):
        """
        Valida el token de recuperación y verifica que no haya expirado.

        Args:
            attrs (dict): Diccionario con token y nueva contraseña.

        Raises:
            ValidationError: Si el token no existe o ha expirado.

        Returns:
            dict: Datos validados con el usuario y el token adjuntos.
        """
        token = attrs.get("token")  # Extrae el token de los datos de entrada

        try:
            reset_token = PasswordResetToken.objects.get(token=token)  # Busca el token en la BD
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Token inválido.")       # Token no existe

        if reset_token.is_expired():                                   # Verifica la vigencia del token
            raise serializers.ValidationError("El token ha expirado.")

        attrs["user"] = reset_token.user           # Adjunta el usuario al contexto de validación
        attrs["reset_token"] = reset_token         # Adjunta el token para eliminarlo en save()
        return attrs

    def save(self):
        """
        Actualiza la contraseña del usuario y elimina el token usado.

        Returns:
            User: Instancia del usuario con la contraseña actualizada.
        """
        user = self.validated_data["user"]                 # Obtiene el usuario de los datos validados
        reset_token = self.validated_data["reset_token"]   # Obtiene el token para eliminarlo
        password = self.validated_data["password"]         # Obtiene la nueva contraseña

        user.set_password(password)   # Hashea y asigna la nueva contraseña al usuario
        user.save()                   # Persiste el cambio de contraseña

        reset_token.delete()          # Elimina el token usado para prevenir reutilización
        return user
