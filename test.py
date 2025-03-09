import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


def generate(user_input):
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )
    
    system_prompt = '''You are a helpful assistant for family physician. You will get a conversion between a 
    family physician and their patient. Your task is provide a short insight, recommendation for the patient 
    based on the conversion! And this is the conversation: '''

    model = "gemini-2.0-flash-exp"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text= system_prompt + user_input
                ),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")


generate("How are you? I am feeling sick! I am feeling too tired and do not want to do anything. I also cannot sleep at night")