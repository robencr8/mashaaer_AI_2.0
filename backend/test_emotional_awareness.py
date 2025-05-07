"""
Test script for the Emotional Self-Awareness and Timeline systems.

This script tests the functionality of the emotional self-awareness engine
and emotional timeline system with various emotional patterns and scenarios.

Usage:
    python test_emotional_awareness.py
"""

import os
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

from emotional_self_awareness import EmotionalSelfAwareness
from emotional_timeline import EmotionalTimeline
from emotional_memory import log_emotion, get_emotion_timeline
from emotion_engine import detect_emotion

# Load environment variables from .env file if available
try:
    load_dotenv()
except ImportError:
    pass

def setup_test_data():
    """Set up test data with various emotional patterns."""
    # Clear any existing test data
    if 'test_session' in globals():
        globals()['test_session'] = {}
    
    # Create a test session ID
    session_id = f"test_{int(time.time())}"
    
    # Log emotions with timestamps spaced out to simulate a conversation over time
    # Pattern: neutral -> happy -> sad -> angry -> fearful -> happy
    base_time = datetime.now() - timedelta(days=1)  # Start from yesterday
    
    # Create test data with timestamps
    test_data = [
        {"emotion": "حياد", "text": "مرحبا، كيف حالك؟", "offset_minutes": 0},
        {"emotion": "فرح", "text": "أنا سعيد جدا اليوم!", "offset_minutes": 10},
        {"emotion": "فرح", "text": "لقد نجحت في الامتحان!", "offset_minutes": 20},
        {"emotion": "حزن", "text": "لكنني أشعر بالحزن لفراق صديقي", "offset_minutes": 40},
        {"emotion": "حزن", "text": "أفتقده كثيرا", "offset_minutes": 50},
        {"emotion": "غضب", "text": "أنا غاضب من تصرفات زميلي", "offset_minutes": 70},
        {"emotion": "غضب", "text": "لماذا يتصرف هكذا؟", "offset_minutes": 80},
        {"emotion": "خوف", "text": "أخشى أن أفشل في المشروع القادم", "offset_minutes": 100},
        {"emotion": "خوف", "text": "المهمة صعبة جدا", "offset_minutes": 110},
        {"emotion": "فرح", "text": "لكنني متحمس للتحدي!", "offset_minutes": 130},
        {"emotion": "فرح", "text": "سأبذل قصارى جهدي", "offset_minutes": 140},
        {"emotion": "حياد", "text": "سأبدأ العمل غدا", "offset_minutes": 160}
    ]
    
    # Log emotions with appropriate timestamps
    for item in test_data:
        # Override the timestamp in the log_emotion function by monkey patching datetime.now
        original_datetime = datetime.now
        try:
            # Create a specific timestamp
            specific_time = base_time + timedelta(minutes=item["offset_minutes"])
            datetime.now = lambda: specific_time
            
            # Log the emotion
            log_emotion(session_id, item["emotion"], item["text"])
        finally:
            # Restore the original datetime.now
            datetime.now = original_datetime
    
    print(f"Created test session: {session_id}")
    print(f"Logged {len(test_data)} emotional events")
    
    return session_id

def test_emotional_self_awareness(session_id):
    """Test the emotional self-awareness engine."""
    print("\n=== Testing Emotional Self-Awareness ===")
    
    # Initialize the emotional self-awareness engine
    awareness = EmotionalSelfAwareness()
    
    # Analyze emotional patterns
    analysis = awareness.analyze_emotional_patterns(session_id)
    
    # Print analysis results
    print(f"Emotional trend: {analysis['trend']} (confidence: {analysis['confidence']:.2f})")
    print(f"Dominant emotion: {analysis['dominant_emotion']}")
    
    if analysis['triggers']:
        print("\nEmotional triggers:")
        for topic, emotions in analysis['triggers'].items():
            for emotion, strength in emotions.items():
                print(f"  - Topic '{topic}' triggers '{emotion}' (strength: {strength:.2f})")
    
    if analysis['patterns']:
        print("\nEmotional patterns:")
        for pattern in analysis['patterns']:
            print(f"  - {pattern}")
    
    # Generate self-aware responses
    print("\nSelf-aware responses:")
    
    # Test with Arabic
    ar_response = awareness.generate_self_aware_response(session_id, "ar")
    if ar_response:
        print(f"  Arabic: {ar_response}")
    else:
        print("  No Arabic response generated (insufficient data or confidence)")
    
    # Test with English
    en_response = awareness.generate_self_aware_response(session_id, "en")
    if en_response:
        print(f"  English: {en_response}")
    else:
        print("  No English response generated (insufficient data or confidence)")
    
    return analysis

