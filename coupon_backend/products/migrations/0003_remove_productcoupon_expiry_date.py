# Generated by Django 5.2.1 on 2025-05-17 13:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_productcoupon_dislikes_productcoupon_likes_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="productcoupon",
            name="expiry_date",
        ),
    ]
