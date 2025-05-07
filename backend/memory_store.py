import json
import os
import time
import threading
from datetime import datetime
import re

class MemoryStore:
    """
    Memory Store for Flask backend

    This class implements a memory system with:
    - Episodic Memory: Stores specific user interactions and experiences
    - Semantic Memory: Stores general knowledge and facts about the user
    - Memory Retrieval: Provides methods to retrieve relevant memories
    - Memory Consolidation: Periodically consolidates memories for better recall
    """

    def __init__(self, config=None):
        """Initialize the memory store with default configuration"""
        self.episodic_memories = []
        self.semantic_memories = {}
        self.last_consolidation = datetime.now().isoformat()

        # Default configuration
        self.config = {
            'storage_path': 'data/memory_store.json',
            'max_episodic_memories': 100,
            'consolidation_interval': 24 * 60 * 60,  # 24 hours in seconds
        }

        # Update with provided config
        if config:
            self.config.update(config)

        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.config['storage_path']), exist_ok=True)

        # Load existing memories
        self.load_memories()

        # Set up consolidation timer
        self.setup_consolidation_timer()

    def load_memories(self):
        """Load memories from storage file"""
        try:
            if os.path.exists(self.config['storage_path']):
                with open(self.config['storage_path'], 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.episodic_memories = data.get('episodic_memories', [])
                    self.semantic_memories = data.get('semantic_memories', {})
                    self.last_consolidation = data.get('last_consolidation', datetime.now().isoformat())
        except Exception as e:
            print(f"Error loading memories: {e}")
            # Initialize with empty memories if loading fails
            self.episodic_memories = []
            self.semantic_memories = {}
            self.last_consolidation = datetime.now().isoformat()

    def save_memories(self):
        """Save memories to storage file"""
        try:
            data = {
                'episodic_memories': self.episodic_memories,
                'semantic_memories': self.semantic_memories,
                'last_consolidation': self.last_consolidation
            }

            with open(self.config['storage_path'], 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving memories: {e}")

    def setup_consolidation_timer(self):
        """Set up a timer for periodic memory consolidation"""
        # Check if consolidation is needed
        last_consolidation_time = datetime.fromisoformat(self.last_consolidation).timestamp()
        current_time = datetime.now().timestamp()

        if current_time - last_consolidation_time >= self.config['consolidation_interval']:
            self.consolidate_memories()

        # Set up timer for next consolidation
        def consolidation_task():
            while True:
                time.sleep(self.config['consolidation_interval'])
                self.consolidate_memories()

        # Start consolidation thread
        thread = threading.Thread(target=consolidation_task, daemon=True)
        thread.start()

    def store_episodic_memory(self, memory):
        """
        Store an episodic memory (specific interaction or experience)

        Args:
            memory (dict): The memory to store with keys:
                - input: User input
                - response: System response
                - emotion: Associated emotion
                - context: Additional context

        Returns:
            str: Timestamp of the stored memory
        """
        if not memory or 'input' not in memory:
            return None

        episodic_memory = {
            'type': 'episodic',
            'input': memory.get('input', ''),
            'response': memory.get('response', ''),
            'emotion': memory.get('emotion', 'neutral'),
            'context': memory.get('context', {}),
            'timestamp': datetime.now().isoformat(),
            'importance': self.calculate_importance(memory),
            'retrieval_count': 0
        }

        # Add to episodic memories
        self.episodic_memories.insert(0, episodic_memory)

        # Limit the number of episodic memories
        if len(self.episodic_memories) > self.config['max_episodic_memories']:
            # Sort by importance before removing
            self.episodic_memories.sort(key=lambda x: x['importance'], reverse=True)
            self.episodic_memories = self.episodic_memories[:self.config['max_episodic_memories']]

        # Extract semantic information from the episodic memory
        self.extract_semantic_information(episodic_memory)

        # Save memories
        self.save_memories()

        return episodic_memory['timestamp']

    def calculate_importance(self, memory):
        """
        Calculate the importance of a memory for retention

        Args:
            memory (dict): The memory to evaluate

        Returns:
            float: Importance score (0-1)
        """
        importance = 0.5  # Default importance

        # Emotional memories are more important
        if memory.get('emotion') and memory['emotion'] != 'neutral':
            emotion_importance = {
                'happy': 0.7,
                'sad': 0.8,
                'angry': 0.8,
                'anxious': 0.7,
                'surprised': 0.6,
                'neutral': 0.5
            }
            importance = emotion_importance.get(memory['emotion'], importance)

        # Longer interactions might be more important
        if memory.get('input') and len(memory['input']) > 100:
            importance += 0.1

        # Recent memories are more important (will be adjusted during consolidation)
        importance += 0.2

        return min(importance, 1.0)

    def extract_semantic_information(self, episodic_memory):
        """
        Extract semantic information from episodic memories

        Args:
            episodic_memory (dict): The episodic memory to extract from
        """
        # Simple extraction based on keywords
        input_text = episodic_memory['input'].lower()

        # Extract personal information
        if 'اسمي' in input_text or 'my name is' in input_text:
            name_match = re.search(r'اسمي\s+(\S+)', input_text) or re.search(r'my name is\s+(\S+)', input_text)
            if name_match:
                self.store_semantic_memory('personal_info', 'name', name_match.group(1))

        # Extract preferences
        if 'أحب' in input_text or 'i like' in input_text:
            like_match = re.search(r'أحب\s+(.+)', input_text) or re.search(r'i like\s+(.+)', input_text)
            if like_match:
                self.store_semantic_memory('preferences', 'likes', like_match.group(1))

        if 'لا أحب' in input_text or 'i don\'t like' in input_text or 'i dislike' in input_text:
            dislike_match = re.search(r'لا أحب\s+(.+)', input_text) or re.search(r'i don\'t like\s+(.+)', input_text) or re.search(r'i dislike\s+(.+)', input_text)
            if dislike_match:
                self.store_semantic_memory('preferences', 'dislikes', dislike_match.group(1))

        # Extract locations
        if 'أعيش في' in input_text or 'i live in' in input_text:
            location_match = re.search(r'أعيش في\s+(.+)', input_text) or re.search(r'i live in\s+(.+)', input_text)
            if location_match:
                self.store_semantic_memory('personal_info', 'location', location_match.group(1))

    def store_semantic_memory(self, category, key, value):
        """
        Store semantic memory (general knowledge about the user)

        Args:
            category (str): Category of the information
            key (str): Key for the information
            value (any): Value to store
        """
        if not category or not key or value is None:
            return

        # Initialize category if it doesn't exist
        if category not in self.semantic_memories:
            self.semantic_memories[category] = {}

        # Store the value
        self.semantic_memories[category][key] = {
            'value': value,
            'timestamp': datetime.now().isoformat(),
            'confidence': 0.8,  # Initial confidence
            'sources': 1  # Number of sources confirming this information
        }

        # Save memories
        self.save_memories()

    def retrieve_episodic_memories(self, query=None):
        """
        Retrieve episodic memories based on query

        Args:
            query (dict): Query parameters
                - text: Text to search for
                - emotion: Emotion to filter by
                - limit: Maximum number of results

        Returns:
            list: Matching episodic memories
        """
        if query is None:
            query = {}

        text = query.get('text')
        emotion = query.get('emotion')
        limit = query.get('limit', 5)

        # Filter memories based on query
        results = self.episodic_memories.copy()

        if text:
            search_text = text.lower()
            results = [memory for memory in results if 
                       search_text in memory['input'].lower() or 
                       search_text in memory['response'].lower()]

        if emotion:
            results = [memory for memory in results if memory['emotion'] == emotion]

        # Sort by timestamp (newest first)
        results.sort(key=lambda x: x['timestamp'], reverse=True)

        # Limit results
        results = results[:limit]

        # Update retrieval count for returned memories
        for result in results:
            for memory in self.episodic_memories:
                if memory['timestamp'] == result['timestamp']:
                    memory['retrieval_count'] += 1
                    memory['importance'] += 0.1  # Increase importance when retrieved
                    memory['importance'] = min(memory['importance'], 1.0)

        # Save after updating retrieval counts
        self.save_memories()

        return results

    def retrieve_semantic_memory(self, category, key=None):
        """
        Retrieve semantic memory

        Args:
            category (str): Category to retrieve
            key (str, optional): Specific key to retrieve

        Returns:
            dict: The semantic memory
        """
        if not category:
            return None

        # Return the entire category if no key is specified
        if category not in self.semantic_memories:
            return None

        if key is None:
            return self.semantic_memories[category]

        # Return the specific key
        return self.semantic_memories[category].get(key)

    def consolidate_memories(self):
        """Consolidate memories to improve recall and reduce storage"""
        print('Consolidating memories...')

        # Update importance based on age and retrieval count
        current_time = datetime.now().timestamp()

        for memory in self.episodic_memories:
            memory_time = datetime.fromisoformat(memory['timestamp']).timestamp()
            age_in_days = (current_time - memory_time) / (24 * 60 * 60)

            # Reduce importance based on age
            if age_in_days > 30:
                memory['importance'] -= 0.2
            elif age_in_days > 7:
                memory['importance'] -= 0.1

            # Increase importance based on retrieval count
            if memory['retrieval_count'] > 5:
                memory['importance'] += 0.3
            elif memory['retrieval_count'] > 2:
                memory['importance'] += 0.2

            # Ensure importance is within bounds
            memory['importance'] = max(0.1, min(memory['importance'], 1.0))

        # Remove low-importance memories if we're over the limit
        if len(self.episodic_memories) > self.config['max_episodic_memories']:
            self.episodic_memories.sort(key=lambda x: x['importance'], reverse=True)
            self.episodic_memories = self.episodic_memories[:self.config['max_episodic_memories']]

        # Update semantic memories confidence based on multiple sources
        for category in self.semantic_memories:
            for key in self.semantic_memories[category]:
                memory = self.semantic_memories[category][key]
                if memory['sources'] > 3:
                    memory['confidence'] = 0.95
                elif memory['sources'] > 1:
                    memory['confidence'] = 0.9

        # Update last consolidation timestamp
        self.last_consolidation = datetime.now().isoformat()

        # Save consolidated memories
        self.save_memories()

        print('Memory consolidation complete')

    def get_user_summary(self):
        """
        Get a summary of the user based on semantic memories

        Returns:
            dict: User summary
        """
        summary = {
            'personal_info': {},
            'preferences': {
                'likes': [],
                'dislikes': []
            },
            'emotional_trends': self.get_emotional_trends()
        }

        # Extract personal info
        if 'personal_info' in self.semantic_memories:
            for key in self.semantic_memories['personal_info']:
                summary['personal_info'][key] = self.semantic_memories['personal_info'][key]['value']

        # Extract preferences
        if 'preferences' in self.semantic_memories:
            if 'likes' in self.semantic_memories['preferences']:
                like_value = self.semantic_memories['preferences']['likes']['value']
                if isinstance(like_value, list):
                    summary['preferences']['likes'].extend(like_value)
                else:
                    summary['preferences']['likes'].append(like_value)
            if 'dislikes' in self.semantic_memories['preferences']:
                dislike_value = self.semantic_memories['preferences']['dislikes']['value']
                if isinstance(dislike_value, list):
                    summary['preferences']['dislikes'].extend(dislike_value)
                else:
                    summary['preferences']['dislikes'].append(dislike_value)

        return summary

    def get_emotional_trends(self):
        """
        Get emotional trends from episodic memories

        Returns:
            dict: Emotional trends
        """
        emotions = [memory['emotion'] for memory in self.episodic_memories]
        emotion_counts = {}

        for emotion in emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        # Calculate percentages
        total = len(emotions)
        trends = {}

        if total > 0:
            for emotion, count in emotion_counts.items():
                trends[emotion] = (count / total) * 100

        return trends

    def get_all_memories(self):
        """
        Get all memories (both episodic and semantic)

        Returns:
            list: All memories with IDs
        """
        all_memories = []

        # Add episodic memories with IDs
        for memory in self.episodic_memories:
            memory_with_id = memory.copy()
            # Use timestamp as ID if not already present
            if 'id' not in memory_with_id:
                memory_with_id['id'] = memory_with_id.get('timestamp')
            all_memories.append(memory_with_id)

        # Add semantic memories with IDs
        for category in self.semantic_memories:
            for key in self.semantic_memories[category]:
                memory = self.semantic_memories[category][key]
                memory_with_id = {
                    'id': f"{category}:{key}",
                    'type': 'semantic',
                    'category': category,
                    'key': key,
                    'value': memory['value'],
                    'timestamp': memory['timestamp'],
                    'confidence': memory.get('confidence', 0.8)
                }
                all_memories.append(memory_with_id)

        return all_memories

    def get_memory_by_id(self, memory_id):
        """
        Get a specific memory by ID

        Args:
            memory_id (str): The ID of the memory to retrieve

        Returns:
            dict: The memory if found, None otherwise
        """
        # Check if it's a semantic memory ID (format: "category:key")
        if ':' in memory_id:
            category, key = memory_id.split(':', 1)
            if category in self.semantic_memories and key in self.semantic_memories[category]:
                memory = self.semantic_memories[category][key]
                return {
                    'id': memory_id,
                    'type': 'semantic',
                    'category': category,
                    'key': key,
                    'value': memory['value'],
                    'timestamp': memory['timestamp'],
                    'confidence': memory.get('confidence', 0.8)
                }

        # Check if it's an episodic memory ID (using timestamp as ID)
        for memory in self.episodic_memories:
            if memory.get('timestamp') == memory_id:
                memory_with_id = memory.copy()
                memory_with_id['id'] = memory_id
                return memory_with_id

        # Memory not found
        return None
