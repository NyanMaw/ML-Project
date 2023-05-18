# urls.py
from django.urls import path
from . import views
from .routing import websocket_urlpatterns

urlpatterns = [
    path('stream/', views.stream_view, name='stream'),
]

# Include the WebSocket URL patterns
urlpatterns += websocket_urlpatterns