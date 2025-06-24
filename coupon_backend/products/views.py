from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.utils import timezone
from django.core.cache import cache # --- NEW: Import cache ---

from .models import Product, ProductCoupon
from .serializers import ProductSerializer, ProductCouponSerializer

# --- Define Cache Timeouts (in seconds) ---
# A shorter timeout means data is refreshed more often, but fewer cache hits.
# With proper invalidation, you can use longer timeouts.
CACHE_TIMEOUT_PRODUCT_LIST = 60 * 5  # 5 minutes
CACHE_TIMEOUT_PRODUCT_DETAIL = 60 * 15 # 15 minutes
CACHE_TIMEOUT_COUPON_LIST = 60 * 1 # 1 minute (as coupons change frequently)
CACHE_TIMEOUT_COUPON_DETAIL = 60 * 5 # 5 minutes

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    # --- NEW: Caching for Product List ---
    def list(self, request, *args, **kwargs):
        cache_key = "product_list_all"
        cached_data = cache.get(cache_key)

        if cached_data is None:
            # If not in cache, fetch from database and serialize
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=CACHE_TIMEOUT_PRODUCT_LIST)
            print(f"DEBUG: Fetched product list from DB (Cache Miss) and cached for {CACHE_TIMEOUT_PRODUCT_LIST}s.")
        else:
            print("DEBUG: Fetched product list from Cache (Cache Hit).")
        
        return Response(cached_data)

    # --- NEW: Caching for Product Detail ---
    def retrieve(self, request, *args, **kwargs):
        instance_id = self.kwargs.get('pk') # Get the ID from the URL
        cache_key = f"product_detail_{instance_id}"
        cached_data = cache.get(cache_key)

        if cached_data is None:
            # If not in cache, fetch from database
            instance = self.get_object() # Uses DRF's default get_object
            serializer = self.get_serializer(instance)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=CACHE_TIMEOUT_PRODUCT_DETAIL)
            print(f"DEBUG: Fetched product {instance_id} from DB (Cache Miss) and cached for {CACHE_TIMEOUT_PRODUCT_DETAIL}s.")
        else:
            print(f"DEBUG: Fetched product {instance_id} from Cache (Cache Hit).")

        return Response(cached_data)
    # --- END NEW ---


class ProductCouponViewSet(ModelViewSet):
    queryset = ProductCoupon.objects.all()
    serializer_class = ProductCouponSerializer
    permission_classes = [AllowAny]

    # --- NEW: Caching for ProductCoupon List ---
    def list(self, request, *args, **kwargs):
        cache_key = "coupon_list_all"
        cached_data = cache.get(cache_key)

        if cached_data is None:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=CACHE_TIMEOUT_COUPON_LIST)
            print(f"DEBUG: Fetched coupon list from DB (Cache Miss) and cached for {CACHE_TIMEOUT_COUPON_LIST}s.")
        else:
            print("DEBUG: Fetched coupon list from Cache (Cache Hit).")
        
        return Response(cached_data)

    # --- NEW: Caching for ProductCoupon Detail ---
    def retrieve(self, request, *args, **kwargs):
        instance_id = self.kwargs.get('pk') # Get the ID from the URL
        cache_key = f"coupon_detail_{instance_id}"
        cached_data = cache.get(cache_key)

        if cached_data is None:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=CACHE_TIMEOUT_COUPON_DETAIL)
            print(f"DEBUG: Fetched coupon {instance_id} from DB (Cache Miss) and cached for {CACHE_TIMEOUT_COUPON_DETAIL}s.")
        else:
            print(f"DEBUG: Fetched coupon {instance_id} from Cache (Cache Hit).")
        
        return Response(cached_data)
    # --- END NEW ---

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def like(self, request, pk=None):
        coupon = self.get_object()
        coupon.likes += 1
        coupon.save()
        # --- IMPORTANT: Invalidate cache for this specific coupon and the list ---
        cache.delete(f"coupon_detail_{pk}")
        cache.delete("coupon_list_all")
        # --- END IMPORTANT ---
        return Response({'likes': coupon.likes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def dislike(self, request, pk=None):
        coupon = self.get_object()
        coupon.dislikes += 1
        coupon.save()
        # --- IMPORTANT: Invalidate cache for this specific coupon and the list ---
        cache.delete(f"coupon_detail_{pk}")
        cache.delete("coupon_list_all")
        # --- END IMPORTANT ---
        return Response({'dislikes': coupon.dislikes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def use(self, request, pk=None):
        coupon = self.get_object()

        # --- Daily Reset Logic ---
        today = timezone.localdate()

        if coupon.last_reset_date != today:
            coupon.used_today = 0
            coupon.last_reset_date = today

        # --- Update Click Counts ---
        coupon.used_count += 1
        coupon.used_today += 1
        coupon.save()

        # --- IMPORTANT: Invalidate cache for this specific coupon and the list ---
        # The coupon details will be re-fetched on next request with updated counts
        cache.delete(f"coupon_detail_{pk}")
        cache.delete("coupon_list_all")
        # --- END IMPORTANT ---

        return Response({
            'used_count': coupon.used_count,
            'used_today': coupon.used_today,
            'message': 'Coupon usage updated successfully.'
        }, status=status.HTTP_200_OK)

class SubmitStoreView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            send_mail(
                "New Store Submission",
                f"Store: {data.get('store_name')}\nWebsite: {data.get('website')}\nCode: {data.get('discount_code')}\nDescription: {data.get('description')}",
                "larriemoses@gmail.com",
                ["larriemoses@gmail.com"],
                fail_silently=False,
            )
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending email: {e}")
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)