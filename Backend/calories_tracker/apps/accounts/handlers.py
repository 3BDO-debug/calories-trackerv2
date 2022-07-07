import asyncio, json, time
from asgiref.sync import sync_to_async
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework_simplejwt.tokens import RefreshToken
from . import models, serializers
from user_configurations.models import DailyCaloriesThreshold
from calories_tracker.utils import generate_username, generate_random_password


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def signup_handler(request):
    created_user = models.User.objects.create_user(
        profile_pic=request.data.get("profilePic"),
        first_name=request.data.get("firstName"),
        last_name=request.data.get("lastName"),
        email=request.data.get("email"),
        username=request.data.get("username"),
        password=request.data.get("password"),
    )

    DailyCaloriesThreshold.objects.create(user=created_user, threshold=2100).save()

    return Response(status=status.HTTP_201_CREATED)


@api_view(["GET"])
def user_info_handler(request):
    user_info = models.User.objects.get(id=request.user.id)
    user_info_serializer = serializers.UserSerializer(user_info, many=False)
    return Response(status=status.HTTP_200_OK, data=user_info_serializer.data)


@api_view(["POST"])
def logout_handler(request):
    refresh_token = request.data.get("refresh_token")
    token = RefreshToken(refresh_token)
    token.blacklist()
    return Response(status=status.HTTP_205_RESET_CONTENT)


@api_view(["POST"])
def invite_friend(request):
    if request.method == "POST":
        generated_password = generate_random_password()
        generated_username = generate_username(
            request.data.get("firstName"), request.data.get("lastName")
        )
        models.User.objects.create_user(
            first_name=request.data.get("firstName"),
            last_name=request.data.get("lastName"),
            email=request.data.get("email"),
            username=generated_username,
            password=generated_password,
        )

        return Response(
            status=status.HTTP_200_OK,
            data={"username": generated_username, "password": generated_password},
        )
