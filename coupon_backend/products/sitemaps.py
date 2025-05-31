# products/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.contrib.sites.models import Site # Still useful for context, but not directly used in location
from .models import Product
import re

# Removed: FRONTEND_DOMAIN constant is no longer needed in location()

def slugify_py(text):
    if not isinstance(text, str):
        text = str(text)
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Product.objects.all()

    def location(self, obj):
        # --- FIXED: Only return the path relative to the domain ---
        return f"/store/{obj.id}/{slugify_py(obj.name)}/"

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        # Note: These paths should start with a slash, but not a domain.
        return ['/', '/stores/', '/submit-store/', '/contact/', '/terms-of-service/', '/privacy/', '/affiliate-disclosure/']

    def location(self, item):
        # --- FIXED: Only return the path ---
        return item # 'item' already contains the correct path like '/stores/'