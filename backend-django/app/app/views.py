"""
Views for the app.
"""
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .settings import OPENAI_API_KEY, OPENAI_ENDPOINT
from langchain.llms import OpenAI
import openai
from django.shortcuts import render

from langchain import OpenAI


class LangchainViewset(viewsets.ModelViewSet):
    openai.api_key = OPENAI_API_KEY
    openai.api_type = "azure"
    openai.api_base = OPENAI_ENDPOINT
    openai.api_version = "2023-03-15-preview"

    @api_view(['POST'])
    def langchain(request):
        question = request.data.get('question')
        llm = OpenAI(model_kwargs={"engine": "text-davinci-003"}, temperature=0.5)
        test = llm(question)
        return Response({'answer': test})


def stream_view(request):
    return render(request, 'stream.html')