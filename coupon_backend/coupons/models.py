from django.db import models

class Coupon(models.Model):
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)  # e.g., 10.00 for 10%
    expiry_date = models.DateField()

    def __str__(self):
        return self.title

        