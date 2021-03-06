# Generated by Django 3.2.5 on 2022-02-23 17:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_configurations', '0003_meal_food_entry_limit'),
        ('food_entries', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='foodentry',
            name='meal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='user_configurations.meal', verbose_name='Meal'),
        ),
    ]
