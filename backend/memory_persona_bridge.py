import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime

from memory_store import MemoryStore
from memory_indexer import MemoryIndexer
from persona_mesh import PersonaMesh
from emotional_memory import get_last_emotion

class MemoryPersonaBridge:
    """
    MemoryPersonaBridge implements a system where memory determines persona selection.
    
    This bridge analyzes the user's memory patterns and history to determine which
    persona would be most appropriate for the current context. It creates a feedback
    loop where memories influence persona selection, and persona interactions create
    new memories.
    
    Key features:
    1. Memory-based persona selection - Using past interactions to select personas
    2. Topic-persona mapping - Matching conversation topics to appropriate personas
    3. Emotional memory influence - Using emotional patterns to guide persona selection
    4. Contextual continuity - Maintaining consistent personas across related topics
    """
    
    def __init__(self, memory_store: Optional[MemoryStore] = None, 
                 memory_indexer: Optional[MemoryIndexer] = None,
                 persona_mesh: Optional[PersonaMesh] = None):
        """
        Initialize the MemoryPersonaBridge with connections to memory and persona systems
        
        Args:
            memory_store: The memory store for accessing episodic and semantic memories
            memory_indexer: The memory indexer for searching and categorizing memories
            persona_mesh: The persona mesh for unified persona responses
        """
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.memory_indexer = memory_indexer if memory_indexer else MemoryIndexer(self.memory_store)
        self.persona_mesh = persona_mesh if persona_mesh else PersonaMesh(self.memory_store)
        
        # Topic-persona affinity map
        self.topic_persona_map = {
            "personal": ["حنون", "صديق مهضوم"],  # Personal topics -> Caring, Funny Friend
            "technical": ["مستشار", "عالم"],     # Technical topics -> Advisor, Scientist
            "emotional": ["حنون", "شاعر"],       # Emotional topics -> Caring, Poet
            "philosophical": ["فيلسوف", "شاعر"], # Philosophical topics -> Philosopher, Poet
            "practical": ["مستشار", "محايد"],    # Practical topics -> Advisor, Neutral
            "creative": ["شاعر", "صديق مهضوم"],  # Creative topics -> Poet, Funny Friend
            "default": ["محايد"]                 # Default -> Neutral
        }
        
        # Load or initialize memory-persona associations
        self.memory_persona_associations = self.load_associations()
    
    def load_associations(self) -> Dict[str, Dict[str, float]]:
        """
        Load memory-persona associations from file or initialize with defaults
        
        Returns:
            Dictionary mapping memory categories to persona weights
        """
        associations_path = 'data/memory_persona_associations.json'
        try:
            if os.path.exists(associations_path):
                with open(associations_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Initialize with default associations
                return {
                    "personal_info": {"حنون": 0.6, "صديق مهضوم": 0.3, "محايد": 0.1},
                    "preferences": {"مستشار": 0.4, "صديق مهضوم": 0.4, "محايد": 0.2},
                    "emotions": {"حنون": 0.5, "شاعر": 0.4, "محايد": 0.1},
                    "knowledge": {"عالم": 0.6, "مستشار": 0.3, "محايد": 0.1},
                    "philosophy": {"فيلسوف": 0.7, "شاعر": 0.2, "محايد": 0.1},
                    "default": {"محايد": 0.5, "مستشار": 0.3, "حنون": 0.2}
                }
        except Exception as e:
            print(f"Error loading memory-persona associations: {e}")
            # Fallback to default associations
            return {
                "default": {"محايد": 1.0}
            }
    
    def save_associations(self):
        """Save memory-persona associations to file"""
        associations_path = 'data/memory_persona_associations.json'
        try:
            os.makedirs(os.path.dirname(associations_path), exist_ok=True)
            with open(associations_path, 'w', encoding='utf-8') as f:
                json.dump(self.memory_persona_associations, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving memory-persona associations: {e}")
    
    def analyze_user_input(self, user_input: str) -> Dict[str, Any]:
        """
        Analyze user input to determine relevant memories and topics
        
        Args:
            user_input: The user's input text
            
        Returns:
            Dictionary with analysis results including topics and relevant memories
        """
        # Search for relevant memories
        relevant_memories = self.memory_indexer.search_memories(user_input, limit=5)
        
        # Determine the topic category
        topic = self._categorize_topic(user_input, relevant_memories)
        
        # Extract key entities or concepts
        entities = self._extract_entities(user_input)
        
        # Check for emotional content
        emotional_content = self._detect_emotional_content(user_input)
        
        return {
            "topic": topic,
            "entities": entities,
            "emotional_content": emotional_content,
            "relevant_memories": relevant_memories
        }
    
    def _categorize_topic(self, text: str, memories: List[Dict]) -> str:
        """
        Categorize the topic of the conversation
        
        Args:
            text: The text to categorize
            memories: Relevant memories that might help with categorization
            
        Returns:
            The topic category
        """
        # Simple keyword-based categorization
        personal_keywords = ["أنا", "نفسي", "حياتي", "عائلتي", "i", "me", "my", "myself", "family"]
        technical_keywords = ["كيف", "تقنية", "علم", "برمجة", "how", "technology", "science", "programming"]
        emotional_keywords = ["أشعر", "حزين", "سعيد", "غاضب", "خائف", "feel", "sad", "happy", "angry", "afraid"]
        philosophical_keywords = ["معنى", "وجود", "حياة", "موت", "meaning", "existence", "life", "death"]
        practical_keywords = ["مساعدة", "حل", "مشكلة", "نصيحة", "help", "solve", "problem", "advice"]
        creative_keywords = ["فكرة", "إبداع", "فن", "شعر", "idea", "creative", "art", "poetry"]
        
        # Count keyword matches for each category
        counts = {
            "personal": sum(1 for kw in personal_keywords if kw in text.lower()),
            "technical": sum(1 for kw in technical_keywords if kw in text.lower()),
            "emotional": sum(1 for kw in emotional_keywords if kw in text.lower()),
            "philosophical": sum(1 for kw in philosophical_keywords if kw in text.lower()),
            "practical": sum(1 for kw in practical_keywords if kw in text.lower()),
            "creative": sum(1 for kw in creative_keywords if kw in text.lower())
        }
        
        # Also consider topics from relevant memories
        for memory in memories:
            memory_text = memory.get("input", "") + " " + memory.get("response", "")
            for category, keywords in [
                ("personal", personal_keywords),
                ("technical", technical_keywords),
                ("emotional", emotional_keywords),
                ("philosophical", philosophical_keywords),
                ("practical", practical_keywords),
                ("creative", creative_keywords)
            ]:
                if any(kw in memory_text.lower() for kw in keywords):
                    counts[category] += 0.5  # Add half a point for each memory match
        
        # Get the category with the highest count
        max_count = max(counts.values()) if counts else 0
        if max_count > 0:
            # If there's a tie, prefer the most specific category
            categories = [cat for cat, count in counts.items() if count == max_count]
            if "emotional" in categories:
                return "emotional"
            elif "philosophical" in categories:
                return "philosophical"
            elif "personal" in categories:
                return "personal"
            elif "technical" in categories:
                return "technical"
            elif "creative" in categories:
                return "creative"
            elif "practical" in categories:
                return "practical"
        
        return "default"
    
    def _extract_entities(self, text: str) -> List[str]:
        """
        Extract key entities or concepts from text
        
        Args:
            text: The text to extract entities from
            
        Returns:
            List of extracted entities
        """
        # This is a simplified implementation
        # In a real system, this would use NLP techniques like named entity recognition
        
        # Split text into words and filter out common words
        common_words = ["و", "في", "من", "على", "إلى", "أن", "the", "and", "in", "of", "to", "a", "is", "that"]
        words = [word.strip('.,?!()[]{}":;') for word in text.split()]
        entities = [word for word in words if word and len(word) > 2 and word.lower() not in common_words]
        
        # Return unique entities
        return list(set(entities))
    
    def _detect_emotional_content(self, text: str) -> Dict[str, float]:
        """
        Detect emotional content in text
        
        Args:
            text: The text to analyze
            
        Returns:
            Dictionary mapping emotion types to intensity scores
        """
        # Simple keyword-based emotion detection
        emotion_keywords = {
            "حزن": ["حزين", "بكاء", "ألم", "فقدان", "sad", "cry", "pain", "loss"],
            "فرح": ["سعيد", "فرح", "ضحك", "سرور", "happy", "joy", "laugh", "pleasure"],
            "غضب": ["غاضب", "عصبي", "إحباط", "angry", "upset", "frustrated"],
            "خوف": ["خائف", "قلق", "توتر", "afraid", "anxious", "nervous"]
        }
        
        # Count emotion keywords
        emotion_scores = {}
        text_lower = text.lower()
        
        for emotion, keywords in emotion_keywords.items():
            count = sum(1 for kw in keywords if kw in text_lower)
            if count > 0:
                # Normalize score between 0.1 and 1.0
                emotion_scores[emotion] = min(1.0, 0.1 + (count * 0.3))
        
        return emotion_scores
    
    def determine_persona_weights(self, user_input: str, session_id: str = "default") -> Dict[str, float]:
        """
        Determine the optimal persona weights based on memory and context
        
        Args:
            user_input: The user's input text
            session_id: The session identifier for emotion tracking
            
        Returns:
            Dictionary mapping persona names to weights
        """
        # Analyze the user input
        analysis = self.analyze_user_input(user_input)
        
        # Get current emotion
        current_emotion = get_last_emotion(session_id)
        
        # Start with default weights
        persona_weights = self.memory_persona_associations.get("default", {"محايد": 1.0}).copy()
        
        # Adjust weights based on topic
        topic = analysis["topic"]
        if topic in self.topic_persona_map:
            for persona in self.topic_persona_map[topic]:
                if persona in persona_weights:
                    persona_weights[persona] = persona_weights.get(persona, 0) + 0.3
                else:
                    persona_weights[persona] = 0.3
        
        # Adjust weights based on emotional content
        emotional_content = analysis["emotional_content"]
        if emotional_content:
            # Map emotions to personas
            emotion_persona_map = {
                "حزن": ["حنون", "شاعر"],  # Sadness -> Caring, Poet
                "فرح": ["صديق مهضوم", "شاعر"],  # Joy -> Funny Friend, Poet
                "غضب": ["مستشار", "محايد"],  # Anger -> Advisor, Neutral
                "خوف": ["حنون", "مستشار"]   # Fear -> Caring, Advisor
            }
            
            # Adjust weights based on detected emotions
            for emotion, score in emotional_content.items():
                if emotion in emotion_persona_map:
                    for persona in emotion_persona_map[emotion]:
                        if persona in persona_weights:
                            persona_weights[persona] = persona_weights.get(persona, 0) + (score * 0.4)
                        else:
                            persona_weights[persona] = score * 0.4
        
        # Adjust weights based on relevant memories
        for memory in analysis["relevant_memories"]:
            # If the memory has an associated emotion, boost related personas
            memory_emotion = memory.get("emotion")
            if memory_emotion and memory_emotion != "neutral" and memory_emotion in emotion_persona_map:
                for persona in emotion_persona_map[memory_emotion]:
                    if persona in persona_weights:
                        persona_weights[persona] = persona_weights.get(persona, 0) + 0.2
                    else:
                        persona_weights[persona] = 0.2
        
        # Normalize weights to sum to 1
        total_weight = sum(persona_weights.values())
        if total_weight > 0:
            for persona in persona_weights:
                persona_weights[persona] /= total_weight
        
        return persona_weights
    
    def get_memory_guided_response(self, user_input: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Get a response guided by memory analysis
        
        Args:
            user_input: The user's input text
            session_id: The session identifier for emotion tracking
            
        Returns:
            A dictionary containing the response and metadata
        """
        # Determine persona weights based on memory and context
        persona_weights = self.determine_persona_weights(user_input, session_id)
        
        # Apply these weights to the persona mesh
        self.persona_mesh.adjust_persona_weights({p: w - 0.5 for p, w in persona_weights.items()})
        
        # Get a unified response from the persona mesh
        response = self.persona_mesh.get_unified_response(user_input, session_id)
        
        # Store this interaction in memory
        if self.memory_store:
            self.memory_store.store_episodic_memory({
                "input": user_input,
                "response": response["text"],
                "emotion": get_last_emotion(session_id),
                "context": {
                    "persona_weights": persona_weights,
                    "topic": self.analyze_user_input(user_input)["topic"]
                }
            })
        
        # Add memory analysis to response metadata
        response["memory_analysis"] = {
            "topic": self.analyze_user_input(user_input)["topic"],
            "persona_weights": persona_weights
        }
        
        return response
    
    def update_associations_from_feedback(self, topic: str, persona: str, feedback_score: float):
        """
        Update memory-persona associations based on feedback
        
        Args:
            topic: The topic category
            persona: The persona name
            feedback_score: Feedback score (-1.0 to 1.0)
        """
        if topic not in self.memory_persona_associations:
            self.memory_persona_associations[topic] = {"محايد": 0.5}
        
        # Adjust the weight for this persona
        current_weight = self.memory_persona_associations[topic].get(persona, 0.1)
        new_weight = current_weight * (1.0 + (feedback_score * 0.2))
        self.memory_persona_associations[topic][persona] = max(0.1, min(new_weight, 1.0))
        
        # Normalize weights
        total_weight = sum(self.memory_persona_associations[topic].values())
        if total_weight > 0:
            for p in self.memory_persona_associations[topic]:
                self.memory_persona_associations[topic][p] /= total_weight
        
        # Save updated associations
        self.save_associations()