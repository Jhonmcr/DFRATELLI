from django.db import migrations, models
import uuid


def generate_unique_codes(apps, schema_editor):
    User = apps.get_model('users', 'User')
    for user in User.objects.all():
        user.unique_code = uuid.uuid4().hex[:12].upper()
        user.save(update_fields=['unique_code'])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_phone_number'),
    ]

    operations = [
        # Step 1: Add the column nullable first
        migrations.AddField(
            model_name='user',
            name='unique_code',
            field=models.CharField(blank=True, max_length=12, default=''),
        ),
        # Step 2: Populate existing rows with unique codes
        migrations.RunPython(generate_unique_codes, migrations.RunPython.noop),
        # Step 3: Now enforce uniqueness
        migrations.AlterField(
            model_name='user',
            name='unique_code',
            field=models.CharField(blank=True, max_length=12, unique=True),
        ),
    ]
