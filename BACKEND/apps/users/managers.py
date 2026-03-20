"""
Module: managers.py
App: users
Project: DFRATELLI - Sistema de Gestión de Ferretería

Descripción:
    Define el manager personalizado UserManager para el modelo User.
    Proporciona métodos para crear usuarios estándar y superusuarios,
    generando automáticamente un código único de identificación (unique_code)
    si no se especifica uno al momento de la creación.

Author:  Jhon Michael Cariaco Rosales
Email:   jhoncariaco@gmail.com
GitHub:  https://github.com/Jhonmcr
Date:    2026-03-20
Version: 1.0.0
"""

from django.contrib.auth.models import BaseUserManager  # Clase base para managers de modelos de usuario
import uuid                                             # Generación de códigos únicos aleatorios


class UserManager(BaseUserManager):
    """
    Manager personalizado para el modelo User.

    Extiende BaseUserManager para manejar la creación de usuarios
    con email como campo de autenticación y generación automática
    de código único de identificación.
    """

    def create_user(self, email, username, password=None, role="CLIENT"):
        """
        Crea y guarda un usuario estándar en la base de datos.

        Normaliza el email, genera un unique_code si no existe, hashea
        la contraseña y persiste el usuario en la base de datos activa.

        Args:
            email (str): Correo electrónico del usuario (campo de login).
            username (str): Nombre de usuario visible en el sistema.
            password (str, optional): Contraseña en texto plano (se hashea).
            role (str, optional): Rol del usuario. Por defecto 'CLIENT'.

        Raises:
            ValueError: Si el email no es proporcionado.

        Returns:
            User: Instancia del usuario creado y guardado en la DB.
        """
        if not email:
            raise ValueError("El usuario debe tener un email")  # El email es obligatorio

        email = self.normalize_email(email)                       # Normaliza el dominio del email a minúsculas
        user = self.model(email=email, username=username, role=role)  # Crea la instancia sin guardar aún

        # Genera un unique_code alfanumérico si el usuario no tiene uno asignado
        if not user.unique_code:
            user.unique_code = uuid.uuid4().hex[:12].upper()     # Toma los primeros 12 caracteres del UUID en mayúsculas

        user.set_password(password)                               # Hashea la contraseña antes de guardar
        user.save(using=self._db)                                 # Guarda en la base de datos configurada
        return user

    def create_superuser(self, email, username, password=None):
        """
        Crea y guarda un superusuario con todos los permisos habilitados.

        El superusuario tiene rol SUPERADMIN, is_staff=True e is_superuser=True,
        lo que le da acceso completo al panel de administración de Django.

        Args:
            email (str): Correo electrónico del superusuario.
            username (str): Nombre de usuario del superusuario.
            password (str, optional): Contraseña en texto plano (se hashea).

        Returns:
            User: Instancia del superusuario creado y guardado en la DB.
        """
        user = self.create_user(email, username, password, role="SUPERADMIN")  # Crea usuario base con rol SUPERADMIN
        user.is_staff = True        # Permite acceso al panel /admin/ de Django
        user.is_superuser = True    # Otorga todos los permisos de Django automáticamente
        user.save(using=self._db)   # Persiste los cambios de permisos
        return user
