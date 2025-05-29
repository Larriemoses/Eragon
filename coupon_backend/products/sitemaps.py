# products/sitemaps.py
from django.contrib.sitemaps import Sitemap
# from django.urls import reverse # Removed from prior instruction as we're constructing absolute URLs now
from django.contrib.sites.models import Site # Import Site model
from .models import Product
# Add slugify helper function if it's not available globally or define it here
# You can copy the slugify function content from src/utils/slugify.ts directly here
def slugify_py(text):
    import re
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
        current_site = Site.objects.get_current(self.request)
        # UPDATED: Construct the absolute URL with both ID and slug
        # Ensure 'slugify_py' (or whatever you name your Python slugify) is defined/imported
        return f"https://{current_site.domain}/store/{obj.id}/{slugify_py(obj.name)}/"

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        # List the paths relative to the frontend domain
        return ['/', '/stores/', '/submit-store/', '/contact/'] # Ensure these match your React Router paths

    def location(self, item):
        current_site = Site.objects.get_current(self.request)
        return f"https://{current_site.domain}{item}"