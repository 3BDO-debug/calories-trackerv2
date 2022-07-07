from django.urls import path
from . import handlers


urlpatterns = [
    path("food-entries-data/<int:user_id>", handlers.food_entries_handler),
    path("admin-food-entries-data", handlers.admin_food_entries_handler),
]
