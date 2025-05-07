import json
import os
from datetime import datetime
import re
from memory_store import MemoryStore

class LongTermConsciousness:
    """
    Long Term Consciousness for Mashaaer
    
    This class stores and manages the user's values, boundaries, and relationships,
    and responds based on this deep understanding.
    
    Features:
    - Values tracking: Stores what matters to the user
    - Boundaries tracking: Remembers limits that shouldn't be crossed
    - Relationship tracking: Stores information about people the user mentions
    - Deep understanding: Responds based on accumulated knowledge
    """
    
    def __init__(self, memory_store=None):
        """Initialize the long term consciousness with a memory store"""
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.consciousness_data = {
            'values': {},        # What matters to the user
            'boundaries': {},    # Limits that shouldn't be crossed
            'relationships': {}, # People the user cares about or mentions
            'insights': [],      # Deep insights about the user
            'last_updated': datetime.now().isoformat()
        }
        
        # Load existing consciousness data
        self.load_consciousness()
    
    def load_consciousness(self):
        """Load consciousness data from storage file"""
        consciousness_path = 'data/long_term_consciousness.json'
        try:
            if os.path.exists(consciousness_path):
                with open(consciousness_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.consciousness_data = data
        except Exception as e:
            print(f"Error loading consciousness data: {e}")
            # Initialize with empty data if loading fails
            self.consciousness_data = {
                'values': {},
                'boundaries': {},
                'relationships': {},
                'insights': [],
                'last_updated': datetime.now().isoformat()
            }
    
    def save_consciousness(self):
        """Save consciousness data to storage file"""
        consciousness_path = 'data/long_term_consciousness.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(consciousness_path), exist_ok=True)
            
            with open(consciousness_path, 'w', encoding='utf-8') as f:
                json.dump(self.consciousness_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving consciousness data: {e}")
    
    def process_interaction(self, user_input, system_response, emotion=None):
        """
        Process an interaction to extract values, boundaries, and relationships
        
        Args:
            user_input (str): The user's input
            system_response (str): The system's response
            emotion (str, optional): The detected emotion
            
        Returns:
            bool: True if new insights were gained, False otherwise
        """
        insights_gained = False
        
        # Process for values
        if self._extract_values(user_input):
            insights_gained = True
        
        # Process for boundaries
        if self._extract_boundaries(user_input):
            insights_gained = True
        
        # Process for relationships
        if self._extract_relationships(user_input):
            insights_gained = True
        
        # Generate insights if we have enough data
        if (len(self.consciousness_data['values']) >= 3 or 
            len(self.consciousness_data['relationships']) >= 2):
            self._generate_insights()
            insights_gained = True
        
        # Update last updated timestamp
        self.consciousness_data['last_updated'] = datetime.now().isoformat()
        
        # Save consciousness data if insights were gained
        if insights_gained:
            self.save_consciousness()
        
        return insights_gained
    
    def _extract_values(self, text):
        """
        Extract values from text
        
        Args:
            text (str): The text to extract values from
            
        Returns:
            bool: True if values were extracted, False otherwise
        """
        values_extracted = False
        
        # Value indicators in Arabic
        value_patterns = [
            (r'أهتم ب([^.،!؟]+)', 0.7),  # I care about...
            (r'يهمني ([^.،!؟]+)', 0.8),   # ... matters to me
            (r'أقدر ([^.،!؟]+)', 0.6),    # I appreciate...
            (r'أحترم ([^.،!؟]+)', 0.7),   # I respect...
            (r'أؤمن ب([^.،!؟]+)', 0.9),   # I believe in...
            (r'قيمة ([^.،!؟]+)', 0.6),    # The value of...
            (r'مهم بالنسبة لي ([^.،!؟]+)', 0.8),  # Important to me...
            (r'أولوية ([^.،!؟]+)', 0.7),  # Priority...
        ]
        
        for pattern, confidence in value_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                value = match.group(1).strip()
                if value and len(value) > 3:  # Ensure it's not too short
                    self._add_value(value, confidence)
                    values_extracted = True
        
        return values_extracted
    
    def _add_value(self, value, confidence):
        """
        Add a value to the consciousness data
        
        Args:
            value (str): The value to add
            confidence (float): Confidence level (0.0-1.0)
        """
        # Check if this value or a similar one already exists
        for existing_value in self.consciousness_data['values']:
            if value.lower() in existing_value.lower() or existing_value.lower() in value.lower():
                # Update existing value with higher confidence or more mentions
                existing_data = self.consciousness_data['values'][existing_value]
                existing_data['mentions'] += 1
                existing_data['confidence'] = max(existing_data['confidence'], confidence)
                existing_data['last_mentioned'] = datetime.now().isoformat()
                return
        
        # Add new value
        self.consciousness_data['values'][value] = {
            'confidence': confidence,
            'mentions': 1,
            'first_mentioned': datetime.now().isoformat(),
            'last_mentioned': datetime.now().isoformat()
        }
    
    def _extract_boundaries(self, text):
        """
        Extract boundaries from text
        
        Args:
            text (str): The text to extract boundaries from
            
        Returns:
            bool: True if boundaries were extracted, False otherwise
        """
        boundaries_extracted = False
        
        # Boundary indicators in Arabic
        boundary_patterns = [
            (r'لا أحب ([^.،!؟]+)', 0.6),  # I don't like...
            (r'أكره ([^.،!؟]+)', 0.8),    # I hate...
            (r'لا أريد ([^.،!؟]+)', 0.7), # I don't want...
            (r'يزعجني ([^.،!؟]+)', 0.7),  # ... bothers me
            (r'لا تتحدث عن ([^.،!؟]+)', 0.9),  # Don't talk about...
            (r'توقف عن ([^.،!؟]+)', 0.8), # Stop...
            (r'لا تسألني عن ([^.،!؟]+)', 0.9),  # Don't ask me about...
            (r'خط أحمر ([^.،!؟]+)', 0.9), # Red line...
        ]
        
        for pattern, confidence in boundary_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                boundary = match.group(1).strip()
                if boundary and len(boundary) > 3:  # Ensure it's not too short
                    self._add_boundary(boundary, confidence)
                    boundaries_extracted = True
        
        return boundaries_extracted
    
    def _add_boundary(self, boundary, confidence):
        """
        Add a boundary to the consciousness data
        
        Args:
            boundary (str): The boundary to add
            confidence (float): Confidence level (0.0-1.0)
        """
        # Check if this boundary or a similar one already exists
        for existing_boundary in self.consciousness_data['boundaries']:
            if boundary.lower() in existing_boundary.lower() or existing_boundary.lower() in boundary.lower():
                # Update existing boundary with higher confidence or more mentions
                existing_data = self.consciousness_data['boundaries'][existing_boundary]
                existing_data['mentions'] += 1
                existing_data['confidence'] = max(existing_data['confidence'], confidence)
                existing_data['last_mentioned'] = datetime.now().isoformat()
                return
        
        # Add new boundary
        self.consciousness_data['boundaries'][boundary] = {
            'confidence': confidence,
            'mentions': 1,
            'first_mentioned': datetime.now().isoformat(),
            'last_mentioned': datetime.now().isoformat()
        }
    
    def _extract_relationships(self, text):
        """
        Extract relationships from text
        
        Args:
            text (str): The text to extract relationships from
            
        Returns:
            bool: True if relationships were extracted, False otherwise
        """
        relationships_extracted = False
        
        # Relationship indicators in Arabic
        relationship_patterns = [
            (r'صديقي ([^.،!؟]+)', 'friend', 0.8),  # My friend...
            (r'زوجتي ([^.،!؟]+)', 'spouse', 0.9),  # My wife...
            (r'زوجي ([^.،!؟]+)', 'spouse', 0.9),   # My husband...
            (r'أخي ([^.،!؟]+)', 'sibling', 0.8),   # My brother...
            (r'أختي ([^.،!؟]+)', 'sibling', 0.8),  # My sister...
            (r'ابني ([^.،!؟]+)', 'child', 0.9),    # My son...
            (r'ابنتي ([^.،!؟]+)', 'child', 0.9),   # My daughter...
            (r'والدي ([^.،!؟]+)', 'parent', 0.9),  # My father...
            (r'والدتي ([^.،!؟]+)', 'parent', 0.9), # My mother...
            (r'أحب ([^.،!؟]+)', 'loved_one', 0.7), # I love...
            (r'أكره ([^.،!؟]+)', 'disliked', 0.7), # I hate...
        ]
        
        for pattern, relation_type, confidence in relationship_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                name = match.group(1).strip()
                if name and len(name) > 2:  # Ensure it's not too short
                    self._add_relationship(name, relation_type, confidence)
                    relationships_extracted = True
        
        return relationships_extracted
    
    def _add_relationship(self, name, relation_type, confidence):
        """
        Add a relationship to the consciousness data
        
        Args:
            name (str): The name of the person
            relation_type (str): The type of relationship
            confidence (float): Confidence level (0.0-1.0)
        """
        # Check if this person already exists
        if name in self.consciousness_data['relationships']:
            # Update existing relationship
            existing_data = self.consciousness_data['relationships'][name]
            existing_data['mentions'] += 1
            
            # Update relation type if confidence is higher
            if confidence > existing_data.get('confidence', 0):
                existing_data['relation_type'] = relation_type
                existing_data['confidence'] = confidence
            
            existing_data['last_mentioned'] = datetime.now().isoformat()
            return
        
        # Add new relationship
        self.consciousness_data['relationships'][name] = {
            'relation_type': relation_type,
            'confidence': confidence,
            'mentions': 1,
            'first_mentioned': datetime.now().isoformat(),
            'last_mentioned': datetime.now().isoformat(),
            'sentiment': 'positive' if relation_type in ['friend', 'spouse', 'child', 'parent', 'loved_one'] else 'negative'
        }
    
    def _generate_insights(self):
        """Generate insights based on accumulated data"""
        # Only generate new insights periodically
        last_updated = datetime.fromisoformat(self.consciousness_data['last_updated'])
        now = datetime.now()
        
        # If less than a day has passed since the last insight generation, skip
        if (now - last_updated).days < 1 and len(self.consciousness_data['insights']) > 0:
            return
        
        # Generate insights based on values
        if len(self.consciousness_data['values']) >= 3:
            top_values = sorted(
                self.consciousness_data['values'].items(),
                key=lambda x: x[1]['confidence'] * x[1]['mentions'],
                reverse=True
            )[:3]
            
            value_insight = {
                'type': 'values',
                'timestamp': datetime.now().isoformat(),
                'content': f"يبدو أن {top_values[0][0]} و{top_values[1][0]} و{top_values[2][0]} من أهم القيم بالنسبة لك.",
                'confidence': 0.7
            }
            
            self.consciousness_data['insights'].append(value_insight)
        
        # Generate insights based on relationships
        if len(self.consciousness_data['relationships']) >= 2:
            important_relationships = sorted(
                self.consciousness_data['relationships'].items(),
                key=lambda x: x[1]['confidence'] * x[1]['mentions'],
                reverse=True
            )[:2]
            
            relationship_insight = {
                'type': 'relationships',
                'timestamp': datetime.now().isoformat(),
                'content': f"يبدو أن علاقتك مع {important_relationships[0][0]} و{important_relationships[1][0]} مهمة جداً في حياتك.",
                'confidence': 0.7
            }
            
            self.consciousness_data['insights'].append(relationship_insight)
        
        # Generate insights based on boundaries
        if len(self.consciousness_data['boundaries']) >= 2:
            strong_boundaries = sorted(
                self.consciousness_data['boundaries'].items(),
                key=lambda x: x[1]['confidence'],
                reverse=True
            )[:2]
            
            boundary_insight = {
                'type': 'boundaries',
                'timestamp': datetime.now().isoformat(),
                'content': f"لاحظت أنك لا ترتاح للحديث عن {strong_boundaries[0][0]} و{strong_boundaries[1][0]}. سأحترم هذه الحدود.",
                'confidence': 0.8
            }
            
            self.consciousness_data['insights'].append(boundary_insight)
        
        # Limit the number of insights
        if len(self.consciousness_data['insights']) > 10:
            self.consciousness_data['insights'] = self.consciousness_data['insights'][-10:]
    
    def get_relevant_consciousness(self, text):
        """
        Get relevant consciousness data based on input text
        
        Args:
            text (str): The input text to find relevant consciousness for
            
        Returns:
            dict: Relevant consciousness data
        """
        relevant_data = {
            'values': [],
            'boundaries': [],
            'relationships': [],
            'insights': []
        }
        
        # Check for values
        for value, data in self.consciousness_data['values'].items():
            if value.lower() in text.lower():
                relevant_data['values'].append({
                    'value': value,
                    'confidence': data['confidence'],
                    'mentions': data['mentions']
                })
        
        # Check for boundaries
        for boundary, data in self.consciousness_data['boundaries'].items():
            if boundary.lower() in text.lower():
                relevant_data['boundaries'].append({
                    'boundary': boundary,
                    'confidence': data['confidence'],
                    'mentions': data['mentions']
                })
        
        # Check for relationships
        for name, data in self.consciousness_data['relationships'].items():
            if name.lower() in text.lower():
                relevant_data['relationships'].append({
                    'name': name,
                    'relation_type': data['relation_type'],
                    'sentiment': data['sentiment'],
                    'confidence': data['confidence']
                })
        
        # Add recent insights
        recent_insights = sorted(
            self.consciousness_data['insights'],
            key=lambda x: x['timestamp'],
            reverse=True
        )[:3]
        
        relevant_data['insights'] = recent_insights
        
        return relevant_data
    
    def should_avoid_topic(self, text):
        """
        Check if a topic should be avoided based on boundaries
        
        Args:
            text (str): The text to check
            
        Returns:
            tuple: (should_avoid, reason) where should_avoid is a boolean and reason is a string
        """
        for boundary, data in self.consciousness_data['boundaries'].items():
            if boundary.lower() in text.lower() and data['confidence'] > 0.7:
                return True, f"This topic relates to {boundary}, which appears to be a boundary for the user."
        
        return False, ""
    
    def get_deep_understanding_response(self, text):
        """
        Get a response based on deep understanding of the user
        
        Args:
            text (str): The input text
            
        Returns:
            str: A response based on deep understanding or None if not applicable
        """
        relevant_data = self.get_relevant_consciousness(text)
        
        # If we have relevant values
        if relevant_data['values']:
            value = relevant_data['values'][0]['value']
            return f"إنت حكيتلي من قبل إن {value} مهم بالنسبة لك، وأنا فاهمة ليش بتسأل عن هذا الموضوع."
        
        # If we have relevant relationships
        if relevant_data['relationships']:
            relationship = relevant_data['relationships'][0]
            name = relationship['name']
            relation_type = relationship['relation_type']
            sentiment = relationship['sentiment']
            
            if sentiment == 'positive':
                return f"أعرف أن {name} شخص مهم في حياتك. كيف حاله/حالها؟"
            else:
                return f"سبق وذكرت {name} من قبل. أشعر أن هناك توتر في هذه العلاقة."
        
        # If we have relevant boundaries
        if relevant_data['boundaries']:
            boundary = relevant_data['boundaries'][0]['boundary']
            return f"أتذكر أنك لا ترتاح للحديث عن {boundary}. هل تريد أن نغير الموضوع؟"
        
        # If we have insights but no direct relevance
        if relevant_data['insights']:
            # Return a random insight
            import random
            insight = random.choice(relevant_data['insights'])
            return insight['content']
        
        return None
    
    def get_user_summary(self):
        """
        Get a summary of the user based on consciousness data
        
        Returns:
            dict: User summary
        """
        summary = {
            'top_values': [],
            'important_relationships': [],
            'key_boundaries': [],
            'insights': []
        }
        
        # Get top values
        if self.consciousness_data['values']:
            top_values = sorted(
                self.consciousness_data['values'].items(),
                key=lambda x: x[1]['confidence'] * x[1]['mentions'],
                reverse=True
            )[:5]
            
            summary['top_values'] = [
                {'value': value, 'importance': data['confidence'] * data['mentions']}
                for value, data in top_values
            ]
        
        # Get important relationships
        if self.consciousness_data['relationships']:
            important_relationships = sorted(
                self.consciousness_data['relationships'].items(),
                key=lambda x: x[1]['confidence'] * x[1]['mentions'],
                reverse=True
            )[:5]
            
            summary['important_relationships'] = [
                {
                    'name': name,
                    'relation_type': data['relation_type'],
                    'sentiment': data['sentiment'],
                    'importance': data['confidence'] * data['mentions']
                }
                for name, data in important_relationships
            ]
        
        # Get key boundaries
        if self.consciousness_data['boundaries']:
            key_boundaries = sorted(
                self.consciousness_data['boundaries'].items(),
                key=lambda x: x[1]['confidence'],
                reverse=True
            )[:5]
            
            summary['key_boundaries'] = [
                {'boundary': boundary, 'strength': data['confidence']}
                for boundary, data in key_boundaries
            ]
        
        # Get recent insights
        if self.consciousness_data['insights']:
            recent_insights = sorted(
                self.consciousness_data['insights'],
                key=lambda x: x['timestamp'],
                reverse=True
            )[:5]
            
            summary['insights'] = recent_insights
        
        return summary

# Example usage
if __name__ == "__main__":
    consciousness = LongTermConsciousness()
    
    # Process some example interactions
    consciousness.process_interaction(
        "أنا أهتم كثيراً بعائلتي وأحب قضاء الوقت معهم.",
        "يبدو أن عائلتك مهمة جداً بالنسبة لك.",
        "فرح"
    )
    
    consciousness.process_interaction(
        "لا أحب الحديث عن السياسة، فهي تسبب لي التوتر.",
        "أفهم ذلك، سنتجنب الحديث عن السياسة.",
        "قلق"
    )
    
    consciousness.process_interaction(
        "أخي محمد سافر للدراسة في الخارج وأفتقده كثيراً.",
        "يبدو أنك قريب من أخيك محمد. متى سيعود؟",
        "حزن"
    )
    
    # Get deep understanding response
    response = consciousness.get_deep_understanding_response("هل تعتقد أن محمد سيعود قريباً؟")
    print(f"Deep understanding response: {response}")
    
    # Get user summary
    summary = consciousness.get_user_summary()
    print(f"User summary: {summary}")