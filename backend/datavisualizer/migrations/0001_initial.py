# Generated by Django 5.2.1 on 2025-06-01 02:17

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Alert",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "source_type",
                    models.CharField(
                        choices=[
                            ("crypto", "Cryptocurrency"),
                            ("stock", "Stock Market"),
                            ("weather", "Weather"),
                            ("currency", "Currency Exchange"),
                        ],
                        max_length=20,
                    ),
                ),
                ("symbol", models.CharField(max_length=20)),
                (
                    "condition",
                    models.CharField(
                        choices=[
                            ("above", "Above"),
                            ("below", "Below"),
                            ("change_up", "Change Up %"),
                            ("change_down", "Change Down %"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "threshold_value",
                    models.DecimalField(decimal_places=8, max_digits=20),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("last_triggered", models.DateTimeField(blank=True, null=True)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="DataSource",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
                (
                    "source_type",
                    models.CharField(
                        choices=[
                            ("crypto", "Cryptocurrency"),
                            ("stock", "Stock Market"),
                            ("weather", "Weather"),
                            ("currency", "Currency Exchange"),
                        ],
                        max_length=20,
                    ),
                ),
                ("api_url", models.URLField()),
                ("api_key_required", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("update_interval_minutes", models.PositiveIntegerField(default=5)),
                ("symbols", models.JSONField(default=list)),
                ("last_updated", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="DataPoint",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "timestamp",
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now
                    ),
                ),
                ("value", models.DecimalField(decimal_places=8, max_digits=20)),
                (
                    "source_type",
                    models.CharField(
                        choices=[
                            ("crypto", "Cryptocurrency"),
                            ("stock", "Stock Market"),
                            ("weather", "Weather"),
                            ("currency", "Currency Exchange"),
                        ],
                        db_index=True,
                        max_length=20,
                    ),
                ),
                ("symbol", models.CharField(db_index=True, max_length=20)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-timestamp"],
                "indexes": [
                    models.Index(
                        fields=["source_type", "symbol", "-timestamp"],
                        name="datavisuali_source__d47502_idx",
                    ),
                    models.Index(
                        fields=["source_type", "-timestamp"],
                        name="datavisuali_source__2bfbd2_idx",
                    ),
                    models.Index(
                        fields=["-timestamp"], name="datavisuali_timesta_961804_idx"
                    ),
                ],
                "unique_together": {("timestamp", "source_type", "symbol")},
            },
        ),
    ]
