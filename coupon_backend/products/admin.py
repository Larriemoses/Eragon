from django.contrib import admin
from .models import Product, ProductCoupon

@admin.register(ProductCoupon)
class ProductCouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'code', 'discount', 'used_count', 'used_today')

admin.site.register(Product)
