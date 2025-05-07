# Google Vertex AI Integration for Mashaaer

This document explains how to use the Google Vertex AI integration in the Mashaaer project.

## Overview

The Mashaaer project now supports Google Vertex AI models, specifically:
- Gemini 1.5 Pro
- Text Bison

These models are integrated into the runtime_bridge.py file and are tried before falling back to other models.

## Setup

1. Make sure you have the following environment variables set in your `.env` file:
   ```
   GOOGLE_PROJECT_ID=gleaming-scene-459009-p1
   GOOGLE_LOCATION=us-central1
   GOOGLE_CREDENTIALS_PATH=./keys/gemini-key.json
   ```

2. Ensure the `gemini-key.json` file is present in the `backend/keys` directory.

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

### Direct Usage

You can use the Google AI models directly in your code:

```python
from google_model_client import generate_response

# Use Gemini model
response = generate_response("Your prompt here", model_type="vertex_gemini")

# Use Text Bison model
response = generate_response("Your prompt here", model_type="text_bison")
```

### Through Runtime Bridge

The models are already integrated into the runtime_bridge.py file. When you call `generate_runtime_response`, it will try the following models in order:

1. Google Vertex AI: Gemini
2. Google Vertex AI: Text Bison
3. OpenAI (if implemented)
4. Mistral (if implemented)
5. Local model (fallback)

```python
from runtime_bridge import generate_runtime_response

response = generate_runtime_response("Your prompt here")
```

## Testing

You can test the Google AI models using the provided test script:

```
python test_google_models.py
```

This script will test both Gemini and Text Bison models with sample prompts.

## Troubleshooting

If you encounter issues:

1. Check that the environment variables are set correctly
2. Verify that the `gemini-key.json` file is in the correct location and has the right permissions
3. Make sure you have installed all the required dependencies
4. Check the error messages for specific issues

## Dependencies

The following packages are required for the Google AI integration:
- google-cloud-aiplatform
- vertexai
- google-generativeai

These are included in the requirements.txt file.