import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime

from emotional_memory import get_last_emotion, get_emotion_timeline, log_emotion
from emotion_engine import detect_emotion as detect_emotion_multilingual, get_emotion_in_language
from memory_store import MemoryStore

class EmotionDecisionMatrix:
    """
    EmotionDecisionMatrix implements a system where emotions decide reactions.

    This matrix analyzes emotional patterns and context to determine appropriate
    reactions to user input. It creates a mapping between emotional states and
    response strategies, allowing the system to adapt its behavior based on the
    emotional context of the conversation.

    Key features:
    1. Emotion-based reaction selection - Choosing reaction strategies based on emotions
    2. Emotional intensity scaling - Adjusting response intensity based on emotion strength
    3. Emotional context awareness - Considering emotional history and patterns
    4. Adaptive emotional responses - Learning from feedback to improve emotional reactions
    """

    def __init__(self, memory_store: Optional[MemoryStore] = None):
        """
        Initialize the EmotionDecisionMatrix with optional connection to memory store

        Args:
            memory_store: Optional memory store for accessing emotional memories
        """
        self.memory_store = memory_store

        # Emotion-reaction mapping
        self.emotion_reactions = {
            "حزن": {  # Sadness
                "primary_strategy": "empathize",
                "secondary_strategy": "encourage",
                "tone": "gentle",
                "response_length": "moderate",
                "question_likelihood": 0.3
            },
            "فرح": {  # Joy
                "primary_strategy": "celebrate",
                "secondary_strategy": "amplify",
                "tone": "enthusiastic",
                "response_length": "moderate",
                "question_likelihood": 0.5
            },
            "غضب": {  # Anger
                "primary_strategy": "deescalate",
                "secondary_strategy": "acknowledge",
                "tone": "calm",
                "response_length": "brief",
                "question_likelihood": 0.2
            },
            "خوف": {  # Fear
                "primary_strategy": "reassure",
                "secondary_strategy": "inform",
                "tone": "steady",
                "response_length": "moderate",
                "question_likelihood": 0.4
            },
            "حياد": {  # Neutral
                "primary_strategy": "inform",
                "secondary_strategy": "engage",
                "tone": "neutral",
                "response_length": "balanced",
                "question_likelihood": 0.5
            }
        }

        # Reaction strategies
        self.reaction_strategies = {
            "empathize": {
                "description": "Show understanding and validation of emotions",
                "templates": [
                    "أتفهم شعورك بـ{emotion}. من الطبيعي أن تشعر هكذا عندما {context}.",
                    "أشعر أنك {emotion_intensity} {emotion}. أنا هنا من أجلك.",
                    "يبدو أنك تمر بوقت صعب مع {context}. أنا أستمع إليك."
                ]
            },
            "encourage": {
                "description": "Provide encouragement and positive reinforcement",
                "templates": [
                    "لقد أظهرت قوة كبيرة في التعامل مع {context}. أنا أؤمن بقدرتك على تجاوز هذا.",
                    "كل خطوة للأمام مهمة، مهما كانت صغيرة. أنت تحرز تقدمًا.",
                    "تذكر أن الأوقات الصعبة هي فرص للنمو. لديك ما يلزم للتغلب على هذا."
                ]
            },
            "celebrate": {
                "description": "Join in celebration of positive emotions or events",
                "templates": [
                    "هذه أخبار رائعة عن {context}! أنا سعيد جدًا من أجلك!",
                    "تهانينا! فرحتك مستحقة تمامًا.",
                    "هذا بالتأكيد شيء يستحق الاحتفال! كيف ستحتفل بهذه المناسبة؟"
                ]
            },
            "amplify": {
                "description": "Amplify positive emotions and experiences",
                "templates": [
                    "هذه التجربة الإيجابية مع {context} يمكن أن تكون بداية للمزيد من الأشياء الجيدة القادمة.",
                    "سعادتك معدية! أخبرني المزيد عما يجعلك تشعر بهذه الطريقة.",
                    "لحظات الفرح هذه مهمة جدًا. كيف يمكننا جعل هذا الشعور يدوم لفترة أطول؟"
                ]
            },
            "deescalate": {
                "description": "Calm and reduce intensity of negative emotions",
                "templates": [
                    "أتفهم أنك محبط بشأن {context}. دعنا نتراجع خطوة وننظر إلى هذا بشكل مختلف.",
                    "مشاعرك صحيحة. ربما يمكننا إيجاد طريقة بناءة لمعالجة {context}.",
                    "أسمع أنك منزعج. هل سيساعد تقسيم الموقف إلى أجزاء أصغر؟"
                ]
            },
            "acknowledge": {
                "description": "Acknowledge emotions without judgment",
                "templates": [
                    "أسمع أنك تشعر بـ{emotion} حيال {context}. هذه استجابة طبيعية.",
                    "{emotion} مفهوم بالنظر إلى الظروف.",
                    "من المنطقي أن تشعر بـ{emotion} حيال {context}."
                ]
            },
            "reassure": {
                "description": "Provide reassurance and safety",
                "templates": [
                    "لا بأس أن تشعر بـ{emotion} حيال {context}. كثير من الناس سيشعرون بنفس الطريقة.",
                    "بينما قد يبدو {context} ساحقًا، يمكننا العمل على هذا معًا، خطوة بخطوة.",
                    "مخاوفك بشأن {context} صحيحة. دعنا نفكر فيما قد يساعدك على الشعور بمزيد من الأمان."
                ]
            },
            "inform": {
                "description": "Provide factual information and context",
                "templates": [
                    "إليك ما أعرفه عن {context} والذي قد يكون مفيدًا لك.",
                    "من فهمي، {context} يتضمن عدة جوانب رئيسية تستحق النظر.",
                    "دعني أشارك بعض المعلومات حول {context} التي قد تمنحك مزيدًا من الوضوح."
                ]
            },
            "engage": {
                "description": "Actively engage with the topic or question",
                "templates": [
                    "هذه نقطة مثيرة للاهتمام حول {context}. ما هي الجوانب التي تثير فضولك أكثر؟",
                    "أود استكشاف {context} معك. ما هو منظورك في هذا الموضوع؟",
                    "{context} له أبعاد عديدة. أي زاوية ترغب في التركيز عليها؟"
                ]
            }
        }

        # Emotion intensity levels
        self.intensity_levels = {
            "low": ["قليلاً", "somewhat"],
            "medium": ["", "moderately"],
            "high": ["جداً", "very", "extremely"]
        }

        # Load or initialize emotion response data
        self.emotion_response_data = self.load_response_data()

    def load_response_data(self) -> Dict:
        """
        Load emotion response data from file or initialize with defaults

        Returns:
            Dictionary containing emotion response data
        """
        data_path = 'data/emotion_response_data.json'
        try:
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Initialize with default data
                return {
                    "strategy_effectiveness": {
                        "empathize": {"حزن": 0.8, "فرح": 0.4, "غضب": 0.6, "خوف": 0.7, "حياد": 0.5},
                        "encourage": {"حزن": 0.7, "فرح": 0.6, "غضب": 0.4, "خوف": 0.6, "حياد": 0.5},
                        "celebrate": {"حزن": 0.3, "فرح": 0.9, "غضب": 0.2, "خوف": 0.3, "حياد": 0.6},
                        "amplify": {"حزن": 0.2, "فرح": 0.8, "غضب": 0.2, "خوف": 0.3, "حياد": 0.5},
                        "deescalate": {"حزن": 0.5, "فرح": 0.3, "غضب": 0.8, "خوف": 0.6, "حياد": 0.4},
                        "acknowledge": {"حزن": 0.7, "فرح": 0.5, "غضب": 0.7, "خوف": 0.7, "حياد": 0.6},
                        "reassure": {"حزن": 0.6, "فرح": 0.4, "غضب": 0.5, "خوف": 0.9, "حياد": 0.5},
                        "inform": {"حزن": 0.4, "فرح": 0.5, "غضب": 0.6, "خوف": 0.7, "حياد": 0.8},
                        "engage": {"حزن": 0.5, "فرح": 0.7, "غضب": 0.4, "خوف": 0.5, "حياد": 0.7}
                    },
                    "emotion_transitions": {
                        "حزن": {"حزن": 0.6, "فرح": 0.1, "غضب": 0.1, "خوف": 0.1, "حياد": 0.1},
                        "فرح": {"حزن": 0.1, "فرح": 0.6, "غضب": 0.1, "خوف": 0.1, "حياد": 0.1},
                        "غضب": {"حزن": 0.2, "فرح": 0.1, "غضب": 0.5, "خوف": 0.1, "حياد": 0.1},
                        "خوف": {"حزن": 0.2, "فرح": 0.1, "غضب": 0.1, "خوف": 0.5, "حياد": 0.1},
                        "حياد": {"حزن": 0.1, "فرح": 0.2, "غضب": 0.1, "خوف": 0.1, "حياد": 0.5}
                    },
                    "feedback_history": {}
                }
        except Exception as e:
            print(f"Error loading emotion response data: {e}")
            # Fallback to minimal default data
            return {
                "strategy_effectiveness": {},
                "emotion_transitions": {},
                "feedback_history": {}
            }

    def save_response_data(self):
        """Save emotion response data to file"""
        data_path = 'data/emotion_response_data.json'
        try:
            os.makedirs(os.path.dirname(data_path), exist_ok=True)
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(self.emotion_response_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving emotion response data: {e}")

    def detect_emotion(self, text: str) -> Tuple[str, float]:
        """
        Detect emotion in text with intensity

        Args:
            text: The text to analyze

        Returns:
            Tuple of (emotion, intensity)
        """
        # Use the multilingual emotion detection system
        standardized_emotion, detected_lang = detect_emotion_multilingual(text)
        # Convert to Arabic emotion name for compatibility with existing code
        emotion = get_emotion_in_language(standardized_emotion, 'ar')

        # Calculate intensity based on emotional keywords
        intensity = 0.5  # Default medium intensity

        # Simple intensity detection based on keyword repetition and modifiers
        intensity_modifiers = {
            "جداً": 0.3, "كثيراً": 0.3, "للغاية": 0.3, "very": 0.3, "extremely": 0.4,
            "قليلاً": -0.2, "نوعاً ما": -0.2, "slightly": -0.2, "somewhat": -0.2
        }

        # Check for intensity modifiers
        for modifier, value in intensity_modifiers.items():
            if modifier in text.lower():
                intensity += value

        # Check for exclamation marks and question marks
        intensity += text.count('!') * 0.1
        intensity += text.count('؟') * 0.05
        intensity += text.count('?') * 0.05

        # Ensure intensity is between 0.1 and 1.0
        intensity = max(0.1, min(intensity, 1.0))

        return emotion, intensity

    def analyze_emotional_context(self, user_input: str, session_id: str) -> Dict[str, Any]:
        """
        Analyze the emotional context of the conversation

        Args:
            user_input: The user's input text
            session_id: The session identifier for emotion tracking

        Returns:
            Dictionary with emotional context analysis
        """
        # Detect current emotion and intensity
        current_emotion, intensity = self.detect_emotion(user_input)

        # Get emotion timeline
        timeline = get_emotion_timeline(session_id)

        # Determine emotional stability/volatility
        stability = self._calculate_emotional_stability(timeline)

        # Determine emotional trend
        trend = self._calculate_emotional_trend(timeline, current_emotion)

        # Log the current emotion
        log_emotion(session_id, current_emotion, user_input)

        # Get intensity level label
        intensity_level = "medium"
        if intensity < 0.4:
            intensity_level = "low"
        elif intensity > 0.7:
            intensity_level = "high"

        return {
            "current_emotion": current_emotion,
            "intensity": intensity,
            "intensity_level": intensity_level,
            "stability": stability,
            "trend": trend,
            "timeline": timeline
        }

    def _calculate_emotional_stability(self, timeline: List[Dict]) -> float:
        """
        Calculate emotional stability based on emotion timeline

        Args:
            timeline: List of emotion records

        Returns:
            Stability score (0.0-1.0) where 1.0 is completely stable
        """
        if not timeline or len(timeline) < 2:
            return 1.0  # Default to stable if not enough data

        # Count emotion changes
        changes = 0
        for i in range(1, len(timeline)):
            if timeline[i]["emotion"] != timeline[i-1]["emotion"]:
                changes += 1

        # Calculate stability as inverse of change rate
        change_rate = changes / (len(timeline) - 1)
        stability = 1.0 - change_rate

        return stability

    def _calculate_emotional_trend(self, timeline: List[Dict], current_emotion: str) -> str:
        """
        Calculate emotional trend based on timeline

        Args:
            timeline: List of emotion records
            current_emotion: The current emotion

        Returns:
            Trend description (improving, deteriorating, stable, fluctuating)
        """
        if not timeline or len(timeline) < 3:
            return "stable"  # Default to stable if not enough data

        # Simplified emotion valence (positivity/negativity)
        valence = {
            "فرح": 1.0,    # Joy (positive)
            "حياد": 0.0,   # Neutral
            "حزن": -1.0,   # Sadness (negative)
            "غضب": -0.8,   # Anger (negative)
            "خوف": -0.6    # Fear (negative)
        }

        # Calculate average valence for first half and second half of timeline
        half_point = len(timeline) // 2
        first_half = timeline[:half_point]
        second_half = timeline[half_point:]

        first_valence = sum(valence.get(record["emotion"], 0) for record in first_half) / len(first_half)
        second_valence = sum(valence.get(record["emotion"], 0) for record in second_half) / len(second_half)

        # Determine trend
        if abs(second_valence - first_valence) < 0.3:
            # Check for fluctuations
            emotions = [record["emotion"] for record in timeline[-5:]]
            unique_emotions = len(set(emotions))
            if unique_emotions >= 3:
                return "fluctuating"
            else:
                return "stable"
        elif second_valence > first_valence:
            return "improving"
        else:
            return "deteriorating"

    def determine_reaction_strategy(self, emotional_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determine the best reaction strategy based on emotional context

        Args:
            emotional_context: The emotional context analysis

        Returns:
            Dictionary with selected reaction strategies and parameters
        """
        current_emotion = emotional_context["current_emotion"]
        intensity = emotional_context["intensity"]
        stability = emotional_context["stability"]
        trend = emotional_context["trend"]

        # Get base reaction for this emotion
        base_reaction = self.emotion_reactions.get(current_emotion, self.emotion_reactions["حياد"])

        # Get primary and secondary strategies
        primary_strategy = base_reaction["primary_strategy"]
        secondary_strategy = base_reaction["secondary_strategy"]

        # Adjust strategies based on emotional context
        if trend == "deteriorating" and stability < 0.5:
            # For deteriorating and unstable emotions, prioritize stabilizing strategies
            if current_emotion in ["حزن", "غضب", "خوف"]:  # Negative emotions
                primary_strategy = "reassure"
                secondary_strategy = "acknowledge"
        elif trend == "improving":
            # For improving emotions, amplify the positive trend
            if current_emotion == "فرح":  # Joy
                primary_strategy = "amplify"
            elif current_emotion in ["حزن", "غضب", "خوف"]:  # Negative emotions improving
                primary_strategy = "encourage"

        # Adjust tone based on intensity
        tone = base_reaction["tone"]
        if intensity > 0.7 and current_emotion in ["غضب", "خوف"]:  # High intensity negative emotions
            tone = "gentle"
        elif intensity > 0.7 and current_emotion == "فرح":  # High intensity joy
            tone = "enthusiastic"

        # Determine if we should ask a question
        question_likelihood = base_reaction["question_likelihood"]
        # Adjust question likelihood based on stability
        if stability < 0.5:
            question_likelihood *= 0.7  # Reduce questions for unstable emotions

        return {
            "primary_strategy": primary_strategy,
            "secondary_strategy": secondary_strategy,
            "tone": tone,
            "intensity_level": emotional_context["intensity_level"],
            "ask_question": question_likelihood > 0.5,
            "response_length": base_reaction["response_length"]
        }

    def generate_emotional_response(self, user_input: str, context: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Generate a response based on emotional analysis

        Args:
            user_input: The user's input text
            context: Context information for the response
            session_id: The session identifier for emotion tracking

        Returns:
            Dictionary with response text and metadata
        """
        # Analyze emotional context
        emotional_context = self.analyze_emotional_context(user_input, session_id)

        # Determine reaction strategy
        reaction = self.determine_reaction_strategy(emotional_context)

        # Get strategy templates
        primary_strategy = reaction["primary_strategy"]
        secondary_strategy = reaction["secondary_strategy"]

        primary_templates = self.reaction_strategies[primary_strategy]["templates"]
        secondary_templates = self.reaction_strategies[secondary_strategy]["templates"]

        # Select templates
        import random
        primary_template = random.choice(primary_templates)
        secondary_template = random.choice(secondary_templates)

        # Fill in template placeholders
        emotion = emotional_context["current_emotion"]
        intensity_level = reaction["intensity_level"]
        emotion_intensity = random.choice(self.intensity_levels[intensity_level])

        primary_text = primary_template.format(
            emotion=emotion,
            emotion_intensity=emotion_intensity,
            context=context
        )

        secondary_text = secondary_template.format(
            emotion=emotion,
            emotion_intensity=emotion_intensity,
            context=context
        )

        # Combine responses based on strategy
        if reaction["response_length"] == "brief":
            response_text = primary_text
        elif reaction["response_length"] == "moderate":
            response_text = f"{primary_text} {secondary_text}"
        else:  # balanced or verbose
            response_text = f"{primary_text} {secondary_text}"

            # Add a question if appropriate
            if reaction["ask_question"]:
                questions = [
                    "كيف يمكنني مساعدتك أكثر؟",
                    "هل هناك شيء محدد تود التحدث عنه؟",
                    "ما رأيك في هذا؟"
                ]
                response_text += f" {random.choice(questions)}"

        return {
            "text": response_text,
            "emotion": emotional_context["current_emotion"],
            "intensity": emotional_context["intensity"],
            "primary_strategy": primary_strategy,
            "secondary_strategy": secondary_strategy,
            "tone": reaction["tone"],
            "emotional_context": emotional_context
        }

    def process_feedback(self, session_id: str, response_data: Dict[str, Any], feedback_score: float):
        """
        Process feedback on an emotional response to improve future responses

        Args:
            session_id: The session identifier
            response_data: The response data that received feedback
            feedback_score: Feedback score (-1.0 to 1.0)
        """
        if not response_data:
            return

        # Extract strategies and emotion from response data
        primary_strategy = response_data.get("primary_strategy")
        secondary_strategy = response_data.get("secondary_strategy")
        emotion = response_data.get("emotion")

        if not primary_strategy or not emotion:
            return

        # Update strategy effectiveness
        effectiveness = self.emotion_response_data["strategy_effectiveness"]

        # Initialize if needed
        if primary_strategy not in effectiveness:
            effectiveness[primary_strategy] = {}
        if secondary_strategy not in effectiveness:
            effectiveness[secondary_strategy] = {}

        # Update primary strategy effectiveness
        current_score = effectiveness[primary_strategy].get(emotion, 0.5)
        effectiveness[primary_strategy][emotion] = current_score * 0.9 + (0.5 + feedback_score/2) * 0.1

        # Update secondary strategy effectiveness (with less weight)
        current_score = effectiveness[secondary_strategy].get(emotion, 0.5)
        effectiveness[secondary_strategy][emotion] = current_score * 0.95 + (0.5 + feedback_score/2) * 0.05

        # Record feedback in history
        if session_id not in self.emotion_response_data["feedback_history"]:
            self.emotion_response_data["feedback_history"][session_id] = []

        self.emotion_response_data["feedback_history"][session_id].append({
            "timestamp": datetime.now().isoformat(),
            "emotion": emotion,
            "primary_strategy": primary_strategy,
            "secondary_strategy": secondary_strategy,
            "feedback_score": feedback_score
        })

        # Save updated data
        self.save_response_data()

    def get_emotion_statistics(self, session_id: str = None) -> Dict[str, Any]:
        """
        Get statistics about emotional responses and effectiveness

        Args:
            session_id: Optional session identifier to filter statistics

        Returns:
            Dictionary with emotion statistics
        """
        # Get all feedback history or filter by session
        feedback_history = []
        if session_id and session_id in self.emotion_response_data["feedback_history"]:
            feedback_history = self.emotion_response_data["feedback_history"][session_id]
        else:
            for session, history in self.emotion_response_data["feedback_history"].items():
                feedback_history.extend(history)

        # Count emotions
        emotion_counts = {}
        for record in feedback_history:
            emotion = record.get("emotion", "unknown")
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1

        # Calculate average feedback by emotion
        emotion_feedback = {}
        for emotion in emotion_counts:
            relevant_feedback = [r["feedback_score"] for r in feedback_history if r.get("emotion") == emotion]
            if relevant_feedback:
                emotion_feedback[emotion] = sum(relevant_feedback) / len(relevant_feedback)
            else:
                emotion_feedback[emotion] = 0

        # Calculate strategy effectiveness
        strategy_effectiveness = {}
        for strategy in self.emotion_response_data["strategy_effectiveness"]:
            strategy_effectiveness[strategy] = {}
            for emotion, score in self.emotion_response_data["strategy_effectiveness"][strategy].items():
                strategy_effectiveness[strategy][emotion] = score

        return {
            "emotion_counts": emotion_counts,
            "emotion_feedback": emotion_feedback,
            "strategy_effectiveness": strategy_effectiveness,
            "total_interactions": len(feedback_history)
        }
