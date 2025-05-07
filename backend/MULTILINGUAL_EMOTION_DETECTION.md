# Multilingual Emotion Detection with Google Gemini AI

This document explains the multilingual emotion detection system in the Mashaaer project, which uses Google Gemini AI for accurate emotion analysis in multiple languages.

## Overview

The emotion detection system has been enhanced to support multiple languages:

1. Arabic (ar) - The original language supported by Mashaaer
2. English (en) - Added as a second supported language
3. More languages can be added following the same pattern

The system uses Google Gemini AI for advanced natural language understanding and emotion detection, with a fallback to keyword-based detection if the AI service is unavailable.

## Architecture

The multilingual emotion detection system consists of:

1. **Language-specific emotion detectors**:
   - `emotion_engine_ar.py` - Arabic emotion detection
   - `emotion_engine_en.py` - English emotion detection

2. **Language-agnostic interface**:
   - `emotion_engine.py` - Provides a unified interface for emotion detection across languages

3. **Core functions**:
   - `detect_language()` - Automatically detects the language of a text
   - `detect_emotion()` - Detects emotion in text using the appropriate language-specific detector
   - `get_emotion_in_language()` - Translates emotion names between languages

## Supported Emotions

The system standardizes on five core emotions across all languages:

| Standardized Name | Arabic | English |
|-------------------|--------|---------|
| sadness           | حزن    | sadness |
| happiness         | فرح    | happiness |
| anger             | غضب    | anger |
| fear              | خوف    | fear |
| neutral           | حياد   | neutral |

## Usage

### Basic Usage

```python
from emotion_engine import detect_emotion

# Auto-detect language and detect emotion
text = "أنا سعيد جدا اليوم"  # Arabic: "I am very happy today"
emotion, language = detect_emotion(text)
print(f"Detected emotion: {emotion}, Language: {language}")
# Output: Detected emotion: happiness, Language: ar

# English example
text = "I feel sad about what happened"
emotion, language = detect_emotion(text)
print(f"Detected emotion: {emotion}, Language: {language}")
# Output: Detected emotion: sadness, Language: en
```

### Specifying Language

```python
from emotion_engine import detect_emotion

# Specify language explicitly
text = "أنا غاضب من هذا الموقف"  # Arabic: "I am angry about this situation"
emotion, language = detect_emotion(text, language="ar")
print(f"Detected emotion: {emotion}, Language: {language}")
# Output: Detected emotion: anger, Language: ar
```

### Getting Emotion Names in Different Languages

```python
from emotion_engine import get_emotion_in_language

# Get the Arabic name for "sadness"
arabic_name = get_emotion_in_language("sadness", "ar")
print(f"Sadness in Arabic: {arabic_name}")
# Output: Sadness in Arabic: حزن

# Get the English name for "غضب" (anger)
english_name = get_emotion_in_language("anger", "en")
print(f"Anger in English: {english_name}")
# Output: Anger in English: anger
```

## Testing

A test script is provided to verify that the multilingual emotion detection system is working correctly:

```bash
python test_multilingual_emotion.py
```

This script tests:
1. Language detection for various texts
2. Emotion detection in both Arabic and English
3. Auto-detection of language vs. specified language
4. Translation of emotion names between languages

## Requirements

The multilingual emotion detection system requires:

1. Google Vertex AI credentials (set in the .env file)
2. The google_model_client.py module for communicating with Google Vertex AI
3. Internet connectivity to access the Google Vertex AI API

## Fallback Mechanism

If Gemini AI is unavailable or fails to detect an emotion, the system falls back to language-specific keyword-based detection. This ensures that the system always returns a valid emotion, even if the AI service is unavailable.

## Adding Support for Additional Languages

To add support for a new language:

1. Create a new language-specific emotion detector file (e.g., `emotion_engine_fr.py` for French)
2. Implement the emotion detection function for that language
3. Update the `emotion_engine.py` file to include the new language:
   - Import the new language-specific function
   - Add language detection support
   - Add routing to the new function in `detect_emotion()`
   - Add emotion translations in `get_emotion_in_language()`

## Benefits

The multilingual emotion detection system provides several benefits:

1. **Language flexibility**: The system can analyze emotions in multiple languages
2. **Automatic language detection**: No need to specify the language in most cases
3. **Standardized emotions**: Consistent emotion categories across languages
4. **Robustness**: Fallback mechanisms ensure the system always returns a valid emotion
5. **Extensibility**: Easy to add support for additional languages