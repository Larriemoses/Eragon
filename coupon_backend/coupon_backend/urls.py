# coupon_backend/urls.py
from django.contrib import admin
from django.urls import path, include
# No TemplateView import needed (assuming frontend is separate)

# Imports for DRF and token auth
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

# Sitemaps imports
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap # Assuming products is your app where sitemaps.py resides

# Imports for media files
from django.conf import settings
from django.conf.urls.static import static

# Router for the coupons app (assuming this setup)
from coupons.views import CouponViewSet # Import CouponViewSet
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
    path('api/', include('products.urls')), # Includes Products, ProductCoupons, and SubmitStore
    path('api/', include(coupon_router.urls)), # Includes the 'coupons' API endpoint
    path('api-token-auth/', obtain_auth_token), # Token authentication

    # --- Frontend React Routes (Crucial for Sitemap's `reverse()` to work) ---
    # These paths are defined here so Django's `reverse()` can find them for the sitemap.
    # They should NOT be served by Django for actual users if frontend is on Vercel.
    # We use a dummy view (lambda function) that essentially does nothing.
    path('', lambda request: None, name='home'),
    path('stores/', lambda request: None, name='stores'),
    path('store/<int:id>/<slug:slug>/', lambda request: None, name='product_store_detail'), # UPDATED: New pattern for product detail
    path('submit-store/', lambda request: None, name='submit_store'),
    path('contact/', lambda request: None, name='contact'),

    # Sitemap URL
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

# Serve media files in development (usually handled by web server in production)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)