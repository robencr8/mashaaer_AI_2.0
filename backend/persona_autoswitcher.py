from persona_controller import set_persona
from intent_classifier import classify_intent
from emotion_engine import get_emotion_in_language

def auto_switch_persona(emotion: str, intent: str = None, user_input: str = None):
    """
    Automatically switches the persona based on the detected emotion and intent.

    Args:
        emotion (str): The detected emotion from the text (can be in standardized format or Arabic)
        intent (str, optional): The classified intent from the text
        user_input (str, optional): The original user input for intent classification if intent is not provided

    Returns:
        str: The name of the selected persona
    """
    # Convert standardized emotion names to Arabic if needed
    if emotion in ["sadness", "happiness", "anger", "fear", "neutral"]:
        emotion = get_emotion_in_language(emotion, 'ar')

    # Map emotions to appropriate personas
    emotion_to_persona = {
        "فرح": "صديق مهضوم",  # Joy/Happiness -> Funny friend
        "سعادة": "صديق مهضوم",  # Happiness -> Funny friend
        "حزن": "حنون",  # Sadness -> Caring
        "غضب": "مستشار",  # Anger -> Advisor
        "خوف": "حنون",  # Fear -> Caring
        "دهشة": "شاعر",  # Surprise -> Poet
        "حب": "شاعر",  # Love -> Poet
        "إعجاب": "شاعر",  # Admiration -> Poet
        "قلق": "حنون",  # Anxiety -> Caring
        "حماس": "صديق مهضوم",  # Enthusiasm -> Funny friend
        "حياد": "محايد",  # Neutral -> Neutral
    }

    # Classify intent if not provided but user_input is available
    if intent is None and user_input:
        intent = classify_intent(user_input)

    # Map intents to appropriate personas
    intent_to_persona = {
        "time_focus": "مستشار",  # Time management/focus -> Advisor
        "creative": "شاعر",  # Creative topics -> Poet
        "business": "مستشار",  # Business topics -> Advisor
        "movie": "صديق مهضوم",  # Movies -> Funny friend
        "book": "شاعر",  # Books -> Poet
        "quote": "شاعر",  # Quotes -> Poet
        "ai_news": "عالم",  # AI/Tech news -> Scientist
        "world_facts": "عالم",  # World facts -> Scientist
        "music": "شاعر",  # Music -> Poet
        "history": "عالم",  # History -> Scientist
        "default": "محايد",  # Default -> Neutral
    }

    # Get persona suggestions from emotion and intent
    emotion_persona = emotion_to_persona.get(emotion, "محايد")
    intent_persona = intent_to_persona.get(intent, "محايد") if intent else "محايد"

    # Emotion-Intent fusion for more nuanced persona selection
    selected_persona = emotion_persona  # Default to emotion-based selection

    # Special cases for emotion-intent combinations
    if emotion == "غضب" and intent in ["time_focus", "business"]:
        # Angry about productivity/business -> Advisor (calm, logical approach)
        selected_persona = "مستشار"
    elif emotion == "حزن" and intent in ["creative", "music", "book"]:
        # Sad about creative topics -> Poet (empathetic, artistic approach)
        selected_persona = "شاعر"
    elif emotion == "فرح" and intent in ["movie", "music"]:
        # Happy about entertainment -> Funny friend (celebratory approach)
        selected_persona = "صديق مهضوم"
    elif emotion == "خوف" and intent in ["business", "ai_news"]:
        # Fearful about business/tech -> Scientist (informative, reassuring approach)
        selected_persona = "عالم"
    elif emotion == "حياد" and intent:
        # For neutral emotion, prioritize intent-based selection
        selected_persona = intent_persona

    # Set the persona
    set_persona(selected_persona)

    return selected_persona
