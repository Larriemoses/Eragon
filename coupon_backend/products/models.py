from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to='product_logos/', blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    sub_subtitle = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class ProductCoupon(models.Model):
    product = models.ForeignKey(Product, related_name='coupons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    used_count = models.PositiveIntegerField(default=0)
    used_today = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.product.name})"
