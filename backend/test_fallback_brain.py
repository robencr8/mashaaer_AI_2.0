from fallback_manager import fallback_brain
from persona_controller import get_persona
from local_model_manager import choose_model

def test_fallback_brain_basic():
    """
    Test the fallback_brain function to ensure it correctly switches personas
    based on the detected emotion.
    """
    # Test with a prompt that should generate a response with an emotion
    prompt = "أنا سعيد جدا اليوم"  # "I am very happy today"

    # Call fallback_brain with the test prompt
    result = fallback_brain(prompt)

    # Print the result
    print("\n=== Basic Test ===")
    print("Prompt:", prompt)
    print("Response:", result["text"])
    print("Detected emotion:", result["emotion"])
    print("Model used:", result["model"])

    # Get the current persona after auto-switching
    current_persona = get_persona()
    print("Selected persona:", current_persona)

    # Return the result for further inspection if needed
    return result

def test_fallback_brain_with_context():
    """
    Test the fallback_brain function with different contexts to ensure
    it selects the appropriate model for each context.
    """
    test_cases = [
        {
            "prompt": "ما هو تاريخ الأندلس؟",  # "What is the history of Andalusia?"
            "context": "معلومة",  # Information context
            "expected_model": "noor"
        },
        {
            "prompt": "كيف يعمل الذكاء الاصطناعي؟",  # "How does AI work?"
            "context": "سؤال حديث",  # Modern question context
            "expected_model": "jais"
        },
        {
            "prompt": "اشرح لي نظرية النسبية",  # "Explain the theory of relativity"
            "context": "نقاش طويل",  # Long discussion context
            "expected_model": "falcon"
        },
        {
            "prompt": "أشعر بالحزن اليوم",  # "I feel sad today"
            "context": "حزن",  # Sadness emotion context
            "expected_model": "aragpt2"
        }
    ]

    print("\n=== Context-Based Tests ===")

    for i, test_case in enumerate(test_cases):
        prompt = test_case["prompt"]
        context = test_case["context"]
        expected_model = test_case["expected_model"]

        # Call fallback_brain with the test prompt and context
        result = fallback_brain(prompt, context=context)

        # Print the result
        print(f"\nTest {i+1}:")
        print("Prompt:", prompt)
        print("Context:", context)
        print("Expected model:", expected_model)
        print("Actual model used:", result["model"])
        print("Response:", result["text"])
        print("Detected emotion:", result["emotion"])

        # Verify that the correct model was selected
        if result["model"] == expected_model:
            print("✅ Model selection test passed")
        else:
            print("❌ Model selection test failed")

def test_model_selection():
    """
    Test the choose_model function directly to ensure it selects
    the appropriate model for each context.
    """
    test_cases = [
        {"context": "فرح", "expected": "aragpt2"},
        {"context": "حزن", "expected": "aragpt2"},
        {"context": "غضب", "expected": "aragpt2"},
        {"context": "خوف", "expected": "aragpt2"},
        {"context": "معلومة", "expected": "noor"},
        {"context": "تاريخ", "expected": "noor"},
        {"context": "تعريف", "expected": "noor"},
        {"context": "سؤال حديث", "expected": "jais"},
        {"context": "تقني", "expected": "jais"},
        {"context": "نقاش طويل", "expected": "falcon"},
        {"context": "تفسير", "expected": "falcon"},
        {"context": "default", "expected": "aragpt2"}
    ]

    print("\n=== Model Selection Tests ===")

    for i, test_case in enumerate(test_cases):
        context = test_case["context"]
        expected = test_case["expected"]

        # Call choose_model with the test context
        model = choose_model(context)

        # Print the result
        print(f"Context: {context}, Expected: {expected}, Actual: {model}", 
              "✅" if model == expected else "❌")

if __name__ == "__main__":
    test_fallback_brain_basic()
    test_fallback_brain_with_context()
    test_model_selection()
