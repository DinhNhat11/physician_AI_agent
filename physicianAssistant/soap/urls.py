from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('process_conversation/', process_conversation, name='process_conversation'),
]