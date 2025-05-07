from datetime import datetime

_memory = {}

def log_emotion(session_id: str, emotion: str, text: str):
    if session_id not in _memory:
        _memory[session_id] = []
    _memory[session_id].append({
        "emotion": emotion,
        "text": text,
        "timestamp": datetime.now().isoformat()
    })

def get_last_emotion(session_id: str):
    if session_id in _memory and _memory[session_id]:
        return _memory[session_id][-1]["emotion"]
    return "حياد"

def get_emotion_timeline(session_id: str):
    return _memory.get(session_id, [])