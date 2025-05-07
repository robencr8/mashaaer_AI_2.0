"""
Test script for the integration of the Emotional Self-Awareness and Timeline systems
with the State Integrator.

This script tests the complete integration of the emotional self-awareness engine
and emotional timeline system with the state integrator.

Usage:
    python test_emotional_integration.py
"""

import os
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

from state_integrator import StateIntegrator
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
    # Create a test session ID
    session_id = f"test_integration_{int(time.time())}"
    
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

def test_state_integrator_with_emotional_awareness(session_id):
    """Test the state integrator with emotional self-awareness."""
    print("\n=== Testing State Integrator with Emotional Self-Awareness ===")
    
    # Initialize the state integrator
    integrator = StateIntegrator()
    
    # Test user inputs
    test_inputs = [
        "كيف حالك اليوم؟",
        "أنا سعيد جدا بلقائك",
        "أشعر بالحزن بسبب ما حدث",
        "أنا غاضب من تصرفات زميلي",
        "أخشى أن أفشل في المشروع القادم",
        "لكنني متحمس للتحدي!"
    ]
    
    # Process each input and check for self-aware responses
    responses = []
    for user_input in test_inputs:
        print(f"\nUser input: {user_input}")
        
        # Generate integrated response
        response = integrator.generate_integrated_response(user_input, session_id)
        
        # Print response
        print(f"Response: {response['text']}")
        print(f"Emotion: {response['emotion']}")
        print(f"Self-aware: {response.get('self_aware', False)}")
        
        responses.append(response)
    
    # Check if any responses were self-aware
    self_aware_count = sum(1 for r in responses if r.get('self_aware', False))
    print(f"\nSelf-aware responses: {self_aware_count}/{len(responses)}")
    
    return responses

def test_emotional_timeline_integration(session_id):
    """Test the integration of the emotional timeline system."""
    print("\n=== Testing Emotional Timeline Integration ===")
    
    # Initialize the state integrator and emotional timeline
    integrator = StateIntegrator()
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
    
    # Get emotion distribution
    distribution = timeline.get_emotion_distribution(session_id)
    print("\nEmotion distribution:")
    for emotion, percentage in distribution.items():
        print(f"  {emotion}: {percentage*100:.1f}%")
    
    # Get system status from integrator
    system_status = integrator.get_system_status()
    print("\nSystem status:")
    print(f"  Current emotion: {system_status['current_state'].get('active_emotion', 'unknown')}")
    print(f"  Dominant persona: {system_status['current_state'].get('dominant_persona', 'unknown')}")
    print(f"  Motivation focus: {system_status['current_state'].get('motivation_focus', 'unknown')}")
    
    return {
        "timeline_data": timeline_data,
        "system_status": system_status
    }

def test_emotional_self_awareness_integration(session_id):
    """Test the integration of the emotional self-awareness engine."""
    print("\n=== Testing Emotional Self-Awareness Integration ===")
    
    # Initialize the state integrator and emotional self-awareness
    integrator = StateIntegrator()
    awareness = EmotionalSelfAwareness()
    
    # Analyze emotional patterns
    analysis = awareness.analyze_emotional_patterns(session_id)
    
    # Print analysis results
    print(f"Emotional trend: {analysis['trend']} (confidence: {analysis['confidence']:.2f})")
    print(f"Dominant emotion: {analysis['dominant_emotion']}")
    
    # Generate self-aware responses
    ar_response = awareness.generate_self_aware_response(session_id, "ar")
    en_response = awareness.generate_self_aware_response(session_id, "en")
    
    print("\nSelf-aware responses:")
    if ar_response:
        print(f"  Arabic: {ar_response}")
    else:
        print("  No Arabic response generated")
    
    if en_response:
        print(f"  English: {en_response}")
    else:
        print("  No English response generated")
    
    # Test integration with state integrator
    # Force a self-aware response by monkey patching random.random
    import random
    original_random = random.random
    try:
        # Always return 0.1 to trigger self-aware response (threshold is 0.3)
        random.random = lambda: 0.1
        
        # Generate integrated response
        response = integrator.generate_integrated_response("كيف تراني الآن؟", session_id)
        
        print("\nForced self-aware response:")
        print(f"  Response: {response['text']}")
        print(f"  Self-aware: {response.get('self_aware', False)}")
    finally:
        # Restore original random function
        random.random = original_random
    
    return {
        "analysis": analysis,
        "ar_response": ar_response,
        "en_response": en_response,
        "integrated_response": response
    }

def main():
    """Main test function."""
    print("=== Emotional Integration Test ===")
    
    # Set up test data
    session_id = setup_test_data()
    
    # Verify the test data
    timeline = get_emotion_timeline(session_id)
    print(f"\nVerifying test data: {len(timeline)} emotional events logged")
    
    # Test state integrator with emotional self-awareness
    integrator_responses = test_state_integrator_with_emotional_awareness(session_id)
    
    # Test emotional timeline integration
    timeline_results = test_emotional_timeline_integration(session_id)
    
    # Test emotional self-awareness integration
    awareness_results = test_emotional_self_awareness_integration(session_id)
    
    print("\n=== Test Complete ===")
    print(f"Session ID: {session_id}")
    print(f"Timeline trend: {timeline_results['timeline_data']['summary']['trend']}")
    print(f"Self-aware responses: {sum(1 for r in integrator_responses if r.get('self_aware', False))}/{len(integrator_responses)}")
    
    return {
        "session_id": session_id,
        "integrator_responses": integrator_responses,
        "timeline_results": timeline_results,
        "awareness_results": awareness_results
    }

if __name__ == "__main__":
    main()