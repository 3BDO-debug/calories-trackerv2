from django.db import models
from accounts.models import User


# Create your models here.
class DailyCaloriesThreshold(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    threshold = models.IntegerField(default=2100, verbose_name="Threshold")

    class Meta:
        verbose_name = "User daily calories threshold"
        verbose_name_plural = "Users daily calories thresholds"

    def __str__(self):
        return f"Daily calories threshold for {self.user.username}"


class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    category = models.CharField(max_length=350, verbose_name="Category")
    name = models.CharField(max_length=350, verbose_name="Name")
    food_entry_limit = models.IntegerField(
        default=3, verbose_name="Food entry limit per meal"
    )

    class Meta:
        verbose_name = "Meal"
        verbose_name_plural = "Meals"

    def __str__(self):
        return f"{self.user.username}-{self.name}"
