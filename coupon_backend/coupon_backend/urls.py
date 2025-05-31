from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect # (Not directly used for sitemap)
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from coupons.views import CouponViewSet
from .views import home  # Import the home view
from django.conf import settings
from django.conf.urls.static import static

# --- SITEMAP IMPORTS ---
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap
# --- END SITEMAP IMPORTS ---

sitemaps = {
    'products': ProductSitemap,
    'static': StaticSitemap,
}

router = DefaultRouter()
router.register(r'coupons', CouponViewSet, basename='coupon')

urlpatterns = [
    path('', home, name='home'),  # Add the homepage
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('products.urls')),
    path('api-token-auth/', obtain_auth_token),

    # --- CRITICAL FIX: ADD THIS LINE ---
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    # --- END CRITICAL FIX ---

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)