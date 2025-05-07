import json
import random
from datetime import datetime, timedelta
import os
from memory_store import MemoryStore

class DreamSimulator:
    """
    Dream Simulator for Mashaaer
    
    This class simulates dreams based on past conversations and sets the tone for the next day.
    Dreams are generated during "night time" and influence the assistant's responses the next day.
    """
    
    def __init__(self, memory_store=None):
        """Initialize the dream simulator with a memory store"""
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.dreams = []
        self.current_dream = None
        self.dream_influence = 0.0  # How much the dream influences responses (0.0-1.0)
        self.last_dream_time = None
        
        # Dream themes based on emotions
        self.dream_themes = {
            "فرح": ["حفلة", "لقاء أصدقاء", "نجاح", "إنجاز"],  # Joy: party, meeting friends, success, achievement
            "حزن": ["فراق", "خسارة", "ذكريات", "مطر"],  # Sadness: separation, loss, memories, rain
            "غضب": ["صراع", "مواجهة", "تحدي", "نار"],  # Anger: conflict, confrontation, challenge, fire
            "خوف": ["ظلام", "متاهة", "سقوط", "مطاردة"],  # Fear: darkness, maze, falling, chase
            "حب": ["لقاء", "قرب", "دفء", "طبيعة"],  # Love: meeting, closeness, warmth, nature
            "قلق": ["تأخر", "امتحان", "ضياع", "بحث"],  # Anxiety: being late, exam, being lost, searching
            "حياد": ["سفر", "مشي", "تأمل", "سماء"]  # Neutral: travel, walking, contemplation, sky
        }
        
        # Load existing dreams
        self.load_dreams()
    
    def load_dreams(self):
        """Load dreams from storage file"""
        dreams_path = 'data/dreams.json'
        try:
            if os.path.exists(dreams_path):
                with open(dreams_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.dreams = data.get('dreams', [])
                    self.last_dream_time = data.get('last_dream_time')
        except Exception as e:
            print(f"Error loading dreams: {e}")
            self.dreams = []
            self.last_dream_time = None
    
    def save_dreams(self):
        """Save dreams to storage file"""
        dreams_path = 'data/dreams.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(dreams_path), exist_ok=True)
            
            data = {
                'dreams': self.dreams,
                'last_dream_time': self.last_dream_time
            }
            
            with open(dreams_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving dreams: {e}")
    
    def is_night_time(self):
        """Check if it's night time (for dream generation)"""
        now = datetime.now()
        # Consider night time between 10 PM and 6 AM
        return now.hour >= 22 or now.hour < 6
    
    def should_generate_dream(self):
        """Determine if a new dream should be generated"""
        # Generate a dream if it's night time and we haven't had a dream today
        if not self.is_night_time():
            return False
            
        now = datetime.now()
        
        # If we've never had a dream or the last dream was yesterday or earlier
        if not self.last_dream_time:
            return True
            
        last_dream_date = datetime.fromisoformat(self.last_dream_time).date()
        return last_dream_date < now.date()
    
    def generate_dream(self, session_id=None):
        """
        Generate a dream based on recent conversations
        
        Args:
            session_id (str, optional): Session ID to retrieve memories from
            
        Returns:
            dict: The generated dream
        """
        # Get recent memories
        memories = []
        if session_id:
            # Get emotional memories for this session
            from emotional_memory import get_emotion_timeline
            memories = get_emotion_timeline(session_id)
        
        if not memories and hasattr(self.memory_store, 'retrieve_episodic_memories'):
            # Fall back to episodic memories from memory store
            memories = self.memory_store.retrieve_episodic_memories({'limit': 10})
        
        # If we still don't have memories, create a generic dream
        if not memories:
            return self._create_generic_dream()
        
        # Extract emotions and topics from memories
        emotions = [memory.get('emotion', 'حياد') for memory in memories if 'emotion' in memory]
        texts = [memory.get('text', '') for memory in memories if 'text' in memory]
        if not texts:
            texts = [memory.get('input', '') for memory in memories if 'input' in memory]
        
        # Find the dominant emotion
        dominant_emotion = 'حياد'  # Default to neutral
        if emotions:
            emotion_counts = {}
            for emotion in emotions:
                emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            dominant_emotion = max(emotion_counts, key=emotion_counts.get)
        
        # Create a dream based on the dominant emotion and recent topics
        dream = self._create_dream(dominant_emotion, texts)
        
        # Store the dream
        self.dreams.append(dream)
        self.current_dream = dream
        self.last_dream_time = datetime.now().isoformat()
        self.dream_influence = random.uniform(0.3, 0.8)  # Random influence level
        
        # Save dreams
        self.save_dreams()
        
        return dream
    
    def _create_dream(self, emotion, texts):
        """
        Create a dream based on emotion and texts
        
        Args:
            emotion (str): The dominant emotion
            texts (list): List of text strings from recent conversations
            
        Returns:
            dict: The created dream
        """
        # Select a theme based on the emotion
        themes = self.dream_themes.get(emotion, self.dream_themes['حياد'])
        theme = random.choice(themes)
        
        # Extract some keywords from the texts
        keywords = []
        for text in texts:
            # Simple keyword extraction - words with 4+ characters
            words = text.split()
            keywords.extend([word for word in words if len(word) >= 4])
        
        # Select up to 3 random keywords
        selected_keywords = []
        if keywords:
            random.shuffle(keywords)
            selected_keywords = keywords[:min(3, len(keywords))]
        
        # Generate dream narrative
        narrative = self._generate_narrative(emotion, theme, selected_keywords)
        
        # Create the dream object
        dream = {
            'timestamp': datetime.now().isoformat(),
            'emotion': emotion,
            'theme': theme,
            'keywords': selected_keywords,
            'narrative': narrative,
            'influence': {
                'tone': self._get_tone_from_emotion(emotion),
                'intensity': random.uniform(0.3, 0.8),
                'duration': random.randint(1, 3)  # How many days this dream influences
            }
        }
        
        return dream
    
    def _create_generic_dream(self):
        """Create a generic dream when no memories are available"""
        emotions = list(self.dream_themes.keys())
        emotion = random.choice(emotions)
        theme = random.choice(self.dream_themes[emotion])
        
        narrative = self._generate_narrative(emotion, theme, [])
        
        dream = {
            'timestamp': datetime.now().isoformat(),
            'emotion': emotion,
            'theme': theme,
            'keywords': [],
            'narrative': narrative,
            'influence': {
                'tone': self._get_tone_from_emotion(emotion),
                'intensity': random.uniform(0.2, 0.5),  # Less intense for generic dreams
                'duration': 1  # Only lasts one day
            }
        }
        
        return dream
    
    def _generate_narrative(self, emotion, theme, keywords):
        """Generate a dream narrative based on emotion, theme, and keywords"""
        # Templates for different emotions
        templates = {
            "فرح": [
                "حلمت أنني في {theme} مليء بالضوء والألوان. كان {keyword1} يتراقص حولي، و{keyword2} يملأ المكان بالبهجة.",
                "رأيت في المنام {theme} عظيم، حيث كان الجميع يحتفلون بـ{keyword1}. شعرت بسعادة غامرة عندما ظهر {keyword2}."
            ],
            "حزن": [
                "في الحلم، كنت وحيداً في {theme} مظلم. كان {keyword1} بعيداً لا أستطيع الوصول إليه، و{keyword2} يتلاشى ببطء.",
                "حلمت بـ{theme} حزين، حيث فقدت {keyword1} للأبد. كان {keyword2} يذكرني بما ضاع مني."
            ],
            "غضب": [
                "في المنام، كنت في {theme} عنيف. كان {keyword1} يثير غضبي، وأردت تحطيم {keyword2} بكل قوتي.",
                "حلمت بـ{theme} مشتعل، حيث واجهت {keyword1} بشراسة. كان {keyword2} سبب كل المشاكل."
            ],
            "خوف": [
                "في الحلم، كنت أهرب في {theme} مخيف. كان {keyword1} يطاردني، وكلما اقتربت من {keyword2} ازداد خوفي.",
                "حلمت بـ{theme} مرعب، حيث اختفى {keyword1} فجأة. كنت أبحث عنه في ظلام دامس، و{keyword2} يصدر أصواتاً مخيفة."
            ],
            "حب": [
                "في المنام، كنت في {theme} جميل مع {keyword1}. كان {keyword2} يحيط بنا، وشعرت بدفء وسعادة لا توصف.",
                "حلمت بـ{theme} رومانسي، حيث التقيت بـ{keyword1} تحت ضوء القمر. كان {keyword2} يعزف لحناً عذباً."
            ],
            "قلق": [
                "في الحلم، كنت أركض في {theme} لا نهاية له. كنت أبحث عن {keyword1} بقلق شديد، و{keyword2} يضيع مني كلما اقتربت.",
                "حلمت بـ{theme} متشابك، حيث كان علي إيجاد {keyword1} قبل فوات الأوان. كان {keyword2} يزداد صعوبة مع مرور الوقت."
            ],
            "حياد": [
                "في المنام، كنت أتجول في {theme} هادئ. رأيت {keyword1} من بعيد، و{keyword2} كان موجوداً دون أن يثير أي مشاعر.",
                "حلمت بـ{theme} عادي، حيث كان {keyword1} و{keyword2} جزءاً من المشهد دون أحداث استثنائية."
            ]
        }
        
        # Get templates for this emotion or use neutral templates as fallback
        emotion_templates = templates.get(emotion, templates["حياد"])
        template = random.choice(emotion_templates)
        
        # Fill in the template with theme and keywords
        narrative = template.format(
            theme=theme,
            keyword1=keywords[0] if keywords and len(keywords) > 0 else "شيء ما",
            keyword2=keywords[1] if keywords and len(keywords) > 1 else "شيء آخر"
        )
        
        return narrative
    
    def _get_tone_from_emotion(self, emotion):
        """Map emotion to a tone for responses"""
        emotion_to_tone = {
            "فرح": "متحمس",  # Joy -> Enthusiastic
            "حزن": "متعاطف",  # Sadness -> Empathetic
            "غضب": "حازم",    # Anger -> Assertive
            "خوف": "مطمئن",   # Fear -> Reassuring
            "حب": "ودود",     # Love -> Friendly
            "قلق": "داعم",    # Anxiety -> Supportive
            "حياد": "محايد"   # Neutral -> Neutral
        }
        
        return emotion_to_tone.get(emotion, "محايد")
    
    def get_current_dream_influence(self):
        """
        Get the current dream's influence on responses
        
        Returns:
            dict: The dream influence information or None if no current dream
        """
        if not self.current_dream:
            # Check if we should generate a dream
            if self.should_generate_dream():
                self.generate_dream()
            else:
                return None
        
        # Check if the dream is still valid (within duration)
        if self.current_dream and self.last_dream_time:
            dream_date = datetime.fromisoformat(self.last_dream_time).date()
            current_date = datetime.now().date()
            days_passed = (current_date - dream_date).days
            
            if days_passed >= self.current_dream['influence']['duration']:
                # Dream has expired
                self.current_dream = None
                self.dream_influence = 0.0
                return None
        
        # Return the dream influence
        if self.current_dream:
            return {
                'narrative': self.current_dream['narrative'],
                'tone': self.current_dream['influence']['tone'],
                'intensity': self.current_dream['influence']['intensity'],
                'emotion': self.current_dream['emotion']
            }
        
        return None
    
    def get_dream_inspired_greeting(self):
        """
        Get a greeting inspired by the current dream
        
        Returns:
            str: A dream-inspired greeting or None if no current dream
        """
        influence = self.get_current_dream_influence()
        if not influence:
            return None
        
        # Templates for dream-inspired greetings
        greeting_templates = [
            "اليوم، أنا حاسّة فيك طاقة {emotion}... مش عارفة ليش. يمكن من حلمي.",
            "حلمت بك البارحة في {narrative_short}. أشعر {feeling} اليوم.",
            "صباح الخير! حلمي البارحة جعلني أشعر {feeling}. هل أنت كذلك أيضاً؟",
            "هناك شيء مختلف في طاقتك اليوم... ربما لأنني حلمت بـ{keyword}.",
            "أشعر {feeling} بعد حلم رأيته عنك. هل تريد أن أخبرك به؟"
        ]
        
        # Map emotions to feelings
        emotion_to_feeling = {
            "فرح": "بالحماس والسعادة",
            "حزن": "بالحنين والتأمل",
            "غضب": "بالقوة والتصميم",
            "خوف": "بالحذر والترقب",
            "حب": "بالدفء والقرب",
            "قلق": "بالفضول والاهتمام",
            "حياد": "بالهدوء والتوازن"
        }
        
        # Get a short version of the narrative (first sentence)
        narrative_short = influence['narrative'].split('.')[0]
        
        # Get a keyword from the dream if available
        keyword = "شيء غامض"
        if self.current_dream and self.current_dream.get('keywords'):
            keyword = random.choice(self.current_dream['keywords'])
        
        # Select a template and fill it
        template = random.choice(greeting_templates)
        greeting = template.format(
            emotion=influence['emotion'],
            narrative_short=narrative_short,
            feeling=emotion_to_feeling.get(influence['emotion'], "بشكل مختلف"),
            keyword=keyword
        )
        
        return greeting

# Example usage
if __name__ == "__main__":
    dream_simulator = DreamSimulator()
    dream = dream_simulator.generate_dream()
    print(f"Generated dream: {dream['narrative']}")
    
    greeting = dream_simulator.get_dream_inspired_greeting()
    print(f"Dream-inspired greeting: {greeting}")