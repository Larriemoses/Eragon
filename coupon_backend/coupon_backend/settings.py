"""
Django settings for coupon_backend project.

Generated by 'django-admin startproject' using Django 4.2.11.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/#values
"""
import dj_database_url
from pathlib import Path
import os
# coupon_backend/settings.py

# ... (existing imports)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-#x34@fh2g)qdt=w)*d84e_e=*rd%q74nn4red1tg802r=)p9-l'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['.onrender.com',
                 '127.0.0.1',
                 'localhost',
                 # Add your Render domain here for production!
                 'eragon-backend1.onrender.com'
                 ]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'coupons',
    'rest_framework',
    'corsheaders', # For CORS
    'rest_framework.authtoken', # Add this for token authentication
    'products',
    'django.contrib.sites',
    'django.contrib.sitemaps',
]

# --- ADD THIS LINE ---
SITE_ID = 1
# ---------------------

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # CORS middleware should be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware', # For sessions (required by cache middleware if used globally)
    'django.middleware.cache.UpdateCacheMiddleware', # Global page caching (if you decide to use it)
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware', # Global page caching (if you decide to use it)
]

# IMPORTANT: If you use global page caching (UpdateCacheMiddleware/FetchFromCacheMiddleware),
# FetchFromCacheMiddleware MUST be listed AFTER UpdateCacheMiddleware.
# Also, they must be very high in your MIDDLEWARE list, usually right after SessionMiddleware.
# I've placed them above for now. If you only use low-level cache (recommended), you can remove them.

ROOT_URLCONF = 'coupon_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'coupon_backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        # default is a fallback for local development if DATABASE_URL is not set
        # For production on Render, DATABASE_URL will be provided by Render
        default='sqlite:///db.sqlite3', # Keep this for local dev if you want
        conn_max_age=600 # Optional: Reconnect to DB after 10 min to avoid stale connections
    )
}

# --- Caching Configuration ---
# Remember to install django-redis: pip install django-redis
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        # For Render production: REDIS_URL will be set by environment variable
        # For local development: ensure a Redis server is running (e.g., via Docker, or directly)
        "LOCATION": os.environ.get('REDIS_URL', "redis://127.0.0.1:6379/1"), # /1 is database 1
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARTS": {"max_connections": 100}, # Typo fix: KWARTS -> KWARGS
        },
        "KEY_PREFIX": "coupon_backend_cache" # Optional: a prefix for all keys from this app
    }
}
# --- End Caching Configuration ---


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', # Require authentication by default
    ],
}

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')