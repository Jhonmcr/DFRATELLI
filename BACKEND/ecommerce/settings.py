"""
Django settings for ecommerce project.
"""

import os
import dj_database_url
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar variables de entorno desde el archivo .env ubicado en la raíz (BACKEND)
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = 'django-insecure-pc=snrntq9(**n)b*dxj7n%01iy8!()kmihfiqe+1=hy)s93ry'

DEBUG = True

ALLOWED_HOSTS = ['*']

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = False  # Cambiado a False para usar dominios específicos
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://inversionesdfratelli.com",
    "https://www.inversionesdfratelli.com",
]

CORS_ALLOW_CREDENTIALS = True

# CSRF Trusted Origins (Necesario para peticiones POST desde el frontend en Prod)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://inversionesdfratelli.com",
    "https://www.inversionesdfratelli.com",
    "https://dfratelli-backend.onrender.com",
]


# ---------------------------------------------------------
# APPS
# ---------------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # CORS
    'corsheaders',

    # Terceros
    'rest_framework',
    'rest_framework_simplejwt',

    # Apps del proyecto
    'apps.users',
    'apps.products',
    'apps.orders',
    'apps.cart',
    'core',

    # AWS
    'storages',
]

AUTH_USER_MODEL = 'users.User'


# ---------------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------------

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Añadido primero según recomendación general
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'ecommerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ecommerce.wsgi.application'


# ---------------------------------------------------------
# BASE DE DATOS
# ---------------------------------------------------------

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'dfratelli_db',
            'USER': 'root',
            'PASSWORD': 'root1234',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
    DATABASES['default']['ENGINE'] = 'django.db.backends.mysql'
    if 'OPTIONS' not in DATABASES['default']:
        DATABASES['default']['OPTIONS'] = {}
    DATABASES['default']['OPTIONS']['init_command'] = "SET sql_mode='STRICT_TRANS_TABLES'"
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'dfratelli_db',
            'USER': 'root',
            'PASSWORD': 'root1234',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }


# ---------------------------------------------------------
# VALIDACIÓN DE CONTRASEÑAS
# ---------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ---------------------------------------------------------
# INTERNACIONALIZACIÓN
# ---------------------------------------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------
# ARCHIVOS ESTÁTICOS
# ---------------------------------------------------------

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'


# ---------------------------------------------------------
# ARCHIVOS MULTIMEDIA (AWS S3)
# ---------------------------------------------------------

USE_S3 = os.getenv('USE_S3', 'True') == 'True'

if USE_S3:
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')
    
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }

    # Para los archivos Media (subidos por usuarios)
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
    
else:
    MEDIA_URL = 'media/'
    MEDIA_ROOT = BASE_DIR / 'media'


# ---------------------------------------------------------
# 🔥 DRF + JWT
# ---------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ---------------------------------------------------------
# 📧 CONFIGURACIÓN DE EMAIL (PARA RECUPERAR CONTRASEÑA)
# ---------------------------------------------------------

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "tu_correo@gmail.com")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "tu_clave_de_aplicacion")

# URL del frontend para los links de correo (puedes ajustarla en Render)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
