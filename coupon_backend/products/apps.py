# products/apps.py

from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "products"

    # --- NEW: Add the ready() method to register signals ---
    def ready(self):
        import products.signals
    # --- END NEW ---