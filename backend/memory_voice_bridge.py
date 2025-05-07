import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime

from memory_store import MemoryStore
from persona_mesh import PersonaMesh
from emotion_engine import detect_emotion, get_emotion_in_language
from voice_local import speak_ar

class MemoryVoiceBridge:
    """
    MemoryVoiceBridge implements a system that connects memory, personas, and voice.
    
    This bridge analyzes the user's memory patterns and emotional context to determine
    appropriate voice characteristics for responses. It creates a feedback loop where
    memories influence persona selection, personas influence voice characteristics,
    and voice interactions create new memories.
    
    Key features:
    1. Memory-based voice selection - Using past interactions to select voice characteristics
    2. Emotion-voice mapping - Matching detected emotions to appropriate voice parameters
    3. Multilingual support - Handling emotions detected in multiple languages
    4. Voice feedback - Storing voice interaction feedback in memory
    """
    
    def __init__(self, memory_store: Optional[MemoryStore] = None, 
                 persona_mesh: Optional[PersonaMesh] = None):
        """
        Initialize the MemoryVoiceBridge with connections to memory and persona systems
        
        Args:
            memory_store: The memory store for accessing episodic and semantic memories
            persona_mesh: The persona mesh for unified persona responses
        """
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.persona_mesh = persona_mesh if persona_mesh else PersonaMesh(self.memory_store)
        
        # Emotion-voice mapping
        self.emotion_voice_map = {
            "sadness": {
                "pitch": 0.8,
                "rate": 0.9,
                "volume": 0.8,
                "voice_profile": "GENTLE"
            },
            "happiness": {
                "pitch": 1.2,
                "rate": 1.1,
                "volume": 1.0,
                "voice_profile": "CHEERFUL"
            },
            "anger": {
                "pitch": 1.0,
                "rate": 1.2,
                "volume": 1.0,
                "voice_profile": "ASSERTIVE"
            },
            "fear": {
                "pitch": 1.1,
                "rate": 1.3,
                "volume": 0.9,
                "voice_profile": "CONCERNED"
            },
            "neutral": {
                "pitch": 1.0,
                "rate": 1.0,
                "volume": 1.0,
                "voice_profile": "NEUTRAL"
            }
        }
        
        # Language-specific voice profiles
        self.language_voice_profiles = {
            "ar": {
                "default": "ARABIC_STANDARD",
                "feminine": "ARABIC_FEMININE",
                "masculine": "ARABIC_MASCULINE"
            },
            "en": {
                "default": "ENGLISH_STANDARD",
                "feminine": "ENGLISH_FEMININE",
                "masculine": "ENGLISH_MASCULINE"
            }
        }
        
        # Load or initialize voice preferences
        self.voice_preferences = self.load_voice_preferences()
    
    def load_voice_preferences(self) -> Dict[str, Any]:
        """
        Load voice preferences from file or initialize with defaults
        
        Returns:
            Dictionary containing voice preferences
        """
        preferences_path = 'data/voice_preferences.json'
        try:
            if os.path.exists(preferences_path):
                with open(preferences_path, 'r', encoding='utf-8') as f:
                    import json
                    return json.load(f)
            else:
                # Initialize with default preferences
                return {
                    "default_language": "ar",
                    "default_gender": "feminine",
                    "emotion_intensity": 0.8,
                    "use_memory_for_voice": True,
                    "preferred_voice_profiles": {
                        "sadness": "GENTLE",
                        "happiness": "CHEERFUL",
                        "anger": "ASSERTIVE",
                        "fear": "CONCERNED",
                        "neutral": "NEUTRAL"
                    }
                }
        except Exception as e:
            print(f"Error loading voice preferences: {e}")
            # Fallback to minimal default preferences
            return {
                "default_language": "ar",
                "default_gender": "feminine",
                "emotion_intensity": 0.8
            }
    
    def save_voice_preferences(self):
        """Save voice preferences to file"""
        preferences_path = 'data/voice_preferences.json'
        try:
            os.makedirs(os.path.dirname(preferences_path), exist_ok=True)
            with open(preferences_path, 'w', encoding='utf-8') as f:
                import json
                json.dump(self.voice_preferences, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving voice preferences: {e}")
    
    def get_voice_parameters(self, text: str, detected_emotion: Optional[str] = None) -> Dict[str, Any]:
        """
        Get voice parameters based on text and emotion
        
        Args:
            text: The text to analyze
            detected_emotion: Optional pre-detected emotion
            
        Returns:
            Dictionary with voice parameters
        """
        # Detect emotion if not provided
        if not detected_emotion:
            standardized_emotion, detected_lang = detect_emotion(text)
        else:
            # If emotion is provided in Arabic, convert to standardized format
            if detected_emotion in ["حزن", "فرح", "غضب", "خوف", "حياد"]:
                emotion_map = {
                    "حزن": "sadness",
                    "فرح": "happiness",
                    "غضب": "anger",
                    "خوف": "fear",
                    "حياد": "neutral"
                }
                standardized_emotion = emotion_map.get(detected_emotion, "neutral")
                # Detect language
                _, detected_lang = detect_emotion(text)
            else:
                # Assume the provided emotion is already standardized
                standardized_emotion = detected_emotion
                # Detect language
                _, detected_lang = detect_emotion(text)
        
        # Get voice parameters for the detected emotion
        voice_params = self.emotion_voice_map.get(standardized_emotion, self.emotion_voice_map["neutral"]).copy()
        
        # Adjust parameters based on language
        if detected_lang in self.language_voice_profiles:
            gender = self.voice_preferences.get("default_gender", "feminine")
            voice_profile = self.language_voice_profiles[detected_lang].get(gender, 
                                                                          self.language_voice_profiles[detected_lang]["default"])
            voice_params["language"] = detected_lang
            voice_params["voice_profile"] = voice_profile
        else:
            # Default to Arabic if language not supported
            gender = self.voice_preferences.get("default_gender", "feminine")
            voice_profile = self.language_voice_profiles["ar"].get(gender, 
                                                                 self.language_voice_profiles["ar"]["default"])
            voice_params["language"] = "ar"
            voice_params["voice_profile"] = voice_profile
        
        # Apply emotion intensity
        emotion_intensity = self.voice_preferences.get("emotion_intensity", 0.8)
        if standardized_emotion != "neutral":
            # Adjust pitch and rate based on emotion intensity
            neutral_params = self.emotion_voice_map["neutral"]
            voice_params["pitch"] = neutral_params["pitch"] + (voice_params["pitch"] - neutral_params["pitch"]) * emotion_intensity
            voice_params["rate"] = neutral_params["rate"] + (voice_params["rate"] - neutral_params["rate"]) * emotion_intensity
        
        return voice_params
    
    def speak_with_emotion(self, text: str, emotion: Optional[str] = None, session_id: str = "default") -> Dict[str, Any]:
        """
        Speak text with appropriate emotion and store in memory
        
        Args:
            text: The text to speak
            emotion: Optional emotion to use (if not provided, will be detected)
            session_id: The session identifier
            
        Returns:
            Dictionary with voice parameters used
        """
        # Get voice parameters
        voice_params = self.get_voice_parameters(text, emotion)
        
        # Use local TTS for now (in a real implementation, this would use more advanced TTS)
        try:
            speak_ar(text)
            
            # Store in memory if available
            if self.memory_store:
                self.memory_store.store_episodic_memory({
                    "input": "",  # No input for voice output
                    "response": text,
                    "emotion": voice_params.get("emotion", "neutral"),
                    "context": {
                        "voice_params": voice_params,
                        "session_id": session_id
                    }
                })
            
            return voice_params
        except Exception as e:
            print(f"Error speaking with emotion: {e}")
            return voice_params
    
    def get_memory_guided_voice_response(self, user_input: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Get a voice response guided by memory and persona analysis
        
        Args:
            user_input: The user's input text
            session_id: The session identifier
            
        Returns:
            Dictionary with response text and voice parameters
        """
        # Get response from persona mesh
        persona_response = self.persona_mesh.get_unified_response(user_input, session_id)
        
        # Extract response text
        response_text = persona_response.get("text", "")
        
        # Get emotion from response if available, otherwise detect it
        if "emotion" in persona_response:
            emotion = persona_response["emotion"]
        else:
            # Detect emotion in the response text
            standardized_emotion, _ = detect_emotion(response_text)
            emotion = standardized_emotion
        
        # Get voice parameters
        voice_params = self.get_voice_parameters(response_text, emotion)
        
        # Speak the response
        self.speak_with_emotion(response_text, emotion, session_id)
        
        return {
            "text": response_text,
            "voice_params": voice_params,
            "persona_response": persona_response
        }
    
    def update_voice_preferences(self, preferences: Dict[str, Any]):
        """
        Update voice preferences
        
        Args:
            preferences: Dictionary with preference updates
        """
        self.voice_preferences.update(preferences)
        self.save_voice_preferences()

# Example usage
if __name__ == "__main__":
    bridge = MemoryVoiceBridge()
    
    # Test with Arabic text
    arabic_text = "أنا سعيد جدا بلقائك"
    print(f"Testing with Arabic text: {arabic_text}")
    voice_params = bridge.get_voice_parameters(arabic_text)
    print(f"Voice parameters: {voice_params}")
    
    # Test with English text
    english_text = "I am very happy to meet you"
    print(f"Testing with English text: {english_text}")
    voice_params = bridge.get_voice_parameters(english_text)
    print(f"Voice parameters: {voice_params}")