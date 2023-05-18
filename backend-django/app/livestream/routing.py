# routing.py
from django.urls import re_path
from .consumers import StreamConsumer

websocket_urlpatterns = [
    re_path(r'ws/stream/$', StreamConsumer.as_asgi()),
]