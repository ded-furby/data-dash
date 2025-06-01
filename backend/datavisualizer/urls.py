from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DataPointViewSet, DataSourceViewSet, AlertViewSet

router = DefaultRouter()
router.register(r'datapoints', DataPointViewSet)
router.register(r'datasources', DataSourceViewSet)
router.register(r'alerts', AlertViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
] 