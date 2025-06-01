from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import DataPoint, DataSource, Alert
from .serializers import (
    DataPointSerializer, DataSourceSerializer, AlertSerializer,
    ChartDataSerializer, SummarySerializer
)


class DataPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer
    
    def get_queryset(self):
        queryset = DataPoint.objects.all()
        source_type = self.request.query_params.get('source_type')
        symbol = self.request.query_params.get('symbol')
        hours = self.request.query_params.get('hours', 24)
        
        if source_type:
            queryset = queryset.filter(source_type=source_type)
        
        if symbol:
            queryset = queryset.filter(symbol=symbol)
        
        # Filter by time range
        time_threshold = timezone.now() - timedelta(hours=int(hours))
        queryset = queryset.filter(timestamp__gte=time_threshold)
        
        return queryset.order_by('-timestamp')
    
    @action(detail=False, methods=['get'])
    def chart_data(self, request):
        """Get formatted data for charts with proper time-series"""
        queryset = self.get_queryset()
        
        # Get more data points for better charts (up to 200 points)
        chart_data = []
        data_points = queryset[:200]
        
        for data_point in data_points:
            chart_data.append({
                'timestamp': data_point.timestamp.isoformat(),
                'value': str(data_point.value),
                'label': f"{data_point.symbol}: {data_point.value}"
            })
        
        # Sort by timestamp to ensure proper time ordering
        chart_data.sort(key=lambda x: x['timestamp'])
        
        serializer = ChartDataSerializer(chart_data, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get summary data for dashboard"""
        summaries = []
        
        # Get unique source_type and symbol combinations
        unique_combinations = DataPoint.objects.values('source_type', 'symbol').distinct()
        
        for combo in unique_combinations:
            source_type = combo['source_type']
            symbol = combo['symbol']
            
            # Get latest data point
            latest = DataPoint.objects.filter(
                source_type=source_type, symbol=symbol
            ).first()
            
            if not latest:
                continue
            
            # Get 24h ago data point for change calculation
            time_24h_ago = timezone.now() - timedelta(hours=24)
            old_data = DataPoint.objects.filter(
                source_type=source_type,
                symbol=symbol,
                timestamp__lte=time_24h_ago
            ).first()
            
            change_24h = None
            change_24h_percent = None
            
            if old_data:
                change_24h = latest.value - old_data.value
                if old_data.value != 0:
                    change_24h_percent = (change_24h / old_data.value) * 100
            
            # Count total data points
            total_points = DataPoint.objects.filter(
                source_type=source_type, symbol=symbol
            ).count()
            
            summaries.append({
                'source_type': source_type,
                'symbol': symbol,
                'current_value': latest.value,
                'change_24h': change_24h,
                'change_24h_percent': change_24h_percent,
                'last_updated': latest.timestamp,
                'total_data_points': total_points
            })
        
        serializer = SummarySerializer(summaries, many=True)
        return Response(serializer.data)


class DataSourceViewSet(viewsets.ModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    
    def get_queryset(self):
        queryset = DataSource.objects.all()
        source_type = self.request.query_params.get('source_type')
        is_active = self.request.query_params.get('is_active')
        
        if source_type:
            queryset = queryset.filter(source_type=source_type)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    
    def get_queryset(self):
        queryset = Alert.objects.all()
        source_type = self.request.query_params.get('source_type')
        symbol = self.request.query_params.get('symbol')
        is_active = self.request.query_params.get('is_active')
        
        if source_type:
            queryset = queryset.filter(source_type=source_type)
        
        if symbol:
            queryset = queryset.filter(symbol=symbol)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
