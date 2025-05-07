def shape_response(text: str, emotion: str):
    if emotion == "حزن":
        return f"أنا معك... كلامك حسّسني بالضيق شوي: {text}"
    elif emotion == "فرح":
        return f"والله فرّحتني معك! 😄 {text}"
    elif emotion == "غضب":
        return f"حاسس بنار بكلامك... {text}"
    elif emotion == "خوف":
        return f"ولا يهمك، خليني أكون جنبك بهاللحظة: {text}"
    return text