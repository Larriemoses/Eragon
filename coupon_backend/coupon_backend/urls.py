# coupon_backend/urls.py
"""
URL configuration for coupon_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView # <--- IMPORT THIS
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

# Assuming 'coupons' is another app that defines CouponViewSet
from coupons.views import CouponViewSet

# Sitemaps imports
from django.contrib.sitemaps.views import sitemap
# Assuming 'products' is your app where sitemaps.py resides
from products.sitemaps import ProductSitemap, StaticSitemap 

from django.conf import settings
from django.conf.urls.static import static

# Define your sitemaps dictionary
sitemaps = {
    'products': ProductSitemap,     
    'static': StaticSitemap,
}

# Router for the coupons app (assuming this setup)
coupon_router = DefaultRouter()
coupon_router.register(r'coupons', CouponViewSet, basename='coupon')

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # API Endpoints
    path('api/', include('products.urls')), # Includes Products, ProductCoupons, and SubmitStore
    path('api/', include(coupon_router.urls)), # Includes the 'coupons' API endpoint
    path('api-token-auth/', obtain_auth_token), # Token authentication

    # --- Frontend React Routes (CRUCIAL for SPA routing and Sitemap) ---
    # These paths will serve your React app's index.html, letting React Router handle sub-routes.
    # Ensure your Django TEMPLATES setting is configured to find index.html.
    # (e.g., TEMPLATES['DIRS'] should include the directory where index.html resides, often 'templates' at project root)
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('stores/', TemplateView.as_view(template_name='index.html'), name='stores'),
    path('store/<int:id>/', TemplateView.as_view(template_name='index.html'), name='product_store_detail'), # For individual product pages
    path('submit-store/', TemplateView.as_view(template_name='index.html'), name='submit_store'),
    path('contact/', TemplateView.as_view(template_name='index.html'), name='contact'),
    # Add any other React Router paths here that should be in the sitemap or directly accessible by Django's `reverse()`

    # Sitemap URL
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

# Serve media files in development (only needed for local development, often handled by web server in production)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)