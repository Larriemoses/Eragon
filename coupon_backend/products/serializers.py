# your_app_name/serializers.py
from rest_framework import serializers
from .models import Product, ProductCoupon

# Your existing ProductSerializer
class ProductSerializer(serializers.ModelSerializer):
    footer_section_how_to_use_steps = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    footer_section_tips_list = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    # REVISED: product_shop_now_url should now prioritize the new main_affiliate_url
    product_shop_now_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        # '__all__' will include main_affiliate_url automatically.
        # If you were listing fields explicitly, you'd add 'main_affiliate_url' here.
        fields = '__all__'

    # REVISED: DEFINE THE METHOD TO GET THE SHOP NOW URL
    # This method should now prioritize main_affiliate_url
    def get_product_shop_now_url(self, obj):
        # 1. Prioritize the new main_affiliate_url field
        if obj.main_affiliate_url:
            return obj.main_affiliate_url

        # 2. If main_affiliate_url is not set, fallback to the shop_now_url of the first available coupon
        first_coupon = obj.coupons.filter(shop_now_url__isnull=False).first()
        if first_coupon:
            return first_coupon.shop_now_url

        return None # Return None if no suitable URL is found

# Your existing ProductCouponSerializer
class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__'
    # No changes needed here for the 'discount' field type change,
    # as ModelSerializer infers it correctly from the model.