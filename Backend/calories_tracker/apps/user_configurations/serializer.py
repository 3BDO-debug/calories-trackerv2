from rest_framework.serializers import ModelSerializer
from . import models


class DailyCaloriesThresholdSerializer(ModelSerializer):
    class Meta:
        model = models.DailyCaloriesThreshold
        fields = "__all__"


class MealSerializer(ModelSerializer):
    class Meta:
        model = models.Meal
        fields = "__all__"
