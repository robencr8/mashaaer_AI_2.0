"""
Test script for the integration of the multilingual emotion detection system with PersonaMesh.
This script demonstrates how the PersonaMesh component works with different languages.

Usage:
    python test_persona_mesh.py
"""

import os
from dotenv import load_dotenv
from persona_mesh import PersonaMesh
from emotion_engine import detect_emotion, get_emotion_in_language

# Load environment variables from .env file
load_dotenv()

def test_persona_mesh_with_emotions():
    """Test how PersonaMesh handles different emotions in different languages."""
    print("Testing PersonaMesh with multilingual emotions...\n")

    # Initialize PersonaMesh
    persona_mesh = PersonaMesh()

    # Test texts in different languages with different emotions
    test_texts = [
        # Arabic texts
        "أنا سعيد جدا اليوم، لقد نجحت في الامتحان!",  # Happy
        "أشعر بالحزن الشديد بسبب ما حدث",              # Sad
        "أنا غاضب جدا من تصرفاتك!",                    # Angry
        "أنا خائف من المستقبل",                        # Fearful

        # English texts
        "I am very happy today, I passed my exam!",     # Happy
        "I feel very sad because of what happened",     # Sad
        "I am very angry with your behavior!",          # Angry
        "I am afraid of the future",                    # Fearful
    ]

    for text in test_texts:
        # Detect emotion using the multilingual system
        emotion, detected_lang = detect_emotion(text)

        # Get the emotion in Arabic for compatibility with PersonaMesh
        arabic_emotion = get_emotion_in_language(emotion, 'ar')

        print(f"Text: {text}")
        print(f"Detected language: {detected_lang}")
        print(f"Detected emotion: {emotion}")
        print(f"Emotion in Arabic: {arabic_emotion}")

        # Create a mock context
        context = {"emotion": arabic_emotion, "history": []}

        # Determine the optimal blend of personas for this context
        persona_mesh.determine_optimal_blend(text, arabic_emotion, context)

        # Get the persona contributions
        contributions = persona_mesh.get_persona_contributions()
        print(f"Persona contributions: {contributions}")
        print("-" * 50)

def test_emotional_content_detection():
    """Test how PersonaMesh detects emotional content in different languages."""
    print("\nTesting emotional content detection in different languages...\n")

    # Initialize PersonaMesh
    persona_mesh = PersonaMesh()

    # Test texts with emotional content in different languages
    test_texts = [
        # Arabic emotional content
        "أنا أحب هذا الكتاب كثيرا",                    # I love this book a lot
        "أشتاق إلى عائلتي",                           # I miss my family

        # English emotional content
        "I really love this movie",
        "I miss my friends so much",

        # Mixed language
        "I feel سعيد today",                           # I feel happy today

        # Non-emotional content
        "اليوم هو الخميس",                            # Today is Thursday
        "The weather is nice today"
    ]

    for text in test_texts:
        print(f"Text: {text}")

        # Define emotional words (same as in persona_mesh.py)
        emotional_words = [
            # Arabic emotional words
            "أشعر", "حزين", "سعيد", "غاضب", "خائف", "مسرور", "متضايق", "قلق", "خجول", "متحمس",
            # English emotional words
            "feel", "sad", "happy", "angry", "afraid", "excited", "upset", "worried", "shy", "anxious",
            # Emotion-related verbs and expressions
            "love", "hate", "miss", "hope", "fear", "أحب", "أكره", "أشتاق", "أتمنى", "أخشى"
        ]

        # Check if any emotional words are detected
        emotional_content_detected = any(word in text.lower() for word in emotional_words)
        print(f"Emotional content detected: {emotional_content_detected}")

        # Create a mock context
        context = {"emotion": "حياد", "history": []}

        # Get the initial blend
        initial_blend = persona_mesh.active_blend.copy()

        # Determine the optimal blend of personas for this context
        persona_mesh.determine_optimal_blend(text, "حياد", context)

        # Get the updated persona contributions
        contributions = persona_mesh.get_persona_contributions()
        print(f"Persona contributions: {contributions}")
        print("-" * 50)

        # Reset the blend to the initial state for the next test
        persona_mesh.active_blend = initial_blend

if __name__ == "__main__":
    # Check if the required environment variables are set
    required_vars = ["GOOGLE_PROJECT_ID", "GOOGLE_LOCATION", "GOOGLE_CREDENTIALS_PATH"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"Error: The following environment variables are missing: {', '.join(missing_vars)}")
        print("Please set these variables in the .env file.")
        exit(1)

    # Run the tests
    test_persona_mesh_with_emotions()
    test_emotional_content_detection()

    print("All tests completed.")
