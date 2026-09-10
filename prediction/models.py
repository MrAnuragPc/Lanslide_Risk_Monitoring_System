from django.db import models


# ============================================================
#              LANDSLIDE PREDICTION DATABASE MODEL
# ============================================================

class LandslidePrediction(models.Model):

    # ========================================================
    # INPUT DATA GIVEN TO THE AI
    # ========================================================

    rainfall = models.FloatField(
        help_text="Rainfall amount"
    )

    slope = models.FloatField(
        help_text="Slope angle"
    )

    soil_moisture = models.FloatField(
        help_text="Soil moisture percentage"
    )


    # ========================================================
    # AI PREDICTION RESULT
    # ========================================================

    prediction = models.IntegerField(
        help_text="0 = No Landslide, 1 = Landslide"
    )

    result = models.CharField(
        max_length=100,
        help_text="AI prediction result"
    )

    confidence = models.FloatField(
        help_text="AI confidence percentage"
    )


    # ========================================================
    # DATE AND TIME
    # ========================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    # ========================================================
    # STRING REPRESENTATION
    # ========================================================

    def __str__(self):

        return (
            f"{self.result} | "
            f"Confidence: {self.confidence}%"
        )


# ============================================================
# OPTIONAL: USER LANDSLIDE REPORT
# ============================================================

class LandslideReport(models.Model):

    location = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="landslide_reports/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return self.location


# Backward compatibility alias used by older imports.
Prediction = LandslidePrediction
