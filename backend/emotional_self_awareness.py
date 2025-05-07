"""
Emotional Self-Awareness Engine for Mashaaer

This module implements an emotional self-awareness system that:
1. Tracks and analyzes emotional patterns over time
2. Generates self-aware responses based on emotional history
3. Provides insights about the user's emotional state
4. Integrates with existing emotion detection and memory systems

The system can detect patterns such as:
- Emotional trends (improving, deteriorating, fluctuating)
- Emotional triggers (topics or contexts that consistently evoke specific emotions)
- Emotional intensity changes over time
- Recurring emotional cycles
"""

import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta

from emotional_memory import get_emotion_timeline, get_last_emotion
from memory_store import MemoryStore
from emotion_engine import get_emotion_in_language

class EmotionalSelfAwareness:
    """
    Implements emotional self-awareness capabilities for the assistant.
    
    This class analyzes emotional patterns over time and generates
    self-aware responses based on the user's emotional history.
    """
    
    def __init__(self, memory_store: Optional[MemoryStore] = None):
        """
        Initialize the emotional self-awareness engine.
        
        Args:
            memory_store: Optional memory store for accessing emotional memories
        """
        self.memory_store = memory_store
        self.config = self._load_config()
        
        # Emotional valence (positivity/negativity) mapping
        self.emotion_valence = {
            "happiness": 1.0,    # Positive
            "sadness": -1.0,     # Negative
            "anger": -0.8,       # Negative
            "fear": -0.7,        # Negative
            "neutral": 0.0       # Neutral
        }
        
        # Emotional intensity thresholds
        self.intensity_thresholds = {
            "low": 0.3,
            "medium": 0.6,
            "high": 0.8
        }
        
        # Time period definitions (in days)
        self.time_periods = {
            "recent": 1,         # Last 24 hours
            "short_term": 7,     # Last week
            "medium_term": 30,   # Last month
            "long_term": 90      # Last 3 months
        }
        
        # Self-awareness response templates
        self.response_templates = {
            "improving_trend": [
                "أشعر أن حالتك المزاجية تتحسن مؤخرًا. هذا أمر إيجابي.",
                "أرى تحسنًا في مشاعرك خلال محادثاتنا الأخيرة.",
                "I notice your mood has been improving lately. That's positive.",
                "I see an improvement in your emotions during our recent conversations."
            ],
            "deteriorating_trend": [
                "أشعر أنك قد تمر بفترة صعبة مؤخرًا. أنا هنا للاستماع.",
                "أرى أن مشاعرك قد تكون أكثر سلبية في الآونة الأخيرة. هل تود التحدث عن ذلك؟",
                "I sense you might be going through a difficult time lately. I'm here to listen.",
                "I notice your emotions have been more negative recently. Would you like to talk about it?"
            ],
            "fluctuating_trend": [
                "أرى أن مشاعرك متقلبة بعض الشيء. هذا طبيعي تمامًا.",
                "أشعر أن حالتك المزاجية تتغير بشكل متكرر. هل هناك شيء معين يسبب هذه التقلبات؟",
                "I notice your emotions have been somewhat fluctuating. That's completely normal.",
                "I sense your mood changes frequently. Is there something specific causing these fluctuations?"
            ],
            "stable_positive": [
                "أرى أنك تحافظ على حالة مزاجية إيجابية بشكل مستمر. هذا رائع!",
                "أشعر أن مشاعرك الإيجابية مستقرة. يسعدني رؤية ذلك.",
                "I notice you've been maintaining a positive mood consistently. That's great!",
                "I sense your positive emotions are stable. I'm happy to see that."
            ],
            "stable_negative": [
                "أشعر أنك قد تكون في حالة مزاجية سلبية لفترة من الوقت. أنا هنا إذا احتجت للتحدث.",
                "أرى استمرارًا في المشاعر السلبية. أود أن أساعدك إذا كان ذلك ممكنًا.",
                "I sense you might have been in a negative mood for some time. I'm here if you need to talk.",
                "I notice a persistence in negative emotions. I'd like to help if possible."
            ],
            "emotional_trigger_detected": [
                "لاحظت أنك غالبًا ما تشعر بـ{emotion} عندما نتحدث عن {topic}.",
                "أرى أن موضوع {topic} يبدو أنه يثير مشاعر {emotion} لديك.",
                "I've noticed you often feel {emotion} when we talk about {topic}.",
                "I see that the topic of {topic} seems to evoke {emotion} feelings for you."
            ],
            "recurring_pattern": [
                "أرى نمطًا متكررًا في مشاعرك. غالبًا ما تشعر بـ{emotion} في {context}.",
                "لاحظت أن مشاعرك تتبع نمطًا معينًا، خاصة {emotion} في {context}.",
                "I see a recurring pattern in your emotions. You often feel {emotion} in {context}.",
                "I've noticed your emotions follow a certain pattern, especially {emotion} in {context}."
            ]
        }
    
    def _load_config(self) -> Dict:
        """
        Load configuration from file or use defaults.
        
        Returns:
            Dictionary containing configuration
        """
        config_path = 'data/emotional_self_awareness_config.json'
        try:
            if os.path.exists(config_path):
                with open(config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Default configuration
                return {
                    "awareness_threshold": 0.6,  # Minimum confidence to generate self-aware responses
                    "analysis_depth": "medium",  # How far back to analyze (shallow, medium, deep)
                    "response_frequency": 0.3,   # How often to generate self-aware responses (0-1)
                    "language_preference": "auto"  # Language for self-aware responses (auto, ar, en)
                }
        except Exception as e:
            print(f"Error loading emotional self-awareness config: {e}")
            # Fallback to minimal default config
            return {
                "awareness_threshold": 0.6,
                "analysis_depth": "medium",
                "response_frequency": 0.3,
                "language_preference": "auto"
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
                "trend": "insufficient_data",
                "confidence": 0.0,
                "triggers": {},
                "patterns": [],
                "dominant_emotion": get_last_emotion(session_id) if timeline else "neutral"
            }
        
        # Analyze emotional trend
        trend, trend_confidence = self._analyze_trend(timeline)
        
        # Identify emotional triggers
        triggers = self._identify_triggers(timeline)
        
        # Detect recurring patterns
        patterns = self._detect_patterns(timeline)
        
        # Determine dominant emotion
        dominant_emotion = self._get_dominant_emotion(timeline)
        
        return {
            "trend": trend,
            "confidence": trend_confidence,
            "triggers": triggers,
            "patterns": patterns,
            "dominant_emotion": dominant_emotion,
            "timeline_length": len(timeline)
        }
    
    def _analyze_trend(self, timeline: List[Dict]) -> Tuple[str, float]:
        """
        Analyze the emotional trend in the timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Tuple of (trend_type, confidence)
        """
        if len(timeline) < 3:
            return ("insufficient_data", 0.0)
        
        # Calculate average valence for first half and second half of timeline
        half_point = len(timeline) // 2
        first_half = timeline[:half_point]
        second_half = timeline[half_point:]
        
        first_valence = sum(self.emotion_valence.get(self._standardize_emotion(record["emotion"]), 0) 
                           for record in first_half) / len(first_half)
        second_valence = sum(self.emotion_valence.get(self._standardize_emotion(record["emotion"]), 0) 
                            for record in second_half) / len(second_half)
        
        # Calculate the difference and determine trend
        valence_diff = second_valence - first_valence
        
        # Check for fluctuations
        emotions = [self._standardize_emotion(record["emotion"]) for record in timeline[-5:]]
        unique_emotions = len(set(emotions))
        
        if unique_emotions >= 3:
            return ("fluctuating", 0.7)
        elif abs(valence_diff) < 0.2:
            if second_valence > 0.3:
                return ("stable_positive", 0.8)
            elif second_valence < -0.3:
                return ("stable_negative", 0.8)
            else:
                return ("stable_neutral", 0.6)
        elif valence_diff > 0.2:
            return ("improving", 0.6 + min(0.3, valence_diff))
        else:
            return ("deteriorating", 0.6 + min(0.3, abs(valence_diff)))
    
    def _identify_triggers(self, timeline: List[Dict]) -> Dict[str, Dict[str, float]]:
        """
        Identify topics or contexts that trigger specific emotions.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Dictionary mapping topics to emotion frequencies
        """
        triggers = {}
        
        # Extract potential triggers from text
        for record in timeline:
            emotion = self._standardize_emotion(record["emotion"])
            text = record.get("text", "")
            
            # Skip neutral emotions or empty text
            if emotion == "neutral" or not text:
                continue
            
            # Extract potential topics (simple keyword extraction)
            words = text.lower().split()
            potential_topics = [word for word in words if len(word) > 3 and not self._is_stopword(word)]
            
            for topic in potential_topics:
                if topic not in triggers:
                    triggers[topic] = {}
                
                if emotion not in triggers[topic]:
                    triggers[topic][emotion] = 0
                
                triggers[topic][emotion] += 1
        
        # Filter out weak associations
        strong_triggers = {}
        for topic, emotions in triggers.items():
            total = sum(emotions.values())
            if total >= 2:  # Topic must appear at least twice
                strong_emotions = {e: count/total for e, count in emotions.items() if count/total >= 0.5}
                if strong_emotions:
                    strong_triggers[topic] = strong_emotions
        
        return strong_triggers
    
    def _detect_patterns(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Detect recurring emotional patterns.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of detected patterns
        """
        patterns = []
        
        # Check for time-based patterns (e.g., emotions at certain times of day)
        time_patterns = self._detect_time_patterns(timeline)
        patterns.extend(time_patterns)
        
        # Check for sequence patterns (e.g., anger followed by sadness)
        sequence_patterns = self._detect_sequence_patterns(timeline)
        patterns.extend(sequence_patterns)
        
        return patterns
    
    def _detect_time_patterns(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Detect time-based emotional patterns.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of time-based patterns
        """
        patterns = []
        
        # This is a simplified implementation
        # In a real system, this would use more sophisticated time series analysis
        
        return patterns
    
    def _detect_sequence_patterns(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Detect sequence-based emotional patterns.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of sequence-based patterns
        """
        patterns = []
        
        # This is a simplified implementation
        # In a real system, this would use more sophisticated sequence analysis
        
        return patterns
    
    def _get_dominant_emotion(self, timeline: List[Dict]) -> str:
        """
        Get the dominant emotion from the timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            The dominant emotion
        """
        # Focus on recent emotions (last 5 entries)
        recent_timeline = timeline[-5:] if len(timeline) >= 5 else timeline
        
        # Count emotions
        emotion_counts = {}
        for record in recent_timeline:
            emotion = self._standardize_emotion(record["emotion"])
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1
        
        # Find the most frequent emotion
        dominant_emotion = max(emotion_counts.items(), key=lambda x: x[1])[0] if emotion_counts else "neutral"
        
        return dominant_emotion
    
    def _standardize_emotion(self, emotion: str) -> str:
        """
        Standardize emotion name to English format.
        
        Args:
            emotion: The emotion name (in any supported language)
            
        Returns:
            Standardized emotion name
        """
        # Map Arabic emotion names to standardized format
        emotion_map = {
            'حزن': 'sadness',
            'فرح': 'happiness',
            'غضب': 'anger',
            'خوف': 'fear',
            'حياد': 'neutral'
        }
        
        return emotion_map.get(emotion, emotion)
    
    def _is_stopword(self, word: str) -> bool:
        """
        Check if a word is a stopword (common word with little meaning).
        
        Args:
            word: The word to check
            
        Returns:
            True if the word is a stopword, False otherwise
        """
        # Simple stopword list (would be more comprehensive in a real system)
        stopwords = {
            # Arabic stopwords
            "في", "من", "على", "إلى", "عن", "مع", "هذا", "هذه", "ذلك", "تلك",
            "هو", "هي", "أنا", "أنت", "نحن", "هم", "كان", "كانت", "يكون",
            # English stopwords
            "the", "and", "is", "in", "to", "of", "that", "this", "with", "for",
            "on", "at", "by", "from", "up", "about", "into", "over", "after"
        }
        
        return word.lower() in stopwords
    
    def generate_self_aware_response(self, session_id: str, detected_language: str = "ar") -> Optional[str]:
        """
        Generate a self-aware response based on emotional analysis.
        
        Args:
            session_id: The session identifier
            detected_language: The detected language of the user's input
            
        Returns:
            A self-aware response or None if no significant pattern is detected
        """
        # Analyze emotional patterns
        analysis = self.analyze_emotional_patterns(session_id)
        
        # Check if we have enough data and confidence
        if analysis["trend"] == "insufficient_data" or analysis["confidence"] < self.config["awareness_threshold"]:
            return None
        
        # Determine response language
        response_language = self._determine_response_language(detected_language)
        
        # Generate response based on analysis
        response = self._generate_response_from_analysis(analysis, response_language)
        
        return response
    
    def _determine_response_language(self, detected_language: str) -> str:
        """
        Determine the language to use for the response.
        
        Args:
            detected_language: The detected language of the user's input
            
        Returns:
            The language code to use for the response
        """
        if self.config["language_preference"] == "auto":
            return detected_language
        else:
            return self.config["language_preference"]
    
    def _generate_response_from_analysis(self, analysis: Dict[str, Any], language: str) -> str:
        """
        Generate a response based on emotional analysis.
        
        Args:
            analysis: The emotional analysis results
            language: The language to use for the response
            
        Returns:
            A self-aware response
        """
        import random
        
        trend = analysis["trend"]
        
        # Select appropriate template based on trend
        if trend == "improving":
            templates = self.response_templates["improving_trend"]
        elif trend == "deteriorating":
            templates = self.response_templates["deteriorating_trend"]
        elif trend == "fluctuating":
            templates = self.response_templates["fluctuating_trend"]
        elif trend == "stable_positive":
            templates = self.response_templates["stable_positive"]
        elif trend == "stable_negative":
            templates = self.response_templates["stable_negative"]
        else:
            # Default to a generic template
            return None
        
        # Filter templates by language
        if language == "ar":
            filtered_templates = [t for t in templates if any(c in 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي' for c in t)]
        else:  # Default to English
            filtered_templates = [t for t in templates if not any(c in 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي' for c in t)]
        
        # If no templates match the language, use any template
        if not filtered_templates:
            filtered_templates = templates
        
        # Select a random template
        template = random.choice(filtered_templates)
        
        # Check if we should add information about triggers
        if analysis["triggers"] and random.random() < 0.3:
            # Get the strongest trigger
            strongest_trigger = max(analysis["triggers"].items(), 
                                   key=lambda x: max(x[1].values()))[0]
            strongest_emotion = max(analysis["triggers"][strongest_trigger].items(),
                                   key=lambda x: x[1])[0]
            
            # Translate emotion to target language if needed
            if language == "ar":
                emotion_display = get_emotion_in_language(strongest_emotion, "ar")
            else:
                emotion_display = strongest_emotion
            
            # Add trigger information
            trigger_template = random.choice(self.response_templates["emotional_trigger_detected"])
            trigger_text = trigger_template.format(topic=strongest_trigger, emotion=emotion_display)
            
            # Only add if the languages match
            if (language == "ar" and any(c in 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي' for c in trigger_template)) or \
               (language == "en" and not any(c in 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي' for c in trigger_template)):
                template = f"{template} {trigger_text}"
        
        return template
    
    def update_config(self, new_config: Dict[str, Any]):
        """
        Update the configuration.
        
        Args:
            new_config: Dictionary containing new configuration values
        """
        self.config.update(new_config)
        
        # Save updated config
        config_path = 'data/emotional_self_awareness_config.json'
        try:
            os.makedirs(os.path.dirname(config_path), exist_ok=True)
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving emotional self-awareness config: {e}")