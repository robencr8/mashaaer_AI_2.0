# تعريف أنماط الشخصية
PERSONAS = {
    "حنون": {
        "prefix": "كأنك أم دافئة تتكلم مع طفلها:",
        "tone": "ناعم",
        "style": "هادئ، متفهم، مطمئن"
    },
    "مستشار": {
        "prefix": "كأنك مدرب حياة يعطي نصائح حقيقية:",
        "tone": "جدي",
        "style": "منطقي، واضح، مباشر"
    },
    "صديق مهضوم": {
        "prefix": "كأنك صديق مضحك بيرد بأسلوب عفوي:",
        "tone": "خفيف دم",
        "style": "ساخر، محبب، شبابي"
    },
    "شاعر": {
        "prefix": "كأنك شاعر يحكي شعور الإنسان بلغة فنية:",
        "tone": "عاطفي",
        "style": "شاعري، ناعم، خيالي"
    },
    "محايد": {
        "prefix": "",
        "tone": "محايد",
        "style": "بسيط، مباشر"
    }
}

# تحديد الشخصية الحالية
_current_persona = "محايد"

def set_persona(name: str):
    global _current_persona
    if name in PERSONAS:
        _current_persona = name
        return True
    return False

def get_persona():
    return PERSONAS.get(_current_persona, PERSONAS["محايد"])

def apply_persona(prompt: str):
    persona = get_persona()
    return f"{persona['prefix']}\n{prompt}"