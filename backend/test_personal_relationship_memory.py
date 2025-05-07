"""
Test script for the PersonalRelationshipMemory component.

This script tests the functionality of the personal relationship memory system,
which tracks and manages relationship data to make interactions feel like they
build upon each other.

Usage:
    python test_personal_relationship_memory.py
"""

import os
import time
from datetime import datetime
from dotenv import load_dotenv

from personal_relationship_memory import PersonalRelationshipMemory
from emotion_engine import detect_emotion

# Load environment variables from .env file if available
try:
    load_dotenv()
except ImportError:
    pass

def test_relationship_data_storage():
    """Test storing and retrieving relationship data."""
    print("\n=== Testing Relationship Data Storage ===")
    
    # Initialize the personal relationship memory system
    relationship_memory = PersonalRelationshipMemory()
    
    # Create a test session ID
    session_id = f"test_{int(time.time())}"
    
    # Test interactions
    interactions = [
        {
            "user_input": "مرحبا، اسمي أحمد وأنا مهندس من الرياض",
            "response": "مرحبا أحمد، سعيد بلقائك. كيف يمكنني مساعدتك اليوم؟"
        },
        {
            "user_input": "أنا أحب التكنولوجيا والسفر",
            "response": "هذا رائع! التكنولوجيا والسفر من المواضيع المثيرة للاهتمام. هل هناك وجهة سفر معينة تفضلها؟"
        },
        {
            "user_input": "نعم، أحب زيارة اليابان كثيرا",
            "response": "اليابان وجهة رائعة! مزيج مذهل من التقاليد والتكنولوجيا المتقدمة. هل زرتها من قبل؟"
        }
    ]
    
    # Process interactions
    for interaction in interactions:
        relationship_memory.update_relationship_from_interaction(
            interaction["user_input"],
            interaction["response"],
            session_id
        )
    
    # Get relationship insights
    insights = relationship_memory.get_relationship_insights(session_id)
    
    # Print insights
    print(f"Relationship insights for session {session_id}:")
    print(f"  Identity: {insights['identity']}")
    print(f"  Relationship quality: {insights['relationship_quality']}")
    print(f"  User preferences:")
    print(f"    Communication style: {insights['user_preferences']['communication_style']}")
    print(f"    Topic interests: {insights['user_preferences']['topic_interests']}")
    
    # Check if identity information was extracted correctly
    assert insights["identity"]["name"] == "أحمد", "Name extraction failed"
    assert "مهندس" in str(insights["identity"]["background"]), "Occupation extraction failed"
    assert "الرياض" in str(insights["identity"]["background"]), "Location extraction failed"
    
    # Check if topic interests were updated correctly
    assert "technology" in insights["user_preferences"]["topic_interests"], "Topic interest extraction failed"
    assert "travel" in insights["user_preferences"]["topic_interests"], "Topic interest extraction failed"
    
    print("Relationship data storage test passed!")
    
    return relationship_memory, session_id, insights

def test_relationship_aware_responses(relationship_memory, session_id):
    """Test generating relationship-aware responses."""
    print("\n=== Testing Relationship-Aware Responses ===")
    
    # Test base responses
    base_responses = [
        "هذه معلومة مفيدة.",
        "يمكنني مساعدتك في ذلك.",
        "هذا موضوع مثير للاهتمام."
    ]
    
    # Test user inputs
    user_inputs = [
        "أخبرني عن التكنولوجيا الحديثة",
        "هل يمكنك مساعدتي في التخطيط لرحلتي القادمة؟",
        "ما رأيك في الذكاء الاصطناعي؟"
    ]
    
    # Generate relationship-aware responses
    print("Generating relationship-aware responses:")
    for i, base_response in enumerate(base_responses):
        user_input = user_inputs[i]
        enhanced_response = relationship_memory.generate_relationship_aware_response(
            user_input,
            base_response,
            session_id
        )
        
        print(f"\nUser input: {user_input}")
        print(f"Base response: {base_response}")
        print(f"Enhanced response: {enhanced_response}")
        
        # Check if the enhanced response is different from the base response
        assert enhanced_response != base_response, "Response enhancement failed"
        
        # Check if the enhanced response contains the user's name
        insights = relationship_memory.get_relationship_insights(session_id)
        if insights["identity"]["name"]:
            assert insights["identity"]["name"] in enhanced_response, "Personalization failed"
    
    print("Relationship-aware responses test passed!")

