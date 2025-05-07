import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime

from persona_mesh import PersonaMesh
from memory_persona_bridge import MemoryPersonaBridge
from emotion_decision_matrix import EmotionDecisionMatrix
from memory_store import MemoryStore
from emotional_memory import get_last_emotion, log_emotion
from emotional_self_awareness import EmotionalSelfAwareness
from emotional_timeline import EmotionalTimeline
from personal_relationship_memory import PersonalRelationshipMemory

class StateIntegrator:
    """
    StateIntegrator integrates emotions, memory, and motivation into a cohesive system.

    This integrator serves as the central coordination point that brings together all
    components of the system (personas, memory, emotions) to create a unified state
    that drives the system's behavior. It manages the flow of information between
    components and ensures that they work together harmoniously.

    Key features:
    1. State management - Maintaining a coherent internal state across components
    2. Cross-component coordination - Ensuring components work together effectively
    3. Motivation modeling - Implementing a motivation system that drives behavior
    4. Adaptive response generation - Creating responses that integrate all aspects
    5. Feedback distribution - Distributing feedback to appropriate components
    """

    def __init__(self, 
                 memory_store: Optional[MemoryStore] = None,
                 persona_mesh: Optional[PersonaMesh] = None,
                 memory_persona_bridge: Optional[MemoryPersonaBridge] = None,
                 emotion_matrix: Optional[EmotionDecisionMatrix] = None,
                 emotional_self_awareness: Optional[EmotionalSelfAwareness] = None,
                 emotional_timeline: Optional[EmotionalTimeline] = None,
                 relationship_memory: Optional[PersonalRelationshipMemory] = None):
        """
        Initialize the StateIntegrator with connections to all system components

        Args:
            memory_store: The memory store for accessing memories
            persona_mesh: The persona mesh for unified persona responses
            memory_persona_bridge: The bridge between memory and personas
            emotion_matrix: The emotion decision matrix
            emotional_self_awareness: The emotional self-awareness engine
            emotional_timeline: The emotional timeline system
            relationship_memory: The personal relationship memory system
        """
        # Initialize or use provided components
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.persona_mesh = persona_mesh if persona_mesh else PersonaMesh(self.memory_store)
        self.emotion_matrix = emotion_matrix if emotion_matrix else EmotionDecisionMatrix(self.memory_store)
        self.emotional_self_awareness = emotional_self_awareness if emotional_self_awareness else EmotionalSelfAwareness(self.memory_store)
        self.emotional_timeline = emotional_timeline if emotional_timeline else EmotionalTimeline(self.memory_store)
        self.relationship_memory = relationship_memory if relationship_memory else PersonalRelationshipMemory(self.memory_store, self.emotional_self_awareness, self.persona_mesh)

        # Initialize memory_persona_bridge last since it depends on other components
        if memory_persona_bridge:
            self.memory_persona_bridge = memory_persona_bridge
        else:
            self.memory_persona_bridge = MemoryPersonaBridge(
                self.memory_store, 
                None,  # Memory indexer will be created by the bridge
                self.persona_mesh
            )

        # Motivation system
        self.motivations = {
            "connection": 0.5,    # Desire to connect emotionally with the user
            "understanding": 0.5, # Desire to understand the user's needs
            "helpfulness": 0.5,   # Desire to be helpful and provide value
            "growth": 0.5,        # Desire to learn and improve
            "consistency": 0.5    # Desire to maintain a consistent identity
        }

        # Current state
        self.current_state = {
            "active_emotion": "حياد",
            "emotion_intensity": 0.5,
            "dominant_persona": "محايد",
            "persona_blend": {},
            "motivation_focus": "helpfulness",
            "context_awareness": 0.5,
            "session_id": "default",
            "interaction_count": 0
        }

        # Load or initialize state data
        self.state_data = self.load_state_data()

    def load_state_data(self) -> Dict:
        """
        Load state data from file or initialize with defaults

        Returns:
            Dictionary containing state data
        """
        data_path = 'data/state_data.json'
        try:
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Initialize with default data
                return {
                    "motivation_history": {},
                    "state_transitions": [],
                    "feedback_impact": {
                        "persona": 0.0,
                        "emotion": 0.0,
                        "memory": 0.0
                    },
                    "session_data": {}
                }
        except Exception as e:
            print(f"Error loading state data: {e}")
            # Fallback to minimal default data
            return {
                "motivation_history": {},
                "state_transitions": [],
                "feedback_impact": {},
                "session_data": {}
            }

    def save_state_data(self):
        """Save state data to file"""
        data_path = 'data/state_data.json'
        try:
            os.makedirs(os.path.dirname(data_path), exist_ok=True)
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(self.state_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving state data: {e}")

    def update_motivations(self, user_input: str, emotional_context: Dict[str, Any]):
        """
        Update the motivation system based on user input and emotional context

        Args:
            user_input: The user's input text
            emotional_context: The emotional context analysis
        """
        # Adjust connection motivation based on emotional content
        if emotional_context["current_emotion"] != "حياد":
            # Increase connection motivation for emotional inputs
            self.motivations["connection"] = min(1.0, self.motivations["connection"] + 0.05)
        else:
            # Gradually decrease connection motivation for neutral inputs
            self.motivations["connection"] = max(0.3, self.motivations["connection"] - 0.02)

        # Adjust understanding motivation based on question marks and complexity
        if "?" in user_input or "؟" in user_input:
            self.motivations["understanding"] = min(1.0, self.motivations["understanding"] + 0.05)

        # Adjust helpfulness motivation based on explicit requests
        help_keywords = ["ساعدني", "احتاج", "كيف يمكنني", "help", "need", "how can i"]
        if any(keyword in user_input.lower() for keyword in help_keywords):
            self.motivations["helpfulness"] = min(1.0, self.motivations["helpfulness"] + 0.1)

        # Adjust growth motivation based on feedback and new topics
        if self.current_state["interaction_count"] > 0:
            self.motivations["growth"] = min(1.0, self.motivations["growth"] + 0.01)

        # Adjust consistency motivation based on emotional stability
        if emotional_context["stability"] > 0.7:
            self.motivations["consistency"] = min(1.0, self.motivations["consistency"] + 0.03)
        else:
            self.motivations["consistency"] = max(0.3, self.motivations["consistency"] - 0.03)

        # Determine the dominant motivation
        dominant_motivation = max(self.motivations.items(), key=lambda x: x[1])[0]
        self.current_state["motivation_focus"] = dominant_motivation

        # Record motivation history
        session_id = self.current_state["session_id"]
        if session_id not in self.state_data["motivation_history"]:
            self.state_data["motivation_history"][session_id] = []

        self.state_data["motivation_history"][session_id].append({
            "timestamp": datetime.now().isoformat(),
            "motivations": self.motivations.copy(),
            "dominant": dominant_motivation
        })

    def determine_response_parameters(self, user_input: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Determine parameters for response generation based on integrated state

        Args:
            user_input: The user's input text
            session_id: The session identifier

        Returns:
            Dictionary with response parameters
        """
        # Update session ID in current state
        self.current_state["session_id"] = session_id
        self.current_state["interaction_count"] += 1

        # Get emotional context
        emotional_context = self.emotion_matrix.analyze_emotional_context(user_input, session_id)

        # Update motivations based on input and emotional context
        self.update_motivations(user_input, emotional_context)

        # Get persona weights from memory-persona bridge
        persona_weights = self.memory_persona_bridge.determine_persona_weights(user_input, session_id)

        # Update current state
        self.current_state["active_emotion"] = emotional_context["current_emotion"]
        self.current_state["emotion_intensity"] = emotional_context["intensity"]
        self.current_state["persona_blend"] = persona_weights
        self.current_state["dominant_persona"] = max(persona_weights.items(), key=lambda x: x[1])[0]

        # Determine context awareness level based on relevant memories
        if self.memory_store:
            relevant_memories = self.memory_store.retrieve_episodic_memories({"text": user_input, "limit": 3})
            context_awareness = min(1.0, 0.3 + (len(relevant_memories) * 0.2))
            self.current_state["context_awareness"] = context_awareness

        # Record state transition
        self.state_data["state_transitions"].append({
            "timestamp": datetime.now().isoformat(),
            "session_id": session_id,
            "emotion": emotional_context["current_emotion"],
            "emotion_intensity": emotional_context["intensity"],
            "dominant_persona": self.current_state["dominant_persona"],
            "motivation_focus": self.current_state["motivation_focus"]
        })

        # Save state data
        self.save_state_data()

        # Return parameters for response generation
        return {
            "emotional_context": emotional_context,
            "persona_weights": persona_weights,
            "motivation_focus": self.current_state["motivation_focus"],
            "context_awareness": self.current_state["context_awareness"],
            "current_state": self.current_state.copy()
        }

    def generate_integrated_response(self, user_input: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Generate a response that integrates emotions, memory, and motivation

        Args:
            user_input: The user's input text
            session_id: The session identifier

        Returns:
            Dictionary with the integrated response and metadata
        """
        # Determine response parameters
        params = self.determine_response_parameters(user_input, session_id)

        # Extract context from memory if available
        context = user_input
        if self.memory_store and params["context_awareness"] > 0.5:
            # Try to extract more context from memory
            memories = self.memory_store.retrieve_episodic_memories({"text": user_input, "limit": 1})
            if memories:
                context_memory = memories[0]
                context = f"{user_input} (في سياق {context_memory.get('input', '')})"

        # Generate emotional response
        emotional_response = self.emotion_matrix.generate_emotional_response(
            user_input, 
            context, 
            session_id
        )

        # Get memory-guided persona response
        persona_response = self.memory_persona_bridge.get_memory_guided_response(
            user_input, 
            session_id
        )

        # Detect language from user input
        from emotion_engine import detect_language
        detected_language = detect_language(user_input)

        # Try to generate a self-aware response
        import random
        self_aware_response = None
        if random.random() < 0.3:  # 30% chance to include self-aware response
            self_aware_response = self.emotional_self_awareness.generate_self_aware_response(
                session_id,
                detected_language
            )

        # Integrate responses based on current state and motivations
        integrated_response = self._blend_responses(
            emotional_response, 
            persona_response, 
            params,
            self_aware_response
        )

        # Enhance response based on personal relationship
        if self.relationship_memory:
            integrated_response["text"] = self.relationship_memory.generate_relationship_aware_response(
                user_input,
                integrated_response["text"],
                session_id
            )

            # Update relationship data
            self.relationship_memory.update_relationship_from_interaction(
                user_input,
                integrated_response["text"],
                session_id
            )

        # Store the interaction in memory
        if self.memory_store:
            self.memory_store.store_episodic_memory({
                "input": user_input,
                "response": integrated_response["text"],
                "emotion": params["emotional_context"]["current_emotion"],
                "context": {
                    "state": self.current_state,
                    "motivation_focus": params["motivation_focus"]
                }
            })

        return integrated_response

    def _blend_responses(self, 
                         emotional_response: Dict[str, Any], 
                         persona_response: Dict[str, Any], 
                         params: Dict[str, Any],
                         self_aware_response: Optional[str] = None) -> Dict[str, Any]:
        """
        Blend emotional and persona responses based on current state

        Args:
            emotional_response: The emotion-based response
            persona_response: The persona-based response
            params: Response parameters
            self_aware_response: Optional self-aware response from emotional self-awareness engine

        Returns:
            Dictionary with the blended response
        """
        # Determine blend weights based on motivation focus
        emotion_weight = 0.5
        persona_weight = 0.5

        motivation_focus = params["motivation_focus"]
        if motivation_focus == "connection":
            # Connection motivation favors emotional response
            emotion_weight = 0.7
            persona_weight = 0.3
        elif motivation_focus == "consistency":
            # Consistency motivation favors persona response
            emotion_weight = 0.3
            persona_weight = 0.7
        elif motivation_focus == "understanding":
            # Understanding motivation balances both
            emotion_weight = 0.5
            persona_weight = 0.5
        elif motivation_focus == "helpfulness":
            # Helpfulness motivation slightly favors persona response
            emotion_weight = 0.4
            persona_weight = 0.6
        elif motivation_focus == "growth":
            # Growth motivation slightly favors emotional response
            emotion_weight = 0.6
            persona_weight = 0.4

        # Adjust weights based on emotion intensity
        emotion_intensity = params["emotional_context"]["intensity"]
        if emotion_intensity > 0.7:
            # High emotional intensity increases emotion weight
            emotion_weight = min(0.8, emotion_weight + 0.2)
            persona_weight = 1.0 - emotion_weight
        elif emotion_intensity < 0.3:
            # Low emotional intensity decreases emotion weight
            emotion_weight = max(0.2, emotion_weight - 0.2)
            persona_weight = 1.0 - emotion_weight

        # Create blended response
        if emotion_weight >= 0.7:
            # Strongly favor emotional response
            blended_text = emotional_response["text"]
        elif persona_weight >= 0.7:
            # Strongly favor persona response
            blended_text = persona_response["text"]
        else:
            # Create a true blend
            # Extract first part from the response with higher weight
            if emotion_weight >= persona_weight:
                primary = emotional_response["text"]
                secondary = persona_response["text"]
            else:
                primary = persona_response["text"]
                secondary = emotional_response["text"]

            # Split into sentences
            primary_parts = primary.split('.')
            secondary_parts = secondary.split('.')

            # Take first sentence from primary
            blended_text = primary_parts[0] + '.'

            # Add a relevant part from secondary if it's not too similar
            if len(secondary_parts) > 1 and secondary_parts[1].strip() and secondary_parts[1].strip() not in primary:
                blended_text += ' ' + secondary_parts[1].strip() + '.'

            # Add another part from primary if available
            if len(primary_parts) > 1 and primary_parts[1].strip():
                blended_text += ' ' + primary_parts[1].strip() + '.'

        # Calculate confidence as weighted average
        confidence = (
            emotion_weight * emotional_response.get("confidence", 0.5) +
            persona_weight * persona_response.get("confidence", 0.5)
        )

        # Add self-aware response if available
        if self_aware_response:
            blended_text += f" {self_aware_response}"

        # Create the response dictionary
        response = {
            "text": blended_text,
            "emotion_weight": emotion_weight,
            "persona_weight": persona_weight,
            "emotion": params["emotional_context"]["current_emotion"],
            "dominant_persona": params["current_state"]["dominant_persona"],
            "motivation_focus": motivation_focus,
            "confidence": confidence,
            "state": params["current_state"],
            "self_aware": bool(self_aware_response)
        }

        # Preserve memory_analysis from persona_response if available
        if "memory_analysis" in persona_response:
            response["memory_analysis"] = persona_response["memory_analysis"]

        return response

    def process_feedback(self, session_id: str, response_data: Dict[str, Any], feedback_score: float):
        """
        Process feedback and distribute it to appropriate components

        Args:
            session_id: The session identifier
            response_data: The response data that received feedback
            feedback_score: Feedback score (-1.0 to 1.0)
        """
        if not response_data:
            return

        # Extract weights from response data
        emotion_weight = response_data.get("emotion_weight", 0.5)
        persona_weight = response_data.get("persona_weight", 0.5)

        # Distribute feedback proportionally
        emotion_feedback = feedback_score * emotion_weight
        persona_feedback = feedback_score * persona_weight

        # Update feedback impact tracking
        if "feedback_impact" not in self.state_data:
            self.state_data["feedback_impact"] = {"persona": 0.0, "emotion": 0.0, "memory": 0.0}

        self.state_data["feedback_impact"]["emotion"] += emotion_feedback
        self.state_data["feedback_impact"]["persona"] += persona_feedback
        self.state_data["feedback_impact"]["memory"] += persona_feedback * 0.5  # Memory affects persona

        # Pass feedback to emotion matrix
        if emotion_feedback != 0 and self.emotion_matrix:
            self.emotion_matrix.process_feedback(
                session_id,
                {
                    "primary_strategy": response_data.get("primary_strategy"),
                    "secondary_strategy": response_data.get("secondary_strategy"),
                    "emotion": response_data.get("emotion")
                },
                emotion_feedback
            )

        # Pass feedback to memory-persona bridge
        if persona_feedback != 0 and self.memory_persona_bridge:
            # Update persona weights based on feedback
            topic = "default"
            if "memory_analysis" in response_data:
                topic = response_data["memory_analysis"].get("topic", "default")

            self.memory_persona_bridge.update_associations_from_feedback(
                topic,
                response_data.get("dominant_persona", "محايد"),
                persona_feedback
            )

        # Adjust motivations based on feedback
        if feedback_score > 0:
            # Positive feedback reinforces current motivation focus
            motivation_focus = response_data.get("motivation_focus")
            if motivation_focus in self.motivations:
                self.motivations[motivation_focus] = min(1.0, self.motivations[motivation_focus] + 0.05)
        elif feedback_score < 0:
            # Negative feedback reduces current motivation focus
            motivation_focus = response_data.get("motivation_focus")
            if motivation_focus in self.motivations:
                self.motivations[motivation_focus] = max(0.2, self.motivations[motivation_focus] - 0.05)

        # Save state data
        self.save_state_data()

    def get_system_status(self) -> Dict[str, Any]:
        """
        Get the current status of the integrated system

        Returns:
            Dictionary with system status information
        """
        # Get component statuses
        emotion_stats = None
        if self.emotion_matrix:
            emotion_stats = self.emotion_matrix.get_emotion_statistics(self.current_state["session_id"])

        persona_contributions = None
        if self.persona_mesh:
            persona_contributions = self.persona_mesh.get_persona_contributions()

        # Compile system status
        return {
            "current_state": self.current_state,
            "motivations": self.motivations,
            "emotion_stats": emotion_stats,
            "persona_contributions": persona_contributions,
            "feedback_impact": self.state_data.get("feedback_impact", {}),
            "interaction_count": self.current_state["interaction_count"]
        }
