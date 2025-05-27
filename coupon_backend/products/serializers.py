# your_app_name/serializers.py
from rest_framework import serializers
from .models import Product, ProductCoupon
import json # Import json

class StringToListField(serializers.CharField):
    """
    Custom field to convert newline-separated string to a list of strings.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            return [line.strip() for line in data.split('\n') if line.strip()]
        return data # Let default JSONField validation handle if not string

    def to_representation(self, value):
        if isinstance(value, list):
            return '\n'.join(value)
        return value # Return as is if not a list

class ProductSerializer(serializers.ModelSerializer):
    # Override the fields that need custom handling
    footer_section_how_to_use_steps = StringToListField(required=False, allow_null=True)
    footer_section_tips_list = StringToListField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = '__all__'

class ProductCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupon
        fields = '__all__'