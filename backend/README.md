# Flask Backend with Memory Store

This is a Flask backend implementation with a memory storage system for the Mashaaer Enhanced Project. The memory store provides functionality for storing and retrieving episodic and semantic memories.

## Features

- **Episodic Memory**: Stores specific user interactions and experiences
- **Semantic Memory**: Stores general knowledge and facts about the user
- **Memory Retrieval**: Provides methods to retrieve relevant memories
- **Memory Consolidation**: Periodically consolidates memories for better recall
- **Persistence**: Memories are stored in JSON files for persistence
- **Advanced Memory Indexing**: Provides efficient search and retrieval based on keywords, categories, time periods, and emotional context
- **System Metrics**: Collects and analyzes system performance, health, and usage statistics

## Setup

1. Install the required dependencies:

> **Important**: Due to issues with the `tokenizers` package requiring Rust compiler, please use the provided installation script instead of direct pip install:

**Windows (PowerShell):**
```powershell
.\fix-tokenizers-install.ps1
```

**Windows (Command Prompt):**
```cmd
fix-tokenizers-install.bat
```

If you still want to install manually, you can use:
```bash
pip install -r requirements.txt
```
But note that this may fail if you don't have Rust compiler installed or are using Python 3.13+.

2. Run the Flask application:

```bash
python app.py
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Episodic Memory

- **POST /api/memory/episodic**: Store an episodic memory
  - Request body: `{ "input": "user message", "response": "system response", "emotion": "happy", "context": {} }`
  - Response: `{ "success": true, "memory_id": "timestamp" }`

- **GET /api/memory/episodic**: Retrieve episodic memories
  - Query parameters: `text`, `emotion`, `limit`
  - Response: Array of matching episodic memories

### Semantic Memory

- **POST /api/memory/semantic/:category**: Store a semantic memory
  - Request body: `{ "key": "name", "value": "John" }`
  - Response: `{ "success": true }`

- **GET /api/memory/semantic/:category**: Retrieve semantic memories
  - Query parameters: `key` (optional)
  - Response: Semantic memory object or category object

### User Summary

- **GET /api/memory/user/summary**: Get a summary of the user
  - Response: User summary object with personal info, preferences, and emotional trends

### Memory Consolidation

- **POST /api/memory/consolidate**: Manually trigger memory consolidation
  - Response: `{ "success": true, "message": "Memory consolidation complete" }`

### Memory Indexing

- **GET /api/memory/search**: Search for memories using advanced indexing
  - Query parameters: `query`, `category`, `emotion`, `time_period`, `limit`
  - Response: Array of matching memories

- **GET /api/memory/related/:memory_id**: Get memories related to a specific memory
  - Response: Array of related memories

### System Metrics

- **GET /api/metrics**: Get system metrics
  - Response: System metrics object with performance, usage, modules, errors, and health data

- **POST /api/metrics/record**: Record a system event (request, module activation, error)
  - Request body: `{ "type": "request|module|error", "data": {} }`
  - Response: `{ "success": true }`

## Integration with Frontend

To integrate with the frontend, update the API calls in the frontend code to use these endpoints instead of the client-side memory implementation.

Example:

```javascript
// Instead of
window.mashaaerComponents.enhancedMemory.storeEpisodicMemory({
  input: prompt,
  response: response,
  emotion: detectedEmotion
});

// Use
fetch('/api/memory/episodic', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: prompt,
    response: response,
    emotion: detectedEmotion
  })
});
```

## Configuration

### Memory Store Configuration

The memory store can be configured by modifying the `config` parameter in the `MemoryStore` constructor:

```python
memory_store = MemoryStore({
    'storage_path': 'custom/path/to/memory_store.json',
    'max_episodic_memories': 200,
    'consolidation_interval': 12 * 60 * 60  # 12 hours in seconds
})
```

### Memory Indexer Configuration

The memory indexer can be configured when initializing the `MemoryIndexer` class:

```python
memory_indexer = MemoryIndexer(memory_store)
# Rebuild the index to ensure all memories are indexed
indexed_count = memory_indexer.rebuild_index()
```

### System Metrics Configuration

The system metrics collector can be configured with a custom collection interval:

```python
# Initialize with a 60-second collection interval
metrics = SystemMetrics(collection_interval=60)

# Start collecting metrics in a background thread
metrics.start_collection()

# Record system events
metrics.record_request("/api/chat", "user123", 150)  # endpoint, user_id, response_time
metrics.record_module_activation("dream_simulator", 200)  # module_name, execution_time
metrics.record_error("connection_error", "api_service", "Failed to connect to external API")
```
