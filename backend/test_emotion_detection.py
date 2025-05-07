"""
Test script for the enhanced emotion detection using Google Gemini AI.
This script demonstrates how to use the enhanced emotion detection in the Mashaaer project.

Usage:
    python test_emotion_detection.py
"""

import os
from dotenv import load_dotenv
from emotion_engine_ar import emotion_ar

# Load environment variables from .env file
load_dotenv()

def test_emotion_detection():
    """Test the enhanced emotion detection with various texts."""
    test_texts = [
        # Happy texts
        "أنا سعيد جدا اليوم، لقد نجحت في الامتحان!",
        "فرحان بلقائك، كم اشتقت إليك!",
        
        # Sad texts
        "أشعر بالحزن الشديد بسبب ما حدث",
        "أنا حزين جدا لفراق صديقي",
        
        # Angry texts
        "أنا غاضب جدا من تصرفاتك!",
        "هذا أمر مزعج للغاية، أشعر بالغضب",
        
        # Fearful texts
        "أنا خائف من المستقبل",
        "أشعر بالقلق والخوف من هذا الموقف",
        
        # Neutral texts
        "اليوم هو الخميس، الطقس معتدل",
        "سأذهب إلى المتجر لشراء بعض الأغراض"
    ]
    
    print("Testing enhanced emotion detection with Gemini AI...\n")
    
    for text in test_texts:
        emotion = emotion_ar(text)
        print(f"Text: {text}")
        print(f"Detected emotion: {emotion}")
        print("-" * 50)

if __name__ == "__main__":
    # Check if the required environment variables are set
    required_vars = ["GOOGLE_PROJECT_ID", "GOOGLE_LOCATION", "GOOGLE_CREDENTIALS_PATH"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: The following environment variables are missing: {', '.join(missing_vars)}")
        print("Please set these variables in the .env file.")
        exit(1)
    
    # Run the test
    test_emotion_detection()
    
    print("All tests completed.")