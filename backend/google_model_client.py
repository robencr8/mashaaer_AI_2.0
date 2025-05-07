import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from vertexai.preview.language_models import TextGenerationModel
import google.generativeai as genai

# إعداد البيئة
def init_google():
    vertexai.init(
        project=os.getenv("GOOGLE_PROJECT_ID"),
        location=os.getenv("GOOGLE_LOCATION"),
        credentials=os.getenv("GOOGLE_CREDENTIALS_PATH")
    )

# استخدام Vertex AI: Gemini
def call_vertex_gemini(prompt):
    init_google()
    model = GenerativeModel("gemini-1.5-pro-preview-0409")
    chat = model.start_chat()
    response = chat.send_message(prompt)
    return response.text

# استخدام Vertex AI: Text Bison
def call_text_bison(prompt):
    init_google()
    model = TextGenerationModel.from_pretrained("text-bison@001")
    response = model.predict(prompt)
    return response.text

# Unified
def generate_response(prompt, model_type="vertex_gemini"):
    try:
        if model_type == "vertex_gemini":
            return call_vertex_gemini(prompt)
        elif model_type == "text_bison":
            return call_text_bison(prompt)
        else:
            return "❌ نموذج غير معروف"
    except Exception as e:
        return f"❌ خطأ: {str(e)}"