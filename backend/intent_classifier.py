def classify_intent(prompt: str) -> str:
    """
    Classifies the intent of a prompt to determine which knowledge module should handle it.

    Args:
        prompt (str): The user's prompt/query

    Returns:
        str: The classified intent (movie, book, quote, ai_news, etc.)
    """
    # Business and Productivity Intelligence intents - check these first for more specific matches
    # Check for time management first to catch "إدارة الوقت" (time management) before general "إدارة" (management)
    if "إدارة الوقت" in prompt or "تنظيم الوقت" in prompt:
        return "time_focus"

    if "تركيز" in prompt or "إنتاجية" in prompt or "إنتاجيتي" in prompt or "أزيد إنتاجية" in prompt or "تنظيم" in prompt or "مماطلة" in prompt or "تسويف" in prompt or "عادات" in prompt:
        return "time_focus"

    # Check for creative intents
    if "أفكار إبداعية" in prompt or "فكرة إبداعية" in prompt or "إلهام" in prompt or "كتابة إبداعية" in prompt:
        return "creative"

    if "إبداع" in prompt or "ابتكار" in prompt or "رسم" in prompt or "تصميم" in prompt:
        return "creative"

    # Check for business intents
    if "أعمال" in prompt or "شركة" in prompt or "مشروع" in prompt or "ريادة" in prompt or "استثمار" in prompt or "تسويق" in prompt or "إدارة" in prompt or "فريق" in prompt or "قيادة" in prompt:
        return "business"

    # Original intents
    if "فيلم" in prompt or "مخرج" in prompt or "ممثل" in prompt or "سينما" in prompt:
        return "movie"
    if "كتاب" in prompt or "رواية" in prompt or "مؤلف" in prompt or "كاتب" in prompt:
        return "book"
    if "اقتباس" in prompt or "حكمة" in prompt or "مقولة" in prompt or "قول مأثور" in prompt:
        return "quote"
    if "ذكاء اصطناعي" in prompt or "AI" in prompt or "تقنية" in prompt or "تكنولوجيا" in prompt:
        return "ai_news"
    if "حقيقة" in prompt or "معلومة" in prompt or "عالم" in prompt or "بلد" in prompt or "دولة" in prompt or "محيط" in prompt or "بحر" in prompt or "جبل" in prompt or "حيوان" in prompt or "فضاء" in prompt or "كوكب" in prompt or "علم" in prompt or "اكتشاف" in prompt:
        return "world_facts"
    if "موسيقى" in prompt or "أغنية" in prompt or "مطرب" in prompt or "فنان" in prompt:
        return "music"
    if "تاريخ" in prompt or "حدث" in prompt or "معركة" in prompt or "شخصية تاريخية" in prompt or "حضارة" in prompt:
        return "history"

    # Default intent if no specific intent is detected
    return "default"
