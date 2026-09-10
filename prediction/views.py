import json

from django.http import JsonResponse

from .landslide_ai import process_landslide_data
from django.shortcuts import render


def predict_landslide(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8")) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    rainfall = payload.get("rainfall")
    slope = payload.get("slope")
    soil_moisture = payload.get("soil_moisture")

    if rainfall is None or slope is None or soil_moisture is None:
        return JsonResponse(
            {
                "success": False,
                "error": "rainfall, slope and soil_moisture are required.",
            },
            status=400,
        )

    try:
        result = process_landslide_data(float(rainfall), float(slope), float(soil_moisture))
    except ValueError:
        return JsonResponse(
            {"success": False, "error": "All numeric fields must be valid numbers."},
            status=400,
        )
    except Exception as exc:  # pragma: no cover - defensive fallback
        return JsonResponse({"success": False, "error": str(exc)}, status=500)

    return JsonResponse(result)


def risk_map(request):
    return render(request, "map.html")
