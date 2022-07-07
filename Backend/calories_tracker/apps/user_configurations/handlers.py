from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import serializer, models
from accounts.models import User


@api_view(["GET", "PUT"])
def daily_calories_threshold_handler(request, user_id):
    user = User.objects.get(id=user_id)

    if request.method == "PUT":
        user_daily_calories_threshold = models.DailyCaloriesThreshold.objects.get(
            user=user
        )

        user_daily_calories_threshold.threshold = int(request.data.get("threshold"))
        user_daily_calories_threshold.save()
        user_daily_calories_threshold_serializer = (
            serializer.DailyCaloriesThresholdSerializer(
                user_daily_calories_threshold, many=False
            )
        )
        return Response(
            data=user_daily_calories_threshold_serializer.data,
            status=status.HTTP_200_OK,
        )
    elif request.method == "GET":
        user_daily_calories_threshold = models.DailyCaloriesThreshold.objects.get(
            user=user
        )
        user_daily_calories_threshold_serializer = (
            serializer.DailyCaloriesThresholdSerializer(
                user_daily_calories_threshold, many=False
            )
        )
        return Response(
            data=user_daily_calories_threshold_serializer.data,
            status=status.HTTP_200_OK,
        )


@api_view(["GET", "POST", "PUT", "DELETE"])
def meals_handler(request, user_id):
    user = User.objects.get(id=user_id)
    if request.method == "GET":
        meals = models.Meal.objects.filter(user=user)
        meals_serializer = serializer.MealSerializer(meals, many=True)
        return Response(data=meals_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        meal = models.Meal.objects.get(id=int(request.data.get("mealId")))
        if request.data.get("mealName"):
            meal.name = request.data.get("mealName")
        if request.data.get("mealCategory"):
            meal.category = request.data.get("mealCategory")
        if request.data.get("foodEntryLimit"):
            meal.food_entry_limit = request.data.get("foodEntryLimit")

        meal.save()

        meals = models.Meal.objects.filter(user=user)
        meals_serializer = serializer.MealSerializer(meals, many=True)
        return Response(data=meals_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        meal = models.Meal.objects.create(
            user=user,
            name=request.data.get("mealName"),
            category=request.data.get("mealCategory"),
            food_entry_limit=request.data.get("foodEntryLimit"),
        )

        meal_serializer = serializer.MealSerializer(meal, many=False)
        return Response(data=meal_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "DELETE":
        meal = models.Meal.objects.get(id=int(request.data.get("mealId"))).delete()
        meals = models.Meal.objects.filter(user=user)
        meals_serializer = serializer.MealSerializer(meals, many=True)
        return Response(status=status.HTTP_200_OK, data=meals_serializer.data)
