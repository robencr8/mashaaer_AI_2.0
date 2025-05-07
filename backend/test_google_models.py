"""
Test script for Google Vertex AI models integration.
This script demonstrates how to use the Google Vertex AI models in the Mashaaer project.

Usage:
    python test_google_models.py
"""

import os
from dotenv import load_dotenv
from google_model_client import generate_response

# Load environment variables from .env file
load_dotenv()

def test_gemini_model():
    """Test the Gemini model."""
    print("Testing Gemini model...")
    prompt = "مرحبا، كيف يمكنني مساعدتك اليوم؟"
    response = generate_response(prompt, model_type="vertex_gemini")
    print(f"Prompt: {prompt}")
    print(f"Response: {response}")
    print("-" * 50)

def test_text_bison_model():
    """Test the Text Bison model."""
    print("Testing Text Bison model...")
    prompt = "ما هي أهم المعالم السياحية في المملكة العربية السعودية؟"
    response = generate_response(prompt, model_type="text_bison")
    print(f"Prompt: {prompt}")
    print(f"Response: {response}")
    print("-" * 50)

def test_invalid_model():
    """Test an invalid model type."""
    print("Testing invalid model type...")
    prompt = "هذا اختبار لنموذج غير موجود."
    response = generate_response(prompt, model_type="invalid_model")
    print(f"Prompt: {prompt}")
    print(f"Response: {response}")
    print("-" * 50)

if __name__ == "__main__":
    # Check if the required environment variables are set
    required_vars = ["GOOGLE_PROJECT_ID", "GOOGLE_LOCATION", "GOOGLE_CREDENTIALS_PATH"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: The following environment variables are missing: {', '.join(missing_vars)}")
        print("Please set these variables in the .env file.")
        exit(1)
    
    # Run the tests
    test_gemini_model()
    test_text_bison_model()
    test_invalid_model()
    
    print("All tests completed.")