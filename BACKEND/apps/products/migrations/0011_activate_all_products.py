from django.db import migrations

def activate_all_products(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    Product.objects.all().update(is_active=True)

class Migration(migrations.Migration):
    dependencies = [
        ('products', '0010_product_total_sold'),
    ]

    operations = [
        migrations.RunPython(activate_all_products),
    ]
