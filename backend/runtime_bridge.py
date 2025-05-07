import os
from fallback_manager import fallback_brain
from google_model_client import generate_response
import anthropic
import openai
import requests
import json

# Load API keys from environment variables
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# Get model priority from environment variable
MODEL_PRIORITY = os.environ.get("AI_MODEL_PRIORITY", "mistral,openai,anthropic,google,cohere").split(",")

# Helper functions for API calls
def call_anthropic(prompt):
    if not ANTHROPIC_API_KEY:
        return None

    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text
    except Exception as e:
        print(f"Anthropic API error: {str(e)}")
        return None

def call_openai(prompt):
    if not OPENAI_API_KEY:
        return None

    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        return None

def call_mistral(prompt):
    if not MISTRAL_API_KEY:
        return None

    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "mistral-large-latest",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        return None
    except Exception as e:
        print(f"Mistral API error: {str(e)}")
        return None

def generate_runtime_response(prompt: str, session=None) -> dict:
    sid = session.get("id", "anon") if session else "anon"

    # Try models in the order specified in MODEL_PRIORITY
    for model in MODEL_PRIORITY:
        if model == "anthropic":
            # Try Anthropic Claude
            response_text = call_anthropic(prompt)
            if response_text:
                return {
                    "text": response_text,
                    "emotion": "حياد",  # Default neutral emotion
                    "engine": "anthropic",
                    "mode": "api",
                    "model": "claude-3-opus",
                    "memory_reaction": None
                }

        elif model == "openai":
            # Try OpenAI GPT-4
            response_text = call_openai(prompt)
            if response_text:
                return {
                    "text": response_text,
                    "emotion": "حياد",  # Default neutral emotion
                    "engine": "openai",
                    "mode": "api",
                    "model": "gpt-4",
                    "memory_reaction": None
                }

        elif model == "mistral":
            # Try Mistral AI
            response_text = call_mistral(prompt)
            if response_text:
                return {
                    "text": response_text,
                    "emotion": "حياد",  # Default neutral emotion
                    "engine": "mistral",
                    "mode": "api",
                    "model": "mistral-large",
                    "memory_reaction": None
                }

        elif model == "google":
            try:
                # Try Google Vertex AI: Gemini model
                response_text = generate_response(prompt, model_type="vertex_gemini")
                if response_text and "❌ خطأ" not in response_text:
                    return {
                        "text": response_text,
                        "emotion": "حياد",  # Default neutral emotion
                        "engine": "google",
                        "mode": "vertex_ai",
                        "model": "gemini-1.5-pro",
                        "memory_reaction": None
                    }
            except Exception:
                try:
                    # Try Google Vertex AI: Text Bison model
                    response_text = generate_response(prompt, model_type="text_bison")
                    if response_text and "❌ خطأ" not in response_text:
                        return {
                            "text": response_text,
                            "emotion": "حياد",  # Default neutral emotion
                            "engine": "google",
                            "mode": "vertex_ai",
                            "model": "text-bison",
                            "memory_reaction": None
                        }
                except Exception:
                    pass  # Continue to next model in priority list

    # If all models fail, fall back to local model
    # Derive context from prompt if possible, otherwise use default
    context = "default"
    # Simple context detection based on keywords in the prompt
    if any(keyword in prompt.lower() for keyword in ["معلومة", "تاريخ", "تعريف"]):
        context = "معلومة"
    elif any(keyword in prompt.lower() for keyword in ["سؤال حديث", "تقني"]):
        context = "سؤال حديث"
    elif any(keyword in prompt.lower() for keyword in ["نقاش طويل", "تفسير"]):
        context = "نقاش طويل"
    elif any(keyword in prompt.lower() for keyword in ["فرح", "حزن", "غضب", "خوف"]):
        # Use the emotion as context if present
        for emotion in ["فرح", "حزن", "غضب", "خوف"]:
            if emotion in prompt.lower():
                context = emotion
                break

    return fallback_brain(prompt, session_id=sid, context=context)
