import os
from google_model_client import generate_response

def emotion_en(text: str) -> str:
    """
    Detect emotion in English text using Google Gemini AI.
    Falls back to keyword-based detection if AI detection fails.

    Args:
        text (str): The text to analyze for emotion

    Returns:
        str: The detected emotion (sadness, happiness, anger, fear, neutral)
    """
    # First try using Gemini for emotion detection
    try:
        # Create a prompt for Gemini to analyze the emotion
        prompt = f"""
        Analyze the emotion in the following text:

        "{text}"

        Identify the primary emotion in the text (sadness, happiness, anger, fear, neutral).
        Please respond with only one of these words: sadness, happiness, anger, fear, neutral.
        """

        # Call Gemini API
        response = generate_response(prompt, model_type="vertex_gemini")

        # Process the response to extract the emotion
        response = response.strip().lower()

        # Check if the response contains one of the expected emotions
        if "sadness" in response:
            return "sadness"
        elif "happiness" in response:
            return "happiness"
        elif "anger" in response:
            return "anger"
        elif "fear" in response:
            return "fear"
        elif "neutral" in response:
            return "neutral"

        # If we couldn't extract a valid emotion, fall back to keyword-based detection
        print(f"Gemini returned unexpected emotion format: {response}. Falling back to keyword detection.")
    except Exception as e:
        # Log the error and fall back to keyword-based detection
        print(f"Error using Gemini for emotion detection: {str(e)}. Falling back to keyword detection.")

    # Fallback: Keyword-based emotion detection
    sad = ["sad", "upset", "unhappy", "depressed", "miserable", "heartbroken"]
    happy = ["happy", "joyful", "excited", "delighted", "pleased", "cheerful"]
    angry = ["angry", "mad", "furious", "annoyed", "irritated", "outraged"]
    fearful = ["afraid", "scared", "terrified", "anxious", "worried", "frightened"]

    if any(w in text.lower() for w in sad): return "sadness"
    if any(w in text.lower() for w in happy): return "happiness"
    if any(w in text.lower() for w in angry): return "anger"
    if any(w in text.lower() for w in fearful): return "fear"
    return "neutral"