import os
from google_model_client import generate_response

def emotion_ar(text: str) -> str:
    """
    Detect emotion in Arabic text using Google Gemini AI.
    Falls back to keyword-based detection if AI detection fails.

    Args:
        text (str): The text to analyze for emotion

    Returns:
        str: The detected emotion (حزن, فرح, غضب, خوف, حياد)
    """
    # First try using Gemini for emotion detection
    try:
        # Create a prompt for Gemini to analyze the emotion
        prompt = f"""
        تحليل المشاعر في النص التالي:

        "{text}"

        قم بتحديد المشاعر الأساسية في النص (حزن، فرح، غضب، خوف، حياد).
        أعطني فقط كلمة واحدة من الكلمات التالية كإجابة: حزن، فرح، غضب، خوف، حياد.
        """

        # Call Gemini API
        response = generate_response(prompt, model_type="vertex_gemini")

        # Process the response to extract the emotion
        response = response.strip().lower()

        # Check if the response contains one of the expected emotions
        if "حزن" in response:
            return "حزن"
        elif "فرح" in response:
            return "فرح"
        elif "غضب" in response:
            return "غضب"
        elif "خوف" in response:
            return "خوف"
        elif "حياد" in response:
            return "حياد"

        # If we couldn't extract a valid emotion, fall back to keyword-based detection
        print(f"Gemini returned unexpected emotion format: {response}. Falling back to keyword detection.")
    except Exception as e:
        # Log the error and fall back to keyword-based detection
        print(f"Error using Gemini for emotion detection: {str(e)}. Falling back to keyword detection.")

    # Fallback: Keyword-based emotion detection
    sad = ["حزين", "ضايق", "دموع", "تعبان"]
    joy = ["فرحان", "سعيد", "مبسوط", "نجحت"]
    anger = ["زعلان", "عصبت", "قهرت", "غضبان"]
    fear = ["خايف", "مرعوب", "قلقان", "توتر"]

    if any(w in text for w in sad): return "حزن"
    if any(w in text for w in joy): return "فرح"
    if any(w in text for w in anger): return "غضب"
    if any(w in text for w in fear): return "خوف"
    return "حياد"
