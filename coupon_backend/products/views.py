from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny # Ensure AllowAny is imported

from django.core.mail import send_mail
from django.utils import timezone # <--- NEW IMPORT: Import timezone

from .models import Product, ProductCoupon
from .serializers import ProductSerializer, ProductCouponSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductCouponViewSet(ModelViewSet):
    queryset = ProductCoupon.objects.all()
    serializer_class = ProductCouponSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def like(self, request, pk=None):
        coupon = self.get_object()
        coupon.likes += 1
        coupon.save()
        return Response({'likes': coupon.likes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def dislike(self, request, pk=None):
        coupon = self.get_object()
        coupon.dislikes += 1
        coupon.save()
        return Response({'dislikes': coupon.dislikes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def use(self, request, pk=None):
        coupon = self.get_object()

        # --- START OF LAZY DAILY RESET LOGIC ---
        today = timezone.localdate() # Get today's date (e.g., 2025-06-01)
        
        # Check if the last reset date is different from today
        if coupon.last_reset_date != today:
            coupon.used_today = 0  # Reset used_today to 0 for the new day
            coupon.last_reset_date = today # Update the last reset date to today
        # --- END OF LAZY DAILY RESET LOGIC ---

        coupon.used_count += 1
        coupon.used_today += 1 # Increment for the current use (starts from 0 if it was reset)
        coupon.save()
        return Response({'used_count': coupon.used_count, 'used_today': coupon.used_today}, status=status.HTTP_200_OK)

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