from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
import uuid
from django.utils import timezone


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('CLIENT', 'Client'),
        ('ADMIN', 'Admin'),
        ('SUPERADMIN', 'Super Admin'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENT')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    @staticmethod
    def generate_token():
        return uuid.uuid4().hex

    def is_expired(self):
        return timezone.now() > self.expires_at
