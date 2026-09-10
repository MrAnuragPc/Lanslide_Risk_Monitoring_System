import json
import os

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from openai import OpenAI


def home(request):
    return render(request, "index.html")


@csrf_protect
@require_POST
def ask_ai(request):
    try:
        payload = json.loads(request.body.decode("utf-8")) if request.body else {}
        prompt = str(payload.get("prompt", "")).strip()

        if not prompt:
            return JsonResponse({"error": "Prompt is required."}, status=400)

        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

        try:
            client = OpenAI()
        except Exception as exc:
            return JsonResponse(
                {"error": f"OpenAI client could not be initialized: {exc}"},
                status=500,
            )

        response = client.responses.create(model=model, input=prompt)
        answer = getattr(response, "output_text", None) or "I could not generate a response."
        return JsonResponse({"answer": answer})
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
