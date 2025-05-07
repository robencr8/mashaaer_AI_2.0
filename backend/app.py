from flask import Flask, request, jsonify, render_template, send_from_directory, session
from flask_cors import CORS
from memory_store import MemoryStore
from memory_indexer import MemoryIndexer
from system_metrics import SystemMetrics
from ai_news_routes import ai_news
from ai_news_brain import initialize as initialize_ai_news
from contextual_ai_news_engine import generate_news_response
from routes.emotion_timeline import timeline_api
from routes.subscription_routes import subscription_bp
from routes.auth_routes import auth_bp
from runtime_bridge import generate_runtime_response
from user_subscription import get_user_subscription_status
from functools import wraps
import time
import atexit
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///mashaaer.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure session
app.secret_key = os.getenv('SESSION_SECRET', 'مشاعر_سر_الجلسة')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours

# PayPal configuration
app.config['PAYPAL_CLIENT_ID'] = os.getenv('PAYPAL_CLIENT_ID', '')
app.config['PAYPAL_CLIENT_SECRET'] = os.getenv('PAYPAL_CLIENT_SECRET', '')

# Configure CORS
if os.getenv('DEBUG', 'false').lower() == 'true':
    # In development, allow all origins
    CORS(app)
else:
    # In production, restrict origins
    allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
    CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Inject subscription context for templates
@app.context_processor
def inject_subscription_context():
    user_id = session.get("user_id")
    plan_status = get_user_subscription_status(user_id)  # Free / Premium
    return {
        "subscription_status": plan_status,
        "paypal_client_id": app.config['PAYPAL_CLIENT_ID']
    }

