from rest_framework import serializers
from .models import DataPoint, DataSource, Alert


class DataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoint
        fields = ['id', 'timestamp', 'value', 'source_type', 'symbol', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = ['id', 'name', 'source_type', 'api_url', 'api_key_required', 
                 'is_active', 'update_interval_minutes', 'symbols', 'last_updated', 'created_at']
        read_only_fields = ['id', 'created_at', 'last_updated']


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['id', 'source_type', 'symbol', 'condition', 'threshold_value', 
                 'is_active', 'email', 'last_triggered', 'created_at']
        read_only_fields = ['id', 'created_at', 'last_triggered']


class ChartDataSerializer(serializers.Serializer):
    """Serializer for formatted chart data"""
    timestamp = serializers.DateTimeField()
    value = serializers.DecimalField(max_digits=20, decimal_places=8)
    label = serializers.CharField(max_length=100)


class SummarySerializer(serializers.Serializer):
    """Serializer for dashboard summary data"""
    source_type = serializers.CharField()
    symbol = serializers.CharField()
    current_value = serializers.DecimalField(max_digits=20, decimal_places=8)
    change_24h = serializers.DecimalField(max_digits=20, decimal_places=8, allow_null=True)
    change_24h_percent = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    last_updated = serializers.DateTimeField()
    total_data_points = serializers.IntegerField() 