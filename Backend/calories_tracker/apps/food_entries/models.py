from django.db import models
from user_configurations.models import Meal
from accounts.models import User

# Create your models here.
class FoodEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    meal = models.ForeignKey(
        Meal, on_delete=models.CASCADE, verbose_name="Meal", null=True, blank=True
    )
    food_name = models.CharField(max_length=350, verbose_name="Food name")
    calories = models.IntegerField(verbose_name="Calories")
    timestamp = models.DateTimeField(verbose_name="Date time")

    class Meta:
        verbose_name = "Food entry"
        verbose_name_plural = "Food entries"

    def __str__(self):
        return f"Food entry for {self.user.username} --- {self.food_name}"
