from flask import Blueprint, jsonify, request
from emotional_memory import get_emotion_timeline

timeline_api = Blueprint("timeline_api", __name__)

@timeline_api.route("/api/emotion-timeline", methods=["GET"])
def timeline():
    session_id = request.args.get("session_id", "anon")
    history = get_emotion_timeline(session_id)
    return jsonify({
        "session_id": session_id,
        "timeline": history
    })