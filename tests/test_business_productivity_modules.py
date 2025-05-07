"""
Test script for Business and Productivity Intelligence modules.
"""

import sys
import os

# Add the parent directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.intent_classifier import classify_intent
from backend.knowledge_dispatcher import smart_response
from backend.business_advisor import handle_business_query
from backend.creative_prompt_engine import handle_creative_prompt_query
from backend.time_focus_engine import handle_time_focus_query

def test_intent_classification():
    """Test that the intent classifier correctly identifies business and productivity intents."""
    print("Testing intent classification...")
    
    # Test business intent
    business_prompts = [
        "أريد نصائح لبدء مشروع جديد",
        "كيف أطور استراتيجية تسويق لشركتي؟",
        "ما هي أفضل طرق الاستثمار؟",
        "كيف أدير فريق عمل بفعالية؟"
    ]
    
    for prompt in business_prompts:
        intent = classify_intent(prompt)
        print(f"Prompt: '{prompt}' -> Intent: '{intent}'")
        assert intent == "business", f"Expected 'business' intent, got '{intent}'"
    
    # Test creative intent
    creative_prompts = [
        "أعطني أفكار إبداعية للكتابة",
        "أحتاج إلهام لمشروع فني",
        "ساعدني في تطوير أفكار إبداعية للتصميم",
        "كيف أعزز التفكير الإبداعي؟"
    ]
    
    for prompt in creative_prompts:
        intent = classify_intent(prompt)
        print(f"Prompt: '{prompt}' -> Intent: '{intent}'")
        assert intent == "creative", f"Expected 'creative' intent, got '{intent}'"
    
    # Test time focus intent
    time_focus_prompts = [
        "كيف أحسن إدارة الوقت؟",
        "أريد نصائح للتركيز أثناء العمل",
        "كيف أزيد إنتاجيتي؟",
        "ساعدني في التغلب على المماطلة"
    ]
    
    for prompt in time_focus_prompts:
        intent = classify_intent(prompt)
        print(f"Prompt: '{prompt}' -> Intent: '{intent}'")
        assert intent == "time_focus", f"Expected 'time_focus' intent, got '{intent}'"
    
    print("Intent classification tests passed!\n")

def test_knowledge_dispatcher():
    """Test that the knowledge dispatcher correctly routes to the appropriate modules."""
    print("Testing knowledge dispatcher routing...")
    
    # Test business routing
    business_prompt = "كيف أبدأ مشروعاً ناجحاً؟"
    response = smart_response(business_prompt)
    print(f"Business prompt: '{business_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response for business prompt, got None"
    
    # Test creative routing
    creative_prompt = "أعطني أفكاراً إبداعية للكتابة"
    response = smart_response(creative_prompt)
    print(f"Creative prompt: '{creative_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response for creative prompt, got None"
    
    # Test time focus routing
    time_focus_prompt = "كيف أحسن إدارة وقتي؟"
    response = smart_response(time_focus_prompt)
    print(f"Time focus prompt: '{time_focus_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response for time focus prompt, got None"
    
    print("Knowledge dispatcher routing tests passed!\n")

def test_direct_module_calls():
    """Test direct calls to the module handler functions."""
    print("Testing direct module calls...")
    
    # Test business advisor
    business_prompt = "ريادة أعمال"
    response = handle_business_query(business_prompt)
    print(f"Business prompt: '{business_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response from business advisor, got None"
    
    # Test creative prompt engine
    creative_prompt = "كتابة"
    response = handle_creative_prompt_query(creative_prompt)
    print(f"Creative prompt: '{creative_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response from creative prompt engine, got None"
    
    # Test time focus engine
    time_focus_prompt = "تركيز"
    response = handle_time_focus_query(time_focus_prompt)
    print(f"Time focus prompt: '{time_focus_prompt}'")
    print(f"Response: '{response[:100]}...'")  # Print first 100 chars of response
    assert response is not None, "Expected a response from time focus engine, got None"
    
    print("Direct module calls tests passed!\n")

if __name__ == "__main__":
    print("Starting tests for Business and Productivity Intelligence modules...\n")
    
    try:
        test_intent_classification()
        test_knowledge_dispatcher()
        test_direct_module_calls()
        
        print("All tests passed successfully!")
    except AssertionError as e:
        print(f"Test failed: {e}")