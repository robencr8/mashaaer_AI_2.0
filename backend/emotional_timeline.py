"""
Emotional Timeline System for Mashaaer

This module implements an emotional timeline system that:
1. Records emotional changes over time
2. Provides visualization data for emotional trends
3. Identifies significant emotional events
4. Integrates with the emotional self-awareness engine

The system can visualize:
- Emotional trends over different time periods
- Emotional intensity changes
- Emotional transitions and patterns
- Significant emotional events
"""

import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta

from emotional_memory import get_emotion_timeline, get_last_emotion
from memory_store import MemoryStore
from emotion_engine import get_emotion_in_language

class EmotionalTimeline:
    """
    Implements emotional timeline capabilities for the assistant.
    
    This class records emotional changes over time and provides
    visualization data for emotional trends.
    """
    
    def __init__(self, memory_store: Optional[MemoryStore] = None):
        """
        Initialize the emotional timeline system.
        
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
        
        # Emotion color mapping for visualization
        self.emotion_colors = {
            "happiness": "#50fa7b",  # Green
            "sadness": "#6272a4",    # Blue-gray
            "anger": "#ff5555",      # Red
            "fear": "#bd93f9",       # Purple
            "neutral": "#f8f8f2"     # Light gray
        }
        
        # Time period definitions (in days)
        self.time_periods = {
            "day": 1,            # Last 24 hours
            "week": 7,           # Last week
            "month": 30,         # Last month
            "quarter": 90        # Last 3 months
        }
    
    def _load_config(self) -> Dict:
        """
        Load configuration from file or use defaults.
        
        Returns:
            Dictionary containing configuration
        """
        config_path = 'data/emotional_timeline_config.json'
        try:
            if os.path.exists(config_path):
                with open(config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Default configuration
                return {
                    "default_time_period": "week",  # Default time period for visualization
                    "significant_event_threshold": 0.7,  # Threshold for significant emotional events
                    "visualization_resolution": "medium",  # Resolution for visualization (low, medium, high)
                    "include_text_samples": True  # Whether to include text samples in visualization
                }
        except Exception as e:
            print(f"Error loading emotional timeline config: {e}")
            # Fallback to minimal default config
            return {
                "default_time_period": "week",
                "significant_event_threshold": 0.7,
                "visualization_resolution": "medium",
                "include_text_samples": True
            }
    
    def get_timeline_data(self, session_id: str, time_period: Optional[str] = None) -> Dict[str, Any]:
        """
        Get emotional timeline data for visualization.
        
        Args:
            session_id: The session identifier
            time_period: Optional time period (day, week, month, quarter)
            
        Returns:
            Dictionary containing timeline data
        """
        # Get emotion timeline
        timeline = get_emotion_timeline(session_id)
        
        if not timeline:
            return {
                "emotions": [],
                "valence": [],
                "significant_events": [],
                "summary": {
                    "dominant_emotion": "neutral",
                    "average_valence": 0.0,
                    "emotional_stability": 1.0,
                    "trend": "insufficient_data"
                }
            }
        
        # Determine time period
        period = time_period or self.config["default_time_period"]
        days = self.time_periods.get(period, self.time_periods["week"])
        
        # Filter timeline by time period
        filtered_timeline = self._filter_timeline_by_period(timeline, days)
        
        # Process timeline data
        emotions_data = self._process_emotions_data(filtered_timeline)
        valence_data = self._process_valence_data(filtered_timeline)
        significant_events = self._identify_significant_events(filtered_timeline)
        summary = self._generate_summary(filtered_timeline)
        
        return {
            "emotions": emotions_data,
            "valence": valence_data,
            "significant_events": significant_events,
            "summary": summary
        }
    
    def _filter_timeline_by_period(self, timeline: List[Dict], days: int) -> List[Dict]:
        """
        Filter timeline by time period.
        
        Args:
            timeline: List of emotion records
            days: Number of days to include
            
        Returns:
            Filtered timeline
        """
        if not timeline:
            return []
        
        # Calculate cutoff date
        cutoff_date = datetime.now() - timedelta(days=days)
        
        # Filter timeline
        filtered_timeline = []
        for record in timeline:
            try:
                record_date = datetime.fromisoformat(record["timestamp"])
                if record_date >= cutoff_date:
                    filtered_timeline.append(record)
            except (ValueError, KeyError):
                # Skip records with invalid timestamps
                continue
        
        return filtered_timeline
    
    def _process_emotions_data(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Process emotions data for visualization.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of processed emotion data points
        """
        emotions_data = []
        
        for record in timeline:
            try:
                # Standardize emotion
                emotion = self._standardize_emotion(record["emotion"])
                
                # Create data point
                data_point = {
                    "timestamp": record["timestamp"],
                    "emotion": emotion,
                    "color": self.emotion_colors.get(emotion, "#f8f8f2")
                }
                
                # Add text sample if configured
                if self.config["include_text_samples"]:
                    data_point["text"] = record.get("text", "")
                
                emotions_data.append(data_point)
            except KeyError:
                # Skip records with missing required fields
                continue
        
        return emotions_data
    
    def _process_valence_data(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Process valence data for visualization.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of processed valence data points
        """
        valence_data = []
        
        for record in timeline:
            try:
                # Standardize emotion
                emotion = self._standardize_emotion(record["emotion"])
                
                # Get valence
                valence = self.emotion_valence.get(emotion, 0.0)
                
                # Create data point
                data_point = {
                    "timestamp": record["timestamp"],
                    "valence": valence
                }
                
                valence_data.append(data_point)
            except KeyError:
                # Skip records with missing required fields
                continue
        
        return valence_data
    
    def _identify_significant_events(self, timeline: List[Dict]) -> List[Dict[str, Any]]:
        """
        Identify significant emotional events.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            List of significant emotional events
        """
        if not timeline or len(timeline) < 2:
            return []
        
        significant_events = []
        threshold = self.config["significant_event_threshold"]
        
        # Calculate valence for each record
        valence_timeline = []
        for record in timeline:
            try:
                emotion = self._standardize_emotion(record["emotion"])
                valence = self.emotion_valence.get(emotion, 0.0)
                valence_timeline.append({
                    "timestamp": record["timestamp"],
                    "emotion": emotion,
                    "valence": valence,
                    "text": record.get("text", "")
                })
            except KeyError:
                # Skip records with missing required fields
                continue
        
        # Identify significant changes in valence
        for i in range(1, len(valence_timeline)):
            prev_valence = valence_timeline[i-1]["valence"]
            curr_valence = valence_timeline[i]["valence"]
            
            # Calculate change in valence
            valence_change = abs(curr_valence - prev_valence)
            
            # Check if change is significant
            if valence_change >= threshold:
                event = {
                    "timestamp": valence_timeline[i]["timestamp"],
                    "emotion": valence_timeline[i]["emotion"],
                    "valence_change": valence_change,
                    "direction": "positive" if curr_valence > prev_valence else "negative"
                }
                
                # Add text if configured
                if self.config["include_text_samples"]:
                    event["text"] = valence_timeline[i]["text"]
                
                significant_events.append(event)
        
        return significant_events
    
    def _generate_summary(self, timeline: List[Dict]) -> Dict[str, Any]:
        """
        Generate summary of emotional timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Dictionary containing summary
        """
        if not timeline:
            return {
                "dominant_emotion": "neutral",
                "average_valence": 0.0,
                "emotional_stability": 1.0,
                "trend": "insufficient_data"
            }
        
        # Count emotions
        emotion_counts = {}
        for record in timeline:
            try:
                emotion = self._standardize_emotion(record["emotion"])
                if emotion not in emotion_counts:
                    emotion_counts[emotion] = 0
                emotion_counts[emotion] += 1
            except KeyError:
                # Skip records with missing required fields
                continue
        
        # Determine dominant emotion
        dominant_emotion = max(emotion_counts.items(), key=lambda x: x[1])[0] if emotion_counts else "neutral"
        
        # Calculate average valence
        valence_values = []
        for record in timeline:
            try:
                emotion = self._standardize_emotion(record["emotion"])
                valence = self.emotion_valence.get(emotion, 0.0)
                valence_values.append(valence)
            except KeyError:
                # Skip records with missing required fields
                continue
        
        average_valence = sum(valence_values) / len(valence_values) if valence_values else 0.0
        
        # Calculate emotional stability
        stability = self._calculate_emotional_stability(timeline)
        
        # Determine trend
        trend = self._determine_trend(timeline)
        
        return {
            "dominant_emotion": dominant_emotion,
            "average_valence": average_valence,
            "emotional_stability": stability,
            "trend": trend
        }
    
    def _calculate_emotional_stability(self, timeline: List[Dict]) -> float:
        """
        Calculate emotional stability based on emotion timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Stability score (0.0-1.0) where 1.0 is completely stable
        """
        if not timeline or len(timeline) < 2:
            return 1.0  # Default to stable if not enough data
        
        # Count emotion changes
        changes = 0
        for i in range(1, len(timeline)):
            try:
                if timeline[i]["emotion"] != timeline[i-1]["emotion"]:
                    changes += 1
            except KeyError:
                # Skip records with missing required fields
                continue
        
        # Calculate stability as inverse of change rate
        change_rate = changes / (len(timeline) - 1)
        stability = 1.0 - change_rate
        
        return stability
    
    def _determine_trend(self, timeline: List[Dict]) -> str:
        """
        Determine emotional trend based on timeline.
        
        Args:
            timeline: List of emotion records
            
        Returns:
            Trend description (improving, deteriorating, stable, fluctuating)
        """
        if not timeline or len(timeline) < 3:
            return "insufficient_data"  # Not enough data
        
        # Calculate valence for each record
        valence_timeline = []
        for record in timeline:
            try:
                emotion = self._standardize_emotion(record["emotion"])
                valence = self.emotion_valence.get(emotion, 0.0)
                valence_timeline.append(valence)
            except KeyError:
                # Skip records with missing required fields
                continue
        
        if not valence_timeline or len(valence_timeline) < 3:
            return "insufficient_data"  # Not enough valid data
        
        # Calculate average valence for first half and second half of timeline
        half_point = len(valence_timeline) // 2
        first_half = valence_timeline[:half_point]
        second_half = valence_timeline[half_point:]
        
        first_valence = sum(first_half) / len(first_half)
        second_valence = sum(second_half) / len(second_half)
        
        # Determine trend
        if abs(second_valence - first_valence) < 0.3:
            # Check for fluctuations
            unique_emotions = len(set(timeline[-5:]))
            if unique_emotions >= 3:
                return "fluctuating"
            else:
                return "stable"
        elif second_valence > first_valence:
            return "improving"
        else:
            return "deteriorating"
    
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
    
    def get_emotion_distribution(self, session_id: str, time_period: Optional[str] = None) -> Dict[str, float]:
        """
        Get distribution of emotions over time.
        
        Args:
            session_id: The session identifier
            time_period: Optional time period (day, week, month, quarter)
            
        Returns:
            Dictionary mapping emotions to their frequency
        """
        # Get emotion timeline
        timeline = get_emotion_timeline(session_id)
        
        if not timeline:
            return {
                "happiness": 0.0,
                "sadness": 0.0,
                "anger": 0.0,
                "fear": 0.0,
                "neutral": 1.0  # Default to 100% neutral if no data
            }
        
        # Determine time period
        period = time_period or self.config["default_time_period"]
        days = self.time_periods.get(period, self.time_periods["week"])
        
        # Filter timeline by time period
        filtered_timeline = self._filter_timeline_by_period(timeline, days)
        
        # Count emotions
        emotion_counts = {
            "happiness": 0,
            "sadness": 0,
            "anger": 0,
            "fear": 0,
            "neutral": 0
        }
        
        total_count = 0
        for record in filtered_timeline:
            try:
                emotion = self._standardize_emotion(record["emotion"])
                if emotion in emotion_counts:
                    emotion_counts[emotion] += 1
                    total_count += 1
            except KeyError:
                # Skip records with missing required fields
                continue
        
        # Calculate distribution
        distribution = {}
        if total_count > 0:
            for emotion, count in emotion_counts.items():
                distribution[emotion] = count / total_count
        else:
            # Default to 100% neutral if no valid data
            for emotion in emotion_counts:
                distribution[emotion] = 1.0 if emotion == "neutral" else 0.0
        
        return distribution
    
    def get_emotion_transitions(self, session_id: str, time_period: Optional[str] = None) -> Dict[str, Dict[str, int]]:
        """
        Get transitions between emotions.
        
        Args:
            session_id: The session identifier
            time_period: Optional time period (day, week, month, quarter)
            
        Returns:
            Dictionary mapping source emotions to target emotions and counts
        """
        # Get emotion timeline
        timeline = get_emotion_timeline(session_id)
        
        if not timeline or len(timeline) < 2:
            return {}
        
        # Determine time period
        period = time_period or self.config["default_time_period"]
        days = self.time_periods.get(period, self.time_periods["week"])
        
        # Filter timeline by time period
        filtered_timeline = self._filter_timeline_by_period(timeline, days)
        
        if len(filtered_timeline) < 2:
            return {}
        
        # Count transitions
        transitions = {}
        for i in range(1, len(filtered_timeline)):
            try:
                source_emotion = self._standardize_emotion(filtered_timeline[i-1]["emotion"])
                target_emotion = self._standardize_emotion(filtered_timeline[i]["emotion"])
                
                if source_emotion not in transitions:
                    transitions[source_emotion] = {}
                
                if target_emotion not in transitions[source_emotion]:
                    transitions[source_emotion][target_emotion] = 0
                
                transitions[source_emotion][target_emotion] += 1
            except KeyError:
                # Skip records with missing required fields
                continue
        
        return transitions
    
    def get_visualization_data(self, session_id: str, format_type: str = "json", time_period: Optional[str] = None) -> Dict[str, Any]:
        """
        Get data for visualization in specified format.
        
        Args:
            session_id: The session identifier
            format_type: Format type (json, chart, timeline)
            time_period: Optional time period (day, week, month, quarter)
            
        Returns:
            Dictionary containing visualization data
        """
        # Get timeline data
        timeline_data = self.get_timeline_data(session_id, time_period)
        
        # Get emotion distribution
        distribution = self.get_emotion_distribution(session_id, time_period)
        
        # Get emotion transitions
        transitions = self.get_emotion_transitions(session_id, time_period)
        
        # Format data based on format_type
        if format_type == "chart":
            return self._format_for_chart(timeline_data, distribution, transitions)
        elif format_type == "timeline":
            return self._format_for_timeline(timeline_data)
        else:  # Default to JSON
            return {
                "timeline": timeline_data,
                "distribution": distribution,
                "transitions": transitions
            }
    
    def _format_for_chart(self, timeline_data: Dict[str, Any], distribution: Dict[str, float], transitions: Dict[str, Dict[str, int]]) -> Dict[str, Any]:
        """
        Format data for chart visualization.
        
        Args:
            timeline_data: Timeline data
            distribution: Emotion distribution
            transitions: Emotion transitions
            
        Returns:
            Dictionary containing chart data
        """
        # Format distribution for pie chart
        pie_chart_data = [
            {"name": emotion, "value": value * 100, "color": self.emotion_colors.get(emotion, "#f8f8f2")}
            for emotion, value in distribution.items()
        ]
        
        # Format valence for line chart
        line_chart_data = [
            {"timestamp": point["timestamp"], "value": point["valence"]}
            for point in timeline_data["valence"]
        ]
        
        # Format transitions for sankey diagram
        sankey_data = {
            "nodes": [],
            "links": []
        }
        
        # Add nodes
        node_map = {}
        node_index = 0
        for source in transitions:
            if source not in node_map:
                node_map[source] = node_index
                sankey_data["nodes"].append({
                    "name": source,
                    "color": self.emotion_colors.get(source, "#f8f8f2")
                })
                node_index += 1
            
            for target in transitions[source]:
                if target not in node_map:
                    node_map[target] = node_index
                    sankey_data["nodes"].append({
                        "name": target,
                        "color": self.emotion_colors.get(target, "#f8f8f2")
                    })
                    node_index += 1
        
        # Add links
        for source, targets in transitions.items():
            for target, value in targets.items():
                sankey_data["links"].append({
                    "source": node_map[source],
                    "target": node_map[target],
                    "value": value
                })
        
        return {
            "pieChart": pie_chart_data,
            "lineChart": line_chart_data,
            "sankeyDiagram": sankey_data,
            "summary": timeline_data["summary"]
        }
    
    def _format_for_timeline(self, timeline_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format data for timeline visualization.
        
        Args:
            timeline_data: Timeline data
            
        Returns:
            Dictionary containing timeline data
        """
        # Format emotions for timeline
        timeline_events = []
        
        for point in timeline_data["emotions"]:
            event = {
                "timestamp": point["timestamp"],
                "emotion": point["emotion"],
                "color": point["color"]
            }
            
            if "text" in point:
                event["text"] = point["text"]
            
            timeline_events.append(event)
        
        # Add significant events
        for event in timeline_data["significant_events"]:
            significant_event = {
                "timestamp": event["timestamp"],
                "emotion": event["emotion"],
                "color": self.emotion_colors.get(event["emotion"], "#f8f8f2"),
                "significant": True,
                "direction": event["direction"]
            }
            
            if "text" in event:
                significant_event["text"] = event["text"]
            
            timeline_events.append(significant_event)
        
        # Sort events by timestamp
        timeline_events.sort(key=lambda x: x["timestamp"])
        
        return {
            "events": timeline_events,
            "summary": timeline_data["summary"]
        }
    
    def update_config(self, new_config: Dict[str, Any]):
        """
        Update the configuration.
        
        Args:
            new_config: Dictionary containing new configuration values
        """
        self.config.update(new_config)
        
        # Save updated config
        config_path = 'data/emotional_timeline_config.json'
        try:
            os.makedirs(os.path.dirname(config_path), exist_ok=True)
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving emotional timeline config: {e}")