def test_preference_adaptation():
    """Test adaptation to user preferences."""
    print("\n=== Testing Preference Adaptation ===")
    
    # Initialize the personal relationship memory system
    relationship_memory = PersonalRelationshipMemory()
    
    # Create a test session ID
    session_id = f"test_pref_{int(time.time())}"
    
    # Test interactions with different styles
    interactions = [
        # Verbose style
        {
            "user_input": "أريد أن أعرف المزيد عن تاريخ الحضارة المصرية القديمة وكيف تطورت على مر العصور وما هي أهم إنجازاتها وكيف أثرت على الحضارات الأخرى في ذلك الوقت",
            "response": "تاريخ الحضارة المصرية غني جدا.",
            "feedback": 0.8  # Positive feedback
        },
        # Formal style
        {
            "user_input": "هل يمكنكم تزويدي بمعلومات حول كيفية الاستثمار في سوق الأسهم، مع الشكر الجزيل لكم",
            "response": "بالتأكيد، يمكنني مساعدتك في ذلك.",
            "feedback": 0.7  # Positive feedback
        },
        # Questions preference
        {
            "user_input": "ما هي أفضل الوجهات السياحية في أوروبا؟",
            "response": "هناك العديد من الوجهات الرائعة في أوروبا. هل سبق لك زيارة أي منها؟",
            "feedback": 0.9  # Very positive feedback
        }
    ]
    
    # Process interactions
    for interaction in interactions:
        relationship_memory.update_relationship_from_interaction(
            interaction["user_input"],
            interaction["response"],
            session_id,
            interaction["feedback"]
        )
    
    # Get relationship insights
    insights = relationship_memory.get_relationship_insights(session_id)
    
    # Print preferences
    print(f"User preferences after interactions:")
    print(f"  Communication style: {insights['user_preferences']['communication_style']}")
    print(f"  Response preferences: {insights['user_preferences']['response_preferences']}")
    
    # Check if preferences were updated correctly
    assert insights["user_preferences"]["communication_style"]["verbose"] > 0.5, "Verbose preference adaptation failed"
    assert insights["user_preferences"]["communication_style"]["formal"] > 0.5, "Formal preference adaptation failed"
    assert insights["user_preferences"]["response_preferences"]["questions"] > 0.5, "Questions preference adaptation failed"
    
    # Test response enhancement based on preferences
    base_response = "هذه معلومة عن الموضوع."
    user_input = "أخبرني عن هذا الموضوع"
    
    enhanced_response = relationship_memory.generate_relationship_aware_response(
        user_input,
        base_response,
        session_id
    )
    
    print(f"\nBase response: {base_response}")
    print(f"Enhanced response (with adapted preferences): {enhanced_response}")
    
    # Check if the enhanced response reflects the preferences
    assert len(enhanced_response) > len(base_response), "Verbose preference not applied"
    assert "?" in enhanced_response, "Questions preference not applied"
    
    print("Preference adaptation test passed!")

def test_multilingual_support():
    """Test support for multiple languages."""
    print("\n=== Testing Multilingual Support ===")
    
    # Initialize the personal relationship memory system
    relationship_memory = PersonalRelationshipMemory()
    
    # Create a test session ID
    session_id = f"test_lang_{int(time.time())}"
    
    # Test interactions in different languages
    interactions = [
        # Arabic
        {
            "user_input": "مرحبا، اسمي محمد",
            "response": "مرحبا محمد، كيف يمكنني مساعدتك؟"
        },
        # English
        {
            "user_input": "Hello, my name is Mohammed and I am from Dubai",
            "response": "Hello Mohammed, how can I help you today?"
        }
    ]
    
    # Process interactions
    for interaction in interactions:
        relationship_memory.update_relationship_from_interaction(
            interaction["user_input"],
            interaction["response"],
            session_id
        )
    
    # Get relationship insights
    insights = relationship_memory.get_relationship_insights(session_id)
    
    # Print identity information
    print(f"Identity information after multilingual interactions:")
    print(f"  Name: {insights['identity']['name']}")
    print(f"  Background: {insights['identity']['background']}")
    
    # Test response enhancement in different languages
    test_cases = [
        {
            "language": "ar",
            "user_input": "كيف حالك اليوم؟",
            "base_response": "أنا بخير، شكرا لسؤالك."
        },
        {
            "language": "en",
            "user_input": "How are you today?",
            "base_response": "I'm doing well, thank you for asking."
        }
    ]
    
    for case in test_cases:
        # Detect language
        _, detected_lang = detect_emotion(case["user_input"])
        
        # Generate enhanced response
        enhanced_response = relationship_memory.generate_relationship_aware_response(
            case["user_input"],
            case["base_response"],
            session_id
        )
        
        print(f"\nLanguage: {detected_lang}")
        print(f"User input: {case['user_input']}")
        print(f"Base response: {case['base_response']}")
        print(f"Enhanced response: {enhanced_response}")
        
        # Check if the enhanced response contains the user's name
        if insights["identity"]["name"]:
            assert insights["identity"]["name"] in enhanced_response, f"Personalization failed for {detected_lang}"
    
    print("Multilingual support test passed!")

def main():
    """Main test function."""
    print("=== Personal Relationship Memory Test ===")
    
    # Test relationship data storage
    relationship_memory, session_id, insights = test_relationship_data_storage()
    
    # Test relationship-aware responses
    test_relationship_aware_responses(relationship_memory, session_id)
    
    # Test preference adaptation
    test_preference_adaptation()
    
    # Test multilingual support
    test_multilingual_support()
    
    print("\n=== All Tests Completed Successfully ===")

if __name__ == "__main__":
    main()