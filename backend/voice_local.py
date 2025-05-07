import pyttsx3

_engine = pyttsx3.init()
_engine.setProperty("rate", 145)

def speak_ar(text: str):
    try:
        _engine.say(text)
        _engine.runAndWait()
    except Exception as e:
        print(f"[LOCAL_VOICE_ERROR] {e}")