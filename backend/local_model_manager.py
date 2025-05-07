import sys
from persona_controller import apply_persona, _current_persona

# Flag to track if transformers is available
TRANSFORMERS_AVAILABLE = False

try:
    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM
    TRANSFORMERS_AVAILABLE = True

    # قائمة العقول المتوفرة 🧠
    MODELS = {
        "aragpt2": "aubmindlab/aragpt2-base",
        "noor": "arbml/noor-7b-v1",
        "jais": "instructlab/jais-13b",
        "falcon": "tiiuae/falcon-7b-instruct"
    }

    # تحميل العقول 🔁
    _loaded_models = {}

    def load_model(name):
        if name in _loaded_models:
            return _loaded_models[name]
        print(f"🧠 Loading model: {name}")
        tokenizer = AutoTokenizer.from_pretrained(MODELS[name])
        model = AutoModelForCausalLM.from_pretrained(MODELS[name])
        _loaded_models[name] = (tokenizer, model)
        return tokenizer, model

    # اختيار العقل المناسب بناءً على نوع الطلب
    def choose_model(context="default"):
        if context in ["فرح", "حزن", "غضب", "خوف"]:
            return "aragpt2"
        elif "معلومة" in context or "تاريخ" in context or "تعريف":
            return "noor"
        elif "سؤال حديث" in context or "تقني":
            return "jais"
        elif "نقاش طويل" in context or "تفسير":
            return "falcon"
        return "aragpt2"

except ImportError as e:
    print(f"Warning: Transformers package not available: {e}")
    print(f"Local model functionality will be disabled.")
    print(f"Python version: {sys.version}")

    # Define empty functions for compatibility
    def load_model(name):
        return None, None

    def choose_model(context="default"):
        return "unavailable"

# الرد الذكي المحلي 🚀
def generate_local_response(prompt, context="default", max_tokens=150):
    prompt_with_style = apply_persona(prompt)

    if not TRANSFORMERS_AVAILABLE:
        # Return a fallback response when transformers is not available
        return {
            "response": f"عذراً، النماذج المحلية غير متوفرة حالياً. يرجى استخدام Python 3.10 لتشغيل النماذج المحلية.\n\nPrompt: {prompt_with_style}",
            "model_used": "fallback",
            "persona": _current_persona
        }

    # Normal flow when transformers is available
    model_key = choose_model(context)
    tokenizer, model = load_model(model_key)

    tokens = tokenizer(prompt_with_style, return_tensors="pt")
    output = model.generate(**tokens, max_new_tokens=max_tokens, pad_token_id=tokenizer.eos_token_id)
    decoded = tokenizer.decode(output[0], skip_special_tokens=True)

    return {
        "response": decoded,
        "model_used": model_key,
        "persona": _current_persona
    }
