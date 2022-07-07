import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers
from accounts.models import User
from user_configurations.models import Meal


@api_view(["GET", "POST"])
def food_entries_handler(request, user_id):

    user = User.objects.get(id=user_id)

    if request.method == "GET":
        food_entries = models.FoodEntry.objects.filter(user=user)
        food_entries_serializer = serializers.FoodEntrySerializer(
            food_entries, many=True
        )

        return Response(data=food_entries_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":

        meal = Meal.objects.get(id=int(request.data.get("mealId")))

        parsed_datetime = datetime.datetime.strptime(
            request.data.get("foodDateTimeIntake"), "%Y-%m-%d %H:%M"
        )

        food_entry = models.FoodEntry.objects.create(
            user=user,
            meal=meal,
            food_name=request.data.get("foodName"),
            calories=int(request.data.get("calories")),
            timestamp=datetime.datetime.strftime(parsed_datetime, "%Y-%m-%d %H:%M"),
        )

        food_entry_serializer = serializers.FoodEntrySerializer(food_entry, many=False)

        return Response(status=status.HTTP_200_OK, data=food_entry_serializer.data)


@api_view(["GET", "POST", "PUT", "DELETE"])
def admin_food_entries_handler(request):

    if request.user.is_superuser:
        if request.method == "GET":
            food_entries = models.FoodEntry.objects.all().order_by("-timestamp")
            food_entries_serializer = serializers.FoodEntrySerializer(
                food_entries, many=True
            )

            return Response(
                data=food_entries_serializer.data, status=status.HTTP_200_OK
            )

        elif request.method == "DELETE":

            models.FoodEntry.objects.get(
                id=int(request.data.get("foodEntryId"))
            ).delete()

            food_entries = models.FoodEntry.objects.all()
            food_entries_serializer = serializers.FoodEntrySerializer(
                food_entries, many=True
            )

            return Response(
                data=food_entries_serializer.data, status=status.HTTP_200_OK
            )

        elif request.method == "PUT":
            food_entry = models.FoodEntry.objects.get(
                id=int(request.data.get("foodEntryId"))
            )

            if request.data.get("foodName"):
                food_entry.food_name = request.data.get("foodName")

            if request.data.get("calories"):
                food_entry.calories = int(request.data.get("calories"))

            if request.data.get("timestamp"):
                parsed_datetime = datetime.datetime.strptime(
                    request.data.get("timestamp"), "%Y-%m-%d %H:%M"
                )
                food_entry.timestamp = datetime.datetime.strftime(
                    parsed_datetime, "%Y-%m-%d %H:%M"
                )

            food_entry.save()
            food_entries = models.FoodEntry.objects.all()
            food_entries_serializer = serializers.FoodEntrySerializer(
                food_entries, many=True
            )
            return Response(
                data=food_entries_serializer.data, status=status.HTTP_200_OK
            )
        elif request.method == "POST":

            meal = Meal.objects.get(id=int(request.data.get("mealId")))

            parsed_datetime = datetime.datetime.strptime(
                request.data.get("foodDateTimeIntake"), "%Y-%m-%d %H:%M"
            )

            food_entry = models.FoodEntry.objects.create(
                user=request.user,
                meal=meal,
                food_name=request.data.get("foodName"),
                calories=int(request.data.get("calories")),
                timestamp=datetime.datetime.strftime(parsed_datetime, "%Y-%m-%d %H:%M"),
            )

            food_entry_serializer = serializers.FoodEntrySerializer(
                food_entry, many=False
            )

            return Response(status=status.HTTP_200_OK, data=food_entry_serializer.data)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)
