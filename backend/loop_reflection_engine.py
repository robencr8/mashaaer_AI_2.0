import json
import os
from datetime import datetime
import re
from collections import Counter

class LoopReflectionEngine:
    """
    Loop Reflection Engine for Mashaaer
    
    This class detects and reflects on repetitive patterns in user interactions.
    It identifies loops in conversation topics, user behaviors, and emotional states,
    and provides insights and interventions to help break unhelpful patterns.
    
    Features:
    - Pattern detection in conversation topics
    - Identification of repetitive user behaviors
    - Tracking of emotional loops
    - Reflection generation for detected patterns
    - Intervention suggestions to break unhelpful loops
    """
    
    def __init__(self):
        """Initialize the loop reflection engine"""
        self.reflection_data = {
            'interactions': [],
            'detected_patterns': [],
            'reflections_provided': [],
            'last_updated': datetime.now().isoformat()
        }
        
        # Pattern detection thresholds
        self.thresholds = {
            'topic_repetition': 3,      # Number of times a topic must repeat to be considered a pattern
            'behavior_repetition': 4,    # Number of times a behavior must repeat to be considered a pattern
            'emotion_repetition': 3,     # Number of times an emotion must repeat to be considered a pattern
            'min_interaction_count': 5,  # Minimum number of interactions before pattern detection begins
            'max_interactions_stored': 100  # Maximum number of interactions to store
        }
        
        # Common topics for categorization
        self.topic_categories = {
            'personal': ['أنا', 'نفسي', 'حياتي', 'مشاعري', 'مستقبلي'],
            'relationships': ['علاقة', 'حب', 'صداقة', 'زواج', 'طلاق', 'أسرة', 'أهل'],
            'work': ['عمل', 'وظيفة', 'مهنة', 'دراسة', 'تعليم', 'جامعة', 'مدرسة'],
            'health': ['صحة', 'مرض', 'ألم', 'طبيب', 'علاج', 'دواء'],
            'technology': ['تقنية', 'حاسوب', 'هاتف', 'إنترنت', 'برمجة', 'تطبيق'],
            'existential': ['معنى', 'هدف', 'وجود', 'حياة', 'موت', 'فلسفة', 'دين'],
            'entertainment': ['فيلم', 'موسيقى', 'كتاب', 'لعبة', 'رياضة', 'هواية']
        }
        
        # User behavior patterns to detect
        self.behavior_patterns = {
            'question_loop': r'\?$',  # Ends with question mark
            'complaint_loop': r'(مشكلة|صعب|لا أستطيع|لا يمكنني|سيء)',
            'validation_seeking': r'(صحيح|أليس كذلك|موافق|ما رأيك)',
            'self_criticism': r'(فاشل|غبي|سيء|لا أستحق|لا أستطيع)',
            'external_blame': r'(بسبب|لولا|هم|هي|هو|الآخرين)'
        }
        
        # Load existing reflection data
        self.load_reflection_data()
    
    def load_reflection_data(self):
        """Load reflection data from storage file"""
        reflection_path = 'data/loop_reflection.json'
        try:
            if os.path.exists(reflection_path):
                with open(reflection_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.reflection_data = data
        except Exception as e:
            print(f"Error loading reflection data: {e}")
            # Initialize with empty data if loading fails
            self.reflection_data = {
                'interactions': [],
                'detected_patterns': [],
                'reflections_provided': [],
                'last_updated': datetime.now().isoformat()
            }
    
    def save_reflection_data(self):
        """Save reflection data to storage file"""
        reflection_path = 'data/loop_reflection.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(reflection_path), exist_ok=True)
            
            with open(reflection_path, 'w', encoding='utf-8') as f:
                json.dump(self.reflection_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving reflection data: {e}")
    
    def process_interaction(self, user_input, system_response, user_emotion=None, session_id=None):
        """
        Process an interaction to detect patterns
        
        Args:
            user_input (str): The user's input
            system_response (str): The system's response
            user_emotion (str, optional): The detected user emotion
            session_id (str, optional): Session identifier
            
        Returns:
            dict: Detected patterns and reflections, if any
        """
        # Store the interaction
        interaction = {
            'user_input': user_input,
            'system_response': system_response,
            'user_emotion': user_emotion,
            'session_id': session_id,
            'timestamp': datetime.now().isoformat(),
            'topic_category': self._categorize_topic(user_input),
            'behavior_patterns': self._detect_behavior_patterns(user_input)
        }
        
        self.reflection_data['interactions'].append(interaction)
        
        # Limit the number of stored interactions
        if len(self.reflection_data['interactions']) > self.thresholds['max_interactions_stored']:
            self.reflection_data['interactions'] = self.reflection_data['interactions'][-self.thresholds['max_interactions_stored']:]
        
        # Only detect patterns if we have enough interactions
        result = {'patterns_detected': False, 'reflection': None}
        
        if len(self.reflection_data['interactions']) >= self.thresholds['min_interaction_count']:
            # Detect patterns
            patterns = self._detect_patterns()
            
            if patterns:
                self.reflection_data['detected_patterns'].extend(patterns)
                result['patterns_detected'] = True
                
                # Generate reflection for the most significant pattern
                reflection = self._generate_reflection(patterns[0])
                
                if reflection:
                    self.reflection_data['reflections_provided'].append({
                        'pattern': patterns[0],
                        'reflection': reflection,
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    result['reflection'] = reflection
        
        # Update last updated timestamp
        self.reflection_data['last_updated'] = datetime.now().isoformat()
        
        # Save reflection data
        self.save_reflection_data()
        
        return result
    
    def _categorize_topic(self, text):
        """
        Categorize the topic of a text
        
        Args:
            text (str): The text to categorize
            
        Returns:
            str: The topic category
        """
        # Count occurrences of keywords from each category
        category_scores = {}
        
        for category, keywords in self.topic_categories.items():
            score = sum(1 for keyword in keywords if keyword in text.lower())
            category_scores[category] = score
        
        # Get the category with the highest score
        if any(score > 0 for score in category_scores.values()):
            return max(category_scores.items(), key=lambda x: x[1])[0]
        
        return "general"  # Default category if no keywords match
    
    def _detect_behavior_patterns(self, text):
        """
        Detect behavior patterns in a text
        
        Args:
            text (str): The text to analyze
            
        Returns:
            list: Detected behavior patterns
        """
        detected_patterns = []
        
        for pattern_name, pattern_regex in self.behavior_patterns.items():
            if re.search(pattern_regex, text, re.IGNORECASE):
                detected_patterns.append(pattern_name)
        
        return detected_patterns
    
    def _detect_patterns(self):
        """
        Detect patterns in the stored interactions
        
        Returns:
            list: Detected patterns
        """
        detected_patterns = []
        
        # Get recent interactions (last 20)
        recent_interactions = self.reflection_data['interactions'][-20:]
        
        # 1. Detect topic repetition patterns
        topic_counter = Counter([interaction['topic_category'] for interaction in recent_interactions])
        for topic, count in topic_counter.items():
            if count >= self.thresholds['topic_repetition']:
                # Check if this is a new pattern
                pattern = {
                    'type': 'topic_repetition',
                    'topic': topic,
                    'count': count,
                    'timestamp': datetime.now().isoformat()
                }
                
                # Check if this pattern was recently detected
                if not self._is_duplicate_pattern(pattern):
                    detected_patterns.append(pattern)
        
        # 2. Detect behavior repetition patterns
        behavior_counts = {}
        for interaction in recent_interactions:
            for behavior in interaction['behavior_patterns']:
                if behavior not in behavior_counts:
                    behavior_counts[behavior] = 0
                behavior_counts[behavior] += 1
        
        for behavior, count in behavior_counts.items():
            if count >= self.thresholds['behavior_repetition']:
                # Check if this is a new pattern
                pattern = {
                    'type': 'behavior_repetition',
                    'behavior': behavior,
                    'count': count,
                    'timestamp': datetime.now().isoformat()
                }
                
                # Check if this pattern was recently detected
                if not self._is_duplicate_pattern(pattern):
                    detected_patterns.append(pattern)
        
        # 3. Detect emotion repetition patterns
        emotions = [interaction['user_emotion'] for interaction in recent_interactions if interaction['user_emotion']]
        emotion_counter = Counter(emotions)
        
        for emotion, count in emotion_counter.items():
            if count >= self.thresholds['emotion_repetition']:
                # Check if this is a new pattern
                pattern = {
                    'type': 'emotion_repetition',
                    'emotion': emotion,
                    'count': count,
                    'timestamp': datetime.now().isoformat()
                }
                
                # Check if this pattern was recently detected
                if not self._is_duplicate_pattern(pattern):
                    detected_patterns.append(pattern)
        
        # 4. Detect question-answer loops
        question_count = sum(1 for interaction in recent_interactions if interaction['user_input'].strip().endswith('?'))
        if question_count >= self.thresholds['behavior_repetition']:
            pattern = {
                'type': 'question_answer_loop',
                'count': question_count,
                'timestamp': datetime.now().isoformat()
            }
            
            # Check if this pattern was recently detected
            if not self._is_duplicate_pattern(pattern):
                detected_patterns.append(pattern)
        
        return detected_patterns
    
    def _is_duplicate_pattern(self, new_pattern):
        """
        Check if a pattern was recently detected
        
        Args:
            new_pattern (dict): The new pattern to check
            
        Returns:
            bool: True if the pattern is a duplicate, False otherwise
        """
        # Get recent patterns (last 5)
        recent_patterns = self.reflection_data['detected_patterns'][-5:] if self.reflection_data['detected_patterns'] else []
        
        for pattern in recent_patterns:
            # Check if the pattern type matches
            if pattern['type'] != new_pattern['type']:
                continue
            
            # Check specific attributes based on pattern type
            if pattern['type'] == 'topic_repetition' and pattern['topic'] == new_pattern['topic']:
                return True
            elif pattern['type'] == 'behavior_repetition' and pattern['behavior'] == new_pattern['behavior']:
                return True
            elif pattern['type'] == 'emotion_repetition' and pattern['emotion'] == new_pattern['emotion']:
                return True
            elif pattern['type'] == 'question_answer_loop':
                return True
        
        return False
    
    def _generate_reflection(self, pattern):
        """
        Generate a reflection for a detected pattern
        
        Args:
            pattern (dict): The detected pattern
            
        Returns:
            dict: The generated reflection
        """
        reflection_text = ""
        intervention = ""
        
        if pattern['type'] == 'topic_repetition':
            topic = pattern['topic']
            topic_name = self._get_topic_name(topic)
            
            reflection_templates = [
                f"لاحظت أننا نتحدث كثيراً عن موضوع {topic_name}. هل هناك جانب معين من هذا الموضوع تود التركيز عليه؟",
                f"يبدو أن موضوع {topic_name} يشغل تفكيرك بشكل كبير. هل هناك سبب محدد لاهتمامك بهذا الموضوع؟",
                f"نعود دائماً إلى الحديث عن {topic_name}. هل تشعر أن هناك شيئاً لم نستكشفه بعد في هذا الموضوع؟"
            ]
            
            intervention_templates = [
                f"ما رأيك أن نتحدث عن جانب آخر غير {topic_name} لفترة؟ قد يفتح ذلك آفاقاً جديدة للتفكير.",
                f"أحياناً يساعدنا تغيير الموضوع في رؤية الأمور من منظور مختلف. هل هناك موضوع آخر يثير اهتمامك؟",
                f"لنحاول تغيير مسار الحديث قليلاً. ما هي المواضيع الأخرى التي تهمك غير {topic_name}؟"
            ]
            
            import random
            reflection_text = random.choice(reflection_templates)
            intervention = random.choice(intervention_templates)
        
        elif pattern['type'] == 'behavior_repetition':
            behavior = pattern['behavior']
            behavior_name = self._get_behavior_name(behavior)
            
            reflection_templates = [
                f"لاحظت أنك غالباً {behavior_name}. هل أنت مدرك لهذا النمط؟",
                f"يبدو أنك تميل إلى {behavior_name} في كثير من أحاديثنا. هل تعتقد أن هذا النمط مفيد لك؟",
                f"أرى نمطاً متكرراً في تفاعلاتنا حيث {behavior_name}. هل تود أن نتحدث عن هذا النمط؟"
            ]
            
            intervention_templates = [
                f"ما رأيك أن نجرب نهجاً مختلفاً بدلاً من {behavior_name}؟ قد يؤدي ذلك إلى نتائج مختلفة.",
                f"أحياناً يمكن أن يقيدنا البقاء في نفس النمط السلوكي. هل يمكنك تجربة نهج مختلف؟",
                f"لنحاول معاً كسر هذا النمط المتكرر. ما هي الطريقة المختلفة التي يمكنك التعبير بها عن أفكارك؟"
            ]
            
            import random
            reflection_text = random.choice(reflection_templates)
            intervention = random.choice(intervention_templates)
        
        elif pattern['type'] == 'emotion_repetition':
            emotion = pattern['emotion']
            
            reflection_templates = [
                f"أرى أنك تشعر بـ{emotion} بشكل متكرر. هل هناك سبب محدد لهذا الشعور المستمر؟",
                f"يبدو أن مشاعر {emotion} تظهر كثيراً في محادثاتنا. هل تود التحدث عن مصدر هذه المشاعر؟",
                f"لاحظت أن {emotion} هو الشعور المهيمن في تفاعلاتنا الأخيرة. كيف يؤثر هذا الشعور على حياتك اليومية؟"
            ]
            
            intervention_templates = [
                f"هل يمكننا استكشاف طرق للتعامل مع مشاعر {emotion} بشكل مختلف؟",
                f"أحياناً يساعدنا تغيير نظرتنا للأمور في تغيير مشاعرنا. هل يمكنك رؤية الموقف من زاوية مختلفة؟",
                f"ما هي الأنشطة أو الأفكار التي قد تساعدك على الشعور بشكل مختلف عن {emotion}؟"
            ]
            
            import random
            reflection_text = random.choice(reflection_templates)
            intervention = random.choice(intervention_templates)
        
        elif pattern['type'] == 'question_answer_loop':
            reflection_templates = [
                "لاحظت أنك تطرح الكثير من الأسئلة المتتالية. هل تبحث عن إجابة محددة لم تحصل عليها بعد؟",
                "يبدو أننا في حلقة من الأسئلة والإجابات. هل هناك شيء محدد تحاول فهمه؟",
                "أرى أنك تطرح العديد من الأسئلة. هل تشعر أن إجاباتي غير كافية أو غير واضحة؟"
            ]
            
            intervention_templates = [
                "بدلاً من طرح المزيد من الأسئلة، ما رأيك أن تشاركني بعض أفكارك أو مشاعرك حول الموضوع؟",
                "قد يكون من المفيد أحياناً التوقف عن طرح الأسئلة والتفكير في المعلومات التي لديك بالفعل. ما الذي فهمته حتى الآن؟",
                "لنجرب نهجاً مختلفاً. بدلاً من أن تسألني، ما رأيك أن تخبرني بما تعتقد أنه الجواب، وسأساعدك في تطوير فكرتك؟"
            ]
            
            import random
            reflection_text = random.choice(reflection_templates)
            intervention = random.choice(intervention_templates)
        
        if reflection_text and intervention:
            return {
                'reflection': reflection_text,
                'intervention': intervention,
                'pattern_type': pattern['type']
            }
        
        return None
    
    def _get_topic_name(self, topic_category):
        """
        Get a human-readable name for a topic category
        
        Args:
            topic_category (str): The topic category
            
        Returns:
            str: The human-readable name
        """
        topic_names = {
            'personal': 'الأمور الشخصية',
            'relationships': 'العلاقات',
            'work': 'العمل والدراسة',
            'health': 'الصحة',
            'technology': 'التكنولوجيا',
            'existential': 'الأسئلة الوجودية',
            'entertainment': 'الترفيه',
            'general': 'مواضيع عامة'
        }
        
        return topic_names.get(topic_category, topic_category)
    
    def _get_behavior_name(self, behavior_pattern):
        """
        Get a human-readable description for a behavior pattern
        
        Args:
            behavior_pattern (str): The behavior pattern
            
        Returns:
            str: The human-readable description
        """
        behavior_descriptions = {
            'question_loop': 'تطرح الأسئلة بشكل متكرر',
            'complaint_loop': 'تعبر عن الشكاوى والصعوبات',
            'validation_seeking': 'تبحث عن التأكيد والموافقة',
            'self_criticism': 'تنتقد نفسك',
            'external_blame': 'تلقي اللوم على عوامل خارجية'
        }
        
        return behavior_descriptions.get(behavior_pattern, behavior_pattern)
    
    def get_recent_reflections(self, limit=3):
        """
        Get recent reflections
        
        Args:
            limit (int): Maximum number of reflections to return
            
        Returns:
            list: Recent reflections
        """
        # Sort reflections by timestamp (newest first)
        sorted_reflections = sorted(
            self.reflection_data['reflections_provided'],
            key=lambda x: x['timestamp'],
            reverse=True
        )
        
        return sorted_reflections[:limit]
    
    def should_provide_reflection(self):
        """
        Determine if a reflection should be provided
        
        Returns:
            bool: True if a reflection should be provided, False otherwise
        """
        # Check if we have any reflections
        if not self.reflection_data['reflections_provided']:
            return True
        
        # Check when the last reflection was provided
        last_reflection = sorted(
            self.reflection_data['reflections_provided'],
            key=lambda x: x['timestamp'],
            reverse=True
        )[0]
        
        last_reflection_time = datetime.fromisoformat(last_reflection['timestamp'])
        now = datetime.now()
        
        # Don't provide reflections too frequently (at least 5 interactions between reflections)
        recent_interactions = self.reflection_data['interactions'][-5:]
        interactions_since_reflection = 0
        
        for interaction in recent_interactions:
            interaction_time = datetime.fromisoformat(interaction['timestamp'])
            if interaction_time > last_reflection_time:
                interactions_since_reflection += 1
        
        return interactions_since_reflection >= 5
    
    def get_loop_statistics(self):
        """
        Get statistics about detected loops
        
        Returns:
            dict: Loop statistics
        """
        # Count pattern types
        pattern_types = [pattern['type'] for pattern in self.reflection_data['detected_patterns']]
        pattern_type_counts = Counter(pattern_types)
        
        # Count topic categories
        topic_patterns = [pattern for pattern in self.reflection_data['detected_patterns'] if pattern['type'] == 'topic_repetition']
        topic_categories = [pattern['topic'] for pattern in topic_patterns]
        topic_category_counts = Counter(topic_categories)
        
        # Count behavior patterns
        behavior_patterns = [pattern for pattern in self.reflection_data['detected_patterns'] if pattern['type'] == 'behavior_repetition']
        behaviors = [pattern['behavior'] for pattern in behavior_patterns]
        behavior_counts = Counter(behaviors)
        
        # Count emotion patterns
        emotion_patterns = [pattern for pattern in self.reflection_data['detected_patterns'] if pattern['type'] == 'emotion_repetition']
        emotions = [pattern['emotion'] for pattern in emotion_patterns]
        emotion_counts = Counter(emotions)
        
        return {
            'pattern_type_counts': dict(pattern_type_counts),
            'topic_category_counts': dict(topic_category_counts),
            'behavior_counts': dict(behavior_counts),
            'emotion_counts': dict(emotion_counts),
            'total_patterns_detected': len(self.reflection_data['detected_patterns']),
            'total_reflections_provided': len(self.reflection_data['reflections_provided'])
        }

# Example usage
if __name__ == "__main__":
    loop_engine = LoopReflectionEngine()
    
    # Process some interactions
    loop_engine.process_interaction(
        "أنا حزين جداً اليوم. لا أعرف ماذا أفعل.",
        "أتفهم شعورك بالحزن. هل هناك سبب محدد لهذا الشعور؟",
        "حزن"
    )
    
    loop_engine.process_interaction(
        "لا أستطيع التركيز في عملي. أشعر بالإحباط.",
        "الإحباط شعور صعب. هل هناك شيء معين يسبب لك صعوبة في التركيز؟",
        "إحباط"
    )
    
    loop_engine.process_interaction(
        "أنا فاشل في كل شيء. لا أستطيع إنجاز أي شيء بشكل صحيح.",
        "أنت لست فاشلاً. كلنا نواجه تحديات أحياناً. هل يمكنك إخباري عن شيء محدد تشعر أنك لم تنجح فيه؟",
        "حزن"
    )
    
    loop_engine.process_interaction(
        "لماذا أشعر بهذا السوء دائماً؟ لماذا لا يمكنني أن أكون سعيداً؟",
        "هذه أسئلة مهمة. المشاعر السلبية جزء طبيعي من الحياة، لكن عندما تستمر لفترة طويلة، قد يكون من المفيد التحدث مع متخصص.",
        "حزن"
    )
    
    loop_engine.process_interaction(
        "لا أحد يفهمني. أشعر بالوحدة دائماً.",
        "الشعور بعدم الفهم والوحدة صعب جداً. هل هناك أشخاص في حياتك حاولت التحدث معهم عن مشاعرك؟",
        "حزن"
    )
    
    # Check for patterns
    result = loop_engine.process_interaction(
        "أنا حزين مرة أخرى. لا أعرف ماذا أفعل بحياتي.",
        "أرى أنك تمر بفترة صعبة. هل فكرت في طلب المساعدة من متخصص؟",
        "حزن"
    )
    
    if result['reflection']:
        print(f"Reflection: {result['reflection']['reflection']}")
        print(f"Intervention: {result['reflection']['intervention']}")
    
    # Get loop statistics
    stats = loop_engine.get_loop_statistics()
    print(f"Loop statistics: {stats}")