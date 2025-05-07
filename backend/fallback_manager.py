from local_model_manager import generate_local_response
from emotion_engine import detect_emotion, get_emotion_in_language
from response_shaper import shape_response
from voice_local import speak_ar
from emotional_memory import log_emotion
from training_logger import log_training_pair
from persona_autoswitcher import auto_switch_persona
from memory_reactor import react_to_memory
from knowledge_dispatcher import smart_response
from config import *

def fallback_brain(prompt: str, session_id: str = "anon", context: str = "default") -> dict:
    # Try to respond using knowledge modules first
    knowledge_reply = smart_response(prompt)

    if knowledge_reply:
        # Apply emotion engine if enabled
        emo = "حياد"  # Neutral emotion as default
        shaped = knowledge_reply  # Use knowledge reply if shaping is disabled

        if ENABLE_EMOTION_ENGINE:
            # Detect emotion using the multilingual system
            standardized_emotion, detected_lang = detect_emotion(knowledge_reply)
            # Convert to Arabic emotion name for compatibility with existing code
            emo = get_emotion_in_language(standardized_emotion, 'ar')

        # Auto-switch persona if enabled
        if ENABLE_PERSONA_AUTOSWITCH:
            auto_switch_persona(emo, user_input=prompt)

        # Shape response if enabled
        if ENABLE_RESPONSE_SHAPER:
            shaped = shape_response(knowledge_reply, emo)

        # Always log emotion and training pair (these are core functions)
        log_emotion(session_id, emo, knowledge_reply)
        log_training_pair(prompt, shaped, emo)

        # React to memory if enabled
        memory_reaction = None
        if ENABLE_MEMORY_REACTOR:
            memory_reaction = react_to_memory(session_id, emo)

        # Speak output if enabled
        if ENABLE_VOICE_OUTPUT:
            speak_ar(shaped)

        return {
            "text": shaped,
            "emotion": emo,
            "engine": "knowledge",
            "mode": "semantic",
            "model": "knowledge_module",
            "memory_reaction": memory_reaction
        }

    # Fall back to local model if knowledge modules couldn't handle the query
    result = generate_local_response(prompt, context=context)
    raw = result["response"]
    model_used = result["model_used"]

    # Default values in case modules are disabled
    emo = "حياد"  # Neutral emotion as default
    shaped = raw  # Use raw response if shaping is disabled
    memory_reaction = None

    # Apply emotion engine if enabled
    if ENABLE_EMOTION_ENGINE:
        # Detect emotion using the multilingual system
        standardized_emotion, detected_lang = detect_emotion(raw)
        # Convert to Arabic emotion name for compatibility with existing code
        emo = get_emotion_in_language(standardized_emotion, 'ar')

    # Auto-switch persona if enabled
    if ENABLE_PERSONA_AUTOSWITCH:
        auto_switch_persona(emo, user_input=prompt)

    # Shape response if enabled
    if ENABLE_RESPONSE_SHAPER:
        shaped = shape_response(raw, emo)

    # Always log emotion and training pair (these are core functions)
    log_emotion(session_id, emo, raw)
    log_training_pair(prompt, shaped, emo)

    # React to memory if enabled
    if ENABLE_MEMORY_REACTOR:
        memory_reaction = react_to_memory(session_id, emo)

    # Speak output if enabled
    if ENABLE_VOICE_OUTPUT:
        speak_ar(shaped)

    return {
        "text": shaped,
        "emotion": emo,
        "engine": "local",
        "mode": "fallback",
        "model": model_used,
        "memory_reaction": memory_reaction
    }
