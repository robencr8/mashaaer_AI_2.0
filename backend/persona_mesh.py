import json
import os
from typing import Dict, List, Optional, Tuple, Any
from parallel_personas_network import ParallelPersonasNetwork
from memory_store import MemoryStore
from emotional_memory import get_last_emotion, get_emotion_timeline
from emotion_engine import get_emotion_in_language

class PersonaMesh:
    """
    PersonaMesh implements unification between all personas, allowing them to work together
    as a cohesive system rather than isolated entities. It extends the functionality of
    ParallelPersonasNetwork by adding:

    1. Persona blending - combining responses from multiple personas
    2. Context-aware persona selection - choosing personas based on conversation context
    3. Adaptive persona weighting - adjusting persona influence based on performance
    4. Persona collaboration - allowing personas to "consult" each other
    """

    def __init__(self, memory_store: Optional[MemoryStore] = None):
        """
        Initialize the PersonaMesh with a connection to the parallel personas network
        and optionally a memory store.

        Args:
            memory_store: Optional memory store for context-aware persona selection
        """
        self.network = ParallelPersonasNetwork()
        self.memory_store = memory_store
        self.active_blend: Dict[str, float] = {}
        self.last_responses: Dict[str, Dict] = {}
        self.context_history: List[Dict] = []
        self.max_context_history = 10

        # Load or initialize persona blend weights
        self.load_blend_weights()

    def load_blend_weights(self):
        """Load persona blend weights from file or initialize with defaults"""
        blend_path = 'data/persona_blend.json'
        try:
            if os.path.exists(blend_path):
                with open(blend_path, 'r', encoding='utf-8') as f:
                    self.active_blend = json.load(f)
            else:
                # Initialize with equal weights for all active personas
                for persona in self.network.active_personas:
                    self.active_blend[persona] = 1.0 / len(self.network.active_personas)
        except Exception as e:
            print(f"Error loading persona blend weights: {e}")
            # Fallback to equal weights
            for persona in self.network.active_personas:
                self.active_blend[persona] = 1.0 / len(self.network.active_personas)

    def save_blend_weights(self):
        """Save persona blend weights to file"""
        blend_path = 'data/persona_blend.json'
        try:
            os.makedirs(os.path.dirname(blend_path), exist_ok=True)
            with open(blend_path, 'w', encoding='utf-8') as f:
                json.dump(self.active_blend, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving persona blend weights: {e}")

    def update_context_history(self, user_input: str, response: str, emotion: Optional[str] = None):
        """
        Update the context history with the latest interaction

        Args:
            user_input: The user's input
            response: The system's response
            emotion: The detected emotion (optional)
        """
        context = {
            "user_input": user_input,
            "response": response,
            "emotion": emotion,
            "timestamp": self.network.evolution_data.get("last_interaction", "")
        }

        self.context_history.append(context)
        if len(self.context_history) > self.max_context_history:
            self.context_history.pop(0)

    def get_unified_response(self, user_input: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Get a unified response that blends multiple personas based on context

        Args:
            user_input: The user's input text
            session_id: The session identifier for emotion tracking

        Returns:
            A dictionary containing the unified response and metadata
        """
        # Get the current emotion if available
        emotion = get_last_emotion(session_id)

        # Create context from history and emotion
        context = {
            "emotion": emotion,
            "history": self.context_history
        }

        # Get responses from all active personas
        all_responses = self.network.get_responses(user_input, emotion, context)
        self.last_responses = {resp["persona"]: resp for resp in all_responses}

        # Determine the best blend of personas for this context
        self.determine_optimal_blend(user_input, emotion, context)

        # Create a unified response by blending persona responses
        unified_response = self.blend_responses(all_responses)

        # Update context history with this interaction
        self.update_context_history(user_input, unified_response["text"], emotion)

        return unified_response

    def determine_optimal_blend(self, user_input: str, emotion: Optional[str], context: Dict):
        """
        Determine the optimal blend of personas based on the current context

        Args:
            user_input: The user's input
            emotion: The detected emotion
            context: Additional context information
        """
        # Start with the current blend
        new_blend = self.active_blend.copy()

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

        # Adjust based on user input content
        # Example: If question detected, boost advisor persona
        if "?" in user_input or "؟" in user_input or any(q in user_input.lower() for q in ["كيف", "لماذا", "متى", "أين", "ما هو", "how", "why", "when", "where", "what"]):
            if "مستشار" in new_blend:
                new_blend["مستشار"] *= 1.3

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
        if any(word in user_input.lower() for word in emotional_words):
            for persona in ["حنون", "شاعر"]:
                if persona in new_blend:
                    new_blend[persona] *= 1.2

        # Normalize weights to sum to 1
        total_weight = sum(new_blend.values())
        if total_weight > 0:
            for persona in new_blend:
                new_blend[persona] /= total_weight

        # Update the active blend
        self.active_blend = new_blend
        self.save_blend_weights()

    def blend_responses(self, responses: List[Dict]) -> Dict[str, Any]:
        """
        Blend multiple persona responses into a unified response

        Args:
            responses: List of responses from different personas

        Returns:
            A dictionary containing the blended response and metadata
        """
        if not responses:
            return {
                "text": "I'm not sure how to respond to that.",
                "persona": "unified",
                "confidence": 0.0,
                "blend": {}
            }

        # Sort responses by persona weight in the active blend
        responses.sort(key=lambda r: self.active_blend.get(r["persona"], 0), reverse=True)

        # Different blending strategies based on number of responses
        if len(responses) == 1:
            # Only one response, use it directly
            return {
                "text": responses[0]["text"],
                "persona": "unified",
                "confidence": responses[0]["confidence"],
                "blend": {responses[0]["persona"]: 1.0}
            }

        # For multiple responses, use a weighted blend
        primary = responses[0]
        secondary = responses[1]

        # Calculate weights based on active blend and confidence
        weights = {}
        for resp in responses:
            persona = resp["persona"]
            weights[persona] = self.active_blend.get(persona, 0) * resp["confidence"]

        # Normalize weights
        total_weight = sum(weights.values())
        if total_weight > 0:
            for persona in weights:
                weights[persona] /= total_weight

        # Create a blended response
        # Start with the highest weighted response
        blended_text = primary["text"]

        # Add insights from secondary response if it's significantly different
        if len(responses) > 1 and weights[secondary["persona"]] > 0.3:
            # Extract a key insight from the secondary response
            secondary_sentences = secondary["text"].split('.')
            if len(secondary_sentences) > 1:
                insight = secondary_sentences[1].strip()
                if insight and insight not in blended_text:
                    blended_text += f" {insight}."

        # Calculate overall confidence as weighted average
        confidence = sum(weights[r["persona"]] * r["confidence"] for r in responses)

        return {
            "text": blended_text,
            "persona": "unified",
            "confidence": confidence,
            "blend": weights
        }

    def get_persona_contributions(self) -> Dict[str, float]:
        """
        Get the current contribution level of each persona in the mesh

        Returns:
            Dictionary mapping persona names to their contribution percentage
        """
        return self.active_blend.copy()

    def adjust_persona_weights(self, feedback: Dict[str, float]):
        """
        Manually adjust persona weights based on feedback

        Args:
            feedback: Dictionary mapping persona names to adjustment values
        """
        for persona, adjustment in feedback.items():
            if persona in self.active_blend:
                self.active_blend[persona] *= (1.0 + adjustment)

        # Normalize weights
        total_weight = sum(self.active_blend.values())
        if total_weight > 0:
            for persona in self.active_blend:
                self.active_blend[persona] /= total_weight

        self.save_blend_weights()
