import os
import re
from typing import Optional, Tuple

from emotion_engine_ar import emotion_ar
from emotion_engine_en import emotion_en

def detect_language(text: str) -> str:
    """
    Detect the language of the given text.
    Currently supports Arabic and English.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        str: Language code ('ar' for Arabic, 'en' for English, 'unknown' if can't determine)
    """
    # Check for Arabic characters (Unicode range for Arabic: \u0600-\u06FF)
    arabic_pattern = re.compile(r'[\u0600-\u06FF]')
    if arabic_pattern.search(text):
        return 'ar'
    
    # Default to English for Latin characters
    english_pattern = re.compile(r'[a-zA-Z]')
    if english_pattern.search(text):
        return 'en'
    
    # If we can't determine the language
    return 'unknown'

def detect_emotion(text: str, language: Optional[str] = None) -> Tuple[str, str]:
    """
    Detect emotion in text using the appropriate language-specific emotion detection.
    
    Args:
        text (str): The text to analyze for emotion
        language (str, optional): Language code ('ar' for Arabic, 'en' for English).
                                 If not provided, language will be auto-detected.
    
    Returns:
        Tuple[str, str]: (detected_emotion, language_used)
    """
    if not text:
        return ('neutral', 'unknown')
    
    # Auto-detect language if not specified
    if not language:
        language = detect_language(text)
    
    # Route to the appropriate language-specific emotion detection
    if language == 'ar':
        emotion = emotion_ar(text)
        # Map Arabic emotion names to standardized format if needed
        emotion_map = {
            'حزن': 'sadness',
            'فرح': 'happiness',
            'غضب': 'anger',
            'خوف': 'fear',
            'حياد': 'neutral'
        }
        standardized_emotion = emotion_map.get(emotion, 'neutral')
        return (standardized_emotion, 'ar')
    
    elif language == 'en':
        emotion = emotion_en(text)
        return (emotion, 'en')
    
    # Fallback to English for unsupported languages
    else:
        print(f"Language '{language}' not supported for emotion detection. Falling back to English.")
        emotion = emotion_en(text)
        return (emotion, 'en')

def get_emotion_in_language(emotion: str, target_language: str) -> str:
    """
    Translate an emotion name to the specified language.
    
    Args:
        emotion (str): The emotion name in standardized format (sadness, happiness, anger, fear, neutral)
        target_language (str): The target language code ('ar' for Arabic, 'en' for English)
    
    Returns:
        str: The emotion name in the target language
    """
    # Emotion translations
    emotion_translations = {
        'sadness': {'en': 'sadness', 'ar': 'حزن'},
        'happiness': {'en': 'happiness', 'ar': 'فرح'},
        'anger': {'en': 'anger', 'ar': 'غضب'},
        'fear': {'en': 'fear', 'ar': 'خوف'},
        'neutral': {'en': 'neutral', 'ar': 'حياد'}
    }
    
    # Get the translation if available
    if emotion in emotion_translations and target_language in emotion_translations[emotion]:
        return emotion_translations[emotion][target_language]
    
    # Return the original emotion if translation not available
    return emotion