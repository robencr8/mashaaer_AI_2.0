from flask import Blueprint, jsonify
from feedparser_compat import parse as feedparser_parse

ai_news = Blueprint('ai_news', __name__)

@ai_news.route('/api/import-ai-summary', methods=['GET'])
def get_import_ai_summary():
    try:
        feed = feedparser_parse("https://importai.substack.com/feed")
        latest = feed.entries[0]
        return jsonify({
            "success": True,
            "title": latest.title,
            "summary": latest.summary,
            "link": latest.link
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
