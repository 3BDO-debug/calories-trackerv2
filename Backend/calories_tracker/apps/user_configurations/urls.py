from django.urls import path
from . import handlers

urlpatterns = [
    path(
        "daily-calories-threshold/<int:user_id>",
        handlers.daily_calories_threshold_handler,
    ),
    path("meals/<int:user_id>", handlers.meals_handler),
]
