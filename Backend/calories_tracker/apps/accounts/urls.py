from django.urls import path
from . import handlers


urlpatterns = [
    path("signup", handlers.signup_handler),
    path("user-info", handlers.user_info_handler),
    path("logout", handlers.logout_handler),
    path("invite-friend", handlers.invite_friend),
]
