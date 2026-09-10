from pathlib import Path

import pandas as pd
from django.test import TestCase


class LandslideDatasetTest(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.FILE_PATH = Path(
            r"E:\LRMS\Data\Landslide_data_19_verified_weather_soil_updated.csv"
        )

        cls.df = pd.read_excel(cls.FILE_PATH)

    def test_file_exists(self):
        self.assertTrue(self.FILE_PATH.exists())

    def test_dataset_not_empty(self):
        self.assertGreater(len(self.df), 0)

    def test_dataset_has_columns(self):
        self.assertGreater(len(self.df.columns), 0)

    def test_duplicate_rows(self):
        duplicates = self.df.duplicated().sum()

        self.assertEqual(duplicates, 0)

    def test_dataset_information(self):
        print("\n========== LANDSLIDE DATASET ==========")
        print(f"Rows: {self.df.shape[0]}")
        print(f"Columns: {self.df.shape[1]}")
        print("\nColumn Names:")

        for column in self.df.columns:
            print(f"✓ {column}")

        print("\n=======================================\n")

        self.assertGreater(self.df.shape[0], 0)
