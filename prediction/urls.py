from django.urls import path
from . import views


urlpatterns = [

    path(
        "predict/",
        views.predict_landslide,
        name="predict_landslide"
    ),

    path(
        "map/",
        views.risk_map,
        name="risk_map"
    ),

]
