from rest_framework import serializers
from .models import Product, ProductCoupon

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name']

class ProductCouponSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = ProductCoupon
        fields = [
            'id', 'product', 'product_id', 'title', 'code', 'discount',
            'likes', 'dislikes', 'used_count', 'used_today'
        ]