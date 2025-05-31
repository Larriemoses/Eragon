# products/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.contrib.sites.models import Site
from .models import Product
import re # Import re for slugify

# --- IMPORTANT: Define your Vercel frontend domain here ---
FRONTEND_DOMAIN = "discountregion.com" # No http/https, just the domain
# --- End of important definition ---

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
        # UPDATED: Removed obj.id from the URL
        return f"https://{FRONTEND_DOMAIN}/store/{slugify_py(obj.name)}/"

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        return ['/', '/stores/', '/submit-store/', '/contact/']

    def location(self, item):
        # This part remains the same as it correctly uses the item path
        return f"https://{FRONTEND_DOMAIN}{item}"