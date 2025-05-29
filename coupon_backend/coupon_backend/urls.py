# coupon_backend/urls.py

from django.contrib import admin
from django.urls import path, include
# No TemplateView import needed anymore

# Imports for DRF and token auth
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

# Sitemaps imports
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap

# Imports for media files
from django.conf import settings
from django.conf.urls.static import static

# <--- ADD THIS IMPORT!
# Assuming CouponViewSet is located in the views.py of your 'coupons' app
from coupons.views import CouponViewSet 


# Define your sitemaps dictionary
sitemaps = {
    'products': ProductSitemap,     
    'static': StaticSitemap,
}

# Router for the coupons app
coupon_router = DefaultRouter()
coupon_router.register(r'coupons', CouponViewSet, basename='coupon')

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # API Endpoints
    path('api/', include('products.urls')),
    path('api/', include(coupon_router.urls)),
    path('api-token-auth/', obtain_auth_token),

    # Sitemap URL
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)