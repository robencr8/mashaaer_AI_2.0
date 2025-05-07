from emotional_memory import get_emotion_timeline, get_last_emotion

def react_to_memory(session_id: str, current_emotion: str) -> dict:
    """
    Reacts to the emotional memory of a session.
    
    Args:
        session_id (str): The ID of the session
        current_emotion (str): The current emotion detected
        
    Returns:
        dict: A dictionary containing the reaction information
    """
    # Get the emotion timeline for the session
    timeline = get_emotion_timeline(session_id)
    
    # If there's no timeline, return a default reaction
    if not timeline:
        return {
            "reaction_type": "new",
            "message": "هذه أول مرة نتفاعل فيها",
            "emotion_trend": "حياد"
        }
    
    # Get the last emotion from the timeline
    last_emotion = get_last_emotion(session_id)
    
    # Check if the emotion has changed
    emotion_changed = last_emotion != current_emotion
    
    # Count the occurrences of each emotion in the timeline
    emotion_counts = {}
    for entry in timeline:
        emotion = entry["emotion"]
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    
    # Determine the dominant emotion
    dominant_emotion = max(emotion_counts, key=emotion_counts.get) if emotion_counts else "حياد"
    
    # Generate a reaction based on the emotion trend
    reaction = {
        "reaction_type": "change" if emotion_changed else "continue",
        "message": f"أشعر أن مزاجك {'تغير' if emotion_changed else 'مستمر'} من {last_emotion} إلى {current_emotion}" if emotion_changed else f"مزاجك مستمر في {current_emotion}",
        "emotion_trend": dominant_emotion,
        "emotion_history": emotion_counts
    }
    
    return reaction