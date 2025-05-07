import os, json
from datetime import datetime

LOG_DIR = "fine_tune_corpus"
os.makedirs(LOG_DIR, exist_ok=True)

def log_training_pair(prompt: str, response: str, emotion: str = "حياد"):
    data = {
        "timestamp": datetime.now().isoformat(),
        "prompt": prompt,
        "response": response,
        "emotion": emotion
    }
    fname = f"{LOG_DIR}/sample_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(fname, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)