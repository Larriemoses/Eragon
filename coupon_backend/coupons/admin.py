from django.contrib import admin
from .models import Coupon
from rest_framework.authtoken.models import Token

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'code', 'discount', 'expiry_date')

admin.site.register(Token)