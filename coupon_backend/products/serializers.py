# your_app_name/serializers.py
from rest_framework import serializers
from .models import Product, ProductCoupon

# Your existing ProductSerializer
class ProductSerializer(serializers.ModelSerializer):
    footer_section_how_to_use_steps = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    footer_section_tips_list = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    # ADD THIS LINE: Add a SerializerMethodField to get a shop_now_url for the product
    # This will expose a 'product_shop_now_url' field in the Product API response
    product_shop_now_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__' # This will automatically include all fields + product_shop_now_url

    # DEFINE THE METHOD TO GET THE SHOP NOW URL
    def get_product_shop_now_url(self, obj):
        # Try to get the shop_now_url from the first coupon associated with this product
        # You might want more complex logic here (e.g., newest coupon, highest discount, etc.)
        first_coupon = obj.coupons.filter(shop_now_url__isnull=False).first()
        if first_coupon:
            return first_coupon.shop_now_url
        return None # Return None if no coupon or no shop_now_url found

# Your existing ProductCouponSerializer
class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__'