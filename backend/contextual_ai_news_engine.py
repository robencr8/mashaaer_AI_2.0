"""
Contextual AI News Engine - Connects AI news with emotional context and provides personalized responses.
"""

import random
from ai_news_brain import get_all_news, get_news_by_source, update_news_memory

# Emotion-to-news mapping weights
EMOTION_WEIGHTS = {
    "happy": {
        "positive": 0.8,
        "neutral": 0.2,
        "negative": 0.0
    },
    "sad": {
        "positive": 0.6,
        "neutral": 0.3,
        "negative": 0.1
    },
    "angry": {
        "positive": 0.3,
        "neutral": 0.3,
        "negative": 0.4
    },
    "surprised": {
        "positive": 0.5,
        "neutral": 0.4,
        "negative": 0.1
    },
    "fearful": {
        "positive": 0.2,
        "neutral": 0.3,
        "negative": 0.5
    },
    "neutral": {
        "positive": 0.33,
        "neutral": 0.34,
        "negative": 0.33
    }
}

# Simple sentiment classification keywords
SENTIMENT_KEYWORDS = {
    "positive": ["breakthrough", "success", "achievement", "improvement", "advance", "solution", "benefit", "opportunity", "progress", "innovation"],
    "negative": ["risk", "danger", "threat", "problem", "issue", "concern", "failure", "limitation", "challenge", "controversy"],
    "neutral": ["research", "study", "analysis", "report", "development", "update", "release", "announcement", "publication", "review"]
}

def classify_news_sentiment(news_item):
    """Classify the sentiment of a news item based on keywords"""
    text = f"{news_item.get('title', '')} {news_item.get('summary', '')}"
    text = text.lower()
    
    scores = {
        "positive": 0,
        "negative": 0,
        "neutral": 0
    }
    
    # Count occurrences of sentiment keywords
    for sentiment, keywords in SENTIMENT_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text:
                scores[sentiment] += 1
    
    # If no keywords found, default to neutral
    if sum(scores.values()) == 0:
        return "neutral"
    
    # Return the sentiment with the highest score
    return max(scores, key=scores.get)

def match_news_to_emotion(user_emotion, user_context=None):
    """Match news items to the user's emotional state"""
    # Default to neutral if emotion not recognized
    if user_emotion not in EMOTION_WEIGHTS:
        user_emotion = "neutral"
    
    # Get all news items
    all_news = get_all_news()
    if not all_news:
        update_news_memory()
        all_news = get_all_news()
    
    # Classify each news item by sentiment
    classified_news = {
        "positive": [],
        "neutral": [],
        "negative": []
    }
    
    for news in all_news:
        sentiment = classify_news_sentiment(news)
        classified_news[sentiment].append(news)
    
    # Apply emotion-based weights to select news
    weights = EMOTION_WEIGHTS[user_emotion]
    selected_news = []
    
    # Calculate how many items to select from each sentiment category
    total_items = min(5, len(all_news))  # Return at most 5 items
    
    for sentiment, weight in weights.items():
        # Calculate number of items to select from this sentiment
        num_items = int(total_items * weight)
        if num_items > 0 and classified_news[sentiment]:
            # Randomly select items from this sentiment category
            items = random.sample(classified_news[sentiment], min(num_items, len(classified_news[sentiment])))
            selected_news.extend(items)
    
    # If we didn't get enough items, add more from any category
    remaining_items = total_items - len(selected_news)
    if remaining_items > 0:
        # Flatten the list of all news items
        remaining_news = [item for sublist in classified_news.values() for item in sublist if item not in selected_news]
        if remaining_news:
            selected_news.extend(random.sample(remaining_news, min(remaining_items, len(remaining_news))))
    
    return selected_news

def summarize_for_user(news_item, tone="empathetic"):
    """Create a user-friendly summary of a news item with the specified emotional tone"""
    title = news_item.get("title", "")
    summary = news_item.get("summary", "")
    source = news_item.get("source", "")
    link = news_item.get("link", "")
    
    # Tone-specific introductions
    tone_intros = {
        "empathetic": [
            "I thought you might find this interesting:",
            "This caught my attention and made me think of you:",
            "I found something you might appreciate:",
            "This seems relevant to your interests:"
        ],
        "excited": [
            "Check out this amazing news!",
            "This is really exciting:",
            "You won't believe what's happening in AI:",
            "This breakthrough is incredible:"
        ],
        "calm": [
            "Here's something worth noting:",
            "I'd like to share this with you:",
            "This recent development might interest you:",
            "For your consideration:"
        ]
    }
    
    # Default to empathetic if tone not recognized
    if tone not in tone_intros:
        tone = "empathetic"
    
    # Select a random introduction for the specified tone
    intro = random.choice(tone_intros[tone])
    
    # Create the formatted summary
    formatted_summary = f"{intro} \"{title}\" from {source}. {summary[:150]}... [Read more]({link})"
    
    # Determine voice tone and emotion color based on the specified tone
    voice_tone = tone
    emotion_colors = {
        "empathetic": "#9bf",
        "excited": "#f9b",
        "calm": "#bfb"
    }
    
    return {
        "text": formatted_summary,
        "voice_tone": voice_tone,
        "emotion_color": emotion_colors.get(tone, "#9bf"),
        "original_news": news_item
    }

def generate_news_response(emotion, context=None):
    """Generate a complete news response based on user emotion and context"""
    # Match news to the user's emotion
    matched_news = match_news_to_emotion(emotion, context)
    
    if not matched_news:
        return {
            "success": False,
            "message": "No relevant news found. Please try again later."
        }
    
    # Determine the appropriate tone based on emotion
    tone_mapping = {
        "happy": "excited",
        "sad": "empathetic",
        "angry": "calm",
        "surprised": "excited",
        "fearful": "empathetic",
        "neutral": "calm"
    }
    
    tone = tone_mapping.get(emotion, "empathetic")
    
    # Summarize the first news item for the user
    response = summarize_for_user(matched_news[0], tone)
    
    # Add additional news items
    additional_news = []
    for news in matched_news[1:]:
        additional_news.append({
            "title": news.get("title", ""),
            "source": news.get("source", ""),
            "link": news.get("link", "")
        })
    
    response["additional_news"] = additional_news
    response["success"] = True
    
    return response