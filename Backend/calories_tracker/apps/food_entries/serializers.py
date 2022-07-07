from rest_framework.serializers import ModelSerializer
from . import models


class FoodEntrySerializer(ModelSerializer):
    class Meta:
        model = models.FoodEntry
        fields = "__all__"

    def to_representation(self, instance):
        data = super(FoodEntrySerializer, self).to_representation(instance)
        data["user_fullname"] = f"{instance.user.first_name} {instance.user.last_name}"
        data["user_profile_pic"] = instance.user.profile_pic.url
        if instance.meal:
            data["meal_name"] = instance.meal.name
        return data
