"""
Module: models.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define los modelos de usuarios del sistema con autenticación basada en email.
    Extiende AbstractBaseUser para personalizar el modelo de usuario de Django,
    implementando un sistema de roles (CLIENT, ADMIN, SUPERADMIN) y un código
    único para identificación entre administradores. Incluye también el modelo
    PasswordResetToken para el flujo de recuperación de contraseña.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.db import models                                              # Módulo base de modelos de Django
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin  # Clases base para modelo de usuario personalizado
from .managers import UserManager                                         # Manager personalizado con create_user/create_superuser
import uuid                                                               # Generación de tokens únicos y códigos UUID
import random                                                             # Generación de códigos aleatorios
import string                                                             # Conjunto de caracteres para el código
from django.utils import timezone                                         # Utilidades de zona horaria de Django


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuario personalizado que usa email como identificador principal.

    Implementa un sistema de roles que controla el nivel de acceso en la aplicación:
    - CLIENT:     Usuario estándar, puede comprar y ver su historial.
    - ADMIN:      Gestiona productos, categorías, órdenes y mensajes.
    - SUPERADMIN: Control total, puede cambiar roles de otros usuarios.

    Attributes:
        email (EmailField): Identificador único de inicio de sesión.
        username (CharField): Nombre de usuario visible.
        first_name (CharField): Nombre del usuario.
        last_name (CharField): Apellido del usuario.
        phone_number (CharField): Número de teléfono (opcional).
        unique_code (CharField): Código alfanumérico único para identificación admin.
        role (CharField): Rol del usuario en el sistema.
        is_active (BooleanField): Indica si la cuenta está habilitada.
        is_staff (BooleanField): Acceso al panel de administración de Django.
    """

    # Opciones de roles disponibles en el sistema
    ROLE_CHOICES = (
        ('CLIENT',     'Client'),      # Usuario cliente estándar
        ('ADMIN',      'Admin'),       # Administrador con permisos de gestión
        ('SUPERADMIN', 'Super Admin'), # Superadministrador con control total
    )

    email = models.EmailField(unique=True)                               # Email único, usado como USERNAME_FIELD
    username = models.CharField(max_length=150)                          # Nombre de usuario visible
    first_name = models.CharField(max_length=150, blank=True)            # Nombre (opcional en registro)
    last_name = models.CharField(max_length=150, blank=True)             # Apellido (opcional en registro)
    phone_number = models.CharField(max_length=30, blank=True, null=True)  # Teléfono de contacto (opcional)
    unique_code = models.CharField(max_length=12, unique=True, blank=True)  # Código único para identificación entre admins
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENT')  # Rol del usuario, CLIENT por defecto

    is_active = models.BooleanField(default=True)   # True: la cuenta está activa y puede iniciar sesión
    is_staff = models.BooleanField(default=False)    # True: acceso al panel /admin/ de Django

    objects = UserManager()  # Manager personalizado que maneja create_user y create_superuser

    USERNAME_FIELD = 'email'          # Campo usado como identificador de inicio de sesión
    REQUIRED_FIELDS = ['username']    # Campos adicionales requeridos al crear un superuser desde CLI

    def __str__(self):
        """Representación legible del usuario para el panel de admin."""
        return f"{self.email} ({self.role})"


class PasswordResetToken(models.Model):
    """
    Modelo que almacena tokens temporales para el flujo de recuperación de contraseña.

    Cada token tiene una fecha de expiración (30 minutos por defecto) y se elimina
    una vez que el usuario restablece su contraseña exitosamente.

    Attributes:
        user (ForeignKey): Usuario propietario del token de recuperación.
        token (CharField): Token único generado con UUID hex.
        created_at (DateTimeField): Fecha de generación del token.
        expires_at (DateTimeField): Fecha y hora de expiración del token.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)               # Si el usuario se elimina, el token también
    token = models.CharField(max_length=255, unique=True)                  # Token único generado con uuid4
    created_at = models.DateTimeField(auto_now_add=True)                   # Fecha de creación del token
    expires_at = models.DateTimeField()                                    # Fecha de expiración (30 min desde creación)

    @staticmethod
    def generate_token():
        """
        Genera un código corto de 6 caracteres alfanuméricos (Mayúsculas y Números).
        Ejemplo: AB34O6

        Returns:
            str: String de 6 caracteres alfanuméricos aleatorios.
        """
        # Excluimos caracteres ambiguos como '0' / 'O' y '1' / 'I' para evitar confusión
        chars = string.ascii_uppercase + string.digits
        chars = chars.replace('0', '').replace('O', '').replace('1', '').replace('I', '')
        return ''.join(random.choices(chars, k=6))

    def is_expired(self):
        """
        Verifica si el token ha superado su fecha de expiración.

        Returns:
            bool: True si el token ha expirado, False si aún es válido.
        """
        return timezone.now() > self.expires_at  # Compara la hora actual con la fecha límite del token
