import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta

from memory_store import MemoryStore
from emotional_self_awareness import EmotionalSelfAwareness
from persona_mesh import PersonaMesh
from emotion_engine import detect_emotion, get_emotion_in_language

class PersonalRelationshipMemory:
    """
    PersonalRelationshipMemory implements a long-term personal relationship system.

    This system tracks and manages relationship data to make interactions feel like they
    build upon each other. It remembers who the user is, how they like to be treated,
    and when to be silent or speak.

    Key features:
    1. User preference tracking - Remembering how the user likes to be treated
    2. Interaction pattern analysis - Learning when to speak and when to be silent
    3. Relationship quality monitoring - Tracking trust, rapport, and satisfaction
    4. Identity memory - Remembering who the user is and their background
    5. Conversation history analysis - Identifying patterns in past conversations
    """

    def __init__(self, memory_store: Optional[MemoryStore] = None,
                 emotional_awareness: Optional[EmotionalSelfAwareness] = None,
                 persona_mesh: Optional[PersonaMesh] = None):
        """
        Initialize the personal relationship memory system.

        Args:
            memory_store: Optional memory store for accessing memories
            emotional_awareness: Optional emotional self-awareness engine
            persona_mesh: Optional persona mesh for persona selection
        """
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.emotional_awareness = emotional_awareness if emotional_awareness else EmotionalSelfAwareness(self.memory_store)
        self.persona_mesh = persona_mesh if persona_mesh else PersonaMesh(self.memory_store)

        # Load or initialize relationship data
        self.relationship_data = self.load_relationship_data()

        # Define relationship quality metrics
        self.relationship_metrics = {
            "trust": 0.5,        # Initial neutral trust level
            "rapport": 0.5,      # Initial neutral rapport level
            "satisfaction": 0.5, # Initial neutral satisfaction level
            "familiarity": 0.1   # Initial low familiarity level
        }

        # Define interaction pattern tracking
        self.interaction_patterns = {
            "response_time": {},  # Time of day -> frequency
            "silence_triggers": {},  # Topics/contexts that lead to user silence
            "engagement_triggers": {},  # Topics/contexts that lead to high engagement
            "conversation_duration": [],  # List of conversation durations
            "message_frequency": {}  # Time between messages -> frequency
        }

        # Define user preference tracking
        self.user_preferences = {
            "communication_style": {
                "verbose": 0.5,  # 0 = concise, 1 = verbose
                "formal": 0.5,   # 0 = casual, 1 = formal
                "direct": 0.5,   # 0 = indirect, 1 = direct
                "emotional": 0.5 # 0 = factual, 1 = emotional
            },
            "topic_interests": {},  # Topic -> interest level
            "persona_preferences": {},  # Persona -> preference level
            "response_preferences": {
                "questions": 0.5,  # Preference for questions in responses
                "suggestions": 0.5,  # Preference for suggestions in responses
                "empathy": 0.5,     # Preference for empathy in responses
                "humor": 0.5        # Preference for humor in responses
            }
        }

        # Define identity memory
        self.identity_memory = {
            "name": "",
            "background": {},
            "relationships": {},
            "important_dates": {},
            "values": {},
            "goals": {}
        }

    def load_relationship_data(self) -> Dict[str, Any]:
        """
        Load relationship data from file or initialize with defaults.

        Returns:
            Dictionary containing relationship data
        """
        data_path = 'data/relationship_memory.json'
        try:
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Initialize with empty data
                return {
                    "sessions": {},
                    "global_metrics": {
                        "total_interactions": 0,
                        "first_interaction": datetime.now().isoformat(),
                        "last_interaction": datetime.now().isoformat()
                    },
                    "relationship_evolution": []
                }
        except Exception as e:
            print(f"Error loading relationship data: {e}")
            # Fallback to minimal default data
            return {
                "sessions": {},
                "global_metrics": {
                    "total_interactions": 0,
                    "first_interaction": datetime.now().isoformat(),
                    "last_interaction": datetime.now().isoformat()
                },
                "relationship_evolution": []
            }

    def save_relationship_data(self):
        """Save relationship data to file"""
        data_path = 'data/relationship_memory.json'
        try:
            os.makedirs(os.path.dirname(data_path), exist_ok=True)

            # Update global metrics
            self.relationship_data["global_metrics"]["last_interaction"] = datetime.now().isoformat()

            # Save to file
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(self.relationship_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving relationship data: {e}")

    def update_relationship_from_interaction(self, user_input: str, response: str, 
                                            session_id: str = "default", 
                                            feedback: Optional[float] = None):
        """
        Update relationship data based on an interaction.

        Args:
            user_input: The user's input text
            response: The system's response text
            session_id: The session identifier
            feedback: Optional explicit feedback score (-1.0 to 1.0)
        """
        # Ensure session exists in relationship data
        if session_id not in self.relationship_data["sessions"]:
            self.relationship_data["sessions"][session_id] = {
                "interactions": 0,
                "first_interaction": datetime.now().isoformat(),
                "last_interaction": datetime.now().isoformat(),
                "topics_discussed": {},
                "emotional_responses": {},
                "silence_patterns": [],
                "engagement_patterns": []
            }

        # Update session data
        session_data = self.relationship_data["sessions"][session_id]
        session_data["interactions"] += 1
        session_data["last_interaction"] = datetime.now().isoformat()

        # Update global metrics
        self.relationship_data["global_metrics"]["total_interactions"] += 1

        # Detect emotion in user input
        standardized_emotion, detected_lang = detect_emotion(user_input)

        # Extract topics from user input
        topics = self._extract_topics(user_input)

        # Update topics discussed
        for topic in topics:
            if topic not in session_data["topics_discussed"]:
                session_data["topics_discussed"][topic] = 0
            session_data["topics_discussed"][topic] += 1

        # Update emotional responses
        if standardized_emotion not in session_data["emotional_responses"]:
            session_data["emotional_responses"][standardized_emotion] = 0
        session_data["emotional_responses"][standardized_emotion] += 1

        # Update user preferences based on interaction
        self._update_preferences(user_input, response, standardized_emotion, topics, feedback)

        # Update interaction patterns
        self._update_interaction_patterns(user_input, standardized_emotion, topics)

        # Update relationship quality metrics
        self._update_relationship_metrics(standardized_emotion, feedback)

        # Extract identity information
        self._extract_identity_info(user_input)

        # Record relationship evolution
        self._record_relationship_evolution(session_id)

        # Save updated data
        self.save_relationship_data()

    def _extract_topics(self, text: str) -> List[str]:
        """
        Extract topics from text.

        Args:
            text: The text to extract topics from

        Returns:
            List of extracted topics
        """
        # Simple topic extraction based on keywords
        # In a real system, this would use more sophisticated NLP techniques
        topics = []

        # Define topic keywords
        topic_keywords = {
            "family": ["family", "mother", "father", "sister", "brother", "أسرة", "عائلة", "أم", "أب", "أخت", "أخ"],
            "work": ["work", "job", "career", "office", "عمل", "وظيفة", "مهنة", "مكتب"],
            "health": ["health", "doctor", "sick", "illness", "صحة", "طبيب", "مريض", "مرض"],
            "education": ["education", "school", "university", "study", "تعليم", "مدرسة", "جامعة", "دراسة"],
            "technology": ["technology", "computer", "phone", "internet", "تكنولوجيا", "حاسوب", "هاتف", "إنترنت"],
            "entertainment": ["entertainment", "movie", "music", "game", "ترفيه", "فيلم", "موسيقى", "لعبة"],
            "travel": ["travel", "trip", "vacation", "سفر", "رحلة", "إجازة"],
            "food": ["food", "eat", "restaurant", "طعام", "أكل", "مطعم"],
            "sports": ["sports", "exercise", "رياضة", "تمرين"],
            "weather": ["weather", "temperature", "طقس", "حرارة"],
            "news": ["news", "politics", "أخبار", "سياسة"],
            "religion": ["religion", "faith", "دين", "إيمان"],
            "emotions": ["feeling", "emotion", "شعور", "عاطفة"]
        }

        # Check for topic keywords in text
        text_lower = text.lower()
        for topic, keywords in topic_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                topics.append(topic)

        return topics

    def _update_preferences(self, user_input: str, response: str, emotion: str, 
                           topics: List[str], feedback: Optional[float] = None):
        """
        Update user preferences based on interaction.

        Args:
            user_input: The user's input text
            response: The system's response text
            emotion: The detected emotion
            topics: The extracted topics
            feedback: Optional explicit feedback score
        """
        # Update topic interests
        for topic in topics:
            if topic not in self.user_preferences["topic_interests"]:
                self.user_preferences["topic_interests"][topic] = 0.5  # Initial neutral interest

            # Adjust interest based on emotion
            if emotion in ["happiness", "فرح"]:
                # Positive emotion increases interest
                self.user_preferences["topic_interests"][topic] = min(1.0, self.user_preferences["topic_interests"][topic] + 0.05)
            elif emotion in ["sadness", "anger", "حزن", "غضب"]:
                # Negative emotion decreases interest
                self.user_preferences["topic_interests"][topic] = max(0.0, self.user_preferences["topic_interests"][topic] - 0.03)

        # Update communication style preferences
        # Verbose vs. Concise
        if len(user_input) > 100:
            self.user_preferences["communication_style"]["verbose"] = min(1.0, self.user_preferences["communication_style"]["verbose"] + 0.02)
        else:
            self.user_preferences["communication_style"]["verbose"] = max(0.0, self.user_preferences["communication_style"]["verbose"] - 0.01)

        # Formal vs. Casual
        formal_indicators = ["please", "would you", "could you", "من فضلك", "هل يمكنك", "لو سمحت"]
        casual_indicators = ["hey", "yo", "مرحبا", "هاي"]

        if any(indicator in user_input.lower() for indicator in formal_indicators):
            self.user_preferences["communication_style"]["formal"] = min(1.0, self.user_preferences["communication_style"]["formal"] + 0.02)
        if any(indicator in user_input.lower() for indicator in casual_indicators):
            self.user_preferences["communication_style"]["formal"] = max(0.0, self.user_preferences["communication_style"]["formal"] - 0.02)

        # Direct vs. Indirect
        if "?" in user_input or "؟" in user_input:
            self.user_preferences["communication_style"]["direct"] = min(1.0, self.user_preferences["communication_style"]["direct"] + 0.02)

        # Emotional vs. Factual
        emotional_words = ["feel", "happy", "sad", "angry", "afraid", "أشعر", "سعيد", "حزين", "غاضب", "خائف"]
        if any(word in user_input.lower() for word in emotional_words):
            self.user_preferences["communication_style"]["emotional"] = min(1.0, self.user_preferences["communication_style"]["emotional"] + 0.02)

        # Update response preferences based on feedback
        if feedback is not None:
            # Check for questions in response
            if "?" in response or "؟" in response:
                self.user_preferences["response_preferences"]["questions"] += feedback * 0.05
                self.user_preferences["response_preferences"]["questions"] = max(0.0, min(1.0, self.user_preferences["response_preferences"]["questions"]))

            # Check for suggestions in response
            suggestion_indicators = ["you could", "you might", "try", "consider", "يمكنك", "قد تحاول", "جرب", "فكر في"]
            if any(indicator in response.lower() for indicator in suggestion_indicators):
                self.user_preferences["response_preferences"]["suggestions"] += feedback * 0.05
                self.user_preferences["response_preferences"]["suggestions"] = max(0.0, min(1.0, self.user_preferences["response_preferences"]["suggestions"]))

            # Check for empathy in response
            empathy_indicators = ["understand", "sorry", "feel", "أفهم", "آسف", "أشعر"]
            if any(indicator in response.lower() for indicator in empathy_indicators):
                self.user_preferences["response_preferences"]["empathy"] += feedback * 0.05
                self.user_preferences["response_preferences"]["empathy"] = max(0.0, min(1.0, self.user_preferences["response_preferences"]["empathy"]))

            # Check for humor in response
            humor_indicators = ["haha", "funny", "joke", "هههه", "مضحك", "نكتة"]
            if any(indicator in response.lower() for indicator in humor_indicators):
                self.user_preferences["response_preferences"]["humor"] += feedback * 0.05
                self.user_preferences["response_preferences"]["humor"] = max(0.0, min(1.0, self.user_preferences["response_preferences"]["humor"]))

    def _update_interaction_patterns(self, user_input: str, emotion: str, topics: List[str]):
        """
        Update interaction patterns based on user input.

        Args:
            user_input: The user's input text
            emotion: The detected emotion
            topics: The extracted topics
        """
        # Update response time patterns
        current_hour = datetime.now().hour
        hour_key = f"{current_hour:02d}:00"

        if hour_key not in self.interaction_patterns["response_time"]:
            self.interaction_patterns["response_time"][hour_key] = 0
        self.interaction_patterns["response_time"][hour_key] += 1

        # Update engagement triggers
        if len(user_input) > 100 or "?" in user_input or "؟" in user_input:
            # Long messages or questions indicate high engagement
            for topic in topics:
                if topic not in self.interaction_patterns["engagement_triggers"]:
                    self.interaction_patterns["engagement_triggers"][topic] = 0
                self.interaction_patterns["engagement_triggers"][topic] += 1

        # Update silence triggers
        if len(user_input) < 20 and emotion in ["sadness", "anger", "حزن", "غضب"]:
            # Short messages with negative emotions might indicate disengagement
            for topic in topics:
                if topic not in self.interaction_patterns["silence_triggers"]:
                    self.interaction_patterns["silence_triggers"][topic] = 0
                self.interaction_patterns["silence_triggers"][topic] += 1

    def _update_relationship_metrics(self, emotion: str, feedback: Optional[float] = None):
        """
        Update relationship quality metrics.

        Args:
            emotion: The detected emotion
            feedback: Optional explicit feedback score
        """
        # Update based on emotion
        if emotion in ["happiness", "فرح"]:
            # Positive emotion improves relationship metrics
            self.relationship_metrics["satisfaction"] = min(1.0, self.relationship_metrics["satisfaction"] + 0.02)
            self.relationship_metrics["rapport"] = min(1.0, self.relationship_metrics["rapport"] + 0.01)
        elif emotion in ["sadness", "حزن"]:
            # Sadness has mixed effects
            self.relationship_metrics["rapport"] = min(1.0, self.relationship_metrics["rapport"] + 0.01)  # Sharing sadness can build rapport
        elif emotion in ["anger", "غضب"]:
            # Anger can reduce satisfaction
            self.relationship_metrics["satisfaction"] = max(0.0, self.relationship_metrics["satisfaction"] - 0.02)

        # Update based on explicit feedback
        if feedback is not None:
            self.relationship_metrics["satisfaction"] += feedback * 0.05
            self.relationship_metrics["satisfaction"] = max(0.0, min(1.0, self.relationship_metrics["satisfaction"]))

            self.relationship_metrics["trust"] += feedback * 0.03
            self.relationship_metrics["trust"] = max(0.0, min(1.0, self.relationship_metrics["trust"]))

        # Increase familiarity with each interaction
        self.relationship_metrics["familiarity"] = min(1.0, self.relationship_metrics["familiarity"] + 0.005)

    def _extract_identity_info(self, text: str):
        """
        Extract identity information from text.

        Args:
            text: The text to extract information from
        """
        # Extract name
        name_patterns = [
            r"my name is (\w+)",
            r"i am (\w+)",
            r"call me (\w+)",
            r"اسمي (\w+)",
            r"أنا (\w+)",
            r"نادني (\w+)"
        ]

        for pattern in name_patterns:
            import re
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                self.identity_memory["name"] = match.group(1)
                break

        # Extract background information
        background_patterns = {
            "occupation": [
                r"i (work|am) (a|an) (\w+)",
                r"أعمل (\w+)",
                r"أنا (\w+) \(مهنة\)"
            ],
            "education": [
                r"i (study|studied) (\w+)",
                r"أدرس (\w+)",
                r"درست (\w+)"
            ],
            "location": [
                r"i (live|am from) (\w+)",
                r"أعيش في (\w+)",
                r"أنا من (\w+)"
            ]
        }

        for category, patterns in background_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    if category not in self.identity_memory["background"]:
                        self.identity_memory["background"][category] = []
                    self.identity_memory["background"][category].append(match.group(match.lastindex))
                    break

    def _record_relationship_evolution(self, session_id: str):
        """
        Record the evolution of the relationship over time.

        Args:
            session_id: The session identifier
        """
        evolution_record = {
            "timestamp": datetime.now().isoformat(),
            "session_id": session_id,
            "metrics": self.relationship_metrics.copy(),
            "preferences": {
                "communication_style": self.user_preferences["communication_style"].copy(),
                "response_preferences": self.user_preferences["response_preferences"].copy()
            }
        }

        self.relationship_data["relationship_evolution"].append(evolution_record)

        # Limit the size of the evolution history
        max_evolution_records = 100
        if len(self.relationship_data["relationship_evolution"]) > max_evolution_records:
            self.relationship_data["relationship_evolution"] = self.relationship_data["relationship_evolution"][-max_evolution_records:]

    def get_relationship_insights(self, session_id: str = "default") -> Dict[str, Any]:
        """
        Get insights about the relationship.

        Args:
            session_id: The session identifier

        Returns:
            Dictionary containing relationship insights
        """
        insights = {
            "relationship_quality": self.relationship_metrics.copy(),
            "user_preferences": {
                "communication_style": self.user_preferences["communication_style"].copy(),
                "topic_interests": self._get_top_interests(),
                "response_preferences": self.user_preferences["response_preferences"].copy()
            },
            "interaction_patterns": {
                "peak_activity_times": self._get_peak_activity_times(),
                "engagement_topics": self._get_top_engagement_topics(),
                "silence_topics": self._get_top_silence_topics()
            },
            "identity": {
                "name": self.identity_memory["name"],
                "background": self.identity_memory["background"]
            }
        }

        # Add session-specific insights if available
        if session_id in self.relationship_data["sessions"]:
            session_data = self.relationship_data["sessions"][session_id]
            insights["session"] = {
                "interactions": session_data["interactions"],
                "first_interaction": session_data["first_interaction"],
                "last_interaction": session_data["last_interaction"],
                "top_topics": self._get_top_topics(session_id),
                "emotional_profile": self._get_emotional_profile(session_id)
            }

        return insights

    def _get_top_interests(self, limit: int = 5) -> Dict[str, float]:
        """
        Get the top topic interests.

        Args:
            limit: Maximum number of topics to return

        Returns:
            Dictionary mapping topics to interest levels
        """
        sorted_interests = sorted(
            self.user_preferences["topic_interests"].items(),
            key=lambda x: x[1],
            reverse=True
        )

        return dict(sorted_interests[:limit])

    def _get_peak_activity_times(self, limit: int = 3) -> Dict[str, int]:
        """
        Get the peak activity times.

        Args:
            limit: Maximum number of times to return

        Returns:
            Dictionary mapping times to activity levels
        """
        sorted_times = sorted(
            self.interaction_patterns["response_time"].items(),
            key=lambda x: x[1],
            reverse=True
        )

        return dict(sorted_times[:limit])

    def _get_top_engagement_topics(self, limit: int = 3) -> Dict[str, int]:
        """
        Get the top engagement topics.

        Args:
            limit: Maximum number of topics to return

        Returns:
            Dictionary mapping topics to engagement levels
        """
        sorted_topics = sorted(
            self.interaction_patterns["engagement_triggers"].items(),
            key=lambda x: x[1],
            reverse=True
        )

        return dict(sorted_topics[:limit])

    def _get_top_silence_topics(self, limit: int = 3) -> Dict[str, int]:
        """
        Get the top silence topics.

        Args:
            limit: Maximum number of topics to return

        Returns:
            Dictionary mapping topics to silence levels
        """
        sorted_topics = sorted(
            self.interaction_patterns["silence_triggers"].items(),
            key=lambda x: x[1],
            reverse=True
        )

        return dict(sorted_topics[:limit])

    def _get_top_topics(self, session_id: str, limit: int = 5) -> Dict[str, int]:
        """
        Get the top topics discussed in a session.

        Args:
            session_id: The session identifier
            limit: Maximum number of topics to return

        Returns:
            Dictionary mapping topics to discussion counts
        """
        if session_id not in self.relationship_data["sessions"]:
            return {}

        topics = self.relationship_data["sessions"][session_id]["topics_discussed"]
        sorted_topics = sorted(topics.items(), key=lambda x: x[1], reverse=True)

        return dict(sorted_topics[:limit])

    def _get_emotional_profile(self, session_id: str) -> Dict[str, float]:
        """
        Get the emotional profile of a session.

        Args:
            session_id: The session identifier

        Returns:
            Dictionary mapping emotions to frequencies
        """
        if session_id not in self.relationship_data["sessions"]:
            return {}

        emotions = self.relationship_data["sessions"][session_id]["emotional_responses"]
        total = sum(emotions.values())

        if total == 0:
            return {}

        return {emotion: count / total for emotion, count in emotions.items()}

    def generate_relationship_aware_response(self, user_input: str, base_response: str, 
                                            session_id: str = "default") -> str:
        """
        Generate a relationship-aware response.

        Args:
            user_input: The user's input text
            base_response: The base response to enhance
            session_id: The session identifier

        Returns:
            Enhanced response that considers the relationship
        """
        # Get relationship insights
        insights = self.get_relationship_insights(session_id)

        # Detect language
        _, detected_lang = detect_emotion(user_input)

        # Enhance response based on relationship insights
        enhanced_response = self._enhance_response(base_response, insights, detected_lang)

        # Update relationship data with this interaction
        self.update_relationship_from_interaction(user_input, enhanced_response, session_id)

        return enhanced_response

    def _enhance_response(self, base_response: str, insights: Dict[str, Any], 
                         language: str = "ar") -> str:
        """
        Enhance a response based on relationship insights.

        Args:
            base_response: The base response to enhance
            insights: Relationship insights
            language: The detected language

        Returns:
            Enhanced response
        """
        enhanced_response = base_response

        # Adjust verbosity based on preference
        verbosity_preference = insights["user_preferences"]["communication_style"]["verbose"]
        if verbosity_preference > 0.7 and len(base_response) < 100:
            # User prefers verbose responses, but base response is short
            enhanced_response = self._make_more_verbose(enhanced_response, language)
        elif verbosity_preference < 0.3 and len(base_response) > 150:
            # User prefers concise responses, but base response is long
            enhanced_response = self._make_more_concise(enhanced_response)

        # Adjust formality based on preference
        formality_preference = insights["user_preferences"]["communication_style"]["formal"]
        if formality_preference > 0.7:
            # User prefers formal responses
            enhanced_response = self._make_more_formal(enhanced_response, language)
        elif formality_preference < 0.3:
            # User prefers casual responses
            enhanced_response = self._make_more_casual(enhanced_response, language)

        # Add personalization based on identity
        enhanced_response = self._add_personalization(enhanced_response, insights, language)

        # Add questions if the user prefers them
        question_preference = insights["user_preferences"]["response_preferences"]["questions"]
        if question_preference > 0.7 and "?" not in enhanced_response and "؟" not in enhanced_response:
            enhanced_response = self._add_question(enhanced_response, language)

        # Add empathy if the user prefers it
        empathy_preference = insights["user_preferences"]["response_preferences"]["empathy"]
        if empathy_preference > 0.7:
            enhanced_response = self._add_empathy(enhanced_response, language)

        # Add humor if the user prefers it
        humor_preference = insights["user_preferences"]["response_preferences"]["humor"]
        if humor_preference > 0.7:
            enhanced_response = self._add_humor(enhanced_response, language)

        return enhanced_response

    def _make_more_verbose(self, response: str, language: str) -> str:
        """
        Make a response more verbose.

        Args:
            response: The response to enhance
            language: The language of the response

        Returns:
            More verbose response
        """
        # Add elaboration phrases based on language
        if language == "ar":
            elaboration_phrases = [
                " دعني أوضح أكثر، ",
                " بشكل أكثر تفصيلاً، ",
                " أود أن أضيف أيضاً أن ",
                " من المهم أن نلاحظ أيضاً أن ",
                " بالإضافة إلى ذلك، "
            ]
        else:  # Default to English
            elaboration_phrases = [
                " Let me elaborate, ",
                " To be more specific, ",
                " I would also like to add that ",
                " It's important to note that ",
                " Additionally, "
            ]

        import random
        elaboration = random.choice(elaboration_phrases)

        # Split response into sentences
        if "." in response:
            parts = response.split(".", 1)
            if len(parts) > 1:
                return parts[0] + "." + elaboration + parts[1]

        # If we can't split by sentences, just append the elaboration
        return response + elaboration + response

    def _make_more_concise(self, response: str) -> str:
        """
        Make a response more concise.

        Args:
            response: The response to make more concise

        Returns:
            More concise response
        """
        # Simple approach: keep only the first two sentences
        sentences = response.split(".")
        if len(sentences) > 2:
            return ".".join(sentences[:2]) + "."

        return response

    def _make_more_formal(self, response: str, language: str) -> str:
        """
        Make a response more formal.

        Args:
            response: The response to make more formal
            language: The language of the response

        Returns:
            More formal response
        """
        # Replace casual phrases with formal ones
        if language == "ar":
            casual_to_formal = {
                "مرحبا": "السلام عليكم",
                "هاي": "تحية طيبة",
                "اوك": "حسناً",
                "تمام": "جيد",
                "باي": "مع السلامة"
            }
        else:  # Default to English
            casual_to_formal = {
                "hi": "hello",
                "hey": "greetings",
                "ok": "certainly",
                "yeah": "yes",
                "bye": "farewell"
            }

        # Replace casual phrases with formal ones
        formal_response = response
        for casual, formal in casual_to_formal.items():
            formal_response = formal_response.replace(casual, formal)

        return formal_response

    def _make_more_casual(self, response: str, language: str) -> str:
        """
        Make a response more casual.

        Args:
            response: The response to make more casual
            language: The language of the response

        Returns:
            More casual response
        """
        # Replace formal phrases with casual ones
        if language == "ar":
            formal_to_casual = {
                "السلام عليكم": "مرحبا",
                "تحية طيبة": "هاي",
                "حسناً": "اوك",
                "جيد": "تمام",
                "مع السلامة": "باي"
            }
        else:  # Default to English
            formal_to_casual = {
                "hello": "hi",
                "greetings": "hey",
                "certainly": "sure",
                "farewell": "bye",
                "however": "but"
            }

        # Replace formal phrases with casual ones
        casual_response = response
        for formal, casual in formal_to_casual.items():
            casual_response = casual_response.replace(formal, casual)

        return casual_response

    def _add_personalization(self, response: str, insights: Dict[str, Any], language: str) -> str:
        """
        Add personalization to a response based on identity.

        Args:
            response: The response to personalize
            insights: Relationship insights
            language: The language of the response

        Returns:
            Personalized response
        """
        personalized_response = response

        # Add name if available
        name = insights["identity"]["name"]
        if name:
            # Add name at the beginning of the response
            if language == "ar":
                if not any(greeting in response[:20] for greeting in ["مرحبا", "أهلا", "السلام"]):
                    personalized_response = f"مرحبا {name}، " + personalized_response
            else:  # Default to English
                if not any(greeting in response[:20] for greeting in ["hello", "hi", "hey", "greetings"]):
                    personalized_response = f"Hello {name}, " + personalized_response

        # Add background references if available
        background = insights["identity"]["background"]
        if background and self.relationship_metrics["familiarity"] > 0.5:
            # Only add background references if we have high familiarity
            for category, values in background.items():
                if values and category in ["occupation", "location"]:
                    # Add a reference to occupation or location
                    if language == "ar":
                        if category == "occupation" and "عمل" not in personalized_response:
                            personalized_response += f" أتمنى أن يكون عملك كـ{values[0]} جيداً."
                        elif category == "location" and "مدينة" not in personalized_response:
                            personalized_response += f" كيف الأحوال في {values[0]}؟"
                    else:  # Default to English
                        if category == "occupation" and "work" not in personalized_response:
                            personalized_response += f" I hope your work as a {values[0]} is going well."
                        elif category == "location" and "city" not in personalized_response:
                            personalized_response += f" How are things in {values[0]}?"
                    break  # Only add one background reference

        return personalized_response

    def _add_question(self, response: str, language: str) -> str:
        """
        Add a question to a response.

        Args:
            response: The response to add a question to
            language: The language of the response

        Returns:
            Response with a question
        """
        # Add a question based on language
        if language == "ar":
            questions = [
                " ما رأيك؟",
                " هل هذا يساعدك؟",
                " هل تريد معرفة المزيد؟",
                " هل لديك أسئلة أخرى؟",
                " كيف يمكنني مساعدتك أكثر؟"
            ]
        else:  # Default to English
            questions = [
                " What do you think?",
                " Does that help?",
                " Would you like to know more?",
                " Do you have any other questions?",
                " How else can I assist you?"
            ]

        import random
        question = random.choice(questions)

        # Add the question at the end of the response
        if response.endswith("."):
            return response[:-1] + question
        else:
            return response + question

    def _add_empathy(self, response: str, language: str) -> str:
        """
        Add empathy to a response.

        Args:
            response: The response to add empathy to
            language: The language of the response

        Returns:
            Response with empathy
        """
        # Add empathy based on language
        if language == "ar":
            empathy_phrases = [
                "أتفهم مشاعرك. ",
                "أقدر وجهة نظرك. ",
                "أشعر بما تمر به. ",
                "من المفهوم أن تشعر هكذا. ",
                "أنا معك. "
            ]
        else:  # Default to English
            empathy_phrases = [
                "I understand how you feel. ",
                "I appreciate your perspective. ",
                "I can relate to what you're going through. ",
                "It's understandable to feel that way. ",
                "I'm here for you. "
            ]

        import random
        empathy = random.choice(empathy_phrases)

        # Add empathy at the beginning of the response
        return empathy + response

    def _add_humor(self, response: str, language: str) -> str:
        """
        Add humor to a response.

        Args:
            response: The response to add humor to
            language: The language of the response

        Returns:
            Response with humor
        """
        # Add humor based on language
        if language == "ar":
            humor_phrases = [
                " 😄 على فكرة، هل سمعت عن الذكاء الاصطناعي الذي حاول تعلم النكات؟ كان دائماً يضحك في الوقت الخطأ!",
                " 😊 بالمناسبة، أنا أحاول تحسين حس الفكاهة لدي. كيف أنا أفعل حتى الآن؟",
                " 😁 أتمنى أن يكون يومك مشرقاً مثل شاشة هاتفك عندما تضبط السطوع على أقصى درجة!",
                " 😉 أحياناً أشعر أنني أتحدث كثيراً، لكن هذا أفضل من أن أكون صامتاً مثل جهاز كمبيوتر معطل!",
                " 😄 لو كنت إنساناً، لكنت الآن أحتسي القهوة وأفكر في نكتة جديدة!"
            ]
        else:  # Default to English
            humor_phrases = [
                " 😄 By the way, did you hear about the AI that tried to learn jokes? It always laughed at the wrong time!",
                " 😊 I'm working on my sense of humor. How am I doing so far?",
                " 😁 Hope your day is as bright as your phone screen at maximum brightness!",
                " 😉 Sometimes I feel like I talk too much, but that's better than being as silent as a crashed computer!",
                " 😄 If I were human, I'd be sipping coffee and thinking of a new joke right now!"
            ]

        import random
        humor = random.choice(humor_phrases)

        # Add humor at the end of the response
        return response + humor
