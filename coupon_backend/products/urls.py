from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductCouponViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'productcoupon', ProductCouponViewSet)

urlpatterns = router.urls