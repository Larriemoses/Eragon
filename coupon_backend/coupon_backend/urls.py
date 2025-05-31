from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from coupons.views import CouponViewSet
from .views import home  # Import the home view
from django.conf import settings
from django.conf.urls.static import static

# your_project/urls.py
from django.contrib.sitemaps.views import sitemap
# from your_app_name.sitemaps import ProductSitemap, StaticSitemap # You'd create these
from products.sitemaps import ProductSitemap, StaticSitemap # You'd create these

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
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)