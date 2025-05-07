# Integrating Multilingual Emotion Detection with PersonaMesh

This document explains how the multilingual emotion detection system has been integrated with the PersonaMesh component in the Mashaaer project.

## Overview

The PersonaMesh component has been enhanced to work with the multilingual emotion detection system, allowing it to:

1. Process emotions detected in multiple languages (currently Arabic and English)
2. Adjust persona weights based on detected emotions regardless of the input language
3. Detect emotional content in multilingual text

## How It Works

### Emotion Processing in PersonaMesh

The PersonaMesh component uses emotions to determine the optimal blend of personas for a given context. With the multilingual enhancement:

1. The system can now receive emotions in standardized format (e.g., "sadness", "happiness") from the multilingual emotion detection system
2. These standardized emotions are automatically converted to Arabic emotion names (e.g., "حزن", "فرح") for compatibility with the existing persona mapping
3. The persona weights are adjusted based on the emotion, regardless of which language the emotion was detected in

### Multilingual Emotional Content Detection

The PersonaMesh component also detects emotional content in user input to boost certain personas. This detection has been enhanced to:

1. Recognize emotional words and expressions in multiple languages
2. Include a broader range of emotional terms in both Arabic and English
3. Support mixed-language input (e.g., text containing both Arabic and English words)

## Implementation Details

### Changes Made

1. **Added Import for Emotion Translation**:
   ```python
   from emotion_engine import get_emotion_in_language
   ```

2. **Updated Emotion Handling in determine_optimal_blend**:
   ```python
   # Adjust based on emotion if present
   if emotion and emotion != "حياد" and emotion != "neutral":
       # Map of emotions to personas that handle them well
       # Using Arabic emotion names for compatibility with existing code
       emotion_persona_map = {
           "حزن": ["حنون", "شاعر"],  # Sadness -> Caring, Poet
           "فرح": ["صديق مهضوم", "شاعر"],  # Joy -> Funny Friend, Poet
           "غضب": ["مستشار", "محايد"],  # Anger -> Advisor, Neutral
           "خوف": ["حنون", "مستشار"]   # Fear -> Caring, Advisor
       }
       
       # Convert standardized emotion to Arabic if needed
       arabic_emotion = emotion
       if emotion in ["sadness", "happiness", "anger", "fear"]:
           arabic_emotion = get_emotion_in_language(emotion, 'ar')
       
       # Boost personas that handle this emotion well
       if arabic_emotion in emotion_persona_map:
           for persona in emotion_persona_map[arabic_emotion]:
               if persona in new_blend:
                   new_blend[persona] *= 1.5
   ```

3. **Enhanced Emotional Words Detection**:
   ```python
   # If emotional content detected, boost caring and poet personas
   # Multilingual emotional words (Arabic, English, and common expressions)
   emotional_words = [
       # Arabic emotional words
       "أشعر", "حزين", "سعيد", "غاضب", "خائف", "مسرور", "متضايق", "قلق", "خجول", "متحمس",
       # English emotional words
       "feel", "sad", "happy", "angry", "afraid", "excited", "upset", "worried", "shy", "anxious",
       # Emotion-related verbs and expressions
       "love", "hate", "miss", "hope", "fear", "أحب", "أكره", "أشتاق", "أتمنى", "أخشى"
   ]
   ```

## Usage Examples

### Processing Emotions in Different Languages

```python
from persona_mesh import PersonaMesh
from emotion_engine import detect_emotion, get_emotion_in_language

# Initialize PersonaMesh
persona_mesh = PersonaMesh()

# Process Arabic text
arabic_text = "أنا سعيد جدا اليوم"
emotion, lang = detect_emotion(arabic_text)
arabic_emotion = get_emotion_in_language(emotion, 'ar')

# Create context and determine optimal blend
context = {"emotion": arabic_emotion, "history": []}
persona_mesh.determine_optimal_blend(arabic_text, arabic_emotion, context)

# Process English text
english_text = "I feel very sad today"
emotion, lang = detect_emotion(english_text)
arabic_emotion = get_emotion_in_language(emotion, 'ar')

# Create context and determine optimal blend
context = {"emotion": arabic_emotion, "history": []}
persona_mesh.determine_optimal_blend(english_text, arabic_emotion, context)
```

### Detecting Emotional Content in Different Languages

The PersonaMesh component will automatically detect emotional content in user input, regardless of the language:

```python
# Arabic emotional content
persona_mesh.determine_optimal_blend("أنا أحب هذا الكتاب كثيرا", "حياد", {})

# English emotional content
persona_mesh.determine_optimal_blend("I really love this movie", "حياد", {})

# Mixed language
persona_mesh.determine_optimal_blend("I feel سعيد today", "حياد", {})
```

## Testing

A test script is provided to verify that the integration works correctly:

```bash
python test_persona_mesh.py
```

This script tests:
1. How PersonaMesh handles different emotions in different languages
2. How PersonaMesh detects emotional content in different languages

## Benefits

The integration of multilingual emotion detection with PersonaMesh provides several benefits:

1. **Language Flexibility**: The system can now process emotions in multiple languages
2. **Improved Persona Selection**: More accurate persona selection based on emotions detected in any supported language
3. **Enhanced Emotional Content Detection**: Better detection of emotional content in multilingual text
4. **Seamless Integration**: The changes are backward compatible with existing code

## Future Improvements

Potential future improvements to the integration include:

1. Adding support for more languages
2. Enhancing the emotion-persona mapping with more nuanced relationships
3. Implementing language-specific persona selection strategies
4. Adding more emotional words and expressions to improve detection