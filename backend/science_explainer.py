"""
Science Explainer Engine - Provides simplified explanations for scientific concepts.
"""

def handle_science_query(prompt: str) -> str:
    """
    Handles queries related to scientific concepts and provides simplified explanations.
    
    Args:
        prompt (str): The user's prompt/query related to science
        
    Returns:
        str: Response with simplified scientific explanation
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a science database or API
    
    if "ثقب أسود" in prompt or "الثقب الأسود" in prompt:
        return "الثقب الأسود هو منطقة في الفضاء ذات جاذبية قوية جداً لدرجة أن لا شيء يمكنه الإفلات منها، حتى الضوء. يتشكل الثقب الأسود عندما تنهار نجمة ضخمة على نفسها بعد نفاد وقودها النووي. تصبح المادة مضغوطة بشكل لا يمكن تصوره، مما يخلق منطقة ذات جاذبية هائلة. حافة الثقب الأسود تسمى 'أفق الحدث'، وهي النقطة التي لا عودة منها. العلماء يدرسون الثقوب السوداء من خلال تأثيرها على النجوم والغازات المحيطة بها."

    elif "نسبية" in prompt or "آينشتاين" in prompt:
        return "النظرية النسبية لألبرت آينشتاين تتكون من جزأين: النسبية الخاصة (1905) والنسبية العامة (1915). النسبية الخاصة تقول إن قوانين الفيزياء هي نفسها لجميع المراقبين في حركة ثابتة، وأن سرعة الضوء ثابتة دائماً. أحد نتائجها الشهيرة هي معادلة E=mc²، التي تبين أن الطاقة والكتلة وجهان لعملة واحدة. أما النسبية العامة فتفسر الجاذبية كانحناء في نسيج الزمكان (الزمان والمكان معاً) بسبب وجود الكتلة. هذه النظريات غيرت فهمنا للكون بشكل جذري."

    elif "كم" in prompt or "ميكانيكا الكم" in prompt:
        return "ميكانيكا الكم هي فرع من الفيزياء يصف سلوك المادة والطاقة على المستويات الذرية وما دون الذرية. على عكس الفيزياء الكلاسيكية، تقول ميكانيكا الكم إن بعض الخصائص الفيزيائية للجسيمات الصغيرة جداً لا يمكن قياسها بدقة في نفس الوقت (مبدأ عدم اليقين لهايزنبرغ)، وأن الجسيمات يمكن أن تتصرف كموجات والعكس صحيح (ازدواجية الموجة والجسيم). من أغرب مفاهيمها: التشابك الكمي، حيث يمكن لجسيمين متباعدين أن يؤثر أحدهما على الآخر فوراً بغض النظر عن المسافة بينهما."

    elif "دماغ" in prompt or "مخ" in prompt:
        return "الدماغ البشري هو أكثر الأعضاء تعقيداً في جسم الإنسان. يزن حوالي 1.4 كيلوغرام ويحتوي على حوالي 86 مليار خلية عصبية (نيورون) متصلة بتريليونات الوصلات العصبية. ينقسم الدماغ إلى نصفي كرة (أيمن وأيسر) وعدة مناطق رئيسية: القشرة المخية (مسؤولة عن التفكير والوعي)، المخيخ (ينسق الحركة)، جذع الدماغ (يتحكم في الوظائف الأساسية مثل التنفس)، والحصين (مهم للذاكرة). الدماغ يستهلك 20% من طاقة الجسم رغم أنه يشكل 2% فقط من وزن الجسم."

    elif "قلب" in prompt:
        return "القلب هو عضلة مجوفة بحجم قبضة اليد، تضخ الدم إلى جميع أنحاء الجسم. يتكون من أربع حجرات: أذينين (علويتين) وبطينين (سفليين). يضخ القلب البالغ حوالي 5 لترات من الدم كل دقيقة، أي حوالي 7200 لتر يومياً. ينبض القلب حوالي 100,000 مرة يومياً، أي أكثر من 2.5 مليار نبضة في عمر 70 عاماً. الجانب الأيسر من القلب يضخ الدم المؤكسج إلى الجسم، بينما يضخ الجانب الأيمن الدم إلى الرئتين لتجديد الأكسجين."

    elif "مناعة" in prompt:
        return "جهاز المناعة هو شبكة معقدة من الخلايا والأنسجة والأعضاء التي تحمي الجسم من العدوى والأمراض. يعمل من خلال التعرف على مسببات الأمراض (مثل البكتيريا والفيروسات) ومهاجمتها. يتكون من مناعة فطرية (استجابة سريعة وعامة) ومناعة مكتسبة (متخصصة وتتطور مع الوقت). الخلايا المناعية الرئيسية تشمل: خلايا الدم البيضاء، الخلايا البائية (تنتج الأجسام المضادة)، والخلايا التائية (تهاجم الخلايا المصابة). اللقاحات تعمل من خلال تدريب جهاز المناعة على التعرف على مسببات أمراض محددة دون التسبب في المرض."

    elif "فضاء" in prompt or "كون" in prompt:
        return "الفضاء أو الكون هو كل ما يوجد: المجرات، النجوم، الكواكب، وكل المادة والطاقة. نشأ الكون منذ حوالي 13.8 مليار سنة في حدث يسمى الانفجار العظيم. يتوسع الكون باستمرار، والمجرات تتباعد عن بعضها. مجرتنا، درب التبانة، تحتوي على حوالي 200 مليار نجم، والشمس هي واحدة منها. يقدر العلماء وجود تريليونات المجرات في الكون المرئي. معظم الكون يتكون من مادة مظلمة وطاقة مظلمة لا نستطيع رؤيتها مباشرة، بل نستدل عليها من تأثيرها الجاذبي."

    elif "نووي" in prompt or "ذرة" in prompt:
        return "الذرة هي اللبنة الأساسية للمادة، وتتكون من نواة مركزية (تحتوي على بروتونات ونيوترونات) تدور حولها إلكترونات. البروتونات موجبة الشحنة، النيوترونات متعادلة، والإلكترونات سالبة. رغم أن الذرة صغيرة جداً (قطرها حوالي 0.1 نانومتر)، إلا أن معظمها فراغ، حيث تشغل النواة جزءاً ضئيلاً من حجمها. الطاقة النووية تنتج من انشطار نوى ذرات ثقيلة مثل اليورانيوم (الانشطار النووي) أو اندماج نوى خفيفة مثل الهيدروجين (الاندماج النووي). الشمس تنتج طاقتها من خلال الاندماج النووي."

    elif "تطور" in prompt or "داروين" in prompt:
        return "نظرية التطور، التي وضع أسسها تشارلز داروين، تفسر كيف تتغير الكائنات الحية عبر الزمن. تقوم على مبدأ الانتقاء الطبيعي: الكائنات التي تمتلك صفات تساعدها على البقاء والتكاثر في بيئتها تنقل هذه الصفات إلى نسلها، بينما تختفي الصفات الأقل ملاءمة تدريجياً. التنوع الوراثي ينشأ من الطفرات العشوائية في الحمض النووي (DNA). عبر ملايين السنين، أدت هذه العملية إلى تنوع الحياة الهائل على الأرض، من بكتيريا بسيطة إلى كائنات معقدة. الأدلة على التطور تشمل السجل الأحفوري، التشابه الجيني بين الكائنات، والأعضاء الأثرية."

    elif "مناخ" in prompt or "احتباس حراري" in prompt:
        return "تغير المناخ هو تغير طويل المدى في أنماط الطقس العالمية أو الإقليمية. الاحتباس الحراري، وهو ارتفاع متوسط درجة حرارة الأرض، هو أحد مظاهر تغير المناخ. السبب الرئيسي هو زيادة غازات الدفيئة (مثل ثاني أكسيد الكربون والميثان) في الغلاف الجوي نتيجة الأنشطة البشرية مثل حرق الوقود الأحفوري وإزالة الغابات. تأثيرات تغير المناخ تشمل: ذوبان الجليد القطبي، ارتفاع مستوى سطح البحر، زيادة الظواهر الجوية المتطرفة (عواصف، فيضانات، جفاف)، وتغيرات في النظم البيئية. للحد من هذه التأثيرات، يحتاج العالم إلى تقليل انبعاثات غازات الدفيئة والتحول إلى مصادر طاقة متجددة."

    else:
        return "العلم هو دراسة منهجية للعالم الطبيعي من خلال الملاحظة والتجربة. يشمل مجالات متنوعة مثل الفيزياء (دراسة المادة والطاقة)، الكيمياء (دراسة المواد وتفاعلاتها)، الأحياء (دراسة الكائنات الحية)، علم الفلك (دراسة الكون)، وعلوم الأرض (دراسة كوكبنا). يمكنني تقديم شرح مبسط لمفاهيم علمية مختلفة مثل الثقوب السوداء، النظرية النسبية، ميكانيكا الكم، أو مواضيع طبية وبيئية. ما المفهوم العلمي الذي تود معرفة المزيد عنه؟"