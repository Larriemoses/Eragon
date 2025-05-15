from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class ProductCoupon(models.Model):
    product = models.ForeignKey(Product, related_name='coupons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    expiry_date = models.DateField()

    def __str__(self):
        return f"{self.title} ({self.product.name})"
