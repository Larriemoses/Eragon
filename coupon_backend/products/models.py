# your_app_name/models.py or products/models.py
from django.db import models
from django.utils.text import slugify # Import slugify

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    # ADD THIS LINE:
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True) # Add this field!
    # It's unique to ensure clean URLs, blank=True/null=True for initial migration

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

    # --- Social Media Links ---
    social_facebook_url = models.URLField(blank=True, null=True)
    social_twitter_url = models.URLField(blank=True, null=True)
    social_instagram_url = models.URLField(blank=True, null=True)
    # --- End of Product model ---

    def save(self, *args, **kwargs):
        if not self.slug: # Generate slug only if it's not already set
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

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

    def __str__(self):
        return f"{self.title} ({self.product.name})"