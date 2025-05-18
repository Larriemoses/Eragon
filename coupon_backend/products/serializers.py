from rest_framework import serializers
from .models import Product, ProductCoupon

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__'