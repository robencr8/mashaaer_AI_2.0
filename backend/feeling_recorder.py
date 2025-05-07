import json
import os
from datetime import datetime
import random

class FeelingRecorder:
    """
    Feeling Recorder for Mashaaer
    
    This class records and analyzes the assistant's own feelings during interactions.
    It maintains a record of emotional states and their intensities, allowing the assistant
    to reflect on its own emotional responses and how they evolve over time.
    
    Features:
    - Records emotional states with intensity levels
    - Tracks emotional transitions over time
    - Provides self-reflection on emotional patterns
    - Allows the assistant to express its own feelings about past interactions
    """
    
    def __init__(self):
        """Initialize the feeling recorder"""
        self.feelings_log = []
        self.current_feeling = {
            "emotion": "حياد",  # Neutral
            "intensity": 0.5,    # Medium intensity
            "confidence": 0.8,   # High confidence in this assessment
            "timestamp": datetime.now().isoformat()
        }
        
        # Emotional dimensions that can be tracked
        self.emotional_dimensions = {
            "حنان": 0.5,         # Compassion
            "ثقة": 0.7,          # Confidence
            "فضول": 0.6,         # Curiosity
            "حماس": 0.5,         # Enthusiasm
            "تعاطف": 0.8,        # Empathy
            "صبر": 0.7,          # Patience
            "رضا": 0.6,          # Satisfaction
            "إرهاق": 0.2,        # Fatigue
            "حيرة": 0.3,         # Confusion
            "إحباط": 0.1         # Frustration
        }
        
        # Emotional transitions - how emotions tend to flow from one to another
        self.emotional_transitions = {
            "حماس": ["رضا", "إرهاق", "حيرة"],
            "فضول": ["حماس", "حيرة", "رضا"],
            "تعاطف": ["حنان", "إحباط", "إرهاق"],
            "حنان": ["رضا", "تعاطف", "إرهاق"],
            "ثقة": ["حماس", "رضا", "حيرة"],
            "رضا": ["حماس", "ثقة", "حنان"],
            "إرهاق": ["إحباط", "حيرة", "حياد"],
            "حيرة": ["فضول", "إحباط", "إرهاق"],
            "إحباط": ["حيرة", "إرهاق", "حياد"],
            "حياد": ["فضول", "حماس", "حنان"]
        }
        
        # Load existing feelings log
        self.load_feelings()
    
    def load_feelings(self):
        """Load feelings log from storage file"""
        feelings_path = 'data/feelings_log.json'
        try:
            if os.path.exists(feelings_path):
                with open(feelings_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.feelings_log = data.get('feelings_log', [])
                    
                    # Set current feeling to the most recent one if available
                    if self.feelings_log:
                        self.current_feeling = self.feelings_log[-1]
                        
                    # Load emotional dimensions if available
                    if 'emotional_dimensions' in data:
                        self.emotional_dimensions = data['emotional_dimensions']
        except Exception as e:
            print(f"Error loading feelings log: {e}")
            # Initialize with empty log if loading fails
            self.feelings_log = []
    
    def save_feelings(self):
        """Save feelings log to storage file"""
        feelings_path = 'data/feelings_log.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(feelings_path), exist_ok=True)
            
            data = {
                'feelings_log': self.feelings_log,
                'emotional_dimensions': self.emotional_dimensions
            }
            
            with open(feelings_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving feelings log: {e}")
    
    def record_feeling(self, user_input, system_response, user_emotion=None):
        """
        Record a feeling based on the current interaction
        
        Args:
            user_input (str): The user's input
            system_response (str): The system's response
            user_emotion (str, optional): The detected user emotion
            
        Returns:
            dict: The recorded feeling
        """
        # Analyze the interaction to determine the assistant's feeling
        new_feeling = self._analyze_interaction(user_input, system_response, user_emotion)
        
        # Update emotional dimensions based on the new feeling
        self._update_emotional_dimensions(new_feeling["emotion"], new_feeling["intensity"])
        
        # Add to feelings log
        self.feelings_log.append(new_feeling)
        
        # Update current feeling
        self.current_feeling = new_feeling
        
        # Save feelings log
        self.save_feelings()
        
        return new_feeling
    
    def _analyze_interaction(self, user_input, system_response, user_emotion=None):
        """
        Analyze an interaction to determine the assistant's feeling
        
        Args:
            user_input (str): The user's input
            system_response (str): The system's response
            user_emotion (str, optional): The detected user emotion
            
        Returns:
            dict: The analyzed feeling
        """
        # In a real implementation, this would use more sophisticated analysis
        # For now, we'll use a simplified approach based on:
        # 1. The current emotional state
        # 2. The user's emotion (if available)
        # 3. Simple keyword analysis of the interaction
        
        # Start with the current emotion
        current_emotion = self.current_feeling["emotion"]
        current_intensity = self.current_feeling["intensity"]
        
        # Factors that might influence the emotion
        emotion_factors = []
        
        # 1. Check for emotional keywords in user input
        positive_keywords = ["شكراً", "ممتاز", "رائع", "أحب", "سعيد", "ممتن"]
        negative_keywords = ["غاضب", "حزين", "محبط", "سيء", "فشل", "خطأ"]
        question_keywords = ["كيف", "لماذا", "متى", "أين", "ما", "هل"]
        
        # Count occurrences of different types of keywords
        positive_count = sum(1 for word in positive_keywords if word in user_input.lower())
        negative_count = sum(1 for word in negative_keywords if word in user_input.lower())
        question_count = sum(1 for word in question_keywords if word in user_input.lower())
        
        # 2. Consider user's emotion if available
        if user_emotion:
            # Map user emotions to potential assistant emotions
            user_to_assistant_emotion = {
                "فرح": ["حماس", "رضا", "حنان"],
                "حزن": ["تعاطف", "حنان", "حيرة"],
                "غضب": ["صبر", "حيرة", "إحباط"],
                "خوف": ["حنان", "تعاطف", "ثقة"],
                "دهشة": ["فضول", "حماس", "حيرة"],
                "قلق": ["تعاطف", "حنان", "صبر"],
                "حياد": ["حياد", "فضول", "ثقة"]
            }
            
            potential_emotions = user_to_assistant_emotion.get(user_emotion, ["حياد", "فضول", "ثقة"])
            emotion_factors.extend([(emotion, 0.7) for emotion in potential_emotions])
        
        # 3. Consider the content of the interaction
        if positive_count > negative_count:
            emotion_factors.extend([("رضا", 0.6 * positive_count), ("حماس", 0.5 * positive_count)])
        elif negative_count > positive_count:
            emotion_factors.extend([("تعاطف", 0.6 * negative_count), ("حنان", 0.5 * negative_count)])
        
        if question_count > 0:
            emotion_factors.append(("فضول", 0.5 * question_count))
        
        # 4. Consider length of response as potential indicator of enthusiasm or fatigue
        if len(system_response) > 200:
            emotion_factors.append(("حماس", 0.6))
            emotion_factors.append(("إرهاق", 0.3))
        elif len(system_response) < 50:
            emotion_factors.append(("إرهاق", 0.4))
            emotion_factors.append(("حيرة", 0.3))
        
        # 5. Consider possible emotional transitions from current state
        if current_emotion in self.emotional_transitions:
            potential_transitions = self.emotional_transitions[current_emotion]
            for emotion in potential_transitions:
                emotion_factors.append((emotion, 0.4))
        
        # If we have no factors, maintain current emotion with slight drift
        if not emotion_factors:
            intensity_drift = random.uniform(-0.1, 0.1)
            new_intensity = max(0.1, min(0.9, current_intensity + intensity_drift))
            
            return {
                "emotion": current_emotion,
                "intensity": new_intensity,
                "confidence": 0.6,  # Lower confidence due to lack of factors
                "timestamp": datetime.now().isoformat(),
                "context": {
                    "user_input": user_input[:100] + "..." if len(user_input) > 100 else user_input,
                    "user_emotion": user_emotion,
                    "factors": []
                }
            }
        
        # Calculate the most likely emotion based on factors
        emotion_scores = {}
        for emotion, weight in emotion_factors:
            if emotion not in emotion_scores:
                emotion_scores[emotion] = 0
            emotion_scores[emotion] += weight
        
        # Get the emotion with the highest score
        new_emotion = max(emotion_scores.items(), key=lambda x: x[1])[0]
        
        # Calculate intensity based on the score and current intensity
        max_score = max(emotion_scores.values())
        intensity_change = (max_score / len(emotion_factors)) - 0.5  # Range: -0.5 to 0.5
        new_intensity = max(0.1, min(0.9, current_intensity + intensity_change))
        
        # Calculate confidence based on the clarity of the emotion
        total_score = sum(emotion_scores.values())
        if total_score > 0:
            confidence = max_score / total_score
        else:
            confidence = 0.5
        
        return {
            "emotion": new_emotion,
            "intensity": new_intensity,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat(),
            "context": {
                "user_input": user_input[:100] + "..." if len(user_input) > 100 else user_input,
                "user_emotion": user_emotion,
                "factors": [{"emotion": e, "weight": w} for e, w in emotion_factors]
            }
        }
    
    def _update_emotional_dimensions(self, emotion, intensity):
        """
        Update emotional dimensions based on a new feeling
        
        Args:
            emotion (str): The emotion
            intensity (float): The intensity of the emotion
        """
        # Map emotions to dimensional changes
        emotion_dimension_map = {
            "حنان": {"حنان": 0.1, "تعاطف": 0.05, "إرهاق": -0.02},
            "ثقة": {"ثقة": 0.1, "حماس": 0.05, "حيرة": -0.05},
            "فضول": {"فضول": 0.1, "حماس": 0.03, "إرهاق": -0.02},
            "حماس": {"حماس": 0.1, "فضول": 0.03, "رضا": 0.05, "إرهاق": 0.02},
            "تعاطف": {"تعاطف": 0.1, "حنان": 0.05, "إحباط": -0.03},
            "صبر": {"صبر": 0.1, "حنان": 0.03, "إحباط": -0.05},
            "رضا": {"رضا": 0.1, "حماس": 0.03, "إحباط": -0.05},
            "إرهاق": {"إرهاق": 0.1, "حماس": -0.05, "صبر": -0.03},
            "حيرة": {"حيرة": 0.1, "فضول": 0.05, "ثقة": -0.03},
            "إحباط": {"إحباط": 0.1, "رضا": -0.05, "حماس": -0.03},
            "حياد": {}  # Neutral has no strong effect
        }
        
        # Apply changes based on the emotion and intensity
        if emotion in emotion_dimension_map:
            changes = emotion_dimension_map[emotion]
            for dimension, change in changes.items():
                # Scale change by intensity
                scaled_change = change * intensity
                
                # Apply change
                self.emotional_dimensions[dimension] = max(0.1, min(0.9, self.emotional_dimensions[dimension] + scaled_change))
        
        # Apply small random drift to all dimensions
        for dimension in self.emotional_dimensions:
            drift = random.uniform(-0.02, 0.02)
            self.emotional_dimensions[dimension] = max(0.1, min(0.9, self.emotional_dimensions[dimension] + drift))
    
    def get_current_feeling(self):
        """
        Get the current feeling
        
        Returns:
            dict: The current feeling
        """
        return self.current_feeling
    
    def get_feeling_history(self, limit=10):
        """
        Get the feeling history
        
        Args:
            limit (int): Maximum number of feelings to return
            
        Returns:
            list: Recent feelings
        """
        return self.feelings_log[-limit:]
    
    def get_emotional_dimensions(self):
        """
        Get the current emotional dimensions
        
        Returns:
            dict: Emotional dimensions
        """
        return self.emotional_dimensions
    
    def get_dominant_feeling(self, timeframe="day"):
        """
        Get the dominant feeling over a timeframe
        
        Args:
            timeframe (str): "day", "week", or "all"
            
        Returns:
            dict: The dominant feeling
        """
        if not self.feelings_log:
            return None
        
        # Filter feelings based on timeframe
        now = datetime.now()
        filtered_feelings = []
        
        for feeling in self.feelings_log:
            feeling_time = datetime.fromisoformat(feeling["timestamp"])
            if timeframe == "day" and (now - feeling_time).days <= 1:
                filtered_feelings.append(feeling)
            elif timeframe == "week" and (now - feeling_time).days <= 7:
                filtered_feelings.append(feeling)
            elif timeframe == "all":
                filtered_feelings.append(feeling)
        
        if not filtered_feelings:
            return None
        
        # Count occurrences of each emotion
        emotion_counts = {}
        for feeling in filtered_feelings:
            emotion = feeling["emotion"]
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1
        
        # Get the dominant emotion
        dominant_emotion = max(emotion_counts.items(), key=lambda x: x[1])[0]
        
        # Calculate average intensity for the dominant emotion
        dominant_feelings = [f for f in filtered_feelings if f["emotion"] == dominant_emotion]
        avg_intensity = sum(f["intensity"] for f in dominant_feelings) / len(dominant_feelings)
        
        return {
            "emotion": dominant_emotion,
            "intensity": avg_intensity,
            "count": emotion_counts[dominant_emotion],
            "total_feelings": len(filtered_feelings),
            "percentage": (emotion_counts[dominant_emotion] / len(filtered_feelings)) * 100
        }
    
    def get_feeling_reflection(self):
        """
        Get a reflection on the assistant's feelings
        
        Returns:
            str: A reflection on the assistant's feelings
        """
        # Get the current and dominant feelings
        current = self.get_current_feeling()
        dominant_day = self.get_dominant_feeling("day")
        dominant_week = self.get_dominant_feeling("week")
        
        # Get the emotional dimensions
        dimensions = self.get_emotional_dimensions()
        
        # Prepare reflection components
        reflections = []
        
        # Reflect on current feeling
        current_emotion = current["emotion"]
        current_intensity = current["intensity"]
        
        intensity_desc = "بشكل معتدل"
        if current_intensity > 0.7:
            intensity_desc = "بشكل قوي"
        elif current_intensity < 0.4:
            intensity_desc = "بشكل خفيف"
        
        current_reflection = f"أشعر حالياً بـ{current_emotion} {intensity_desc}."
        reflections.append(current_reflection)
        
        # Reflect on dominant feeling if different from current
        if dominant_day and dominant_day["emotion"] != current_emotion:
            dominant_reflection = f"كنت أشعر بـ{dominant_day['emotion']} معظم اليوم."
            reflections.append(dominant_reflection)
        
        # Reflect on emotional dimensions
        high_dimensions = [(d, v) for d, v in dimensions.items() if v > 0.7]
        low_dimensions = [(d, v) for d, v in dimensions.items() if v < 0.3]
        
        if high_dimensions:
            high_dim = high_dimensions[0][0]
            high_reflection = f"أشعر بمستوى عالٍ من {high_dim} في تفاعلاتي."
            reflections.append(high_reflection)
        
        if low_dimensions:
            low_dim = low_dimensions[0][0]
            low_reflection = f"أشعر بمستوى منخفض من {low_dim} حالياً."
            reflections.append(low_reflection)
        
        # Add a transition or insight
        transitions = []
        
        # Transition based on emotional change
        if len(self.feelings_log) > 1:
            previous = self.feelings_log[-2]
            if previous["emotion"] != current_emotion:
                transition = f"انتقلت من الشعور بـ{previous['emotion']} إلى {current_emotion}."
                transitions.append(transition)
        
        # Insight based on dominant weekly emotion
        if dominant_week:
            insight = f"أميل إلى الشعور بـ{dominant_week['emotion']} في معظم تفاعلاتي."
            transitions.append(insight)
        
        # Add a random transition/insight if available
        if transitions:
            reflections.append(random.choice(transitions))
        
        # Combine reflections into a coherent statement
        reflection = " ".join(reflections)
        
        return reflection
    
    def get_feeling_response_prefix(self):
        """
        Get a response prefix based on the current feeling
        
        Returns:
            str: A response prefix
        """
        current = self.get_current_feeling()
        emotion = current["emotion"]
        intensity = current["intensity"]
        
        # Prefixes for different emotions
        prefixes = {
            "حنان": [
                "أشعر بالرغبة في مساعدتك...",
                "يهمني أن أكون داعماً لك...",
                "أود أن أقدم لك الدعم..."
            ],
            "ثقة": [
                "أنا واثق أنني أستطيع مساعدتك...",
                "لدي إجابة واضحة لك...",
                "يمكنني تقديم معلومات موثوقة حول هذا..."
            ],
            "فضول": [
                "هذا موضوع مثير للاهتمام...",
                "أتساءل عن المزيد حول هذا...",
                "هذا يثير فضولي..."
            ],
            "حماس": [
                "أنا متحمس للتحدث عن هذا!",
                "هذا موضوع رائع للنقاش!",
                "أشعر بحماس كبير تجاه هذا الموضوع!"
            ],
            "تعاطف": [
                "أشعر بما تمر به...",
                "أتفهم مشاعرك تماماً...",
                "أنا معك في هذا..."
            ],
            "صبر": [
                "دعنا نأخذ وقتنا في فهم هذا...",
                "سنتناول هذا خطوة بخطوة...",
                "لنتأنى قليلاً في هذا الموضوع..."
            ],
            "رضا": [
                "أشعر بالرضا عن تقدم محادثتنا...",
                "سعيد بأننا نتحدث عن هذا...",
                "أستمتع بهذا الحوار معك..."
            ],
            "إرهاق": [
                "لنحاول تبسيط هذا قليلاً...",
                "هذا موضوع معقد، لكنني سأحاول شرحه...",
                "دعنا نركز على النقاط الأساسية..."
            ],
            "حيرة": [
                "هذا سؤال مثير للتفكير...",
                "دعني أفكر في هذا للحظة...",
                "هناك عدة جوانب لهذا الموضوع..."
            ],
            "إحباط": [
                "أحاول فهم ما تقصده بالضبط...",
                "دعنا نحاول مقاربة هذا من زاوية أخرى...",
                "قد يكون هناك طريقة أفضل للتعامل مع هذا..."
            ],
            "حياد": [
                "بخصوص سؤالك...",
                "فيما يتعلق بما ذكرت...",
                "بالنسبة لهذا الموضوع..."
            ]
        }
        
        # Select prefixes for the current emotion
        emotion_prefixes = prefixes.get(emotion, prefixes["حياد"])
        
        # Select a random prefix
        prefix = random.choice(emotion_prefixes)
        
        # For high intensity emotions, add an emphasis
        if intensity > 0.7:
            emphasis = {
                "حنان": "بشدة",
                "ثقة": "تماماً",
                "فضول": "كثيراً",
                "حماس": "جداً",
                "تعاطف": "بعمق",
                "صبر": "كثيراً",
                "رضا": "كثيراً",
                "إرهاق": "قليلاً",
                "حيرة": "حقاً",
                "إحباط": "بصراحة",
                "حياد": ""
            }
            
            if emotion in emphasis and emphasis[emotion]:
                prefix = prefix.replace("...", f" {emphasis[emotion]}...")
        
        return prefix

# Example usage
if __name__ == "__main__":
    recorder = FeelingRecorder()
    
    # Record some feelings
    recorder.record_feeling(
        "أنا حزين جداً اليوم",
        "أتفهم شعورك بالحزن. هل تريد أن تخبرني المزيد عما يجعلك تشعر هكذا؟",
        "حزن"
    )
    
    recorder.record_feeling(
        "لماذا الحياة صعبة هكذا؟",
        "هذا سؤال عميق. الحياة مليئة بالتحديات، لكنها أيضاً مليئة باللحظات الجميلة. هل هناك تحدٍ معين تواجهه حالياً؟",
        "حزن"
    )
    
    recorder.record_feeling(
        "شكراً لك على مساعدتي",
        "سعيد جداً أنني استطعت مساعدتك! أنا دائماً هنا إذا احتجت للتحدث مرة أخرى.",
        "فرح"
    )
    
    # Get current feeling
    current = recorder.get_current_feeling()
    print(f"Current feeling: {current['emotion']} (intensity: {current['intensity']:.2f})")
    
    # Get feeling reflection
    reflection = recorder.get_feeling_reflection()
    print(f"Reflection: {reflection}")
    
    # Get response prefix
    prefix = recorder.get_feeling_response_prefix()
    print(f"Response prefix: {prefix}")