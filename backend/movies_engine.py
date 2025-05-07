"""
Movies Knowledge Engine - Provides information about movies, directors, actors, etc.
"""

def handle_movie_query(prompt: str) -> str:
    """
    Handles queries related to movies.
    
    Args:
        prompt (str): The user's prompt/query related to movies
        
    Returns:
        str: Response with movie information
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a movie database or API
    
    if "درامي" in prompt or "دراما" in prompt:
        if "حزين" in prompt:
            return "أنصحك بفيلم The Pursuit of Happyness. قصته حزينة لكنه ملهم ويحكي عن أب يكافح من أجل ابنه رغم الظروف الصعبة."
        else:
            return "من أفضل الأفلام الدرامية: The Shawshank Redemption، Forrest Gump، The Godfather. هذه الأفلام تعتبر من كلاسيكيات السينما العالمية."
    
    elif "كوميدي" in prompt:
        return "من أفضل الأفلام الكوميدية: The Hangover، Bridesmaids، Superbad. هذه الأفلام ستضمن لك الضحك والمتعة."
    
    elif "رعب" in prompt or "مخيف" in prompt:
        return "من أفضل أفلام الرعب: The Shining، Get Out، Hereditary. هذه الأفلام ستجعلك تشعر بالخوف والتوتر."
    
    elif "خيال علمي" in prompt or "sci-fi" in prompt:
        return "من أفضل أفلام الخيال العلمي: Inception، Interstellar، The Matrix. هذه الأفلام تجمع بين القصص المشوقة والمؤثرات البصرية المذهلة."
    
    elif "مخرج" in prompt:
        return "من أشهر المخرجين: ستيفن سبيلبرغ، كريستوفر نولان، مارتن سكورسيزي، كوينتن تارانتينو. كل منهم له أسلوبه الخاص في صناعة الأفلام."
    
    elif "ممثل" in prompt:
        return "من أشهر الممثلين: توم هانكس، ليوناردو دي كابريو، دينزل واشنطن، ميريل ستريب. هؤلاء الممثلون حصلوا على جوائز الأوسكار لأدائهم المتميز."
    
    else:
        return "هناك الكثير من الأفلام الرائعة في مختلف التصنيفات. هل تبحث عن نوع معين من الأفلام مثل الدراما، الكوميديا، الرعب، أو الخيال العلمي؟"