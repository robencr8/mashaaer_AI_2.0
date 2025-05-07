# Dynamic Persona Switching Based on Emotion and Intent

This document explains the enhanced persona autoswitcher system in the Mashaaer project, which now uses both emotion detection and intent classification for more nuanced persona selection.

## Overview

The persona autoswitcher system has been enhanced to:

1. Support multilingual emotion detection (Arabic and English)
2. Incorporate intent classification for context-aware persona selection
3. Implement emotion-intent fusion for more nuanced persona selection
4. Provide a more personalized and contextually appropriate user experience

## How It Works

The enhanced persona autoswitcher works as follows:

1. When `auto_switch_persona()` is called, it can now accept both emotion and intent parameters
2. If the emotion is provided in standardized format (e.g., "sadness", "happiness"), it's automatically converted to Arabic
3. If intent is not provided but user input is, the system automatically classifies the intent
4. The system then uses both emotion and intent to select the most appropriate persona
5. Special emotion-intent combinations are handled with specific persona selections
6. For neutral emotions, intent-based selection is prioritized

## Emotion-Persona Mapping

The system maps emotions to appropriate personas:

| Emotion (Arabic) | Emotion (English) | Persona            | Persona Description |
|------------------|-------------------|--------------------|--------------------|
| فرح              | happiness         | صديق مهضوم (Funny Friend) | Humorous, light-hearted approach |
| حزن              | sadness           | حنون (Caring)      | Empathetic, supportive approach |
| غضب              | anger             | مستشار (Advisor)    | Calm, logical approach |
| خوف              | fear              | حنون (Caring)      | Reassuring, supportive approach |
| حياد             | neutral           | محايد (Neutral)    | Balanced, straightforward approach |

## Intent-Persona Mapping

The system maps intents to appropriate personas:

| Intent       | Persona            | Persona Description |
|--------------|--------------------|--------------------|
| time_focus   | مستشار (Advisor)    | Structured, practical approach |
| creative     | شاعر (Poet)        | Artistic, imaginative approach |
| business     | مستشار (Advisor)    | Professional, strategic approach |
| movie        | صديق مهضوم (Funny Friend) | Entertaining, casual approach |
| book         | شاعر (Poet)        | Literary, thoughtful approach |
| ai_news      | عالم (Scientist)   | Informative, technical approach |
| world_facts  | عالم (Scientist)   | Educational, factual approach |
| music        | شاعر (Poet)        | Artistic, expressive approach |
| history      | عالم (Scientist)   | Historical, contextual approach |

## Emotion-Intent Fusion

The system implements special cases for emotion-intent combinations:

| Emotion      | Intent       | Selected Persona   | Rationale |
|--------------|--------------|-------------------|-----------|
| غضب (anger)  | business     | مستشار (Advisor)   | Calm, logical approach for business concerns |
| حزن (sadness) | creative     | شاعر (Poet)       | Empathetic, artistic approach for creative expression |
| فرح (happiness) | movie      | صديق مهضوم (Funny Friend) | Celebratory, entertaining approach for movies |
| خوف (fear)   | ai_news      | عالم (Scientist)  | Informative, reassuring approach for tech concerns |
| حياد (neutral) | any intent  | Intent-based persona | Prioritize intent for neutral emotions |

## Usage

### Basic Usage

```python
from persona_autoswitcher import auto_switch_persona

# Switch persona based on emotion only
selected_persona = auto_switch_persona("حزن")  # Arabic emotion name
# or
selected_persona = auto_switch_persona("sadness")  # Standardized emotion name

# Switch persona based on emotion and intent
selected_persona = auto_switch_persona("غضب", intent="business")

# Switch persona based on emotion and user input (for intent classification)
selected_persona = auto_switch_persona("فرح", user_input="أريد مشاهدة فيلم جديد")
```

### Integration with Fallback Manager

The persona autoswitcher is integrated with the fallback manager, which passes both the detected emotion and the user input:

```python
# In fallback_manager.py
if ENABLE_PERSONA_AUTOSWITCH:
    auto_switch_persona(emo, user_input=prompt)
```

## Testing

A test script is provided to verify the enhanced persona autoswitcher functionality:

```bash
python test_persona_autoswitcher.py
```

This script tests:
1. Emotion-based persona switching in different languages
2. Intent-based persona switching
3. Emotion-intent fusion for special cases
4. Real-world scenarios with both emotion and intent

## Benefits

The enhanced persona autoswitcher provides several benefits:

1. **More Contextual Responses**: By considering both emotion and intent, the system can provide more contextually appropriate responses
2. **Improved User Experience**: Users receive responses from personas that better match their emotional state and needs
3. **Language Flexibility**: The system works with both Arabic and English inputs
4. **Nuanced Persona Selection**: Special emotion-intent combinations are handled with specific persona selections

## Future Improvements

Potential future improvements to the persona autoswitcher include:

1. Adding support for more languages
2. Implementing user preference tracking to personalize persona selection
3. Adding more sophisticated emotion-intent fusion rules
4. Incorporating conversation history for more contextual persona selection
5. Implementing adaptive learning to improve persona selection over time