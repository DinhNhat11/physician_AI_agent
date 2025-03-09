from django.shortcuts import render
import speech_recognition as sr
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from .llm import generate
import os

# Create your views here.

def home(request):
    return render(request, 'soap/index.html')

def process_conversation(request):
    if request.method == 'POST':
        # Get user input from the request
        user_input = request.POST.get('conversation', '')

        if user_input:
            try:
                # Call the generate function with the user input
                response_text = generate(user_input)
                
                print(f"Generated Response: {response_text}")
                return JsonResponse({'status': 'success', 'recommendation': response_text})
            except Exception as e:
                print(f"Error: {e}")  # Debugging log
                return JsonResponse({'status': 'error', 'message': str(e)})

        return JsonResponse({'status': 'error', 'message': 'No conversation provided'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
