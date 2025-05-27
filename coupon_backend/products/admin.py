# your_app_name/admin.py
from django.contrib import admin
from .models import Product, ProductCoupon

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'subtitle', 'sub_subtitle', 'logo', 'logo_url')
    search_fields = ('name', 'title', 'subtitle', 'sub_subtitle')
    fieldsets = (
        (None, {
            'fields': (
                'name',
                'logo',
                'logo_url',
                'title',
                'subtitle',
                'sub_subtitle'
            )
        }),
        ('Product Footer Content', {
            'fields': (
                'footer_section_effortless_savings_title',
                'footer_section_effortless_savings_description',
                'footer_section_how_to_use_title',
                'footer_section_how_to_use_steps',
                'footer_section_how_to_use_note',
                'footer_section_tips_title',
                'footer_section_tips_list',
                'footer_section_contact_title',
                'footer_section_contact_description',
                'footer_contact_phone',
                'footer_contact_email',
                'footer_contact_whatsapp',
            ),
            'classes': ('collapse',),
        }),
        # --- NEW: Social Media Links Fieldset ---
        ('Social Media Links', {
            'fields': (
                'social_facebook_url',
                'social_twitter_url',
                'social_instagram_url',
            ),
            'classes': ('collapse',), # Optional: make this section collapsible
        }),
        # --- End NEW ---
    )

@admin.register(ProductCoupon)
class ProductCouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'code', 'discount', 'used_count', 'used_today')