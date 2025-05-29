# coupon_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse # <--- ADD THIS IMPORT

# Imports for DRF and token auth
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

# Sitemaps imports
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap

# Imports for media files
from django.conf import settings
from django.conf.urls.static import static

# Router for the coupons app (assuming this setup)
from coupons.views import CouponViewSet
coupon_router = DefaultRouter()
coupon_router.register(r'coupons', CouponViewSet, basename='coupon')

# Define your sitemaps dictionary
sitemaps = {
    'products': ProductSitemap,
    'static': StaticSitemap,
}

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # API Endpoints
    path('api/', include('products.urls')),
    path('api/', include(coupon_router.urls)),
    path('api-token-auth/', obtain_auth_token),

    # --- Frontend React Routes (Crucial for Sitemap's `reverse()` to work) ---
    # These paths are defined here so Django's `reverse()` can find them for the sitemap.
    # They should NOT be served by Django for actual users if frontend is on Vercel.
    # We use a dummy view (lambda function) that returns an empty HttpResponse.
    path('', lambda request: HttpResponse(''), name='home'), # <--- CHANGED
    path('stores/', lambda request: HttpResponse(''), name='stores'), # <--- CHANGED
    path('store/<int:id>/<slug:slug>/', lambda request: HttpResponse(''), name='product_store_detail'), # <--- CHANGED
    path('submit-store/', lambda request: HttpResponse(''), name='submit_store'), # <--- CHANGED
    path('contact/', lambda request: HttpResponse(''), name='contact'), # <--- CHANGED

    # Sitemap URL
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

# Serve media files in development (usually handled by web server in production)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)