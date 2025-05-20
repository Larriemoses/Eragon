from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ProductViewSet, ProductCouponViewSet, SubmitStoreView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'productcoupon', ProductCouponViewSet)

urlpatterns = router.urls + [
    path('submitstore/', SubmitStoreView.as_view(), name='submitstore'),
]