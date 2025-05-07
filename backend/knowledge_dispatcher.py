"""
Knowledge Dispatcher - Routes queries to the appropriate knowledge module based on intent.
"""

from intent_classifier import classify_intent
from movies_engine import handle_movie_query
from books_engine import handle_book_query
from quotes_engine import handle_quote_query
from world_facts_engine import handle_world_facts_query
from music_recommender import handle_music_query
from historical_events_engine import handle_history_query
# Import Business and Productivity Intelligence modules
from business_advisor import handle_business_query
from creative_prompt_engine import handle_creative_prompt_query
from time_focus_engine import handle_time_focus_query

def get_latest_news():
    """
    Gets the latest AI news.

    Returns:
        str: A formatted string with the latest AI news
    """
    # Placeholder function for testing
    return "آخر أخبار الذكاء الاصطناعي:\n\n1. تطورات جديدة في نماذج اللغة الكبيرة\n   تم إطلاق نماذج لغوية جديدة تتفوق على النماذج السابقة في فهم اللغة الطبيعية والقدرة على التفكير المنطقي...\n\n2. تقدم في مجال الرؤية الحاسوبية\n   باحثون يطورون خوارزميات جديدة تمكن الأنظمة من فهم المشاهد البصرية بشكل أفضل...\n\n3. تطبيقات الذكاء الاصطناعي في الطب\n   دراسات جديدة تظهر فعالية الذكاء الاصطناعي في تشخيص الأمراض بدقة تفوق الأطباء البشريين في بعض الحالات..."

def smart_response(prompt: str) -> str:
    """
    Routes the prompt to the appropriate knowledge module based on intent.

    Args:
        prompt (str): The user's prompt/query

    Returns:
        str: Response from the appropriate knowledge module, or None if no module can handle it
    """
    # Classify the intent of the prompt
    intent = classify_intent(prompt)

    # Route to the appropriate knowledge module
    if intent == "movie":
        return handle_movie_query(prompt)
    elif intent == "book":
        return handle_book_query(prompt)
    elif intent == "quote":
        return handle_quote_query(prompt)
    elif intent == "ai_news":
        return get_latest_news()
    elif intent == "world_facts":
        return handle_world_facts_query(prompt)
    elif intent == "music":
        return handle_music_query(prompt)
    elif intent == "history":
        return handle_history_query(prompt)
    # Business and Productivity Intelligence routing
    elif intent == "business":
        return handle_business_query(prompt)
    elif intent == "creative":
        return handle_creative_prompt_query(prompt)
    elif intent == "time_focus":
        return handle_time_focus_query(prompt)

    # If no specific intent is detected, return None to fall back to the main brain
    return None
