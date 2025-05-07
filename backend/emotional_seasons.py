import json
import os
from datetime import datetime, timedelta
from collections import Counter, defaultdict
import random
from emotional_memory import get_emotion_timeline

class EmotionalSeasons:
    """
    Emotional Seasons for Mashaaer
    
    This class tracks emotional patterns over time and identifies "seasons" in the user's
    emotional state. It analyzes emotional data to detect patterns, transitions, and cycles,
    providing insights about the user's emotional journey.
    """
    
    def __init__(self):
        """Initialize the emotional seasons tracker"""
        self.seasons_data = {
            'user_seasons': {},  # Seasons by user/session ID
            'global_seasons': {  # Global seasons across all users
                'current_season': None,
                'past_seasons': [],
                'season_transitions': []
            },
            'season_definitions': {
                'حزن': {  # Sadness
                    'name': 'موسم الحزن',
                    'description': 'فترة يغلب عليها مشاعر الحزن والإحباط',
                    'dominant_emotions': ['حزن', 'إحباط', 'خيبة أمل'],
                    'typical_duration': 14,  # days
                    'transition_emotions': ['حياد', 'أمل', 'قبول']
                },
                'فرح': {  # Joy
                    'name': 'موسم الفرح',
                    'description': 'فترة يغلب عليها مشاعر السعادة والحماس',
                    'dominant_emotions': ['فرح', 'سعادة', 'حماس'],
                    'typical_duration': 21,  # days
                    'transition_emotions': ['رضا', 'حياد', 'هدوء']
                },
                'غضب': {  # Anger
                    'name': 'موسم الغضب',
                    'description': 'فترة يغلب عليها مشاعر الغضب والإحباط',
                    'dominant_emotions': ['غضب', 'إحباط', 'توتر'],
                    'typical_duration': 7,  # days
                    'transition_emotions': ['هدوء', 'حياد', 'قبول']
                },
                'خوف': {  # Fear
                    'name': 'موسم القلق',
                    'description': 'فترة يغلب عليها مشاعر الخوف والقلق',
                    'dominant_emotions': ['خوف', 'قلق', 'توتر'],
                    'typical_duration': 10,  # days
                    'transition_emotions': ['أمان', 'حياد', 'قبول']
                },
                'حب': {  # Love
                    'name': 'موسم الحب',
                    'description': 'فترة يغلب عليها مشاعر الحب والتقارب',
                    'dominant_emotions': ['حب', 'إعجاب', 'حنان'],
                    'typical_duration': 30,  # days
                    'transition_emotions': ['رضا', 'حياد', 'هدوء']
                },
                'حياد': {  # Neutral
                    'name': 'موسم الهدوء',
                    'description': 'فترة من الاستقرار العاطفي والهدوء',
                    'dominant_emotions': ['حياد', 'هدوء', 'رضا'],
                    'typical_duration': 14,  # days
                    'transition_emotions': ['فضول', 'حماس', 'قلق']
                }
            },
            'last_updated': datetime.now().isoformat()
        }
        
        # Minimum data points needed to identify a season
        self.min_data_points = 5
        
        # Minimum duration (in days) to consider a period as a season
        self.min_season_duration = 3
        
        # Load existing seasons data
        self.load_seasons_data()
    
    def load_seasons_data(self):
        """Load seasons data from storage file"""
        seasons_path = 'data/emotional_seasons.json'
        try:
            if os.path.exists(seasons_path):
                with open(seasons_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.seasons_data = data
        except Exception as e:
            print(f"Error loading seasons data: {e}")
    
    def save_seasons_data(self):
        """Save seasons data to storage file"""
        seasons_path = 'data/emotional_seasons.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(seasons_path), exist_ok=True)
            
            with open(seasons_path, 'w', encoding='utf-8') as f:
                json.dump(self.seasons_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving seasons data: {e}")
    
    def update_seasons(self, session_id=None):
        """
        Update emotional seasons based on recent emotional data
        
        Args:
            session_id (str, optional): Session ID to update seasons for
            
        Returns:
            dict: Updated season information
        """
        # Get emotional data
        emotions_timeline = self._get_emotional_data(session_id)
        
        if not emotions_timeline or len(emotions_timeline) < self.min_data_points:
            return None
        
        # Analyze the emotional data to identify seasons
        seasons = self._identify_seasons(emotions_timeline, session_id)
        
        # Update the seasons data
        if session_id:
            self.seasons_data['user_seasons'][session_id] = seasons
        else:
            self.seasons_data['global_seasons'] = seasons
        
        # Update last updated timestamp
        self.seasons_data['last_updated'] = datetime.now().isoformat()
        
        # Save seasons data
        self.save_seasons_data()
        
        return seasons
    
    def _get_emotional_data(self, session_id=None):
        """Get emotional data for analysis"""
        if session_id:
            # Get emotional data for this session from emotional_memory
            return get_emotion_timeline(session_id)
        else:
            # In a real implementation, this would aggregate data from all sessions
            return []
    
    def _identify_seasons(self, emotions_timeline, session_id=None):
        """Identify emotional seasons from a timeline of emotions"""
        # Group emotions by date
        emotions_by_date = self._group_emotions_by_date(emotions_timeline)
        
        # If we don't have enough days of data, return existing seasons
        if len(emotions_by_date) < self.min_season_duration:
            return self._get_existing_seasons(session_id)
        
        # Find the dominant emotion for each day
        daily_dominant_emotions = {}
        for date, day_emotions in emotions_by_date.items():
            emotion_counts = Counter([e['emotion'] for e in day_emotions])
            if emotion_counts:
                dominant_emotion = emotion_counts.most_common(1)[0][0]
                daily_dominant_emotions[date] = dominant_emotion
        
        # Identify continuous periods with the same dominant emotion
        emotion_periods = self._identify_emotion_periods(daily_dominant_emotions)
        
        # Convert emotion periods to seasons
        seasons = self._convert_periods_to_seasons(emotion_periods)
        
        # Get the current season
        current_season = self._get_current_season(seasons)
        
        # Get past seasons
        past_seasons = [s for s in seasons if s != current_season]
        
        # Identify season transitions
        season_transitions = self._identify_season_transitions(seasons)
        
        return {
            'current_season': current_season,
            'past_seasons': past_seasons,
            'season_transitions': season_transitions
        }
    
    def _group_emotions_by_date(self, emotions_timeline):
        """Group emotions by date"""
        emotions_by_date = defaultdict(list)
        
        for emotion_data in emotions_timeline:
            if 'timestamp' in emotion_data:
                timestamp = emotion_data['timestamp']
                date = timestamp.split('T')[0]  # Extract date part (YYYY-MM-DD)
                emotions_by_date[date].append(emotion_data)
        
        return emotions_by_date
    
    def _identify_emotion_periods(self, daily_dominant_emotions):
        """Identify continuous periods with the same dominant emotion"""
        dates = sorted(daily_dominant_emotions.keys())
        if not dates:
            return []
        
        periods = []
        current_period = {
            'emotion': daily_dominant_emotions[dates[0]],
            'start_date': dates[0],
            'end_date': dates[0],
            'duration': 1
        }
        
        for i in range(1, len(dates)):
            current_date = dates[i]
            current_emotion = daily_dominant_emotions[current_date]
            
            # Check if this is a continuation of the current period
            if current_emotion == current_period['emotion']:
                current_period['end_date'] = current_date
                current_period['duration'] += 1
            else:
                # End the current period and start a new one
                periods.append(current_period)
                current_period = {
                    'emotion': current_emotion,
                    'start_date': current_date,
                    'end_date': current_date,
                    'duration': 1
                }
        
        # Add the last period
        periods.append(current_period)
        
        return periods
    
    def _convert_periods_to_seasons(self, emotion_periods):
        """Convert emotion periods to seasons"""
        seasons = []
        
        for period in emotion_periods:
            # Only consider periods that are long enough to be a season
            if period['duration'] >= self.min_season_duration:
                # Map the emotion to a season
                season_type = self._map_emotion_to_season(period['emotion'])
                
                # Create a season object
                season = {
                    'type': season_type,
                    'name': self.seasons_data['season_definitions'][season_type]['name'],
                    'description': self.seasons_data['season_definitions'][season_type]['description'],
                    'start_date': period['start_date'],
                    'end_date': period['end_date'],
                    'duration': period['duration'],
                    'dominant_emotion': period['emotion']
                }
                
                seasons.append(season)
        
        return seasons
    
    def _map_emotion_to_season(self, emotion):
        """Map an emotion to a season type"""
        # Check each season definition to see if this emotion is a dominant emotion
        for season_type, definition in self.seasons_data['season_definitions'].items():
            if emotion in definition['dominant_emotions']:
                return season_type
        
        # Default to neutral if no match is found
        return 'حياد'
    
    def _get_current_season(self, seasons):
        """Get the current season from a list of seasons"""
        if not seasons:
            return None
        
        # Sort seasons by end date (newest first)
        sorted_seasons = sorted(seasons, key=lambda x: x['end_date'], reverse=True)
        
        # The most recent season is the current season
        return sorted_seasons[0]
    
    def _identify_season_transitions(self, seasons):
        """Identify transitions between seasons"""
        transitions = []
        
        # Sort seasons by start date
        sorted_seasons = sorted(seasons, key=lambda x: x['start_date'])
        
        # Identify transitions between consecutive seasons
        for i in range(1, len(sorted_seasons)):
            prev_season = sorted_seasons[i-1]
            curr_season = sorted_seasons[i]
            
            # Calculate the gap between seasons (if any)
            prev_end = datetime.fromisoformat(prev_season['end_date'])
            curr_start = datetime.fromisoformat(curr_season['start_date'])
            gap_days = (curr_start - prev_end).days - 1  # -1 because end and start dates are inclusive
            
            transition = {
                'from_season': prev_season['type'],
                'to_season': curr_season['type'],
                'from_date': prev_season['end_date'],
                'to_date': curr_season['start_date'],
                'gap_days': max(0, gap_days),
                'transition_type': self._determine_transition_type(prev_season['type'], curr_season['type'])
            }
            
            transitions.append(transition)
        
        return transitions
    
    def _determine_transition_type(self, from_season, to_season):
        """Determine the type of transition between seasons"""
        # Define transition types
        if from_season == to_season:
            return 'استمرار'  # Continuation
        
        # Positive transitions
        if (from_season in ['حزن', 'غضب', 'خوف'] and to_season in ['فرح', 'حب', 'حياد']):
            return 'تحسن'  # Improvement
        
        # Negative transitions
        if (from_season in ['فرح', 'حب', 'حياد'] and to_season in ['حزن', 'غضب', 'خوف']):
            return 'تراجع'  # Decline
        
        # Neutral transitions
        return 'تغيير'  # Change
    
    def _get_existing_seasons(self, session_id=None):
        """Get existing seasons data for a session"""
        if session_id and session_id in self.seasons_data['user_seasons']:
            return self.seasons_data['user_seasons'][session_id]
        elif not session_id:
            return self.seasons_data['global_seasons']
        else:
            return {
                'current_season': None,
                'past_seasons': [],
                'season_transitions': []
            }
    
    def get_current_season(self, session_id=None):
        """Get the current emotional season for a session"""
        # Update seasons first to ensure we have the latest data
        self.update_seasons(session_id)
        
        # Get the seasons data
        if session_id:
            if session_id in self.seasons_data['user_seasons']:
                return self.seasons_data['user_seasons'][session_id]['current_season']
        else:
            return self.seasons_data['global_seasons']['current_season']
        
        return None
    
    def get_season_insight(self, session_id=None):
        """Get an insight about the current emotional season"""
        current_season = self.get_current_season(session_id)
        if not current_season:
            return "لم يتم تحديد موسم عاطفي بعد. نحتاج إلى المزيد من التفاعلات لفهم أنماطك العاطفية."
        
        # Get season type
        season_type = current_season['type']
        season_name = current_season['name']
        dominant_emotion = current_season['dominant_emotion']
        duration = current_season['duration']
        
        # Generate insight based on season type
        insights = {
            'حزن': [
                f"أنت تمر حالياً بـ{season_name}. لاحظت أن مشاعر {dominant_emotion} كانت مهيمنة لمدة {duration} أيام. هل هناك شيء معين يسبب هذه المشاعر؟",
                f"يبدو أنك في {season_name}. من الطبيعي أن تمر بفترات من الحزن، لكن تذكر أن المشاعر متغيرة وهذا الموسم سينتهي في النهاية."
            ],
            'فرح': [
                f"أنت تستمتع حالياً بـ{season_name}! لقد لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام. استمر في الاستمتاع بهذه الفترة الإيجابية.",
                f"يبدو أنك في {season_name} رائع! ما الذي يجلب لك هذه السعادة في الفترة الأخيرة؟"
            ],
            'غضب': [
                f"يبدو أنك تمر بـ{season_name}. لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام. هل هناك شيء يزعجك بشكل خاص؟",
                f"أنت في {season_name} حالياً. الغضب مشروع، لكن من المهم التعامل معه بطريقة صحية."
            ],
            'خوف': [
                f"يبدو أنك تمر بـ{season_name}. لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام. هل هناك شيء محدد يسبب لك القلق؟",
                f"أنت في {season_name} حالياً. القلق جزء طبيعي من الحياة، لكن عندما يستمر لفترة طويلة، قد يكون من المفيد مواجهته بشكل مباشر."
            ],
            'حب': [
                f"أنت تستمتع بـ{season_name} جميل! لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام. هذه فترة خاصة في حياتك.",
                f"يبدو أنك في {season_name} رائع! العلاقات الإيجابية تضيف الكثير من المعنى لحياتنا."
            ],
            'حياد': [
                f"أنت تمر بـ{season_name}. لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام. هذه فترة من الاستقرار العاطفي.",
                f"يبدو أنك في {season_name}. أحياناً تكون فترات الهدوء فرصة للتأمل والتفكير في المستقبل."
            ]
        }
        
        # Get insights for this season type or use generic insights
        season_insights = insights.get(season_type, [
            f"أنت تمر بموسم عاطفي مثير للاهتمام. لاحظت مشاعر {dominant_emotion} لمدة {duration} أيام.",
            f"يبدو أن مشاعرك في الفترة الأخيرة تتمحور حول {dominant_emotion}. هل تود مشاركة المزيد عن هذه المشاعر؟"
        ])
        
        return random.choice(season_insights)
    
    def get_seasonal_greeting(self, session_id=None):
        """Get a greeting based on the current emotional season"""
        current_season = self.get_current_season(session_id)
        if not current_season:
            return "مرحباً! كيف حالك اليوم؟"
        
        season_type = current_season['type']
        
        # Greetings for different season types
        greetings = {
            'حزن': [
                "مرحباً، أرى أنك تمر بفترة صعبة. كيف يمكنني دعمك اليوم؟",
                "أهلاً، أنا هنا للاستماع إليك. كيف تشعر اليوم؟"
            ],
            'فرح': [
                "مرحباً! يبدو أنك في حالة جيدة. ما الذي يجعلك سعيداً اليوم؟",
                "أهلاً! أرى أن طاقتك إيجابية. كيف يمكنني المساعدة في الحفاظ على هذه الطاقة؟"
            ],
            'غضب': [
                "مرحباً، أشعر أن هناك شيئاً يزعجك. هل تود التحدث عنه؟",
                "أهلاً، أنا هنا إذا أردت مشاركة ما يغضبك."
            ],
            'خوف': [
                "مرحباً، أنا هنا معك. هل هناك شيء يقلقك اليوم؟",
                "أهلاً، أشعر أنك قلق. كيف يمكنني مساعدتك في الشعور بالأمان؟"
            ],
            'حب': [
                "مرحباً! يبدو أن الحب يملأ حياتك. أخبرني المزيد!",
                "أهلاً! أرى أن مشاعرك الإيجابية تتدفق. كيف حالك اليوم؟"
            ],
            'حياد': [
                "مرحباً! كيف يمكنني مساعدتك اليوم؟",
                "أهلاً! ما الذي يشغل تفكيرك اليوم؟"
            ]
        }
        
        # Get greetings for this season type or use generic greetings
        season_greetings = greetings.get(season_type, [
            "مرحباً! كيف حالك اليوم؟",
            "أهلاً! كيف يمكنني مساعدتك؟"
        ])
        
        return random.choice(season_greetings)

# Example usage
if __name__ == "__main__":
    seasons = EmotionalSeasons()
    current_season = seasons.get_current_season("user_123")
    if current_season:
        print(f"Current season: {current_season['name']}")
        print(f"Insight: {seasons.get_season_insight('user_123')}")
        print(f"Greeting: {seasons.get_seasonal_greeting('user_123')}")
    else:
        print("No emotional season detected yet.")