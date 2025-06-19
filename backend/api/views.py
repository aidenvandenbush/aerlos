from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subscriber
from .serializers import SubscriberSerializer
from agents import Agent, Runner
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import async_to_sync
import json

# Create the agent once (module-level)
agent = Agent(
    name="Assistant",
    instructions="You are a helpful assistant"
)

class SubscribeView(APIView):
    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Subscribed!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def openai_agent(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")

        # Use async_to_sync to run the async agent call
        result = async_to_sync(Runner.run)(agent, user_message)
        reply = result.final_output

        return JsonResponse({"reply": reply})
    return JsonResponse({"error": "POST request required"}, status=400)
