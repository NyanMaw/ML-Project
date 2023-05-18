import json
import base64
import cv2
import numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer

class VideoConsumer(AsyncWebsocketConsumer):
    cascade_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    async def connect(self):
        print("New client connected")
        await self.accept()

    async def disconnect(self, close_code):
        print("Client disconnected")

    async def receive(self, text_data):
        # Parse the received JSON data
        data = json.loads(text_data)

        # Extract the base64-encoded image
        heading_image_data = data.get('image', '')
        image_data = heading_image_data.split(',')[1]

        # Decode the base64 image data
        decoded_data = base64.b64decode(image_data)

        # Convert the decoded image data to a NumPy array
        nparr = np.frombuffer(decoded_data, np.uint8)

        # Decode the image array using OpenCV
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Perform computer vision operations on the image
        processed_image = process_image(image)

        # Encode the processed image as base64
        _, buffer = cv2.imencode('.jpg', processed_image)
        processed_data = base64.b64encode(buffer).decode('utf-8')

        # Create a response JSON object with the processed image data
        response = {'image': processed_data}

        # Send the response back to the frontend
        await self.send(text_data=json.dumps(response))

    async def send_video_frame(self, event):
        video_frame = event['video_frame']
        print(video_frame)
        await self.send(text_data=video_frame)


def process_image(image):
    # Convert the image to grayscale for Haar Cascade
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Perform face detection using Haar Cascade
    faces = VideoConsumer.cascade_classifier.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Draw rectangles around the detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return image
