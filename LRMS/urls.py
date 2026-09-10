from django import views
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

from backend import ask_ai


def home(request):
    return render(request, 'index.html')

def risk_map(request):
    return render(request, "map.html")


urlpatterns = [
    path('', home, name='home'),
    path('ask_ai/', ask_ai, name='ask_ai'),
    path('admin/', admin.site.urls),
    path('api/', include('prediction.urls')),
    path("map/", views.risk_map, name="risk_map"),
] 
