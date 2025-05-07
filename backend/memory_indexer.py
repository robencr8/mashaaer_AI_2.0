import json
import os
from datetime import datetime
from collections import defaultdict
import re
from memory_store import MemoryStore

class MemoryIndexer:
    """
    Memory Indexer for Mashaaer
    
    This class provides advanced indexing and retrieval capabilities for the memory system.
    It creates and maintains indexes for different types of memories, allowing for efficient
    and flexible querying based on various criteria.
    
    Features:
    - Keyword-based memory indexing
    - Semantic categorization of memories
    - Temporal indexing (time-based retrieval)
    - Emotional context indexing
    - Priority-based memory retrieval
    - Cross-referencing between related memories
    """
    
    def __init__(self, memory_store=None):
        """Initialize the memory indexer with a memory store"""
        self.memory_store = memory_store if memory_store else MemoryStore()
        self.index_data = {
            'keyword_index': defaultdict(list),  # Maps keywords to memory IDs
            'category_index': defaultdict(list),  # Maps categories to memory IDs
            'temporal_index': defaultdict(list),  # Maps time periods to memory IDs
            'emotion_index': defaultdict(list),   # Maps emotions to memory IDs
            'priority_index': defaultdict(list),  # Maps priority levels to memory IDs
            'cross_references': defaultdict(list), # Maps memory IDs to related memory IDs
            'last_indexed': None,
            'last_updated': datetime.now().isoformat()
        }
        
        # Load existing index data
        self.load_index_data()
    
    def load_index_data(self):
        """Load index data from storage file"""
        index_path = 'data/memory_index.json'
        try:
            if os.path.exists(index_path):
                with open(index_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # Convert defaultdict keys back from strings
                    self.index_data = {
                        'keyword_index': defaultdict(list, data.get('keyword_index', {})),
                        'category_index': defaultdict(list, data.get('category_index', {})),
                        'temporal_index': defaultdict(list, data.get('temporal_index', {})),
                        'emotion_index': defaultdict(list, data.get('emotion_index', {})),
                        'priority_index': defaultdict(list, data.get('priority_index', {})),
                        'cross_references': defaultdict(list, data.get('cross_references', {})),
                        'last_indexed': data.get('last_indexed'),
                        'last_updated': data.get('last_updated', datetime.now().isoformat())
                    }
        except Exception as e:
            print(f"Error loading index data: {e}")
            # Initialize with empty data if loading fails
    
    def save_index_data(self):
        """Save index data to storage file"""
        index_path = 'data/memory_index.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(index_path), exist_ok=True)
            
            # Convert defaultdicts to regular dicts for JSON serialization
            serializable_data = {
                'keyword_index': dict(self.index_data['keyword_index']),
                'category_index': dict(self.index_data['category_index']),
                'temporal_index': dict(self.index_data['temporal_index']),
                'emotion_index': dict(self.index_data['emotion_index']),
                'priority_index': dict(self.index_data['priority_index']),
                'cross_references': dict(self.index_data['cross_references']),
                'last_indexed': self.index_data['last_indexed'],
                'last_updated': datetime.now().isoformat()
            }
            
            with open(index_path, 'w', encoding='utf-8') as f:
                json.dump(serializable_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving index data: {e}")
    
    def index_memory(self, memory):
        """
        Index a single memory
        
        Args:
            memory (dict): The memory to index
            
        Returns:
            bool: True if indexing was successful, False otherwise
        """
        if not memory or 'id' not in memory:
            return False
        
        memory_id = memory['id']
        
        # Index by keywords
        if 'text' in memory:
            keywords = self._extract_keywords(memory['text'])
            for keyword in keywords:
                self.index_data['keyword_index'][keyword].append(memory_id)
        
        # Index by category
        if 'text' in memory:
            category = self._categorize_memory(memory['text'])
            self.index_data['category_index'][category].append(memory_id)
        
        # Index by time period
        if 'timestamp' in memory:
            time_period = self._get_time_period(memory['timestamp'])
            self.index_data['temporal_index'][time_period].append(memory_id)
        
        # Index by emotion
        if 'emotion' in memory:
            emotion = memory['emotion']
            self.index_data['emotion_index'][emotion].append(memory_id)
        
        # Index by priority
        priority = memory.get('priority', 'medium')
        self.index_data['priority_index'][priority].append(memory_id)
        
        # Update last indexed timestamp
        self.index_data['last_updated'] = datetime.now().isoformat()
        
        return True
    
    def rebuild_index(self):
        """
        Rebuild the entire index from the memory store
        
        Returns:
            int: Number of memories indexed
        """
        # Clear existing indexes
        self.index_data['keyword_index'] = defaultdict(list)
        self.index_data['category_index'] = defaultdict(list)
        self.index_data['temporal_index'] = defaultdict(list)
        self.index_data['emotion_index'] = defaultdict(list)
        self.index_data['priority_index'] = defaultdict(list)
        self.index_data['cross_references'] = defaultdict(list)
        
        # Get all memories from the memory store
        memories = self.memory_store.get_all_memories()
        
        # Index each memory
        count = 0
        for memory in memories:
            if self.index_memory(memory):
                count += 1
        
        # Update cross-references
        self._build_cross_references(memories)
        
        # Update last indexed timestamp
        self.index_data['last_indexed'] = datetime.now().isoformat()
        self.index_data['last_updated'] = datetime.now().isoformat()
        
        # Save the updated index
        self.save_index_data()
        
        return count
    
    def _build_cross_references(self, memories):
        """
        Build cross-references between related memories
        
        Args:
            memories (list): List of memories to process
        """
        # Group memories by user/session
        memories_by_user = defaultdict(list)
        for memory in memories:
            user_id = memory.get('user_id', 'unknown')
            memories_by_user[user_id].append(memory)
        
        # For each user, find related memories
        for user_id, user_memories in memories_by_user.items():
            # Sort by timestamp
            sorted_memories = sorted(user_memories, key=lambda x: x.get('timestamp', ''))
            
            # Build cross-references based on temporal proximity and content similarity
            for i, memory in enumerate(sorted_memories):
                memory_id = memory.get('id')
                if not memory_id:
                    continue
                
                # Look at nearby memories (temporal proximity)
                start_idx = max(0, i - 5)
                end_idx = min(len(sorted_memories), i + 6)
                
                for j in range(start_idx, end_idx):
                    if i == j:
                        continue
                    
                    other_memory = sorted_memories[j]
                    other_id = other_memory.get('id')
                    if not other_id:
                        continue
                    
                    # Check for content similarity
                    if self._are_memories_related(memory, other_memory):
                        self.index_data['cross_references'][memory_id].append(other_id)
    
    def _are_memories_related(self, memory1, memory2):
        """
        Determine if two memories are related
        
        Args:
            memory1 (dict): First memory
            memory2 (dict): Second memory
            
        Returns:
            bool: True if memories are related, False otherwise
        """
        # Check if they share the same emotion
        if 'emotion' in memory1 and 'emotion' in memory2:
            if memory1['emotion'] == memory2['emotion']:
                return True
        
        # Check if they share keywords
        if 'text' in memory1 and 'text' in memory2:
            keywords1 = self._extract_keywords(memory1['text'])
            keywords2 = self._extract_keywords(memory2['text'])
            
            # If they share at least 2 keywords, consider them related
            common_keywords = set(keywords1) & set(keywords2)
            if len(common_keywords) >= 2:
                return True
        
        # Check temporal proximity (within 1 hour)
        if 'timestamp' in memory1 and 'timestamp' in memory2:
            try:
                time1 = datetime.fromisoformat(memory1['timestamp'])
                time2 = datetime.fromisoformat(memory2['timestamp'])
                
                time_diff = abs((time1 - time2).total_seconds())
                if time_diff <= 3600:  # Within 1 hour
                    return True
            except:
                pass
        
        return False
    
    def _extract_keywords(self, text):
        """
        Extract keywords from text
        
        Args:
            text (str): The text to extract keywords from
            
        Returns:
            list: Extracted keywords
        """
        # Remove punctuation and convert to lowercase
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        
        # Split into words
        words = text.split()
        
        # Filter out common words (stopwords)
        stopwords = ['و', 'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي', 'أنا', 'أنت', 'نحن', 'هم']
        keywords = [word for word in words if word not in stopwords and len(word) > 2]
        
        return keywords
    
    def _categorize_memory(self, text):
        """
        Categorize memory based on its content
        
        Args:
            text (str): The text to categorize
            
        Returns:
            str: Category name
        """
        # Define category keywords
        categories = {
            'personal': ['أنا', 'نفسي', 'حياتي', 'مشاعري', 'شخصي'],
            'social': ['صديق', 'عائلة', 'أهل', 'زملاء', 'علاقة', 'اجتماعي'],
            'work': ['عمل', 'وظيفة', 'مشروع', 'مهمة', 'مهني'],
            'education': ['دراسة', 'تعلم', 'مدرسة', 'جامعة', 'تعليم'],
            'health': ['صحة', 'مرض', 'طبيب', 'علاج', 'رياضة'],
            'entertainment': ['فيلم', 'موسيقى', 'لعبة', 'ترفيه', 'هواية'],
            'technology': ['تقنية', 'حاسوب', 'هاتف', 'برنامج', 'تطبيق'],
            'finance': ['مال', 'ميزانية', 'توفير', 'استثمار', 'مصروف'],
            'spiritual': ['دين', 'روحانية', 'إيمان', 'تأمل', 'معنوي'],
            'emotional': ['سعادة', 'حزن', 'غضب', 'خوف', 'حب', 'مشاعر']
        }
        
        # Count category matches
        category_scores = defaultdict(int)
        text_lower = text.lower()
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in text_lower:
                    category_scores[category] += 1
        
        # Return the category with the highest score, or 'general' if no matches
        if category_scores:
            return max(category_scores.items(), key=lambda x: x[1])[0]
        else:
            return 'general'
    
    def _get_time_period(self, timestamp):
        """
        Get the time period for a timestamp
        
        Args:
            timestamp (str): ISO format timestamp
            
        Returns:
            str: Time period identifier
        """
        try:
            dt = datetime.fromisoformat(timestamp)
            
            # Format: YYYY-MM (year and month)
            return dt.strftime('%Y-%m')
        except:
            # If parsing fails, return 'unknown'
            return 'unknown'
    
    def search_memories(self, query, filters=None, limit=10):
        """
        Search for memories using the index
        
        Args:
            query (str): Search query
            filters (dict, optional): Additional filters (emotion, time_period, priority, category)
            limit (int): Maximum number of results to return
            
        Returns:
            list: Matching memories
        """
        if not query and not filters:
            return []
        
        # Extract keywords from query
        query_keywords = self._extract_keywords(query) if query else []
        
        # Find memory IDs matching the keywords
        matching_ids = set()
        
        if query_keywords:
            # Get memory IDs for each keyword
            for keyword in query_keywords:
                keyword_ids = set(self.index_data['keyword_index'].get(keyword, []))
                
                if not matching_ids:
                    # First keyword, initialize the set
                    matching_ids = keyword_ids
                else:
                    # Subsequent keywords, find intersection (AND logic)
                    matching_ids &= keyword_ids
        
        # Apply filters
        if filters:
            filtered_ids = self._apply_filters(matching_ids, filters)
            
            if query_keywords:
                # If we had query keywords, intersect with filtered IDs
                matching_ids &= filtered_ids
            else:
                # If we only had filters, use the filtered IDs
                matching_ids = filtered_ids
        
        # If no matches found, return empty list
        if not matching_ids:
            return []
        
        # Retrieve the actual memories
        memories = []
        for memory_id in matching_ids:
            memory = self.memory_store.get_memory_by_id(memory_id)
            if memory:
                memories.append(memory)
        
        # Sort by timestamp (newest first) and limit results
        sorted_memories = sorted(memories, key=lambda x: x.get('timestamp', ''), reverse=True)
        return sorted_memories[:limit]
    
    def _apply_filters(self, memory_ids, filters):
        """
        Apply filters to a set of memory IDs
        
        Args:
            memory_ids (set): Set of memory IDs to filter
            filters (dict): Filters to apply
            
        Returns:
            set: Filtered memory IDs
        """
        filtered_ids = set(memory_ids) if memory_ids else set()
        
        # Filter by emotion
        if 'emotion' in filters:
            emotion = filters['emotion']
            emotion_ids = set(self.index_data['emotion_index'].get(emotion, []))
            
            if filtered_ids:
                filtered_ids &= emotion_ids
            else:
                filtered_ids = emotion_ids
        
        # Filter by time period
        if 'time_period' in filters:
            time_period = filters['time_period']
            period_ids = set(self.index_data['temporal_index'].get(time_period, []))
            
            if filtered_ids:
                filtered_ids &= period_ids
            else:
                filtered_ids = period_ids
        
        # Filter by priority
        if 'priority' in filters:
            priority = filters['priority']
            priority_ids = set(self.index_data['priority_index'].get(priority, []))
            
            if filtered_ids:
                filtered_ids &= priority_ids
            else:
                filtered_ids = priority_ids
        
        # Filter by category
        if 'category' in filters:
            category = filters['category']
            category_ids = set(self.index_data['category_index'].get(category, []))
            
            if filtered_ids:
                filtered_ids &= category_ids
            else:
                filtered_ids = category_ids
        
        return filtered_ids
    
    def get_related_memories(self, memory_id, limit=5):
        """
        Get memories related to a specific memory
        
        Args:
            memory_id (str): ID of the memory to find related memories for
            limit (int): Maximum number of related memories to return
            
        Returns:
            list: Related memories
        """
        # Get related memory IDs from cross-references
        related_ids = self.index_data['cross_references'].get(memory_id, [])
        
        if not related_ids:
            return []
        
        # Retrieve the actual memories
        related_memories = []
        for related_id in related_ids:
            memory = self.memory_store.get_memory_by_id(related_id)
            if memory:
                related_memories.append(memory)
        
        # Sort by relevance (currently just by timestamp, newest first)
        sorted_memories = sorted(related_memories, key=lambda x: x.get('timestamp', ''), reverse=True)
        return sorted_memories[:limit]
    
    def get_memories_by_emotion(self, emotion, limit=10):
        """
        Get memories associated with a specific emotion
        
        Args:
            emotion (str): The emotion to search for
            limit (int): Maximum number of memories to return
            
        Returns:
            list: Memories with the specified emotion
        """
        # Get memory IDs for the emotion
        memory_ids = self.index_data['emotion_index'].get(emotion, [])
        
        if not memory_ids:
            return []
        
        # Retrieve the actual memories
        memories = []
        for memory_id in memory_ids:
            memory = self.memory_store.get_memory_by_id(memory_id)
            if memory:
                memories.append(memory)
        
        # Sort by timestamp (newest first) and limit results
        sorted_memories = sorted(memories, key=lambda x: x.get('timestamp', ''), reverse=True)
        return sorted_memories[:limit]
    
    def get_memories_by_time_period(self, year, month, limit=10):
        """
        Get memories from a specific time period
        
        Args:
            year (int): Year
            month (int): Month (1-12)
            limit (int): Maximum number of memories to return
            
        Returns:
            list: Memories from the specified time period
        """
        # Format the time period
        time_period = f"{year:04d}-{month:02d}"
        
        # Get memory IDs for the time period
        memory_ids = self.index_data['temporal_index'].get(time_period, [])
        
        if not memory_ids:
            return []
        
        # Retrieve the actual memories
        memories = []
        for memory_id in memory_ids:
            memory = self.memory_store.get_memory_by_id(memory_id)
            if memory:
                memories.append(memory)
        
        # Sort by timestamp (newest first) and limit results
        sorted_memories = sorted(memories, key=lambda x: x.get('timestamp', ''), reverse=True)
        return sorted_memories[:limit]
    
    def get_index_stats(self):
        """
        Get statistics about the memory index
        
        Returns:
            dict: Index statistics
        """
        return {
            'keyword_count': len(self.index_data['keyword_index']),
            'category_count': len(self.index_data['category_index']),
            'time_period_count': len(self.index_data['temporal_index']),
            'emotion_count': len(self.index_data['emotion_index']),
            'priority_count': len(self.index_data['priority_index']),
            'cross_reference_count': len(self.index_data['cross_references']),
            'last_indexed': self.index_data['last_indexed'],
            'last_updated': self.index_data['last_updated']
        }

# Example usage
if __name__ == "__main__":
    indexer = MemoryIndexer()
    
    # Rebuild the index
    indexed_count = indexer.rebuild_index()
    print(f"Indexed {indexed_count} memories")
    
    # Search for memories
    results = indexer.search_memories("سعادة", {"emotion": "فرح"}, limit=5)
    print(f"Found {len(results)} matching memories")
    
    # Get index statistics
    stats = indexer.get_index_stats()
    print(f"Index stats: {stats}")