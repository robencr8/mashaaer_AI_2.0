"""
Historical Events Engine - Provides information about historical events, figures, and periods.
"""

def handle_history_query(prompt: str) -> str:
    """
    Handles queries related to historical events and figures.
    
    Args:
        prompt (str): The user's prompt/query related to history
        
    Returns:
        str: Response with historical information
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a history database or API
    
    if "حضارة" in prompt:
        if "مصر" in prompt or "فرعون" in prompt:
            return "الحضارة المصرية القديمة هي واحدة من أقدم الحضارات في التاريخ، استمرت لأكثر من 3000 سنة. اشتهرت ببناء الأهرامات والمعابد، وتطوير الكتابة الهيروغليفية، والتقدم في الطب والفلك والرياضيات."
        elif "عربية" in prompt or "إسلامية" in prompt:
            return "ازدهرت الحضارة العربية الإسلامية خلال العصر الذهبي (القرن 8-14 م). قدمت إسهامات كبيرة في العلوم والطب والرياضيات والفلك والفلسفة. من أبرز علمائها: ابن سينا، الخوارزمي، ابن الهيثم، والرازي."
        else:
            return "من أبرز الحضارات القديمة: المصرية، السومرية، البابلية، الإغريقية، الرومانية، الصينية، والهندية. كل حضارة تركت إرثاً ثقافياً وعلمياً مميزاً أثر في تطور البشرية."
    
    elif "حرب عالمية" in prompt:
        if "أولى" in prompt:
            return "الحرب العالمية الأولى (1914-1918) نشبت بين دول الوفاق (بريطانيا، فرنسا، روسيا) ودول المحور (ألمانيا، النمسا-المجر، الدولة العثمانية). أدت إلى مقتل أكثر من 9 ملايين جندي وتغييرات جذرية في خريطة أوروبا والشرق الأوسط."
        elif "ثانية" in prompt:
            return "الحرب العالمية الثانية (1939-1945) هي أكبر صراع عسكري في التاريخ. دارت بين دول الحلفاء (بريطانيا، فرنسا، الاتحاد السوفيتي، الولايات المتحدة) ودول المحور (ألمانيا، إيطاليا، اليابان). أدت إلى مقتل حوالي 70-85 مليون شخص."
        else:
            return "الحربان العالميتان غيرتا وجه العالم في القرن العشرين. الأولى (1914-1918) أدت إلى سقوط إمبراطوريات وظهور دول جديدة، والثانية (1939-1945) كانت الأكثر دموية في التاريخ وأدت إلى ظهور نظام عالمي جديد."
    
    elif "ثورة" in prompt:
        if "فرنسية" in prompt:
            return "الثورة الفرنسية (1789-1799) كانت فترة من الاضطرابات السياسية والاجتماعية في فرنسا. أطاحت بالنظام الملكي وأسست للجمهورية. شعارها كان 'الحرية، المساواة، الإخاء' وأثرت بشكل كبير على الفكر السياسي الحديث."
        elif "صناعية" in prompt:
            return "الثورة الصناعية (بدأت في القرن 18) كانت فترة تحول من الإنتاج اليدوي إلى الإنتاج الآلي. بدأت في بريطانيا ثم انتشرت عالمياً. أدت إلى تغييرات جذرية في الاقتصاد والمجتمع وأسست للعالم الصناعي الحديث."
        else:
            return "الثورات غيرت مسار التاريخ البشري. من أشهرها: الثورة الفرنسية، الثورة الأمريكية، الثورة الروسية، والثورة الصناعية. كل ثورة أحدثت تغييرات جذرية في المجتمعات التي حدثت فيها."
    
    elif "شخصية" in prompt:
        return "من أبرز الشخصيات التاريخية: الإسكندر الأكبر، يوليوس قيصر، صلاح الدين الأيوبي، جنكيز خان، ليوناردو دافنشي، نابليون بونابرت، مهاتما غاندي، ونيلسون مانديلا. هؤلاء الأشخاص تركوا بصمة واضحة في التاريخ البشري."
    
    else:
        return "التاريخ البشري غني بالأحداث والشخصيات المؤثرة. هل تبحث عن معلومات عن حضارة معينة، أو حرب، أو ثورة، أو شخصية تاريخية محددة؟"