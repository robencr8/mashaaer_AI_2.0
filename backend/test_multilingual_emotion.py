"""
Test script for the multilingual emotion detection system.
This script demonstrates how to use the enhanced emotion detection with multiple languages.

Usage:
    python test_multilingual_emotion.py
"""

import os
from dotenv import load_dotenv
from emotion_engine import detect_emotion, detect_language, get_emotion_in_language

# Load environment variables from .env file
load_dotenv()

def test_language_detection():
    """Test the language detection functionality."""
    test_texts = [
        # Arabic texts
        "أنا سعيد جدا اليوم",
        "هذا نص باللغة العربية",
        
        # English texts
        "I am very happy today",
        "This is an English text",
        
        # Mixed text
        "This is mixed عربي and English",
        
        # Numbers and symbols
        "123 !@#$%",
    ]
    
    print("Testing language detection...\n")
    
    for text in test_texts:
        language = detect_language(text)
        print(f"Text: {text}")
        print(f"Detected language: {language}")
        print("-" * 50)

def test_emotion_detection():
    """Test the emotion detection with various texts in different languages."""
    test_texts = [
        # Happy texts
        ("أنا سعيد جدا اليوم، لقد نجحت في الامتحان!", None),  # Arabic, auto-detect
        ("I am very happy today, I passed my exam!", None),     # English, auto-detect
        ("أنا مبسوط جدا", "ar"),                               # Arabic, specified
        ("I'm feeling joyful and excited", "en"),               # English, specified
        
        # Sad texts
        ("أشعر بالحزن الشديد بسبب ما حدث", None),              # Arabic, auto-detect
        ("I feel very sad because of what happened", None),     # English, auto-detect
        
        # Angry texts
        ("أنا غاضب جدا من تصرفاتك!", None),                    # Arabic, auto-detect
        ("I am very angry with your behavior!", None),          # English, auto-detect
        
        # Fearful texts
        ("أنا خائف من المستقبل", None),                        # Arabic, auto-detect
        ("I am afraid of the future", None),                    # English, auto-detect
        
        # Neutral texts
        ("اليوم هو الخميس، الطقس معتدل", None),                # Arabic, auto-detect
        ("Today is Thursday, the weather is moderate", None),   # English, auto-detect
    ]
    
    print("\nTesting emotion detection with multiple languages...\n")
    
    for text, lang in test_texts:
        emotion, detected_lang = detect_emotion(text, lang)
        print(f"Text: {text}")
        print(f"Specified language: {lang or 'auto-detect'}")
        print(f"Detected language: {detected_lang}")
        print(f"Detected emotion: {emotion}")
        
        # Get the emotion name in both languages
        emotion_ar = get_emotion_in_language(emotion, 'ar')
        emotion_en = get_emotion_in_language(emotion, 'en')
        print(f"Emotion in Arabic: {emotion_ar}")
        print(f"Emotion in English: {emotion_en}")
        print("-" * 50)

if __name__ == "__main__":
    # Check if the required environment variables are set
    required_vars = ["GOOGLE_PROJECT_ID", "GOOGLE_LOCATION", "GOOGLE_CREDENTIALS_PATH"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: The following environment variables are missing: {', '.join(missing_vars)}")
        print("Please set these variables in the .env file.")
        exit(1)
    
    # Run the tests
    test_language_detection()
    test_emotion_detection()
    
    print("All tests completed.")