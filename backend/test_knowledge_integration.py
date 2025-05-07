"""
Test script to verify the integration of knowledge modules.
"""

from intent_classifier import classify_intent
from knowledge_dispatcher import smart_response

def test_knowledge_modules():
    """
    Tests the knowledge modules directly without relying on fallback_manager.
    """
    print("Testing Knowledge Modules")
    print("=======================")

    # Test movie intent
    movie_prompt = "اعطيني فيلم درامي حزين"
    print(f"\nPrompt: {movie_prompt}")
    print(f"Classified Intent: {classify_intent(movie_prompt)}")
    response = smart_response(movie_prompt)
    print(f"Response: {response}")

    # Test book intent
    book_prompt = "اقترح لي رواية عربية"
    print(f"\nPrompt: {book_prompt}")
    print(f"Classified Intent: {classify_intent(book_prompt)}")
    response = smart_response(book_prompt)
    print(f"Response: {response}")

    # Test quote intent
    quote_prompt = "اعطني حكمة عن النجاح"
    print(f"\nPrompt: {quote_prompt}")
    print(f"Classified Intent: {classify_intent(quote_prompt)}")
    response = smart_response(quote_prompt)
    print(f"Response: {response}")

    # Test world facts intent
    facts_prompt = "ما هي أكبر دولة عربية من حيث المساحة؟"
    print(f"\nPrompt: {facts_prompt}")
    print(f"Classified Intent: {classify_intent(facts_prompt)}")
    response = smart_response(facts_prompt)
    print(f"Response: {response}")

    # Test music intent
    music_prompt = "اقترح لي موسيقى كلاسيكية"
    print(f"\nPrompt: {music_prompt}")
    print(f"Classified Intent: {classify_intent(music_prompt)}")
    response = smart_response(music_prompt)
    print(f"Response: {response}")

    # Test history intent
    history_prompt = "حدثني عن الحضارة المصرية القديمة"
    print(f"\nPrompt: {history_prompt}")
    print(f"Classified Intent: {classify_intent(history_prompt)}")
    response = smart_response(history_prompt)
    print(f"Response: {response}")

    # Test default intent (should return None)
    default_prompt = "كيف حالك اليوم؟"
    print(f"\nPrompt: {default_prompt}")
    print(f"Classified Intent: {classify_intent(default_prompt)}")
    response = smart_response(default_prompt)
    print(f"Response: {response}")

if __name__ == "__main__":
    test_knowledge_modules()
