"""
Test script for the integration of the personal relationship system with the state integrator.

This script tests the complete integration of the personal relationship memory system
with the state integrator, ensuring that relationship-aware responses are generated
correctly.

Usage:
    python test_relationship_integration.py
"""

import os
import time
from datetime import datetime
from dotenv import load_dotenv

from state_integrator import StateIntegrator
from personal_relationship_memory import PersonalRelationshipMemory
from emotion_engine import detect_emotion

# Load environment variables from .env file if available
try:
    load_dotenv()
except ImportError:
    pass

def test_state_integrator_with_relationship_memory():
    """Test the state integrator with the personal relationship memory system."""
    print("\n=== Testing State Integrator with Personal Relationship Memory ===")
    
    # Initialize the state integrator
    integrator = StateIntegrator()
    
    # Create a test session ID
    session_id = f"test_integration_{int(time.time())}"
    
    # Test interactions
    interactions = [
        # First interaction - introduce user
        "مرحبا، اسمي خالد وأنا مهندس برمجيات من الرياض",
        
        # Second interaction - express interest in technology
        "أنا مهتم جدا بالذكاء الاصطناعي وتطبيقاته",
        
        # Third interaction - ask a question
        "هل يمكنك إخباري عن آخر التطورات في مجال الذكاء الاصطناعي؟",
        
        # Fourth interaction - express emotion
        "أنا متحمس جدا لمستقبل هذه التقنية!",
        
        # Fifth interaction - ask for help
        "هل يمكنك مساعدتي في فهم كيفية عمل نماذج اللغة الكبيرة؟"
    ]
    
    # Process each interaction and check for personalization
    responses = []
    for i, user_input in enumerate(interactions):
        print(f"\nInteraction {i+1}:")
        print(f"User: {user_input}")
        
        # Generate integrated response
        response = integrator.generate_integrated_response(user_input, session_id)
        
        print(f"Assistant: {response['text']}")
        
        # Store response for later analysis
        responses.append(response)
        
        # Check if the response contains personalization after the first interaction
        if i > 0 and "خالد" in response["text"]:
            print("✓ Response contains personalization (user's name)")
        
        # Add a small delay to simulate real conversation
        time.sleep(1)
    
    # Get relationship insights
    relationship_memory = integrator.relationship_memory
    insights = relationship_memory.get_relationship_insights(session_id)
    
    # Print relationship insights
    print("\nRelationship insights after conversation:")
    print(f"  Identity: {insights['identity']}")
    print(f"  Relationship quality: {insights['relationship_quality']}")
    print(f"  User preferences:")
    print(f"    Communication style: {insights['user_preferences']['communication_style']}")
    print(f"    Topic interests: {insights['user_preferences']['topic_interests']}")
    
    # Check if identity information was extracted correctly
    assert insights["identity"]["name"] == "خالد", "Name extraction failed"
    assert "مهندس" in str(insights["identity"]["background"]), "Occupation extraction failed"
    assert "الرياض" in str(insights["identity"]["background"]), "Location extraction failed"
    
    # Check if topic interests were updated correctly
    assert "technology" in insights["user_preferences"]["topic_interests"], "Topic interest extraction failed"
    
    print("\nState integrator with personal relationship memory test passed!")
    
    return integrator, session_id, insights

def test_relationship_adaptation_over_time():
    """Test adaptation of relationship over time."""
    print("\n=== Testing Relationship Adaptation Over Time ===")
    
    # Initialize the state integrator
    integrator = StateIntegrator()
    
    # Create a test session ID
    session_id = f"test_adaptation_{int(time.time())}"
    
    # Test interactions with different styles
    interactions = [
        # Verbose style
        "أريد أن أعرف المزيد عن تاريخ الحضارة المصرية القديمة وكيف تطورت على مر العصور وما هي أهم إنجازاتها وكيف أثرت على الحضارات الأخرى في ذلك الوقت",
        
        # Formal style
        "هل يمكنكم تزويدي بمعلومات حول كيفية الاستثمار في سوق الأسهم، مع الشكر الجزيل لكم",
        
        # Question style
        "ما هي أفضل الوجهات السياحية في أوروبا؟",
        
        # Emotional style
        "أشعر بالسعادة اليوم لأنني حققت إنجازًا مهمًا في عملي",
        
        # Direct style
        "أخبرني عن الطقس غدًا"
    ]
    
    # Process each interaction
    for i, user_input in enumerate(interactions):
        print(f"\nInteraction {i+1}:")
        print(f"User: {user_input}")
        
        # Generate integrated response
        response = integrator.generate_integrated_response(user_input, session_id)
        
        print(f"Assistant: {response['text']}")
        
        # Add a small delay to simulate real conversation
        time.sleep(1)
    
    # Get relationship insights
    relationship_memory = integrator.relationship_memory
    insights = relationship_memory.get_relationship_insights(session_id)
    
    # Print user preferences
    print("\nUser preferences after interactions:")
    print(f"  Communication style: {insights['user_preferences']['communication_style']}")
    print(f"  Response preferences: {insights['user_preferences']['response_preferences']}")
    
    # Test adaptation with a final interaction
    final_input = "أخبرني عن أهمية الذكاء الاصطناعي"
    print("\nFinal interaction:")
    print(f"User: {final_input}")
    
    # Generate integrated response
    final_response = integrator.generate_integrated_response(final_input, session_id)
    
    print(f"Assistant: {final_response['text']}")
    
    # Check if the response reflects the adapted preferences
    if insights["user_preferences"]["communication_style"]["verbose"] > 0.6:
        assert len(final_response["text"]) > 100, "Verbose preference not applied"
        print("✓ Response reflects verbose preference")
    
    if insights["user_preferences"]["communication_style"]["formal"] > 0.6:
        formal_indicators = ["يمكنني", "بالتأكيد", "يسعدني"]
        assert any(indicator in final_response["text"] for indicator in formal_indicators), "Formal preference not applied"
        print("✓ Response reflects formal preference")
    
    print("\nRelationship adaptation over time test passed!")

def main():
    """Main test function."""
    print("=== Personal Relationship Integration Test ===")
    
    # Test state integrator with personal relationship memory
    integrator, session_id, insights = test_state_integrator_with_relationship_memory()
    
    # Test relationship adaptation over time
    test_relationship_adaptation_over_time()
    
    print("\n=== All Integration Tests Completed Successfully ===")

if __name__ == "__main__":
    main()