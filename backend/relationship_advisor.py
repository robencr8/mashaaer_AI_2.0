"""
Relationship Advisor Engine - Provides advice on relationships and social interactions.
"""

def handle_relationship_query(prompt: str) -> str:
    """
    Handles queries related to relationships, social interactions, and interpersonal dynamics.
    
    Args:
        prompt (str): The user's prompt/query related to relationships
        
    Returns:
        str: Response with relationship advice
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a more sophisticated relationship advice system
    
    if "تجاهل" in prompt or "يتجاهلني" in prompt:
        return "التعامل مع شخص يتجاهلك يمكن أن يكون مؤلماً. إليك بعض النصائح:\n\n1. تأكد من الموقف: هل هو تجاهل متعمد أم قد يكون الشخص مشغولاً أو يمر بظروف صعبة؟\n\n2. تواصل بوضوح: عبّر عن مشاعرك باستخدام عبارات \"أنا\" مثل \"أشعر بالحزن عندما...\" بدلاً من الاتهام.\n\n3. استمع بانفتاح: إذا شرح سبب سلوكه، استمع بدون دفاع أو مقاطعة.\n\n4. حدد احتياجاتك: وضّح ما تحتاجه من هذه العلاقة بشكل محدد.\n\n5. قيّم العلاقة: هل هذا نمط متكرر؟ فكر في قيمة هذه العلاقة في حياتك.\n\n6. اعتنِ بنفسك: ركز على أنشطة تعزز ثقتك بنفسك وعلاقاتك الأخرى الداعمة.\n\nتذكر أن سلوك الآخرين يعكس حالتهم أكثر مما يعكس قيمتك."

    elif "خلاف" in prompt or "نزاع" in prompt or "مشكلة" in prompt:
        return "لحل الخلافات والنزاعات في العلاقات بطريقة صحية:\n\n1. اختر الوقت والمكان المناسبين: تحدثا عندما تكونان هادئين، وليس في ذروة الغضب.\n\n2. ركز على المشكلة وليس الشخص: تجنب الانتقاد الشخصي واستخدم عبارات مثل \"أشعر بالإحباط عندما يحدث كذا\" بدلاً من \"أنت دائماً تفعل كذا\".\n\n3. استمع بفعالية: أنصت لفهم وجهة نظر الطرف الآخر، وليس فقط للرد.\n\n4. ابحث عن أرضية مشتركة: ركز على النقاط التي تتفقان عليها أولاً.\n\n5. اقترح حلولاً: فكرا معاً في خيارات متعددة ترضي الطرفين.\n\n6. كن مستعداً للتسوية: العلاقات الناجحة تتطلب مرونة من الجانبين.\n\n7. اطلب المساعدة عند الحاجة: لا تتردد في طلب وساطة أو استشارة من شخص محايد.\n\nتذكر أن الهدف ليس \"الفوز\" في النقاش، بل الوصول إلى حل يعزز العلاقة."

    elif "ثقة" in prompt or "خيانة" in prompt:
        return "بناء الثقة أو إعادة بنائها بعد خيانة الثقة يتطلب جهداً وصبراً:\n\n1. الصدق والشفافية: كن صادقاً في كل تعاملاتك، حتى في الأمور الصغيرة.\n\n2. الاتساق: كن متسقاً بين أقوالك وأفعالك، والتزم بوعودك.\n\n3. الاعتراف بالأخطاء: إذا أخطأت، اعترف بذلك واعتذر بصدق.\n\n4. احترام الحدود: تفهم واحترم حدود الطرف الآخر.\n\n5. التواصل المفتوح: شجع المناقشات الصريحة حول المخاوف والتوقعات.\n\n6. الصبر: إعادة بناء الثقة تستغرق وقتاً، فلا تتوقع نتائج فورية.\n\n7. المسؤولية: تحمل مسؤولية أفعالك وتأثيرها على الآخرين.\n\nتذكر أن الثقة تُبنى ببطء وتُهدم بسرعة، لذا فإن الحفاظ عليها يتطلب اهتماماً مستمراً."

    elif "تواصل" in prompt or "حوار" in prompt:
        return "لتحسين التواصل في العلاقات الشخصية:\n\n1. الاستماع الفعال: أنصت بانتباه كامل، دون مقاطعة أو تحضير للرد.\n\n2. التحقق من الفهم: لخص ما فهمته من كلام الآخر للتأكد من فهمك الصحيح.\n\n3. التعبير الواضح: عبر عن أفكارك ومشاعرك بوضوح ودون غموض.\n\n4. لاحظ لغة الجسد: انتبه للإشارات غير اللفظية (نبرة الصوت، تعابير الوجه، وضعية الجسم).\n\n5. تجنب الافتراضات: لا تفترض أنك تعرف ما يفكر به الآخر، بل اسأل للتوضيح.\n\n6. اختر التوقيت المناسب: ناقش المواضيع المهمة عندما يكون الطرفان مستعدين ذهنياً وعاطفياً.\n\n7. تجنب التعميم: استخدم عبارات محددة بدلاً من كلمات مثل \"دائماً\" أو \"أبداً\".\n\nالتواصل الجيد هو أساس العلاقات الصحية والمستدامة."

    elif "حدود" in prompt or "مساحة شخصية" in prompt:
        return "وضع الحدود الصحية في العلاقات أمر ضروري للحفاظ على صحتك النفسية والعلاقات المتوازنة:\n\n1. تعرف على احتياجاتك: حدد ما هو مهم لك وما يسبب لك الضيق.\n\n2. عبّر بوضوح: وضح حدودك بطريقة مباشرة ولطيفة، دون اعتذار مفرط.\n\n3. كن متسقاً: طبق حدودك باستمرار حتى يأخذها الآخرون على محمل الجد.\n\n4. توقع ردود الفعل: قد لا يتقبل البعض حدودك في البداية، كن مستعداً لذلك.\n\n5. احترم حدود الآخرين: كما تتوقع احترام حدودك، احترم حدود الآخرين أيضاً.\n\n6. كن مرناً: راجع حدودك من وقت لآخر، فقد تتغير مع تطور العلاقات والظروف.\n\nتذكر أن وضع الحدود ليس أنانية، بل هو جزء أساسي من العلاقات الصحية."

    elif "علاقة عاطفية" in prompt or "حب" in prompt or "زواج" in prompt:
        return "لبناء علاقة عاطفية صحية ومستدامة:\n\n1. التواصل المفتوح: شارك أفكارك ومشاعرك بصراحة، واستمع باهتمام لشريكك.\n\n2. الاحترام المتبادل: قدّر اختلافاتكما واحترم آراء وقرارات بعضكما البعض.\n\n3. الثقة والصدق: كن صادقاً وجديراً بالثقة في جميع جوانب العلاقة.\n\n4. الدعم المتبادل: كن داعماً لأهداف وطموحات شريكك، وشجعه على النمو.\n\n5. الاستقلالية: حافظ على هويتك واهتماماتك الشخصية، وشجع شريكك على فعل الشيء نفسه.\n\n6. حل الخلافات بشكل صحي: تعلم كيفية التعامل مع الخلافات بطريقة بناءة.\n\n7. الالتزام: اعمل باستمرار على تنمية العلاقة والحفاظ عليها.\n\nتذكر أن العلاقات الناجحة تتطلب جهداً مستمراً من الطرفين."

    elif "صداقة" in prompt or "أصدقاء" in prompt:
        return "لبناء صداقات حقيقية والحفاظ عليها:\n\n1. كن أصيلاً: كن على طبيعتك وصادقاً في تعاملاتك.\n\n2. أظهر اهتماماً حقيقياً: اسأل عن حياة أصدقائك واستمع باهتمام.\n\n3. كن موثوقاً به: احتفظ بالأسرار واحترم خصوصية أصدقائك.\n\n4. قدم الدعم: كن موجوداً في الأوقات الصعبة كما في الأوقات السعيدة.\n\n5. احترم الحدود: تفهم أن لكل شخص حياته الخاصة واحتياجاته للمساحة الشخصية.\n\n6. تقبل الاختلافات: لا تتوقع أن يتفق أصدقاؤك معك في كل شيء.\n\n7. حافظ على التواصل: خصص وقتاً للتواصل بانتظام، حتى لو كانت حياتك مزدحمة.\n\nالصداقات الحقيقية تتطلب وقتاً وجهداً، لكنها من أكثر العلاقات قيمة في الحياة."

    elif "عائلة" in prompt or "أهل" in prompt or "أسرة" in prompt:
        return "للتعامل مع العلاقات العائلية بشكل صحي:\n\n1. التواصل المحترم: حتى عند الاختلاف، حافظ على لغة محترمة وهادئة.\n\n2. وضع حدود صحية: من الممكن أن تحب عائلتك وتضع حدوداً في نفس الوقت.\n\n3. تقبل الاختلافات: تفهم أن لكل فرد شخصيته وآراءه الخاصة.\n\n4. البحث عن أرضية مشتركة: ركز على القيم والاهتمامات المشتركة.\n\n5. التسامح: تعلم أن تسامح وتتجاوز الأخطاء والخلافات القديمة.\n\n6. قضاء وقت نوعي: خصص وقتاً للتواصل الهادف والأنشطة المشتركة.\n\n7. احترام الأدوار المتغيرة: تفهم أن العلاقات العائلية تتطور مع الوقت، خاصة مع تقدم العمر.\n\nالعلاقات العائلية الصحية تبنى على التوازن بين الارتباط والاستقلالية."

    elif "زملاء" in prompt or "عمل" in prompt or "مهني" in prompt:
        return "لبناء علاقات مهنية إيجابية في بيئة العمل:\n\n1. الاحترافية: حافظ على سلوك مهني واحترم حدود العمل.\n\n2. التواصل الواضح: كن دقيقاً وموضوعياً في تواصلك المهني.\n\n3. الموثوقية: كن شخصاً يمكن الاعتماد عليه في إنجاز المهام والوفاء بالمواعيد.\n\n4. التعاون: كن مستعداً للعمل ضمن فريق ومساعدة زملائك عند الحاجة.\n\n5. حل النزاعات بشكل بناء: تعامل مع الخلافات المهنية بموضوعية وبدون شخصنة.\n\n6. الإيجابية: ساهم في خلق بيئة عمل إيجابية وداعمة.\n\n7. التوازن: حافظ على توازن صحي بين الصداقة والعلاقة المهنية مع زملائك.\n\nالعلاقات المهنية الجيدة تعزز الإنتاجية والرضا الوظيفي وتفتح فرصاً جديدة."

    elif "انفصال" in prompt or "انتهاء علاقة" in prompt:
        return "للتعامل مع انتهاء علاقة أو انفصال بطريقة صحية:\n\n1. اسمح لنفسك بالحزن: من الطبيعي الشعور بالألم والحزن، امنح نفسك الوقت لمعالجة هذه المشاعر.\n\n2. ابتعد مؤقتاً: خذ مسافة عاطفية وربما جسدية للتعافي، خاصة في البداية.\n\n3. تجنب لوم الذات المفرط: لا تقسُ على نفسك أو تغرق في الندم.\n\n4. ابحث عن الدعم: تحدث مع أصدقاء موثوقين أو مختص نفسي إذا لزم الأمر.\n\n5. تعلم من التجربة: فكر بموضوعية فيما يمكن تعلمه من هذه العلاقة لعلاقات مستقبلية أفضل.\n\n6. ركز على نفسك: استثمر في اهتماماتك وصحتك ونموك الشخصي.\n\n7. تقبل أن التعافي ليس خطياً: ستكون هناك أيام جيدة وأخرى صعبة، وهذا طبيعي.\n\nتذكر أن نهاية علاقة ليست نهاية العالم، بل فرصة للنمو والتعلم."

    else:
        return "العلاقات الإنسانية هي أساس حياتنا الاجتماعية والعاطفية. يمكنني تقديم نصائح حول مختلف جوانب العلاقات مثل: التعامل مع التجاهل، حل الخلافات، بناء الثقة، تحسين التواصل، وضع الحدود الصحية، العلاقات العاطفية، الصداقات، العلاقات العائلية، العلاقات المهنية، أو التعامل مع انتهاء العلاقات. ما الجانب الذي تود معرفة المزيد عنه لتحسين علاقاتك الشخصية أو المهنية؟"