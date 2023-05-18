import asyncio
import json
import cv2
import base64
from channels.generic.websocket import AsyncWebsocketConsumer

class StreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Perform any necessary connection setup here
        await self.accept()

    async def receive(self, text_data):
        # Handle received messages here
        pass

    async def disconnect(self, close_code):
        # Clean up resources and perform any necessary cleanup actions here
        pass

    async def send(self, text_data=None, bytes_data=None):
        # Send outgoing messages
        pass