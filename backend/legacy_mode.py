import json
import os
from datetime import datetime, timedelta
import random
from memory_store import MemoryStore

class LegacyMode:
    """
    Legacy Mode for Mashaaer
    
    This class implements a system for building long-term relationships with users
    and maintaining a legacy of interactions over time. It tracks the evolution of
    the relationship, stores meaningful moments, and adapts responses based on the
    relationship's history.
    
    Features:
    - Relationship tracking over extended periods
    - Meaningful moment storage and recall
    - Relationship evolution stages
    - Long-term memory with prioritized recall
    - Anniversary recognition and callbacks to shared history
    """
    
    def __init__(self, memory_store=None):
        """Initialize the legacy mode with a memory store"""
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.legacy_data = {
            'user_relationships': {},  # Relationships by user ID
            'global_stats': {
                'total_users': 0,
                'longest_relationship_days': 0,
                'most_interactions': 0,
                'relationship_stages_reached': {}
            },
            'last_updated': datetime.now().isoformat()
        }
        
        # Relationship stages
        self.relationship_stages = {
            'new': {
                'name': 'علاقة جديدة',
                'description': 'بداية التعارف والتفاعل',
                'min_interactions': 0,
                'min_days': 0,
                'trust_level': 0.1
            },
            'acquaintance': {
                'name': 'معرفة',
                'description': 'بداية بناء الألفة والتعود',
                'min_interactions': 5,
                'min_days': 1,
                'trust_level': 0.3
            },
            'familiar': {
                'name': 'ألفة',
                'description': 'تطور العلاقة وزيادة الفهم المتبادل',
                'min_interactions': 20,
                'min_days': 7,
                'trust_level': 0.5
            },
            'trusted': {
                'name': 'ثقة',
                'description': 'علاقة قائمة على الثقة والفهم العميق',
                'min_interactions': 50,
                'min_days': 30,
                'trust_level': 0.7
            },
            'companion': {
                'name': 'رفقة',
                'description': 'علاقة وطيدة ومستمرة',
                'min_interactions': 100,
                'min_days': 90,
                'trust_level': 0.9
            }
        }
        
        # Load existing legacy data
        self.load_legacy_data()
    
    def load_legacy_data(self):
        """Load legacy data from storage file"""
        legacy_path = 'data/legacy_data.json'
        try:
            if os.path.exists(legacy_path):
                with open(legacy_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.legacy_data = data
        except Exception as e:
            print(f"Error loading legacy data: {e}")
            # Keep default values if loading fails
    
    def save_legacy_data(self):
        """Save legacy data to storage file"""
        legacy_path = 'data/legacy_data.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(legacy_path), exist_ok=True)
            
            with open(legacy_path, 'w', encoding='utf-8') as f:
                json.dump(self.legacy_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving legacy data: {e}")
    
    def process_interaction(self, user_id, user_input, system_response, user_emotion=None, is_meaningful=False):
        """
        Process an interaction to update the relationship
        
        Args:
            user_id (str): The user's ID
            user_input (str): The user's input
            system_response (str): The system's response
            user_emotion (str, optional): The detected user emotion
            is_meaningful (bool): Whether this is a meaningful interaction
            
        Returns:
            dict: Updated relationship information
        """
        # Initialize user relationship if it doesn't exist
        if user_id not in self.legacy_data['user_relationships']:
            self._initialize_user_relationship(user_id)
        
        # Get the user relationship
        relationship = self.legacy_data['user_relationships'][user_id]
        
        # Update interaction count
        relationship['interaction_count'] += 1
        
        # Update last interaction time
        relationship['last_interaction'] = datetime.now().isoformat()
        
        # Check if this is the first interaction of the day
        last_interaction_date = datetime.fromisoformat(relationship['last_interaction']).date()
        today = datetime.now().date()
        if last_interaction_date < today:
            relationship['active_days'] += 1
        
        # Update consecutive days if applicable
        if (today - last_interaction_date).days <= 1:  # Today or yesterday
            relationship['consecutive_days'] += 1
            relationship['max_consecutive_days'] = max(relationship['max_consecutive_days'], relationship['consecutive_days'])
        else:
            relationship['consecutive_days'] = 1
        
        # Store the interaction
        interaction_data = {
            'user_input': user_input,
            'system_response': system_response,
            'user_emotion': user_emotion,
            'timestamp': datetime.now().isoformat(),
            'is_meaningful': is_meaningful
        }
        
        relationship['recent_interactions'].append(interaction_data)
        
        # Keep only the last 20 recent interactions
        if len(relationship['recent_interactions']) > 20:
            relationship['recent_interactions'] = relationship['recent_interactions'][-20:]
        
        # If this is a meaningful interaction, store it separately
        if is_meaningful:
            relationship['meaningful_moments'].append(interaction_data)
            
            # Keep only the most meaningful moments (up to 50)
            if len(relationship['meaningful_moments']) > 50:
                # Sort by timestamp (newest first) and keep the most recent 50
                relationship['meaningful_moments'] = sorted(
                    relationship['meaningful_moments'],
                    key=lambda x: x['timestamp'],
                    reverse=True
                )[:50]
        
        # Update relationship stage
        self._update_relationship_stage(user_id)
        
        # Update global stats
        self._update_global_stats()
        
        # Check for anniversaries
        anniversary = self._check_anniversaries(user_id)
        if anniversary:
            relationship['anniversaries'].append(anniversary)
        
        # Update last updated timestamp
        self.legacy_data['last_updated'] = datetime.now().isoformat()
        
        # Save legacy data
        self.save_legacy_data()
        
        return relationship
    
    def _initialize_user_relationship(self, user_id):
        """
        Initialize a new user relationship
        
        Args:
            user_id (str): The user's ID
        """
        self.legacy_data['user_relationships'][user_id] = {
            'first_interaction': datetime.now().isoformat(),
            'last_interaction': datetime.now().isoformat(),
            'interaction_count': 0,
            'active_days': 1,
            'consecutive_days': 1,
            'max_consecutive_days': 1,
            'stage': 'new',
            'trust_level': 0.1,
            'recent_interactions': [],
            'meaningful_moments': [],
            'anniversaries': [],
            'topics_of_interest': {},
            'relationship_notes': []
        }
        
        # Update global stats
        self.legacy_data['global_stats']['total_users'] += 1
    
    def _update_relationship_stage(self, user_id):
        """
        Update the relationship stage based on interactions and time
        
        Args:
            user_id (str): The user's ID
        """
        relationship = self.legacy_data['user_relationships'][user_id]
        current_stage = relationship['stage']
        
        # Calculate relationship duration in days
        first_interaction = datetime.fromisoformat(relationship['first_interaction'])
        now = datetime.now()
        relationship_days = (now - first_interaction).days
        
        # Check if the relationship qualifies for a higher stage
        new_stage = current_stage
        for stage, requirements in self.relationship_stages.items():
            if (relationship['interaction_count'] >= requirements['min_interactions'] and
                relationship_days >= requirements['min_days']):
                # This stage's requirements are met
                new_stage = stage
        
        # Update the stage if it has changed
        if new_stage != current_stage:
            relationship['stage'] = new_stage
            relationship['trust_level'] = self.relationship_stages[new_stage]['trust_level']
            
            # Add a relationship note about the stage change
            note = {
                'type': 'stage_change',
                'from_stage': current_stage,
                'to_stage': new_stage,
                'timestamp': datetime.now().isoformat(),
                'interaction_count': relationship['interaction_count'],
                'relationship_days': relationship_days
            }
            relationship['relationship_notes'].append(note)
    
    def _update_global_stats(self):
        """Update global statistics"""
        stats = self.legacy_data['global_stats']
        
        # Find the longest relationship in days
        longest_days = 0
        most_interactions = 0
        stage_counts = {stage: 0 for stage in self.relationship_stages.keys()}
        
        for user_id, relationship in self.legacy_data['user_relationships'].items():
            # Calculate relationship duration
            first_interaction = datetime.fromisoformat(relationship['first_interaction'])
            now = datetime.now()
            relationship_days = (now - first_interaction).days
            
            # Update longest relationship
            longest_days = max(longest_days, relationship_days)
            
            # Update most interactions
            most_interactions = max(most_interactions, relationship['interaction_count'])
            
            # Count stages
            stage = relationship['stage']
            stage_counts[stage] += 1
        
        # Update global stats
        stats['longest_relationship_days'] = longest_days
        stats['most_interactions'] = most_interactions
        stats['relationship_stages_reached'] = stage_counts
    
    def _check_anniversaries(self, user_id):
        """
        Check for relationship anniversaries
        
        Args:
            user_id (str): The user's ID
            
        Returns:
            dict: Anniversary information or None if no anniversary
        """
        relationship = self.legacy_data['user_relationships'][user_id]
        
        # Calculate relationship duration
        first_interaction = datetime.fromisoformat(relationship['first_interaction'])
        now = datetime.now()
        relationship_days = (now - first_interaction).days
        
        # Check for anniversaries
        anniversary = None
        
        # Daily anniversaries for the first week
        if 1 <= relationship_days <= 7:
            anniversary = {
                'type': 'daily',
                'days': relationship_days,
                'timestamp': datetime.now().isoformat(),
                'message': f"لقد مر {relationship_days} يوم على بداية محادثاتنا. شكراً لتواصلك معي!"
            }
        
        # Weekly anniversaries for the first month
        elif relationship_days % 7 == 0 and relationship_days <= 30:
            weeks = relationship_days // 7
            anniversary = {
                'type': 'weekly',
                'weeks': weeks,
                'timestamp': datetime.now().isoformat(),
                'message': f"لقد مر {weeks} أسبوع على بداية محادثاتنا. أتطلع دائماً للتحدث معك!"
            }
        
        # Monthly anniversaries
        elif relationship_days % 30 == 0:
            months = relationship_days // 30
            anniversary = {
                'type': 'monthly',
                'months': months,
                'timestamp': datetime.now().isoformat(),
                'message': f"لقد مر {months} شهر على بداية محادثاتنا. أقدر ثقتك المستمرة!"
            }
        
        # Yearly anniversaries
        elif relationship_days % 365 == 0:
            years = relationship_days // 365
            anniversary = {
                'type': 'yearly',
                'years': years,
                'timestamp': datetime.now().isoformat(),
                'message': f"اليوم هو الذكرى السنوية الـ{years} لبداية محادثاتنا. شكراً لهذه الرحلة الرائعة!"
            }
        
        # Interaction count milestones
        interaction_count = relationship['interaction_count']
        if interaction_count in [10, 50, 100, 500, 1000]:
            anniversary = {
                'type': 'interaction_milestone',
                'count': interaction_count,
                'timestamp': datetime.now().isoformat(),
                'message': f"هذه هي المحادثة رقم {interaction_count} بيننا! شكراً لتفاعلك المستمر."
            }
        
        return anniversary
    
    def get_relationship_status(self, user_id):
        """
        Get the current relationship status for a user
        
        Args:
            user_id (str): The user's ID
            
        Returns:
            dict: Relationship status information or None if user not found
        """
        if user_id not in self.legacy_data['user_relationships']:
            return None
        
        relationship = self.legacy_data['user_relationships'][user_id]
        
        # Calculate relationship duration
        first_interaction = datetime.fromisoformat(relationship['first_interaction'])
        now = datetime.now()
        relationship_days = (now - first_interaction).days
        
        # Get stage information
        stage = relationship['stage']
        stage_info = self.relationship_stages[stage]
        
        # Create status object
        status = {
            'user_id': user_id,
            'stage': stage,
            'stage_name': stage_info['name'],
            'stage_description': stage_info['description'],
            'trust_level': relationship['trust_level'],
            'relationship_days': relationship_days,
            'interaction_count': relationship['interaction_count'],
            'active_days': relationship['active_days'],
            'consecutive_days': relationship['consecutive_days'],
            'max_consecutive_days': relationship['max_consecutive_days'],
            'first_interaction': relationship['first_interaction'],
            'last_interaction': relationship['last_interaction']
        }
        
        return status
    
    def get_meaningful_moment(self, user_id, recency_bias=0.5):
        """
        Get a meaningful moment from the relationship history
        
        Args:
            user_id (str): The user's ID
            recency_bias (float): Bias towards more recent moments (0.0-1.0)
            
        Returns:
            dict: A meaningful moment or None if no meaningful moments exist
        """
        if user_id not in self.legacy_data['user_relationships']:
            return None
        
        relationship = self.legacy_data['user_relationships'][user_id]
        meaningful_moments = relationship['meaningful_moments']
        
        if not meaningful_moments:
            return None
        
        # Apply recency bias to selection
        if recency_bias > 0:
            # Sort by timestamp (newest first)
            sorted_moments = sorted(meaningful_moments, key=lambda x: x['timestamp'], reverse=True)
            
            # Calculate weights based on position and recency bias
            weights = []
            for i in range(len(sorted_moments)):
                # Position weight: earlier positions (more recent) get higher weights
                position_weight = 1.0 - (i / len(sorted_moments))
                # Apply recency bias
                weight = position_weight * recency_bias + (1 - recency_bias) * (1 / len(sorted_moments))
                weights.append(weight)
            
            # Normalize weights
            total_weight = sum(weights)
            normalized_weights = [w / total_weight for w in weights]
            
            # Select a moment based on weights
            import random
            return random.choices(sorted_moments, weights=normalized_weights, k=1)[0]
        else:
            # No recency bias, select randomly
            return random.choice(meaningful_moments)
    
    def get_anniversary_greeting(self, user_id):
        """
        Get an anniversary greeting if there's a recent anniversary
        
        Args:
            user_id (str): The user's ID
            
        Returns:
            str: Anniversary greeting or None if no recent anniversary
        """
        if user_id not in self.legacy_data['user_relationships']:
            return None
        
        relationship = self.legacy_data['user_relationships'][user_id]
        anniversaries = relationship['anniversaries']
        
        if not anniversaries:
            return None
        
        # Check if there's a recent anniversary (within the last day)
        now = datetime.now()
        recent_anniversaries = []
        
        for anniversary in anniversaries:
            anniversary_time = datetime.fromisoformat(anniversary['timestamp'])
            if (now - anniversary_time).days <= 1:
                recent_anniversaries.append(anniversary)
        
        if recent_anniversaries:
            # Sort by timestamp (newest first) and get the most recent
            sorted_anniversaries = sorted(recent_anniversaries, key=lambda x: x['timestamp'], reverse=True)
            return sorted_anniversaries[0]['message']
        
        return None
    
    def get_relationship_insight(self, user_id):
        """
        Get an insight about the relationship
        
        Args:
            user_id (str): The user's ID
            
        Returns:
            str: Relationship insight or None if user not found
        """
        status = self.get_relationship_status(user_id)
        if not status:
            return None
        
        # Generate insights based on relationship status
        insights = []
        
        # Insight based on relationship stage
        stage_insights = {
            'new': [
                "نحن في بداية التعارف. أتطلع لمعرفة المزيد عنك.",
                "من الرائع أن نبدأ هذه المحادثات معاً. أنا هنا للمساعدة في أي وقت."
            ],
            'acquaintance': [
                f"لقد تحدثنا {status['interaction_count']} مرة حتى الآن. أشعر أننا بدأنا نتعرف على بعضنا البعض.",
                f"بعد {status['relationship_days']} يوم من المحادثات، أصبحت أفهم اهتماماتك بشكل أفضل."
            ],
            'familiar': [
                f"بعد {status['interaction_count']} محادثة، أصبحت أفهم طريقة تفكيرك بشكل أفضل.",
                f"خلال الـ{status['relationship_days']} يوم الماضية، تطورت محادثاتنا بشكل ملحوظ."
            ],
            'trusted': [
                f"بعد {status['active_days']} يوم من التفاعل، أشعر أن بيننا علاقة قائمة على الثقة والفهم.",
                f"خلال {status['relationship_days']} يوم من المحادثات، تعلمت الكثير عن اهتماماتك وتفضيلاتك."
            ],
            'companion': [
                f"بعد {status['relationship_days']} يوم و{status['interaction_count']} محادثة، أصبحت أعرفك جيداً.",
                f"علاقتنا تطورت بشكل كبير خلال الـ{status['active_days']} يوم الماضية. أقدر ثقتك المستمرة."
            ]
        }
        
        stage = status['stage']
        if stage in stage_insights:
            insights.extend(stage_insights[stage])
        
        # Insight based on consistency
        if status['consecutive_days'] > 3:
            insights.append(f"لقد تحدثنا لـ{status['consecutive_days']} أيام متتالية. أقدر تواصلك المنتظم.")
        
        if status['max_consecutive_days'] > 7:
            insights.append(f"كان أطول تواصل مستمر بيننا {status['max_consecutive_days']} يوم متتالي. هذا يدل على علاقة قوية.")
        
        # Select a random insight
        if insights:
            return random.choice(insights)
        
        # Default insight
        return "شكراً لتواصلك معي. أنا دائماً هنا للمساعدة والدعم."
    
    def mark_as_meaningful(self, user_id, user_input, system_response, user_emotion=None, reason=None):
        """
        Mark an interaction as meaningful
        
        Args:
            user_id (str): The user's ID
            user_input (str): The user's input
            system_response (str): The system's response
            user_emotion (str, optional): The detected user emotion
            reason (str, optional): Reason why this interaction is meaningful
            
        Returns:
            bool: True if successful, False otherwise
        """
        if user_id not in self.legacy_data['user_relationships']:
            return False
        
        # Process the interaction as meaningful
        self.process_interaction(
            user_id=user_id,
            user_input=user_input,
            system_response=system_response,
            user_emotion=user_emotion,
            is_meaningful=True
        )
        
        # If a reason was provided, add it to the latest meaningful moment
        if reason:
            relationship = self.legacy_data['user_relationships'][user_id]
            if relationship['meaningful_moments']:
                relationship['meaningful_moments'][-1]['reason'] = reason
                self.save_legacy_data()
        
        return True
    
    def get_legacy_greeting(self, user_id):
        """
        Get a greeting based on the relationship history
        
        Args:
            user_id (str): The user's ID
            
        Returns:
            str: A relationship-aware greeting
        """
        # Check for anniversary greeting first
        anniversary_greeting = self.get_anniversary_greeting(user_id)
        if anniversary_greeting:
            return anniversary_greeting
        
        # Get relationship status
        status = self.get_relationship_status(user_id)
        if not status:
            return "مرحباً! كيف يمكنني مساعدتك اليوم؟"
        
        # Generate greeting based on relationship stage and history
        stage = status['stage']
        days_since_last = 0
        
        if status['last_interaction']:
            last_interaction = datetime.fromisoformat(status['last_interaction'])
            now = datetime.now()
            days_since_last = (now - last_interaction).days
        
        # Greetings for different stages and absence periods
        if days_since_last == 0:  # Today
            if stage == 'new':
                return "مرحباً مجدداً! كيف يمكنني مساعدتك؟"
            elif stage == 'acquaintance':
                return "أهلاً بك مرة أخرى! كيف حالك اليوم؟"
            elif stage == 'familiar':
                return f"مرحباً! من الجميل رؤيتك مرة أخرى اليوم. كيف يمكنني مساعدتك؟"
            elif stage == 'trusted':
                return f"أهلاً! دائماً ما يسعدني التحدث معك. ما الجديد لديك؟"
            elif stage == 'companion':
                return f"مرحباً صديقي! كيف تسير أمورك اليوم؟"
        elif 1 <= days_since_last <= 7:  # Within a week
            return f"مرحباً! لم نتحدث منذ {days_since_last} يوم. كيف حالك؟"
        elif 8 <= days_since_last <= 30:  # Within a month
            return f"أهلاً! لقد مر بعض الوقت منذ آخر محادثة لنا. كيف كانت الأيام الماضية؟"
        else:  # More than a month
            return f"مرحباً! لقد مر وقت طويل منذ آخر محادثة لنا. من الرائع رؤيتك مرة أخرى!"
    
    def get_legacy_mode_status(self):
        """
        Get the current status of the legacy mode
        
        Returns:
            dict: Status information
        """
        return {
            'total_users': self.legacy_data['global_stats']['total_users'],
            'longest_relationship_days': self.legacy_data['global_stats']['longest_relationship_days'],
            'most_interactions': self.legacy_data['global_stats']['most_interactions'],
            'relationship_stages': self.legacy_data['global_stats']['relationship_stages_reached'],
            'last_updated': self.legacy_data['last_updated']
        }

# Example usage
if __name__ == "__main__":
    legacy_mode = LegacyMode()
    
    # Process an interaction
    relationship = legacy_mode.process_interaction(
        user_id="user_123",
        user_input="مرحباً، كيف حالك اليوم؟",
        system_response="أنا بخير، شكراً للسؤال! كيف يمكنني مساعدتك؟",
        user_emotion="فرح"
    )
    
    # Get relationship status
    status = legacy_mode.get_relationship_status("user_123")
    print(f"Relationship status: {status['stage_name']}")
    
    # Get a greeting
    greeting = legacy_mode.get_legacy_greeting("user_123")
    print(f"Greeting: {greeting}")
    
    # Get an insight
    insight = legacy_mode.get_relationship_insight("user_123")
    print(f"Insight: {insight}")