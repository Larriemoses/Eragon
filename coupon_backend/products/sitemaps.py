# products/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
# Assuming Product model is in the 'products' app
from .models import Product 

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9 # This is a common priority for individual product pages

    def items(self):
        # This will query all Product objects from your database
        return Product.objects.all()

    def location(self, obj):
        # 'product_store_detail' is the name of the URL pattern for your frontend product detail page
        # The 'args=[obj.id]' passes the product's ID to that URL pattern.
        return reverse('product_store_detail', args=[obj.id])

class StaticSitemap(Sitemap):
    changefreq = "monthly" # Less frequent changes for static pages
    priority = 0.8 # Slightly lower priority than dynamic product pages

    def items(self):
        # These are the *names* of the URL patterns defined in your project-level urls.py
        # Match these names exactly to those in your project's urlpatterns
        return ['home', 'stores', 'submit_store', 'contact']

    def location(self, item):
        # For static pages, reverse() directly uses the item name.
        return reverse(item)