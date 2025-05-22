from django.contrib import admin
from .models import Product, ProductCoupon

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'subtitle', 'sub_subtitle', 'logo', 'logo_url', 'approved')  # Combined
    list_filter = ('approved',)
    search_fields = ('name', 'title', 'subtitle', 'sub_subtitle')

@admin.register(ProductCoupon)
class ProductCouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'code', 'discount', 'used_count', 'used_today')
