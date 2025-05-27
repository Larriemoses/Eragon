# your_app_name/serializers.py
from rest_framework import serializers
from .models import Product, ProductCoupon

class StringToListField(serializers.CharField):
    """
    Custom field to convert newline-separated string to a list of strings.
    Handles potential empty strings correctly by returning an empty list.
    """
    def to_internal_value(self, data):
        if not data:
            return []
        if isinstance(data, str):
            return [line.strip() for line in data.split('\n') if line.strip()]
        return data

    def to_representation(self, value):
        if isinstance(value, list):
            return '\n'.join(value)
        return value if value is not None else ''

class ProductSerializer(serializers.ModelSerializer):
    footer_section_how_to_use_steps = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    footer_section_tips_list = serializers.CharField(required=False, allow_null=True, allow_blank=True)


    class Meta:
        model = Product
        fields = '__all__' # This will automatically include the new social fields

class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__'