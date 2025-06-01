# your_app_name/models.py
from django.db import models
from django.utils import timezone # <--- NEW IMPORT: Import timezone here

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to='product_logos/', blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    sub_subtitle = models.CharField(max_length=255, blank=True)

    # --- New field for Product's main affiliate link ---
    main_affiliate_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="Main Product Affiliate Link",
        help_text="Primary affiliate link for the product (e.g., used on logo, social buttons)"
    )
    
    # --- End of new field ---

    # --- Existing fields for Product Footer content ---
    footer_section_effortless_savings_title = models.CharField(max_length=255, blank=True, null=True)
    footer_section_effortless_savings_description = models.TextField(blank=True, null=True)

    footer_section_how_to_use_title = models.CharField(max_length=255, blank=True, null=True)
    footer_section_how_to_use_steps = models.TextField(blank=True, null=True)
    footer_section_how_to_use_note = models.TextField(blank=True, null=True)

    footer_section_tips_title = models.CharField(max_length=255, blank=True, null=True)
    footer_section_tips_list = models.TextField(blank=True, null=True) # This remains text for tips

    footer_section_contact_title = models.CharField(max_length=255, blank=True, null=True)
    footer_section_contact_description = models.TextField(blank=True, null=True)
    footer_contact_phone = models.CharField(max_length=100, blank=True, null=True)
    footer_contact_email = models.EmailField(blank=True, null=True)
    footer_contact_whatsapp = models.CharField(max_length=100, blank=True, null=True)

    # --- Social Media Links (these will still be available for specific social links if needed elsewhere) ---
    social_facebook_url = models.URLField(blank=True, null=True)
    social_twitter_url = models.URLField(blank=True, null=True)
    social_instagram_url = models.URLField(blank=True, null=True)
    # --- End of Product model ---

    def __str__(self):
        return self.name

class ProductCoupon(models.Model):
    product = models.ForeignKey(Product, related_name='coupons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True, null=True)
    discount = models.CharField(max_length=50)
    used_count = models.PositiveIntegerField(default=0)
    used_today = models.PositiveIntegerField(default=0)
    shop_now_url = models.URLField(blank=True, null=True, verbose_name="Shop Now Link")
    
    last_reset_date = models.DateField(default=timezone.now) # <--- NEW FIELD ADDED HERE

    def __str__(self):
        return f"{self.title} ({self.product.name})"