from unittest.mock import patch

from django.test import TestCase, override_settings

from apps.users.models import User


class PasswordResetFlowTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="cliente@example.com",
            username="cliente",
            password="123456",
        )

    @override_settings(DEBUG=True, LOCAL_DEV=True)
    @patch("apps.users.views.send_mail", side_effect=Exception("SMTP failure"))
    def test_password_reset_request_returns_debug_token_when_email_fails_in_local_dev(self, mock_send_mail):
        response = self.client.post(
            "/api/auth/password-reset-request/",
            {"email": self.user.email},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("debug_token", response.json())
        self.assertEqual(len(response.json()["debug_token"]), 6)
