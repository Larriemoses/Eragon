from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from coupons.views import CouponViewSet
from products.views import ProductViewSet, ProductCouponViewSet, SubmitStoreView
from .views import home
from django.conf import settings
from django.conf.urls.static import static

# Sitemaps
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, StaticSitemap

sitemaps = {
    'products': ProductSitemap,
    'static': StaticSitemap,
}

# 🔁 One unified router
router = DefaultRouter()
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'productcoupon', ProductCouponViewSet, basename='productcoupon')

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),

    # ✅ Unified API
    path('api/', include(router.urls)),

    # 🔧 Other custom views
    path('api/submitstore/', SubmitStoreView.as_view(), name='submitstore'),

    # Auth & sitemap
    path('api-token-auth/', obtain_auth_token),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
