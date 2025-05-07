"""
Emotional Motivation System for Mashaaer

This module implements an intelligent motivation system that:
1. Analyzes emotional patterns over time
2. Identifies recurring emotions and emotional triggers
3. Generates motivational suggestions based on emotional patterns
4. Provides personalized interventions for emotional well-being

The system can generate suggestions for:
- Emotional regulation techniques
- Mindfulness and meditation exercises
- Physical activities to improve mood
- Social connection opportunities
- Cognitive reframing strategies
"""

import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta

from emotional_memory import get_emotion_timeline, get_last_emotion
from memory_store import MemoryStore
from emotion_engine import detect_emotion, get_emotion_in_language

class EmotionalMotivationSystem:
    """
    Implements an intelligent motivation system based on emotional patterns.
    
    This class analyzes emotional patterns over time and generates
    motivational suggestions based on recurring emotions.
    """
    
    def __init__(self, memory_store: Optional[MemoryStore] = None):
        """
        Initialize the emotional motivation system.
        
        Args:
            memory_store: Optional memory store for accessing emotional memories
        """
        self.memory_store = memory_store
        self.config = self._load_config()
        
        # Emotion categories for analysis
        self.emotion_categories = {
            "happiness": {
                "arabic": "فرح",
                "valence": 1.0,
                "activation": 0.7
            },
            "sadness": {
                "arabic": "حزن",
                "valence": -1.0,
                "activation": -0.5
            },
            "anger": {
                "arabic": "غضب",
                "valence": -0.8,
                "activation": 0.8
            },
            "fear": {
                "arabic": "خوف",
                "valence": -0.7,
                "activation": 0.5
            },
            "neutral": {
                "arabic": "حياد",
                "valence": 0.0,
                "activation": 0.0
            }
        }
        
        # Motivation suggestion templates
        self.suggestion_templates = {
            "recurring_negative": {
                "ar": [
                    "لاحظت أنك تشعر بـ{emotion} بشكل متكرر. جرب {technique} للمساعدة في تحسين مزاجك.",
                    "يبدو أنك تمر بفترة من {emotion}. قد يساعدك {technique} في التعامل مع هذه المشاعر.",
                    "عندما تشعر بـ{emotion} بشكل متكرر، يمكن أن يكون {technique} مفيدًا للغاية."
                ],
                "en": [
                    "I've noticed you've been feeling {emotion} frequently. Try {technique} to help improve your mood.",
                    "It seems you're going through a period of {emotion}. {technique} might help you deal with these feelings.",
                    "When you experience recurring {emotion}, {technique} can be very helpful."
                ]
            },
            "emotional_transition": {
                "ar": [
                    "لاحظت أنك غالبًا ما تنتقل من {emotion1} إلى {emotion2}. يمكن أن يساعدك {technique} في إدارة هذا التحول.",
                    "عندما تتغير مشاعرك من {emotion1} إلى {emotion2}، جرب {technique} للحفاظ على توازنك العاطفي.",
                    "التحول من {emotion1} إلى {emotion2} شائع. {technique} قد يساعدك على التعامل معه بشكل أفضل."
                ],
                "en": [
                    "I've noticed you often transition from {emotion1} to {emotion2}. {technique} can help you manage this shift.",
                    "When your emotions change from {emotion1} to {emotion2}, try {technique} to maintain your emotional balance.",
                    "The shift from {emotion1} to {emotion2} is common. {technique} may help you handle it better."
                ]
            },
            "emotional_trigger": {
                "ar": [
                    "يبدو أن {trigger} غالبًا ما يسبب شعورك بـ{emotion}. قد يساعدك {technique} في التعامل مع هذا الموقف.",
                    "لاحظت أن {trigger} يمكن أن يثير {emotion}. جرب {technique} في المرة القادمة التي تواجه فيها هذا.",
                    "عندما يسبب {trigger} شعورك بـ{emotion}، يمكن أن يكون {technique} استراتيجية مفيدة."
                ],
                "en": [
                    "It seems that {trigger} often causes you to feel {emotion}. {technique} might help you deal with this situation.",
                    "I've noticed that {trigger} can trigger {emotion}. Try {technique} the next time you encounter this.",
                    "When {trigger} causes you to feel {emotion}, {technique} can be a useful strategy."
                ]
            },
            "emotional_pattern": {
                "ar": [
                    "لاحظت نمطًا في مشاعرك: {pattern}. قد يساعدك {technique} في تحسين رفاهيتك العاطفية.",
                    "هناك نمط يظهر في مشاعرك: {pattern}. جرب {technique} لتعزيز صحتك العاطفية.",
                    "بناءً على أنماط مشاعرك ({pattern})، قد يكون {technique} مفيدًا لك."
                ],
                "en": [
                    "I've noticed a pattern in your emotions: {pattern}. {technique} might help improve your emotional well-being.",
                    "There's a pattern emerging in your emotions: {pattern}. Try {technique} to enhance your emotional health.",
                    "Based on your emotional patterns ({pattern}), {technique} might be beneficial for you."
                ]
            },
            "positive_reinforcement": {
                "ar": [
                    "رائع أن ترى {emotion} في مشاعرك! استمر في {technique} للحفاظ على هذه المشاعر الإيجابية.",
                    "من الجميل رؤية {emotion} في حياتك. {technique} يمكن أن يساعدك في تعزيز هذه المشاعر الإيجابية.",
                    "أنت تشعر بـ{emotion} وهذا رائع! واصل ممارسة {technique} للاستمتاع بهذه المشاعر الإيجابية."
                ],
                "en": [
                    "It's great to see {emotion} in your emotions! Keep up with {technique} to maintain these positive feelings.",
                    "It's nice to see {emotion} in your life. {technique} can help you reinforce these positive emotions.",
                    "You're feeling {emotion} and that's wonderful! Continue practicing {technique} to enjoy these positive emotions."
                ]
            }
        }
        
        # Techniques for different emotional states
        self.techniques = {
            "sadness": {
                "ar": [
                    "تمارين التنفس العميق",
                    "المشي في الطبيعة",
                    "التحدث مع صديق مقرب",
                    "كتابة المشاعر في مذكرة",
                    "الاستماع إلى موسيقى مبهجة",
                    "مشاهدة فيلم كوميدي",
                    "ممارسة اليوغا",
                    "قراءة كتاب ملهم"
                ],
                "en": [
                    "deep breathing exercises",
                    "walking in nature",
                    "talking to a close friend",
                    "journaling your feelings",
                    "listening to uplifting music",
                    "watching a comedy",
                    "practicing yoga",
                    "reading an inspiring book"
                ]
            },
            "anger": {
                "ar": [
                    "العد إلى عشرة قبل الرد",
                    "تمارين التنفس العميق",
                    "المشي السريع",
                    "كتابة مشاعرك دون رقابة",
                    "ممارسة تمارين الاسترخاء",
                    "الابتعاد مؤقتًا عن الموقف",
                    "التحدث مع شخص محايد",
                    "تمارين التأمل"
                ],
                "en": [
                    "counting to ten before responding",
                    "deep breathing exercises",
                    "brisk walking",
                    "writing your feelings without censorship",
                    "practicing relaxation exercises",
                    "temporarily stepping away from the situation",
                    "talking to a neutral person",
                    "meditation exercises"
                ]
            },
            "fear": {
                "ar": [
                    "تمارين التنفس العميق",
                    "تقنية 5-4-3-2-1 للتأريض",
                    "تحدي الأفكار السلبية",
                    "التركيز على اللحظة الحالية",
                    "تمارين الاسترخاء العضلي",
                    "تخيل نتيجة إيجابية",
                    "التحدث مع شخص تثق به",
                    "تدوين مخاوفك"
                ],
                "en": [
                    "deep breathing exercises",
                    "the 5-4-3-2-1 grounding technique",
                    "challenging negative thoughts",
                    "focusing on the present moment",
                    "progressive muscle relaxation",
                    "visualizing a positive outcome",
                    "talking to someone you trust",
                    "writing down your fears"
                ]
            },
            "happiness": {
                "ar": [
                    "ممارسة الامتنان",
                    "مشاركة سعادتك مع الآخرين",
                    "تدوين اللحظات السعيدة",
                    "التخطيط لنشاط ممتع",
                    "قضاء الوقت في الطبيعة",
                    "ممارسة هواية تحبها",
                    "التواصل مع الأصدقاء",
                    "الاحتفال بالإنجازات الصغيرة"
                ],
                "en": [
                    "practicing gratitude",
                    "sharing your happiness with others",
                    "journaling happy moments",
                    "planning a fun activity",
                    "spending time in nature",
                    "engaging in a hobby you love",
                    "connecting with friends",
                    "celebrating small achievements"
                ]
            },
            "neutral": {
                "ar": [
                    "تجربة شيء جديد",
                    "ممارسة التأمل",
                    "تحديد أهداف جديدة",
                    "قراءة كتاب ملهم",
                    "تعلم مهارة جديدة",
                    "إعادة ترتيب مساحتك",
                    "التخطيط لنشاط ممتع",
                    "التواصل مع صديق قديم"
                ],
                "en": [
                    "trying something new",
                    "practicing mindfulness",
                    "setting new goals",
                    "reading an inspiring book",
                    "learning a new skill",
                    "reorganizing your space",
                    "planning a fun activity",
                    "reaching out to an old friend"
                ]
            }
        }
        
        # Common emotional triggers
        self.common_triggers = {
            "ar": [
                "العمل", "العلاقات", "المال", "الصحة", "الأسرة", 
                "الدراسة", "المستقبل", "الماضي", "التغيير", "الضغط"
            ],
            "en": [
                "work", "relationships", "money", "health", "family", 
                "studies", "future", "past", "change", "pressure"
            ]
        }
    
    def _load_config(self) -> Dict:
        """
        Load configuration from file or use defaults.
        
        Returns:
            Dictionary containing configuration
        """
        config_path = 'data/emotional_motivation_config.json'
        try:
            if os.path.exists(config_path):
                with open(config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Default configuration
                return {
                    "suggestion_frequency": 0.3,  # How often to generate suggestions (0-1)
                    "analysis_depth": "medium",  # How far back to analyze (shallow, medium, deep)
                    "suggestion_threshold": 0.7,  # Minimum confidence to generate a suggestion
                    "max_suggestions_per_session": 3,  # Maximum suggestions per session
                    "cooldown_period": 24  # Hours between suggestions for the same pattern
                }
        except Exception as e:
            print(f"Error loading emotional motivation config: {e}")
            # Fallback to minimal default config
            return {
                "suggestion_frequency": 0.3,
                "analysis_depth": "medium",
                "suggestion_threshold": 0.7,
                "max_suggestions_per_session": 3,
                "cooldown_period": 24
            }
    
    def analyze_emotional_patterns(self, session_id: str) -> Dict[str, Any]:
        """
        Analyze emotional patterns for a given session.
        
        Args:
            session_id: The session identifier
            
        Returns:
            Dictionary containing analysis results
        """
        # Get emotion timeline
        timeline = get_emotion_timeline(session_id)
        
        if not timeline or len(timeline) < 3:
            return {
                "recurring_emotions": {},
                "emotional_transitions": [],
                "potential_triggers": {},
                "patterns": [],
                "confidence": 0.0
            }
        
        # Standardize emotions in timeline
        standardized_timeline = []
        for record in timeline:
            emotion = record.get("emotion", "neutral")
            # Convert Arabic emotion names to standardized format if needed
            if emotion in ["حزن", "فرح", "غضب", "خوف", "حياد"]:
                emotion_map = {
                    "حزن": "sadness",
                    "فرح": "happiness",
                    "غضب": "anger",
                    "خوف": "fear",
                    "حياد": "neutral"
                }
                emotion = emotion_map.get(emotion, "neutral")
            
            standardized_timeline.append({
                "emotion": emotion,
                "text": record.get("text", ""),
                "timestamp": record.get("timestamp", "")
            })
        
        # Identify recurring emotions
        recurring_emotions = self._identify_recurring_emotions(standardized_timeline)
        
        # Identify emotional transitions
        emotional_transitions = self._identify_emotional_transitions(standardized_timeline)
        
        # Identify potential triggers
        potential_triggers = self._identify_potential_triggers(standardized_timeline)
        
        # Identify patterns
        patterns = self._identify_patterns(standardized_timeline, recurring_emotions, emotional_transitions)
        
        # Calculate confidence based on amount of data
        confidence = min(1.0, len(standardized_timeline) / 10)
        
        return {
            "recurring_emotions": recurring_emotions,
            "emotional_transitions": emotional_transitions,
            "potential_triggers": potential_triggers,
            "patterns": patterns,
            "confidence": confidence
        }
    
    def _identify_recurring_emotions(self, timeline: List[Dict]) -> Dict[str, float]:
        """
        Identify recurring emotions in the timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Dictionary mapping emotions to their frequency
        """
        emotion_counts = {}
        total_records = len(timeline)
        
        for record in timeline:
            emotion = record["emotion"]
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1
        
        # Calculate frequency
        emotion_frequency = {}
        for emotion, count in emotion_counts.items():
            emotion_frequency[emotion] = count / total_records
        
        # Filter to emotions that occur more than 20% of the time
        recurring_emotions = {e: f for e, f in emotion_frequency.items() if f >= 0.2}
        
        return recurring_emotions
    
    def _identify_emotional_transitions(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Identify common emotional transitions in the timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of emotional transitions with frequency
        """
        transitions = {}
        
        for i in range(1, len(timeline)):
            prev_emotion = timeline[i-1]["emotion"]
            curr_emotion = timeline[i]["emotion"]
            
            if prev_emotion != curr_emotion:
                transition_key = f"{prev_emotion}_to_{curr_emotion}"
                if transition_key not in transitions:
                    transitions[transition_key] = {
                        "from": prev_emotion,
                        "to": curr_emotion,
                        "count": 0
                    }
                transitions[transition_key]["count"] += 1
        
        # Convert to list and sort by count
        transition_list = list(transitions.values())
        transition_list.sort(key=lambda x: x["count"], reverse=True)
        
        return transition_list[:3]  # Return top 3 transitions
    
    def _identify_potential_triggers(self, timeline: List[Dict]) -> Dict[str, Dict[str, Any]]:
        """
        Identify potential triggers for emotions.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Dictionary mapping emotions to potential triggers
        """
        triggers = {}
        
        for record in timeline:
            emotion = record["emotion"]
            text = record["text"].lower()
            
            if emotion not in triggers:
                triggers[emotion] = {}
            
            # Check for common triggers in text
            for language, trigger_list in self.common_triggers.items():
                for trigger in trigger_list:
                    if trigger.lower() in text:
                        if trigger not in triggers[emotion]:
                            triggers[emotion][trigger] = 0
                        triggers[emotion][trigger] += 1
        
        # Filter and sort triggers
        filtered_triggers = {}
        for emotion, emotion_triggers in triggers.items():
            if emotion_triggers:
                # Sort by frequency
                sorted_triggers = sorted(emotion_triggers.items(), key=lambda x: x[1], reverse=True)
                filtered_triggers[emotion] = {
                    "triggers": [t[0] for t in sorted_triggers[:3]],  # Top 3 triggers
                    "confidence": min(1.0, sum(emotion_triggers.values()) / 5)  # Confidence based on occurrences
                }
        
        return filtered_triggers
    
    def _identify_patterns(self, timeline: List[Dict], recurring_emotions: Dict[str, float], 
                          emotional_transitions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identify emotional patterns based on recurring emotions and transitions.
        
        Args:
            timeline: List of emotion records
            recurring_emotions: Dictionary of recurring emotions
            emotional_transitions: List of emotional transitions
            
        Returns:
            List of identified patterns
        """
        patterns = []
        
        # Pattern 1: Persistent negative emotion
        for emotion, frequency in recurring_emotions.items():
            if emotion in ["sadness", "anger", "fear"] and frequency >= 0.3:
                patterns.append({
                    "type": "persistent_negative",
                    "emotion": emotion,
                    "frequency": frequency,
                    "confidence": frequency
                })
        
        # Pattern 2: Emotional volatility (frequent transitions)
        if len(emotional_transitions) >= 2:
            total_transitions = sum(t["count"] for t in emotional_transitions)
            if total_transitions >= 3:
                patterns.append({
                    "type": "emotional_volatility",
                    "transitions": emotional_transitions[:2],  # Top 2 transitions
                    "confidence": min(1.0, total_transitions / 5)
                })
        
        # Pattern 3: Positive trend (increasing positive emotions)
        positive_count_first_half = 0
        positive_count_second_half = 0
        half_point = len(timeline) // 2
        
        for i, record in enumerate(timeline):
            if record["emotion"] == "happiness":
                if i < half_point:
                    positive_count_first_half += 1
                else:
                    positive_count_second_half += 1
        
        if positive_count_second_half > positive_count_first_half:
            positive_trend_confidence = (positive_count_second_half - positive_count_first_half) / max(1, half_point)
            if positive_trend_confidence >= 0.2:
                patterns.append({
                    "type": "positive_trend",
                    "confidence": positive_trend_confidence
                })
        
        # Pattern 4: Negative trend (increasing negative emotions)
        negative_count_first_half = 0
        negative_count_second_half = 0
        
        for i, record in enumerate(timeline):
            if record["emotion"] in ["sadness", "anger", "fear"]:
                if i < half_point:
                    negative_count_first_half += 1
                else:
                    negative_count_second_half += 1
        
        if negative_count_second_half > negative_count_first_half:
            negative_trend_confidence = (negative_count_second_half - negative_count_first_half) / max(1, half_point)
            if negative_trend_confidence >= 0.2:
                patterns.append({
                    "type": "negative_trend",
                    "confidence": negative_trend_confidence
                })
        
        return patterns
    
    def generate_suggestions(self, session_id: str, language: str = "ar") -> List[Dict[str, Any]]:
        """
        Generate motivational suggestions based on emotional patterns.
        
        Args:
            session_id: The session identifier
            language: The language for suggestions (ar, en)
            
        Returns:
            List of motivational suggestions
        """
        # Analyze emotional patterns
        analysis = self.analyze_emotional_patterns(session_id)
        
        # Check if we have enough data and confidence
        if analysis["confidence"] < self.config["suggestion_threshold"]:
            return []
        
        suggestions = []
        
        # Generate suggestions based on patterns
        for pattern in analysis["patterns"]:
            if pattern["confidence"] >= self.config["suggestion_threshold"]:
                suggestion = self._generate_suggestion_for_pattern(pattern, analysis, language)
                if suggestion:
                    suggestions.append(suggestion)
        
        # Generate suggestions based on recurring emotions
        for emotion, frequency in analysis["recurring_emotions"].items():
            if frequency >= self.config["suggestion_threshold"]:
                suggestion = self._generate_suggestion_for_emotion(emotion, frequency, analysis, language)
                if suggestion:
                    suggestions.append(suggestion)
        
        # Generate suggestions based on emotional transitions
        for transition in analysis["emotional_transitions"]:
            if transition["count"] >= 2:  # At least 2 occurrences
                suggestion = self._generate_suggestion_for_transition(transition, analysis, language)
                if suggestion:
                    suggestions.append(suggestion)
        
        # Limit the number of suggestions
        max_suggestions = self.config["max_suggestions_per_session"]
        if len(suggestions) > max_suggestions:
            # Sort by confidence and take top N
            suggestions.sort(key=lambda x: x["confidence"], reverse=True)
            suggestions = suggestions[:max_suggestions]
        
        return suggestions
    
    def _generate_suggestion_for_pattern(self, pattern: Dict[str, Any], analysis: Dict[str, Any], 
                                        language: str) -> Optional[Dict[str, Any]]:
        """
        Generate a suggestion for an emotional pattern.
        
        Args:
            pattern: The emotional pattern
            analysis: The full emotional analysis
            language: The language for the suggestion
            
        Returns:
            A suggestion or None if no appropriate suggestion can be generated
        """
        import random
        
        if pattern["type"] == "persistent_negative":
            emotion = pattern["emotion"]
            emotion_display = self._get_emotion_display(emotion, language)
            
            # Get a random technique for this emotion
            techniques = self.techniques.get(emotion, self.techniques["neutral"])
            technique = random.choice(techniques[language])
            
            # Get a template for recurring negative emotions
            templates = self.suggestion_templates["recurring_negative"][language]
            template = random.choice(templates)
            
            # Format the suggestion
            suggestion_text = template.format(emotion=emotion_display, technique=technique)
            
            return {
                "type": "emotional_regulation",
                "text": suggestion_text,
                "emotion": emotion,
                "technique": technique,
                "confidence": pattern["confidence"]
            }
        
        elif pattern["type"] == "emotional_volatility":
            # Get the most frequent transition
            transition = pattern["transitions"][0]
            emotion1 = self._get_emotion_display(transition["from"], language)
            emotion2 = self._get_emotion_display(transition["to"], language)
            
            # Get a random technique for the target emotion
            techniques = self.techniques.get(transition["to"], self.techniques["neutral"])
            technique = random.choice(techniques[language])
            
            # Get a template for emotional transitions
            templates = self.suggestion_templates["emotional_transition"][language]
            template = random.choice(templates)
            
            # Format the suggestion
            suggestion_text = template.format(emotion1=emotion1, emotion2=emotion2, technique=technique)
            
            return {
                "type": "emotional_transition",
                "text": suggestion_text,
                "from_emotion": transition["from"],
                "to_emotion": transition["to"],
                "technique": technique,
                "confidence": pattern["confidence"]
            }
        
        elif pattern["type"] == "positive_trend":
            # Get a random positive emotion
            emotion = "happiness"
            emotion_display = self._get_emotion_display(emotion, language)
            
            # Get a random technique for this emotion
            techniques = self.techniques[emotion][language]
            technique = random.choice(techniques)
            
            # Get a template for positive reinforcement
            templates = self.suggestion_templates["positive_reinforcement"][language]
            template = random.choice(templates)
            
            # Format the suggestion
            suggestion_text = template.format(emotion=emotion_display, technique=technique)
            
            return {
                "type": "positive_reinforcement",
                "text": suggestion_text,
                "emotion": emotion,
                "technique": technique,
                "confidence": pattern["confidence"]
            }
        
        elif pattern["type"] == "negative_trend":
            # Get a random negative emotion
            emotions = ["sadness", "anger", "fear"]
            emotion = random.choice(emotions)
            emotion_display = self._get_emotion_display(emotion, language)
            
            # Get a random technique for this emotion
            techniques = self.techniques[emotion][language]
            technique = random.choice(techniques)
            
            # Get a template for recurring negative emotions
            templates = self.suggestion_templates["recurring_negative"][language]
            template = random.choice(templates)
            
            # Format the suggestion
            suggestion_text = template.format(emotion=emotion_display, technique=technique)
            
            return {
                "type": "emotional_regulation",
                "text": suggestion_text,
                "emotion": emotion,
                "technique": technique,
                "confidence": pattern["confidence"]
            }
        
        return None
    
    def _generate_suggestion_for_emotion(self, emotion: str, frequency: float, analysis: Dict[str, Any], 
                                        language: str) -> Optional[Dict[str, Any]]:
        """
        Generate a suggestion for a recurring emotion.
        
        Args:
            emotion: The recurring emotion
            frequency: The frequency of the emotion
            analysis: The full emotional analysis
            language