# Decorator to require premium subscription
def require_premium_subscription(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id or get_user_subscription_status(user_id) != "Premium":
            return jsonify({"error": "Subscription required"}), 403
        return f(*args, **kwargs)
    return decorated_function

# Root route to serve the React app
@app.route('/', methods=['GET'])
def index():
    """Root route that serves the React application"""
    return render_template('index.html')

# Launch route (alternative entry point for the React app)
@app.route('/launch', methods=['GET'])
def launch():
    """Launch route that serves the React application"""
    return render_template('launch.html')

# Route to serve static/index.html directly
@app.route('/index', methods=['GET'])
def index_html():
    """Route to serve the static index.html file"""
    return send_from_directory('static', 'index.html')

# API status route
@app.route('/api/status', methods=['GET'])
def api_status():
    """API status route that returns a welcome message"""
    return jsonify({
        'status': 'online',
        'message': 'Mashaaer Enhanced API is running',
        'api_endpoints': {
            'metrics': '/api/metrics',
            'memory': '/api/memory/search',
            'ai_news': '/api/ai-news'
        }
    })

# Initialize the memory store
memory_store = MemoryStore()

# Initialize the memory indexer
memory_indexer = MemoryIndexer(memory_store)
memory_indexer.rebuild_index()

# Initialize the system metrics collector
metrics = SystemMetrics(collection_interval=60)
metrics.start_collection()

# Register shutdown handler to stop metrics collection when the application exits
def shutdown_handler():
    print("Shutting down metrics collection...")
    metrics.stop_collection()
    print("Metrics collection stopped.")

atexit.register(shutdown_handler)

# Register blueprints
app.register_blueprint(ai_news)
app.register_blueprint(timeline_api)
app.register_blueprint(subscription_bp)
app.register_blueprint(auth_bp)

# Initialize AI news
initialize_ai_news()

@app.route('/api/memory/episodic', methods=['POST'])
def store_episodic_memory():
    """Store an episodic memory"""
    data = request.json
    if not data or 'input' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    memory_id = memory_store.store_episodic_memory(data)
    return jsonify({'success': True, 'memory_id': memory_id})

@app.route('/api/memory/episodic', methods=['GET'])
def retrieve_episodic_memories():
    """Retrieve episodic memories based on query parameters"""
    text = request.args.get('text')
    emotion = request.args.get('emotion')
    limit = request.args.get('limit', 5, type=int)

    query = {
        'text': text,
        'emotion': emotion,
        'limit': limit
    }

    memories = memory_store.retrieve_episodic_memories(query)
    return jsonify(memories)

@app.route('/api/memory/semantic/<category>', methods=['POST'])
def store_semantic_memory(category):
    """Store a semantic memory"""
    data = request.json
    if not data or 'key' not in data or 'value' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    memory_store.store_semantic_memory(category, data['key'], data['value'])
    return jsonify({'success': True})

@app.route('/api/memory/semantic/<category>', methods=['GET'])
def retrieve_semantic_memory(category):
    """Retrieve semantic memory by category and optional key"""
    key = request.args.get('key')
    memory = memory_store.retrieve_semantic_memory(category, key)

    if memory is None:
        return jsonify({'error': 'Memory not found'}), 404

    return jsonify(memory)

@app.route('/api/memory/user/summary', methods=['GET'])
def get_user_summary():
    """Get a summary of the user based on semantic memories"""
    summary = memory_store.get_user_summary()
    return jsonify(summary)

@app.route('/api/memory/consolidate', methods=['POST'])
def consolidate_memories():
    """Manually trigger memory consolidation"""
    memory_store.consolidate_memories()
    return jsonify({'success': True, 'message': 'Memory consolidation complete'})

@app.route('/api/ai-news', methods=['GET'])
@require_premium_subscription
def get_ai_news_response():
    """Get AI news response based on user emotion and context (Premium feature)"""
    emotion = request.args.get("emotion", "neutral")
    context = request.args.get("context", "curious")
    result = generate_news_response(emotion, context)
    return jsonify(result)

@app.route('/api/generate-response', methods=['POST'])
def get_runtime_response():
    """Generate a response using the runtime bridge"""
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    prompt = data['prompt']
    session = data.get('session')

    result = generate_runtime_response(prompt, session)
    return jsonify(result)

# Memory Indexing routes
@app.route('/api/memory/search', methods=['GET'])
@require_premium_subscription
def search_memories():
    """Search for memories using advanced indexing (Premium feature)"""
    query = request.args.get('query', '')
    category = request.args.get('category')
    emotion = request.args.get('emotion')
    time_period = request.args.get('time_period')
    limit = request.args.get('limit', 10, type=int)

    # Build filters
    filters = {}
    if category:
        filters['category'] = category
    if emotion:
        filters['emotion'] = emotion
    if time_period:
        filters['time_period'] = time_period

    # Record the request in metrics
    start_time = time.time()

    # Search for memories
    memories = memory_indexer.search_memories(query, filters, limit)

    # Record response time
    response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    metrics.record_request('/api/memory/search', request.remote_addr, response_time)

    return jsonify(memories)

@app.route('/api/memory/related/<memory_id>', methods=['GET'])
@require_premium_subscription
def get_related_memories(memory_id):
    """Get memories related to a specific memory (Premium feature)"""
    limit = request.args.get('limit', 5, type=int)

    # Record the request in metrics
    start_time = time.time()

    # Get related memories
    related_memories = memory_indexer.get_related_memories(memory_id, limit)

    # Record response time
    response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    metrics.record_request('/api/memory/related', request.remote_addr, response_time)

    return jsonify(related_memories)

# System Metrics routes
@app.route('/api/metrics', methods=['GET'])
@require_premium_subscription
def get_metrics():
    """Get system metrics (Premium feature)"""
    # Record the request in metrics
    start_time = time.time()

    # Get all metrics
    all_metrics = metrics.get_all_metrics()

    # Record response time
    response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    metrics.record_request('/api/metrics', request.remote_addr, response_time)

    return jsonify(all_metrics)

@app.route('/api/metrics/record', methods=['POST'])
def record_metric():
    """Record a system event (request, module activation, error)"""
    data = request.json
    if not data or 'type' not in data or 'data' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    event_type = data['type']
    event_data = data['data']

    if event_type == 'request':
        # Record a request
        endpoint = event_data.get('endpoint')
        user_id = event_data.get('user_id')
        response_time = event_data.get('response_time')

        if endpoint:
            metrics.record_request(endpoint, user_id, response_time)

    elif event_type == 'module':
        # Record a module activation
        module_name = event_data.get('module_name')
        execution_time = event_data.get('execution_time')

        if module_name:
            metrics.record_module_activation(module_name, execution_time)

    elif event_type == 'error':
        # Record an error
        error_type = event_data.get('error_type')
        module_name = event_data.get('module_name')
        details = event_data.get('details')

        if error_type:
            metrics.record_error(error_type, module_name, details)

    else:
        return jsonify({'error': 'Invalid event type'}), 400

    return jsonify({'success': True})

if __name__ == '__main__':
    debug_mode = os.getenv('DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
