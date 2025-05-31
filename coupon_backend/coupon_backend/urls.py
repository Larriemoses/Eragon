# your_project/urls.py (main project urls.py)

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect # Not directly used in API
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from coupons.views import CouponViewSet # Assuming this is correct
from products.views import home, ProductDetailBySlug # Import your new view here
from django.conf import settings
from django.conf.urls.static import static

# your_project/urls.py
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap

sitemaps = {
    'products': ProductSitemap,
    'static': StaticSitemap,
}

router = DefaultRouter()
router.register(r'coupons', CouponViewSet, basename='coupon')
# You already registered ProductViewSet here if it's in your main app urls.py
# If ProductViewSet is part of 'products.urls', then it will be included there.

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Add the specific path for fetching products by slug within your API urls
    path('api/products/by_slug/<str:slug>/', ProductDetailBySlug.as_view(), name='product-detail-by-slug'),
    path('api/', include('products.urls')), # Keep this if products.urls contains other product-related paths
    path('api-token-auth/', obtain_auth_token),
    # Sitemap URL
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)