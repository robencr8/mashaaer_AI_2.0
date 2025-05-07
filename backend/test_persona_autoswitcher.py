"""
Test script for the enhanced persona_autoswitcher module.
This script demonstrates how the persona_autoswitcher uses both emotion and intent
to make more nuanced persona selections.

Usage:
    python test_persona_autoswitcher.py
"""

import os
from dotenv import load_dotenv
from persona_autoswitcher import auto_switch_persona
from emotion_engine import detect_emotion, get_emotion_in_language
from intent_classifier import classify_intent
from persona_controller import get_persona

# Load environment variables from .env file if available
try:
    load_dotenv()
except ImportError:
    pass

def test_emotion_based_switching():
    """Test persona switching based on emotions in different languages."""
    print("Testing emotion-based persona switching...\n")

    # Test texts in different languages with different emotions
    test_texts = [
        # Arabic texts
        "أنا سعيد جدا اليوم، لقد نجحت في الامتحان!",  # Happy
        "أشعر بالحزن الشديد بسبب ما حدث",              # Sad
        "أنا غاضب جدا من تصرفاتك!",                    # Angry
        "أنا خائف من المستقبل",                        # Fearful
        "اليوم هو الخميس، الطقس معتدل",                # Neutral

        # English texts
        "I am very happy today, I passed my exam!",     # Happy
        "I feel very sad because of what happened",     # Sad
        "I am very angry with your behavior!",          # Angry
        "I am afraid of the future",                    # Fearful
        "Today is Thursday, the weather is moderate"    # Neutral
    ]

    for text in test_texts:
        # Detect emotion using the multilingual system
        standardized_emotion, detected_lang = detect_emotion(text)
        arabic_emotion = get_emotion_in_language(standardized_emotion, 'ar')

        print(f"Text: {text}")
        print(f"Detected language: {detected_lang}")
        print(f"Detected emotion: {standardized_emotion}")
        print(f"Emotion in Arabic: {arabic_emotion}")

        # Test auto_switch_persona with the detected emotion
        selected_persona = auto_switch_persona(standardized_emotion)
        persona_details = get_persona()

        print(f"Selected persona: {selected_persona}")
        print(f"Persona prefix: {persona_details['prefix']}")
        print(f"Persona tone: {persona_details['tone']}")
        print("-" * 50)

def test_intent_based_switching():
    """Test persona switching based on intents."""
    print("\nTesting intent-based persona switching...\n")

    # Test texts with different intents
    test_texts = [
        "أريد نصائح لإدارة الوقت بشكل أفضل",           # time_focus
        "أعطني أفكار إبداعية لكتابة قصة",              # creative
        "كيف أبدأ مشروع تجاري ناجح؟",                  # business
        "ما هو أفضل فيلم شاهدته مؤخرا؟",               # movie
        "أوصيني بكتاب جيد للقراءة",                    # book
        "ما هي آخر التطورات في مجال الذكاء الاصطناعي؟", # ai_news
        "أخبرني حقيقة مثيرة عن الفضاء",                # world_facts
        "من هو أفضل مغني في العالم العربي؟",           # music
        "ما هي أهم الأحداث التاريخية في القرن العشرين؟" # history
    ]

    for text in test_texts:
        # Classify intent
        intent = classify_intent(text)

        print(f"Text: {text}")
        print(f"Classified intent: {intent}")

        # Test auto_switch_persona with neutral emotion and the classified intent
        selected_persona = auto_switch_persona("حياد", intent=intent)
        persona_details = get_persona()

        print(f"Selected persona: {selected_persona}")
        print(f"Persona prefix: {persona_details['prefix']}")
        print(f"Persona tone: {persona_details['tone']}")
        print("-" * 50)

def test_emotion_intent_fusion():
    """Test persona switching based on both emotion and intent."""
    print("\nTesting emotion-intent fusion for persona switching...\n")

    # Test cases with specific emotion-intent combinations
    test_cases = [
        # Emotion, Intent, Text
        ("غضب", "business", "أنا غاضب جدا من أداء الشركة هذا الشهر!"),
        ("حزن", "creative", "أشعر بالحزن وأريد كتابة قصيدة تعبر عن مشاعري"),
        ("فرح", "movie", "أنا سعيد جدا بمشاهدة هذا الفيلم الرائع!"),
        ("خوف", "ai_news", "أخشى من تأثير الذكاء الاصطناعي على مستقبل العمل"),
        ("حياد", "world_facts", "أريد معرفة حقائق عن المحيطات")
    ]

    for emotion, intent, text in test_cases:
        print(f"Text: {text}")
        print(f"Emotion: {emotion}")
        print(f"Intent: {intent}")

        # Test auto_switch_persona with both emotion and intent
        selected_persona = auto_switch_persona(emotion, intent=intent)
        persona_details = get_persona()

        print(f"Selected persona: {selected_persona}")
        print(f"Persona prefix: {persona_details['prefix']}")
        print(f"Persona tone: {persona_details['tone']}")
        print("-" * 50)

def test_real_world_scenarios():
    """Test persona switching with real-world scenarios."""
    print("\nTesting real-world scenarios for persona switching...\n")

    # Real-world scenarios with text, expected emotion, and expected intent
    scenarios = [
        # Text, Expected Emotion, Expected Intent
        ("أنا حزين جدا لأنني فقدت وظيفتي، هل يمكنك مساعدتي في البحث عن عمل جديد؟", 
         "sadness", "business"),
        
        ("أنا متحمس جدا لمشاهدة الفيلم الجديد، هل يمكنك اقتراح بعض الأفلام المشابهة؟", 
         "happiness", "movie"),
        
        ("أنا غاضب من زميلي في العمل، كيف يمكنني التعامل مع هذا الموقف بشكل احترافي؟", 
         "anger", "business"),
        
        ("أنا خائف من الامتحان القادم، كيف يمكنني التركيز والاستعداد بشكل أفضل؟", 
         "fear", "time_focus"),
        
        ("ما هي أحدث الاكتشافات العلمية في مجال الفضاء؟", 
         "neutral", "world_facts")
    ]

    for text, expected_emotion, expected_intent in scenarios:
        # Detect emotion
        standardized_emotion, detected_lang = detect_emotion(text)
        
        # Classify intent
        intent = classify_intent(text)

        print(f"Text: {text}")
        print(f"Detected emotion: {standardized_emotion} (Expected: {expected_emotion})")
        print(f"Classified intent: {intent} (Expected: {expected_intent})")

        # Test auto_switch_persona with the full text
        selected_persona = auto_switch_persona(standardized_emotion, user_input=text)
        persona_details = get_persona()

        print(f"Selected persona: {selected_persona}")
        print(f"Persona prefix: {persona_details['prefix']}")
        print(f"Persona tone: {persona_details['tone']}")
        print("-" * 50)

if __name__ == "__main__":
    print("Testing Enhanced Persona AutoSwitcher\n")
    print("=" * 50)
    
    # Run the tests
    test_emotion_based_switching()
    test_intent_based_switching()
    test_emotion_intent_fusion()
    test_real_world_scenarios()
    
    print("\nAll tests completed.")