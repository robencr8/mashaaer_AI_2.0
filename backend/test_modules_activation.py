from fallback_manager import fallback_brain
from persona_controller import get_persona

def test_modules_activation():
    """
    Test the activation of all modules in the fallback_brain function.
    """
    # Test with a prompt that should generate a response with an emotion
    prompt = "أنا سعيد جدا اليوم"  # "I am very happy today"
    session_id = "test_session"
    
    # Call fallback_brain with the test prompt
    result = fallback_brain(prompt, session_id)
    
    # Print the result
    print("\n=== Test Results ===")
    print(f"Prompt: {prompt}")
    print(f"Response: {result['text']}")
    print(f"Detected emotion: {result['emotion']}")
    
    # Get the current persona after auto-switching
    current_persona = get_persona()
    print(f"Selected persona: {current_persona}")
    
    # Print the memory reaction
    print("\n=== Memory Reaction ===")
    memory_reaction = result.get("memory_reaction", {})
    print(f"Reaction type: {memory_reaction.get('reaction_type', 'N/A')}")
    print(f"Reaction message: {memory_reaction.get('message', 'N/A')}")
    print(f"Emotion trend: {memory_reaction.get('emotion_trend', 'N/A')}")
    
    # Call fallback_brain again with a different prompt to test memory reaction
    prompt2 = "أنا حزين اليوم"  # "I am sad today"
    result2 = fallback_brain(prompt2, session_id)
    
    # Print the result of the second call
    print("\n=== Test Results (Second Call) ===")
    print(f"Prompt: {prompt2}")
    print(f"Response: {result2['text']}")
    print(f"Detected emotion: {result2['emotion']}")
    
    # Get the current persona after auto-switching
    current_persona2 = get_persona()
    print(f"Selected persona: {current_persona2}")
    
    # Print the memory reaction
    print("\n=== Memory Reaction (Second Call) ===")
    memory_reaction2 = result2.get("memory_reaction", {})
    print(f"Reaction type: {memory_reaction2.get('reaction_type', 'N/A')}")
    print(f"Reaction message: {memory_reaction2.get('message', 'N/A')}")
    print(f"Emotion trend: {memory_reaction2.get('emotion_trend', 'N/A')}")
    
    # Return the results for further inspection if needed
    return result, result2

if __name__ == "__main__":
    test_modules_activation()