def test_emotional_timeline(session_id):
    """Test the emotional timeline system."""
    print("\n=== Testing Emotional Timeline ===")
    
    # Initialize the emotional timeline system
    timeline = EmotionalTimeline()
    
    # Get timeline data
    timeline_data = timeline.get_timeline_data(session_id)
    
    # Print summary
    summary = timeline_data["summary"]
    print(f"Timeline summary:")
    print(f"  Dominant emotion: {summary['dominant_emotion']}")
    print(f"  Average valence: {summary['average_valence']:.2f}")
    print(f"  Emotional stability: {summary['emotional_stability']:.2f}")
    print(f"  Trend: {summary['trend']}")
    
    # Print emotions data
    print(f"\nEmotions data ({len(timeline_data['emotions'])} records):")
    for i, emotion_data in enumerate(timeline_data['emotions'][:3]):  # Print first 3 for brevity
        print(f"  {i+1}. {emotion_data['emotion']} at {emotion_data['timestamp']}")
    if len(timeline_data['emotions']) > 3:
        print(f"  ... and {len(timeline_data['emotions']) - 3} more")
    
    # Print significant events
    if timeline_data["significant_events"]:
        print(f"\nSignificant events ({len(timeline_data['significant_events'])} events):")
        for i, event in enumerate(timeline_data['significant_events']):
            print(f"  {i+1}. {event['emotion']} (change: {event['valence_change']:.2f}, direction: {event['direction']})")
            if 'text' in event:
                print(f"     Text: {event['text']}")
    else:
        print("\nNo significant events detected")
    
    # Get emotion distribution
    distribution = timeline.get_emotion_distribution(session_id)
    print("\nEmotion distribution:")
    for emotion, percentage in distribution.items():
        print(f"  {emotion}: {percentage*100:.1f}%")
    
    # Get emotion transitions
    transitions = timeline.get_emotion_transitions(session_id)
    if transitions:
        print("\nEmotion transitions:")
        for source, targets in transitions.items():
            for target, count in targets.items():
                print(f"  {source} → {target}: {count} times")
    else:
        print("\nNo emotion transitions detected")
    
    return timeline_data

def test_visualization_formats(session_id):
    """Test different visualization formats."""
    print("\n=== Testing Visualization Formats ===")
    
    # Initialize the emotional timeline system
    timeline = EmotionalTimeline()
    
    # Test JSON format
    json_data = timeline.get_visualization_data(session_id, "json")
    print(f"JSON format contains {len(json_data['timeline']['emotions'])} emotion records")
    
    # Test chart format
    chart_data = timeline.get_visualization_data(session_id, "chart")
    print(f"Chart format contains:")
    print(f"  Pie chart data: {len(chart_data['pieChart'])} segments")
    print(f"  Line chart data: {len(chart_data['lineChart'])} points")
    if 'sankeyDiagram' in chart_data and 'nodes' in chart_data['sankeyDiagram']:
        print(f"  Sankey diagram: {len(chart_data['sankeyDiagram']['nodes'])} nodes, {len(chart_data['sankeyDiagram']['links'])} links")
    
    # Test timeline format
    timeline_data = timeline.get_visualization_data(session_id, "timeline")
    print(f"Timeline format contains {len(timeline_data['events'])} events")
    
    return {
        "json": json_data,
        "chart": chart_data,
        "timeline": timeline_data
    }

def test_time_period_filtering(session_id):
    """Test filtering by different time periods."""
    print("\n=== Testing Time Period Filtering ===")
    
    # Initialize the emotional timeline system
    timeline = EmotionalTimeline()
    
    # Test different time periods
    for period in ["day", "week", "month", "quarter"]:
        data = timeline.get_timeline_data(session_id, period)
        print(f"{period.capitalize()} data: {len(data['emotions'])} emotion records")
    
    return True

def main():
    """Main test function."""
    print("=== Emotional Self-Awareness and Timeline Test ===")
    
    # Set up test data
    session_id = setup_test_data()
    
    # Verify the test data
    timeline = get_emotion_timeline(session_id)
    print(f"\nVerifying test data: {len(timeline)} emotional events logged")
    
    # Test emotional self-awareness
    awareness_results = test_emotional_self_awareness(session_id)
    
    # Test emotional timeline
    timeline_results = test_emotional_timeline(session_id)
    
    # Test visualization formats
    visualization_results = test_visualization_formats(session_id)
    
    # Test time period filtering
    filtering_results = test_time_period_filtering(session_id)
    
    print("\n=== Test Complete ===")
    print(f"Session ID: {session_id}")
    print(f"Emotional trend: {awareness_results['trend']}")
    print(f"Timeline trend: {timeline_results['summary']['trend']}")
    
    return {
        "session_id": session_id,
        "awareness_results": awareness_results,
        "timeline_results": timeline_results,
        "visualization_results": visualization_results,
        "filtering_results": filtering_results
    }

if __name__ == "__main__":
    main()