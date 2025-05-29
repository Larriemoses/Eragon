from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ProductViewSet, ProductCouponViewSet, SubmitStoreView


urlpatterns = [
    # ... your other url patterns ...
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'productcoupon', ProductCouponViewSet)

urlpatterns = router.urls + [
    path('submitstore/', SubmitStoreView.as_view(), name='submitstore'),
]