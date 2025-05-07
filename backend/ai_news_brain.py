"""
AI News Brain - Central hub for collecting AI news and research from various global sources.
"""

from feedparser_compat import parse as feedparser_parse
import requests
from datetime import datetime
import json
import os

# In-memory storage for news items
news_memory = {
    "import_ai": [],
    "arxiv": [],
    "huggingface": [],
    "openai_blog": [],
    "google_ai": []
}

def fetch_import_ai():
    """Fetch the latest news from Import AI newsletter"""
    try:
        feed = feedparser_parse("https://importai.substack.com/feed")
        entries = []

        for entry in feed.entries[:5]:  # Get the 5 most recent entries
            entries.append({
                "title": entry.title,
                "summary": entry.summary,
                "link": entry.link,
                "published": entry.published,
                "source": "Import AI"
            })

        news_memory["import_ai"] = entries
        return entries
    except Exception as e:
        print(f"Error fetching Import AI news: {str(e)}")
        return []

def fetch_arxiv_ai():
    """Fetch the latest AI research papers from arXiv"""
    try:
        # Using arXiv API to fetch papers in the cs.AI category
        url = "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=5"
        response = requests.get(url)

        if response.status_code != 200:
            return []

        # Parse the XML response
        feed = feedparser_parse(response.text)
        entries = []

        for entry in feed.entries:
            entries.append({
                "title": entry.title,
                "summary": entry.summary,
                "link": entry.link,
                "published": entry.published,
                "authors": [author.name for author in entry.authors],
                "source": "arXiv"
            })

        news_memory["arxiv"] = entries
        return entries
    except Exception as e:
        print(f"Error fetching arXiv papers: {str(e)}")
        return []

def fetch_openai_blog():
    """Fetch the latest posts from OpenAI blog"""
    try:
        feed = feedparser_parse("https://openai.com/blog/rss.xml")
        entries = []

        for entry in feed.entries[:5]:
            entries.append({
                "title": entry.title,
                "summary": entry.summary,
                "link": entry.link,
                "published": entry.published,
                "source": "OpenAI Blog"
            })

        news_memory["openai_blog"] = entries
        return entries
    except Exception as e:
        print(f"Error fetching OpenAI blog: {str(e)}")
        return []

def update_news_memory():
    """Update the internal memory with the latest news from all sources"""
    fetch_import_ai()
    fetch_arxiv_ai()
    fetch_openai_blog()

    # Save to a file for persistence
    try:
        with open("ai_news_cache.json", "w") as f:
            json.dump(news_memory, f)
    except Exception as e:
        print(f"Error saving news cache: {str(e)}")

    return news_memory

def get_all_news():
    """Get all news items from memory"""
    global news_memory

    # If memory is empty, try to load from cache file
    if not any(news_memory.values()):
        try:
            if os.path.exists("ai_news_cache.json"):
                with open("ai_news_cache.json", "r") as f:
                    news_memory = json.load(f)
        except Exception:
            # If loading fails, update the memory
            update_news_memory()

    # Flatten all news sources into a single list
    all_news = []
    for source_news in news_memory.values():
        all_news.extend(source_news)

    # Sort by published date (newest first)
    all_news.sort(key=lambda x: x.get("published", ""), reverse=True)

    return all_news

def get_news_by_source(source):
    """Get news items from a specific source"""
    if source in news_memory:
        return news_memory[source]
    return []

# Initialize by loading from cache or fetching new data
def initialize():
    """Initialize the news brain by loading cached data or fetching new data"""
    global news_memory

    try:
        if os.path.exists("ai_news_cache.json"):
            with open("ai_news_cache.json", "r") as f:
                news_memory = json.load(f)
        else:
            update_news_memory()
    except Exception as e:
        print(f"Error initializing AI News Brain: {str(e)}")
        update_news_memory()
