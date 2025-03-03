from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth',AuthURL.as_view()),
    path('redirect',spotify_callback),
    path('is-auth',IsAuthenticated.as_view()),
    path('current-song',CurrentSong.as_view())
]