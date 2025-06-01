from django.db import models
from django.utils import timezone


class DataPoint(models.Model):
    SOURCE_CHOICES = [
        ('crypto', 'Cryptocurrency'),
        ('stock', 'Stock Market'),
        ('weather', 'Weather'),
        ('currency', 'Currency Exchange'),
    ]
    
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    value = models.DecimalField(max_digits=20, decimal_places=8)
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES, db_index=True)
    symbol = models.CharField(max_length=20, db_index=True)  # e.g., 'BTC', 'AAPL', 'USD-EUR'
    metadata = models.JSONField(default=dict, blank=True)  # Store additional data like price, volume, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['source_type', 'symbol', '-timestamp']),
            models.Index(fields=['source_type', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]
        unique_together = ['timestamp', 'source_type', 'symbol']
    
    def __str__(self):
        return f"{self.source_type} - {self.symbol}: {self.value} at {self.timestamp}"


class DataSource(models.Model):
    """Configuration for different data sources"""
    name = models.CharField(max_length=100, unique=True)
    source_type = models.CharField(max_length=20, choices=DataPoint.SOURCE_CHOICES)
    api_url = models.URLField()
    api_key_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    update_interval_minutes = models.PositiveIntegerField(default=5)
    symbols = models.JSONField(default=list)  # List of symbols to track
    last_updated = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.source_type}"


class Alert(models.Model):
    """User alerts for specific thresholds"""
    CONDITION_CHOICES = [
        ('above', 'Above'),
        ('below', 'Below'),
        ('change_up', 'Change Up %'),
        ('change_down', 'Change Down %'),
    ]
    
    source_type = models.CharField(max_length=20, choices=DataPoint.SOURCE_CHOICES)
    symbol = models.CharField(max_length=20)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    threshold_value = models.DecimalField(max_digits=20, decimal_places=8)
    is_active = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.symbol} {self.condition} {self.threshold_value}"
