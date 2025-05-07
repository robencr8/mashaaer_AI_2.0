import json
import requests
import time

# Test configuration
BASE_URL = 'http://localhost:5000/api'

def test_episodic_memory():
    """Test storing and retrieving episodic memories"""
    print("\n=== Testing Episodic Memory ===")
    
    # Store a memory
    memory = {
        "input": "Hello, my name is John",
        "response": "Nice to meet you, John!",
        "emotion": "happy",
        "context": {"session_id": "test-123"}
    }
    
    response = requests.post(f"{BASE_URL}/memory/episodic", json=memory)
    print(f"Store memory response: {response.status_code}")
    print(response.json())
    
    # Retrieve memories
    response = requests.get(f"{BASE_URL}/memory/episodic")
    print(f"Retrieve all memories response: {response.status_code}")
    print(f"Found {len(response.json())} memories")
    
    # Retrieve with text filter
    response = requests.get(f"{BASE_URL}/memory/episodic?text=John")
    print(f"Retrieve filtered memories response: {response.status_code}")
    print(f"Found {len(response.json())} memories with 'John'")
    
    # Retrieve with emotion filter
    response = requests.get(f"{BASE_URL}/memory/episodic?emotion=happy")
    print(f"Retrieve by emotion response: {response.status_code}")
    print(f"Found {len(response.json())} 'happy' memories")
    
    return True

def test_semantic_memory():
    """Test storing and retrieving semantic memories"""
    print("\n=== Testing Semantic Memory ===")
    
    # Store semantic memories
    categories = {
        "personal_info": [
            {"key": "name", "value": "John Doe"},
            {"key": "location", "value": "New York"}
        ],
        "preferences": [
            {"key": "likes", "value": "chocolate"},
            {"key": "dislikes", "value": "vegetables"}
        ]
    }
    
    for category, items in categories.items():
        for item in items:
            response = requests.post(f"{BASE_URL}/memory/semantic/{category}", json=item)
            print(f"Store {category}.{item['key']} response: {response.status_code}")
    
    # Retrieve semantic memories by category
    for category in categories:
        response = requests.get(f"{BASE_URL}/memory/semantic/{category}")
        print(f"Retrieve {category} response: {response.status_code}")
        print(f"{category} data: {json.dumps(response.json(), indent=2)}")
    
    # Retrieve specific semantic memory
    response = requests.get(f"{BASE_URL}/memory/semantic/personal_info?key=name")
    print(f"Retrieve specific memory response: {response.status_code}")
    print(f"Name data: {json.dumps(response.json(), indent=2)}")
    
    return True

def test_user_summary():
    """Test getting user summary"""
    print("\n=== Testing User Summary ===")
    
    response = requests.get(f"{BASE_URL}/memory/user/summary")
    print(f"User summary response: {response.status_code}")
    print(f"Summary: {json.dumps(response.json(), indent=2)}")
    
    return True

def test_consolidation():
    """Test memory consolidation"""
    print("\n=== Testing Memory Consolidation ===")
    
    response = requests.post(f"{BASE_URL}/memory/consolidate")
    print(f"Consolidation response: {response.status_code}")
    print(response.json())
    
    return True

def run_all_tests():
    """Run all tests"""
    print("Starting memory store tests...")
    
    try:
        test_episodic_memory()
        test_semantic_memory()
        test_user_summary()
        test_consolidation()
        
        print("\n=== All tests completed successfully ===")
    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect to the Flask server.")
        print("Make sure the Flask application is running on http://localhost:5000")
    except Exception as e:
        print(f"\nERROR: Test failed with exception: {e}")

if __name__ == "__main__":
    run_all_tests()