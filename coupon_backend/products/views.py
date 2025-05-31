# your_app_name/views.py or products/views.py
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework import serializers # Make sure to import serializers here

from django.core.mail import send_mail

from .models import Product, ProductCoupon

# --- IMPORTANT: Corrected Serializer Definition ---
# It's generally best practice to have your serializers in a separate file (e.g., products/serializers.py).
# If you do, you would *remove* the class definition below and just use:
# from .serializers import ProductSerializer, ProductCouponSerializer

# Assuming you want to define it here for simplicity,
# or if you don't have a separate serializers.py for products.
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__' # Or specify your fields like ['id', 'name', 'slug', 'logo', ...]

class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__' # Or specify your fields
# --- END IMPORTANT: Corrected Serializer Definition ---


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

# NEW VIEW FOR SLUG LOOKUP
class ProductDetailBySlug(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug' # This tells DRF to use the 'slug' field for lookup

    # DRF's RetrieveAPIView handles getting the object by lookup_field automatically
    # if the field is defined in your model and is unique.
    permission_classes = [AllowAny] # Ensure this view is also publicly accessible

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
        coupon.used_count += 1
        coupon.used_today += 1
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

# This home view function needs to be defined if it's imported in your main urls.py.
# If this is a standalone API backend, you might not need a rendered HTML response.
def home(request):
    # You might want to return a simple API message here if it's purely an API backend
    from django.http import HttpResponse # Import HttpResponse if not rendering HTML
    return HttpResponse("Welcome to the Eragon Coupon Backend API!")
    # Or, if you truly have a template:
    # return render(request, 'your_template_name.html', {})