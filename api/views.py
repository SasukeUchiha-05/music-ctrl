from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer
from .models import Room
# Create your views here.


# def main(request):
#     return HttpResponse("<h1>Hello, World!<h1>")

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer