# Generated by Django 3.2.5 on 2022-02-22 17:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user_configurations', '0002_meal'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_name', models.CharField(max_length=350, verbose_name='Food name')),
                ('calories', models.IntegerField(verbose_name='Calories')),
                ('timestamp', models.DateTimeField(verbose_name='Date time')),
                ('meal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_configurations.meal', verbose_name='Meal')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Food entry',
                'verbose_name_plural': 'Food entries',
            },
        ),
    ]
