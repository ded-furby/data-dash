from django.contrib import admin
from .models import DataPoint, DataSource, Alert


@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'source_type', 'symbol', 'value', 'created_at']
    list_filter = ['source_type', 'symbol', 'timestamp']
    search_fields = ['symbol', 'source_type']
    ordering = ['-timestamp']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'source_type', 'is_active', 'update_interval_minutes', 'last_updated']
    list_filter = ['source_type', 'is_active']
    search_fields = ['name', 'source_type']
    ordering = ['name']
    readonly_fields = ['created_at', 'last_updated']


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['symbol', 'source_type', 'condition', 'threshold_value', 'is_active', 'last_triggered']
    list_filter = ['source_type', 'condition', 'is_active']
    search_fields = ['symbol', 'email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'last_triggered']
