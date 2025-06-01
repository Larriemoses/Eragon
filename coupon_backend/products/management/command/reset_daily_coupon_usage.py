# products/management/commands/reset_daily_coupon_usage.py
from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import ProductCoupon # Adjust import path if ProductCoupon is in 'coupons' app

class Command(BaseCommand):
    help = 'Resets the used_today count for all ProductCoupon objects to 0.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Attempting to reset daily coupon usage...'))

        try:
            # Use a transaction to ensure atomicity
            with transaction.atomic():
                # Update all ProductCoupon objects, setting used_today to 0
                updated_count = ProductCoupon.objects.update(used_today=0)

            self.stdout.write(self.style.SUCCESS(f'Successfully reset used_today for {updated_count} coupons.'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'An error occurred during daily coupon usage reset: {e}'))