# Memory-Voice Integration with Multilingual Emotion Detection

This document explains how the memory system, persona mesh, and voice system have been integrated in the Mashaaer project, with support for multilingual emotion detection.

## Overview

The integration connects three key components of the Mashaaer system:

1. **PersonaMesh** - The unified persona system that blends multiple personas
2. **Memory System** - The system that stores and retrieves episodic and semantic memories
3. **Voice System** - The system that provides voice output with emotional characteristics

The integration is facilitated by the new `MemoryVoiceBridge` component, which:

1. Uses multilingual emotion detection to analyze text in different languages
2. Maps detected emotions to appropriate voice parameters
3. Connects persona responses with voice output
4. Stores voice interactions in memory for future reference

## Architecture

The integration architecture consists of:

1. **MemoryVoiceBridge** - The central component that connects memory, personas, and voice
2. **PersonaMesh** - Enhanced to work with multilingual emotion detection
3. **Emotion Engine** - Provides multilingual emotion detection capabilities
4. **Memory Store** - Stores episodic and semantic memories
5. **Voice System** - Provides voice output with emotional characteristics

## Key Features

### Multilingual Emotion Detection

The system can detect emotions in multiple languages:

- Arabic (ar)
- English (en)

The detected emotions are standardized to a common format:
- sadness
- happiness
- anger
- fear
- neutral

### Emotion-Voice Mapping

Detected emotions are mapped to appropriate voice parameters:

| Emotion   | Pitch | Rate | Volume | Voice Profile |
|-----------|-------|------|--------|---------------|
| sadness   | 0.8   | 0.9  | 0.8    | GENTLE        |
| happiness | 1.2   | 1.1  | 1.0    | CHEERFUL      |
| anger     | 1.0   | 1.2  | 1.0    | ASSERTIVE     |
| fear      | 1.1   | 1.3  | 0.9    | CONCERNED     |
| neutral   | 1.0   | 1.0  | 1.0    | NEUTRAL       |

### Language-Specific Voice Profiles

The system supports different voice profiles for different languages:

| Language | Default Profile   | Feminine Profile   | Masculine Profile   |
|----------|-------------------|--------------------|--------------------|
| Arabic   | ARABIC_STANDARD   | ARABIC_FEMININE    | ARABIC_MASCULINE   |
| English  | ENGLISH_STANDARD  | ENGLISH_FEMININE   | ENGLISH_MASCULINE  |

### Memory-Guided Voice Responses

The system uses memory to guide voice responses:

1. User input is processed by the PersonaMesh to generate a response
2. The response is analyzed for emotional content
3. Voice parameters are determined based on the detected emotion and language
4. The response is spoken with the appropriate voice characteristics
5. The interaction is stored in memory for future reference

## Implementation Details

### MemoryVoiceBridge

The `MemoryVoiceBridge` class is the central component of the integration. It:

1. Connects to the memory store and persona mesh
2. Defines emotion-voice mappings
3. Defines language-specific voice profiles
4. Loads and saves voice preferences
5. Gets voice parameters based on text and emotion
6. Speaks text with appropriate emotion
7. Gets memory-guided voice responses

```python
from memory_store import MemoryStore
from persona_mesh import PersonaMesh
from emotion_engine import detect_emotion, get_emotion_in_language
from voice_local import speak_ar

class MemoryVoiceBridge:
    def __init__(self, memory_store=None, persona_mesh=None):
        # Initialize with memory store and persona mesh
        
    def get_voice_parameters(self, text, detected_emotion=None):
        # Get voice parameters based on text and emotion
        
    def speak_with_emotion(self, text, emotion=None, session_id="default"):
        # Speak text with appropriate emotion
        
    def get_memory_guided_voice_response(self, user_input, session_id="default"):
        # Get a voice response guided by memory and persona analysis
```

### Voice Preferences

The system supports customizable voice preferences:

```json
{
    "default_language": "ar",
    "default_gender": "feminine",
    "emotion_intensity": 0.8,
    "use_memory_for_voice": true,
    "preferred_voice_profiles": {
        "sadness": "GENTLE",
        "happiness": "CHEERFUL",
        "anger": "ASSERTIVE",
        "fear": "CONCERNED",
        "neutral": "NEUTRAL"
    }
}
```

These preferences can be updated at runtime:

```python
bridge.update_voice_preferences({
    "default_gender": "masculine",
    "emotion_intensity": 0.5
})
```

## Usage Examples

### Basic Usage

```python
from memory_voice_bridge import MemoryVoiceBridge

# Initialize the bridge
bridge = MemoryVoiceBridge()

# Get voice parameters for text
text = "أنا سعيد جدا بلقائك"  # "I am very happy to meet you" in Arabic
voice_params = bridge.get_voice_parameters(text)
print(f"Voice parameters: {voice_params}")

# Speak text with emotion
bridge.speak_with_emotion(text)
```

### Memory-Guided Voice Response

```python
from memory_store import MemoryStore
from persona_mesh import PersonaMesh
from memory_voice_bridge import MemoryVoiceBridge

# Initialize components
memory_store = MemoryStore()
persona_mesh = PersonaMesh(memory_store)
bridge = MemoryVoiceBridge(memory_store, persona_mesh)

# Get memory-guided voice response
user_input = "مرحبا، كيف حالك اليوم؟"  # "Hello, how are you today?" in Arabic
response = bridge.get_memory_guided_voice_response(user_input)
print(f"Response text: {response['text']}")
print(f"Voice parameters: {response['voice_params']}")
```

### Updating Voice Preferences

```python
from memory_voice_bridge import MemoryVoiceBridge

# Initialize the bridge
bridge = MemoryVoiceBridge()

# Update voice preferences
bridge.update_voice_preferences({
    "default_gender": "masculine",
    "emotion_intensity": 0.5
})

# Get voice parameters with new preferences
text = "I am very happy to meet you"
voice_params = bridge.get_voice_parameters(text)
print(f"Voice parameters with new preferences: {voice_params}")
```

## Testing

A test script is provided to verify that the integration works correctly:

```bash
python test_memory_voice_bridge.py
```

This script tests:
1. Getting voice parameters for different languages and emotions
2. Getting memory-guided voice responses
3. Updating and using voice preferences

## Benefits

The integration of memory, personas, and voice with multilingual emotion detection provides several benefits:

1. **Enhanced User Experience** - Voice responses that match the emotional context of the conversation
2. **Language Flexibility** - Support for multiple languages with appropriate voice characteristics
3. **Personalization** - Voice preferences that can be customized for each user
4. **Emotional Intelligence** - Voice output that reflects the emotional content of the response
5. **Memory Integration** - Voice interactions that are stored in memory for future reference

## Future Improvements

Potential future improvements to the integration include:

1. Adding support for more languages
2. Enhancing the emotion-voice mapping with more nuanced parameters
3. Implementing more advanced text-to-speech capabilities
4. Adding voice input capabilities with emotion detection
5. Implementing voice-based persona selection