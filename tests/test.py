from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch


class AiIntegrationTests(TestCase):
    def test_home_page_loads(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)

    @patch("backend.OpenAI")
    def test_ai_endpoint_returns_model_answer(self, mock_openai):
        mock_client = mock_openai.return_value
        mock_client.responses.create.return_value.output_text = "This is a test answer"

        response = self.client.post(
            reverse("ask_ai"),
            {"prompt": "Hello AI"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {"answer": "This is a test answer"},
        )

    def test_landslide_prediction_endpoint_returns_risk_data(self):
        response = self.client.post(
            reverse("predict_landslide"),
            {
                "rainfall": 180,
                "slope": 35,
                "soil_moisture": 85,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["success"])
        self.assertIn("risk", payload)
        self.assertIn("risk_level", payload["risk"])
        self.assertIn("travel_safety", payload)
