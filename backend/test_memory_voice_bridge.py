"""
Test script for the MemoryVoiceBridge component.
This script demonstrates how the MemoryVoiceBridge connects memory, personas, and voice
with support for multilingual emotion detection.

Usage:
    python test_memory_voice_bridge.py
"""

import os
from dotenv import load_dotenv
from memory_voice_bridge import MemoryVoiceBridge
from emotion_engine import detect_emotion, get_emotion_in_language
from persona_mesh import PersonaMesh
from memory_store import MemoryStore

# Load environment variables from .env file
load_dotenv()

def test_voice_parameters():
    """Test getting voice parameters for different languages and emotions."""
    print("Testing voice parameters for different languages and emotions...\n")

    # Initialize MemoryVoiceBridge
    bridge = MemoryVoiceBridge()

    # Test texts in different languages with different emotions
    test_texts = [
        # Arabic texts
        "أنا سعيد جدا اليوم، لقد نجحت في الامتحان!",  # Happy
        "أشعر بالحزن الشديد بسبب ما حدث",              # Sad
        "أنا غاضب جدا من تصرفاتك!",                    # Angry
        "أنا خائف من المستقبل",                        # Fearful
        "اليوم هو الخميس، الطقس معتدل",                # Neutral

        # English texts
        "I am very happy today, I passed my exam!",     # Happy
        "I feel very sad because of what happened",     # Sad
        "I am very angry with your behavior!",          # Angry
        "I am afraid of the future",                    # Fearful
        "Today is Thursday, the weather is moderate"    # Neutral
    ]

    for text in test_texts:
        # Detect emotion using the multilingual system
        standardized_emotion, detected_lang = detect_emotion(text)

        print(f"Text: {text}")
        print(f"Detected language: {detected_lang}")
        print(f"Detected emotion: {standardized_emotion}")

        # Get voice parameters
        voice_params = bridge.get_voice_parameters(text)
        print(f"Voice parameters: {voice_params}")
        print("-" * 50)

def test_memory_guided_voice_response():
    """Test getting memory-guided voice responses."""
    print("\nTesting memory-guided voice responses...\n")

    # Initialize components
    memory_store = MemoryStore()
    persona_mesh = PersonaMesh(memory_store)
    bridge = MemoryVoiceBridge(memory_store, persona_mesh)

    # Test user inputs
    test_inputs = [
        # Arabic inputs
        "مرحبا، كيف حالك اليوم؟",                      # Hello, how are you today?
        "أخبرني عن نفسك",                              # Tell me about yourself
        "أنا سعيد بالتحدث معك",                        # I'm happy to talk to you

        # English inputs
        "Hello, how are you today?",
        "Tell me about yourself",
        "I'm happy to talk to you"
    ]

    for user_input in test_inputs:
        print(f"User input: {user_input}")
        
        # Get memory-guided voice response
        response = bridge.get_memory_guided_voice_response(user_input)
        
        print(f"Response text: {response['text']}")
        print(f"Voice parameters: {response['voice_params']}")
        print("-" * 50)

def test_voice_preferences():
    """Test updating and using voice preferences."""
    print("\nTesting voice preferences...\n")

    # Initialize MemoryVoiceBridge
    bridge = MemoryVoiceBridge()

    # Print current preferences
    print(f"Current voice preferences: {bridge.voice_preferences}")

    # Update preferences
    new_preferences = {
        "default_gender": "masculine",
        "emotion_intensity": 0.5
    }
    bridge.update_voice_preferences(new_preferences)
    print(f"Updated voice preferences: {bridge.voice_preferences}")

    # Test with the new preferences
    test_text = "أنا سعيد جدا بلقائك"  # I am very happy to meet you
    voice_params = bridge.get_voice_parameters(test_text)
    print(f"Text: {test_text}")
    print(f"Voice parameters with new preferences: {voice_params}")
    print("-" * 50)

    # Reset preferences
    bridge.update_voice_preferences({"default_gender": "feminine", "emotion_intensity": 0.8})

if __name__ == "__main__":
    # Check if the required environment variables are set
    required_vars = ["GOOGLE_PROJECT_ID", "GOOGLE_LOCATION", "GOOGLE_CREDENTIALS_PATH"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: The following environment variables are missing: {', '.join(missing_vars)}")
        print("Please set these variables in the .env file.")
        exit(1)
    
    # Run the tests
    test_voice_parameters()
    test_memory_guided_voice_response()
    test_voice_preferences()
    
    print("All tests completed.")