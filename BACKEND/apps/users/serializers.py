from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from datetime import timedelta

from .models import User, PasswordResetToken


# ---------------------------------------------------------
# REGISTRO
# ---------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "role")

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            role=validated_data.get("role", "CLIENT"),
        )
        return user


# ---------------------------------------------------------
# LOGIN (JWT usando email)
# ---------------------------------------------------------

class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = user.role
        return token

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Email no registrado")

        if not user.check_password(password):
            raise serializers.ValidationError("Contraseña incorrecta")

        attrs["username"] = user.email
        return super().validate(attrs)


# ---------------------------------------------------------
# RECUPERACIÓN DE CONTRASEÑA - SOLICITUD
# ---------------------------------------------------------

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No existe un usuario con este email.")
        return value

    def save(self):
        email = self.validated_data["email"]
        user = User.objects.get(email=email)

        token = PasswordResetToken.generate_token()
        expires_at = timezone.now() + timedelta(minutes=30)

        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )

        return token, user


# ---------------------------------------------------------
# RECUPERACIÓN DE CONTRASEÑA - CONFIRMACIÓN
# ---------------------------------------------------------

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        token = attrs.get("token")

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Token inválido.")

        if reset_token.is_expired():
            raise serializers.ValidationError("El token ha expirado.")

        attrs["user"] = reset_token.user
        attrs["reset_token"] = reset_token
        return attrs

    def save(self):
        user = self.validated_data["user"]
        reset_token = self.validated_data["reset_token"]
        password = self.validated_data["password"]

        user.set_password(password)
        user.save()

        reset_token.delete()
        return user
