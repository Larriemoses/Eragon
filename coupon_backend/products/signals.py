# products/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Product, ProductCoupon # Import your models

# --- Cache Keys ---
PRODUCT_LIST_CACHE_KEY = "product_list_all"
COUPON_LIST_CACHE_KEY = "coupon_list_all"

# Invalidate cache when Product model changes
@receiver(post_save, sender=Product)
def invalidate_product_cache_on_save(sender, instance, **kwargs):
    # Invalidate the list of all products
    cache.delete(PRODUCT_LIST_CACHE_KEY)
    print(f"DEBUG: Product list cache invalidated due to save of Product: {instance.name}.")

    # Invalidate cache for this specific product's detail page
    # Note: If your ProductStore uses /store/{id}/{slug}/, the product detail cache key is product_detail_{id}
    cache.delete(f"product_detail_{instance.id}")
    print(f"DEBUG: Product detail cache for ID {instance.id} invalidated on save.")

    # Also invalidate the list of all coupons, as product data might affect coupon display
    cache.delete(COUPON_LIST_CACHE_KEY)
    print("DEBUG: Coupon list cache invalidated due to product save.")


@receiver(post_delete, sender=Product)
def invalidate_product_cache_on_delete(sender, instance, **kwargs):
    # Invalidate the list of all products
    cache.delete(PRODUCT_LIST_CACHE_KEY)
    print(f"DEBUG: Product list cache invalidated due to delete of Product: {instance.name}.")

    # Invalidate cache for this specific product's detail page (even if deleted, good practice to clear)
    cache.delete(f"product_detail_{instance.id}")
    print(f"DEBUG: Product detail cache for ID {instance.id} invalidated on delete.")

    # Also invalidate the list of all coupons
    cache.delete(COUPON_LIST_CACHE_KEY)
    print("DEBUG: Coupon list cache invalidated due to product delete.")


# Invalidate cache when ProductCoupon model changes
@receiver(post_save, sender=ProductCoupon)
def invalidate_coupon_cache_on_save(sender, instance, **kwargs):
    # Invalidate the list of all coupons
    cache.delete(COUPON_LIST_CACHE_KEY)
    print(f"DEBUG: Coupon list cache invalidated due to save of Coupon: {instance.title}.")

    # Invalidate cache for this specific coupon's detail page
    cache.delete(f"coupon_detail_{instance.id}")
    print(f"DEBUG: Coupon detail cache for ID {instance.id} invalidated on save.")

    # Also invalidate the detail page of the associated product if its coupons are displayed there
    # (assuming ProductStore fetches coupon details from coupon_api, not embedded in product detail)
    # If ProductStore also displays count of coupons or similar on product detail, this might be needed
    # cache.delete(f"product_detail_{instance.product.id}") # Uncomment if necessary

@receiver(post_delete, sender=ProductCoupon)
def invalidate_coupon_cache_on_delete(sender, instance, **kwargs):
    # Invalidate the list of all coupons
    cache.delete(COUPON_LIST_CACHE_KEY)
    print(f"DEBUG: Coupon list cache invalidated due to delete of Coupon: {instance.title}.")

    # Invalidate cache for this specific coupon's detail page
    cache.delete(f"coupon_detail_{instance.id}")
    print(f"DEBUG: Coupon detail cache for ID {instance.id} invalidated on delete.")

    # Invalidate product detail if necessary
    # cache.delete(f"product_detail_{instance.product.id}") # Uncomment if necessary