from django.urls import path
from .views import SubscribeView, openai_agent

urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('openai-agent/', openai_agent, name='openai_agent'),
]
