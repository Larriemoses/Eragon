# your_app_name/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Product # Assuming Product model is in this app

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Product.objects.all()

    def location(self, obj):
        return reverse('product_store_detail', args=[obj.id]) # Replace 'product_store_detail' with the actual URL name for your product detail page in Django

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        return ['home', 'stores', 'submit_store', 'contact'] # Replace with actual URL names

    def location(self, item):
        return reverse(item)