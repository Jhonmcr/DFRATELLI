from django.http import JsonResponse
from rest_framework import viewsets, permissions
from .models import ContactMessage
from .serializers import ContactMessageSerializer


def health_check(request):
    return JsonResponse({"status": "ok"})


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_permissions():
        # Cualquiera puede enviar un mensaje (POST)
        # Solo admin puede ver los mensajes o borrarlos
        pass

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
