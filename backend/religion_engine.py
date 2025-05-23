"""
Religion Knowledge Engine - Provides religious and spiritual information without direct preaching.
"""

def handle_religion_query(prompt: str) -> str:
    """
    Handles queries related to religious and spiritual topics.
    
    Args:
        prompt (str): The user's prompt/query related to religion
        
    Returns:
        str: Response with religious or spiritual information
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a religious texts database or API
    
    if "آية" in prompt:
        if "صبر" in prompt:
            return "من الآيات القرآنية عن الصبر: 'واصبر وما صبرك إلا بالله' (النحل: 127)، 'إنما يوفى الصابرون أجرهم بغير حساب' (الزمر: 10)، 'يا أيها الذين آمنوا استعينوا بالصبر والصلاة إن الله مع الصابرين' (البقرة: 153)."
        elif "رحمة" in prompt:
            return "من الآيات القرآنية عن الرحمة: 'ورحمتي وسعت كل شيء' (الأعراف: 156)، 'وما أرسلناك إلا رحمة للعالمين' (الأنبياء: 107)، 'والله يختص برحمته من يشاء' (البقرة: 105)."
        elif "علم" in prompt:
            return "من الآيات القرآنية عن العلم: 'يرفع الله الذين آمنوا منكم والذين أوتوا العلم درجات' (المجادلة: 11)، 'قل هل يستوي الذين يعلمون والذين لا يعلمون' (الزمر: 9)، 'وقل رب زدني علماً' (طه: 114)."
        else:
            return "القرآن الكريم هو كتاب المسلمين المقدس، يتكون من 114 سورة و6236 آية. نزل على النبي محمد صلى الله عليه وسلم على مدى 23 عاماً. يتناول القرآن مواضيع متنوعة تشمل العقيدة، العبادات، المعاملات، القصص، والأخلاق. هل تبحث عن آيات في موضوع معين؟"
    
    elif "حديث" in prompt:
        if "أخلاق" in prompt:
            return "من الأحاديث النبوية عن الأخلاق: 'إنما بعثت لأتمم مكارم الأخلاق'، 'أكمل المؤمنين إيماناً أحسنهم خلقاً'، 'ما من شيء أثقل في ميزان المؤمن يوم القيامة من حسن الخلق'."
        elif "علم" in prompt:
            return "من الأحاديث النبوية عن العلم: 'طلب العلم فريضة على كل مسلم'، 'من سلك طريقاً يلتمس فيه علماً سهل الله له طريقاً إلى الجنة'، 'العلماء ورثة الأنبياء'."
        elif "رحمة" in prompt:
            return "من الأحاديث النبوية عن الرحمة: 'الراحمون يرحمهم الرحمن، ارحموا من في الأرض يرحمكم من في السماء'، 'لا تنزع الرحمة إلا من شقي'، 'من لا يرحم لا يُرحم'."
        else:
            return "الحديث النبوي هو ما نُقل عن النبي محمد صلى الله عليه وسلم من قول أو فعل أو تقرير. جُمعت الأحاديث في كتب عديدة أشهرها: صحيح البخاري، صحيح مسلم، سنن أبي داود، سنن الترمذي، سنن النسائي، وسنن ابن ماجه. هل تبحث عن أحاديث في موضوع معين؟"
    
    elif "روحانية" in prompt or "تأمل" in prompt:
        return "التأمل والممارسات الروحانية موجودة في جميع الثقافات والأديان. في الإسلام، يمكن اعتبار الخشوع في الصلاة والذكر والتفكر في خلق الله من أشكال التأمل. هذه الممارسات تساعد على تهدئة النفس وتصفية الذهن والشعور بالسكينة الداخلية. من الأذكار المهدئة للنفس: 'سبحان الله وبحمده، سبحان الله العظيم'، 'لا إله إلا الله'، 'الحمد لله الذي بنعمته تتم الصالحات'."
    
    elif "أديان" in prompt:
        return "هناك العديد من الأديان في العالم، أكبرها من حيث عدد الأتباع: المسيحية (2.4 مليار)، الإسلام (1.9 مليار)، الهندوسية (1.2 مليار)، البوذية (500 مليون). تشترك معظم الأديان في قيم أساسية مثل الرحمة، العدل، الصدق، والإحسان للآخرين، رغم اختلافها في العقائد والطقوس."
    
    elif "قيم" in prompt or "أخلاق" in prompt:
        return "القيم الأخلاقية هي مبادئ توجه سلوك الإنسان نحو الخير. من القيم المشتركة بين الأديان والثقافات: الصدق، الأمانة، العدل، الرحمة، التسامح، الإيثار، احترام الآخرين. هذه القيم ضرورية لبناء مجتمع متماسك وعلاقات إنسانية صحية."
    
    elif "معنى الحياة" in prompt:
        return "سؤال معنى الحياة من الأسئلة الفلسفية والروحانية العميقة التي شغلت الإنسان عبر التاريخ. تقدم الأديان إجابات متنوعة، ففي الإسلام مثلاً، الغاية من الحياة هي عبادة الله وعمارة الأرض. بينما يرى البعض أن معنى الحياة يكمن في السعي للسعادة أو خدمة الآخرين أو تحقيق الذات. في النهاية، كل إنسان يصنع معنى لحياته بناءً على قيمه ومعتقداته وتجاربه."
    
    else:
        return "الدين والروحانية جزء أساسي من الثقافة الإنسانية عبر التاريخ. يمكنني تقديم معلومات عن آيات قرآنية، أحاديث نبوية، قيم أخلاقية، أو مفاهيم روحانية. ما الجانب الذي تود معرفة المزيد عنه؟"