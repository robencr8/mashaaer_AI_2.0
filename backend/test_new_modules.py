import sys
import os
import time

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the new modules
from memory_indexer import MemoryIndexer
from system_metrics import SystemMetrics

def test_memory_indexer():
    """Test the memory indexer module"""
    print("Testing MemoryIndexer...")
    
    # Create a memory indexer
    indexer = MemoryIndexer()
    
    # Get index statistics
    stats = indexer.get_index_stats()
    print(f"Memory index stats: {stats}")
    
    print("MemoryIndexer test completed successfully!")

def test_system_metrics():
    """Test the system metrics module"""
    print("Testing SystemMetrics...")
    
    # Create a system metrics collector
    metrics = SystemMetrics(collection_interval=5)  # Short interval for testing
    
    # Record some test data
    metrics.record_request("/api/test", "test_user", 100)
    metrics.record_module_activation("test_module", 50)
    metrics.record_error("test_error", "test_module", "Test error details")
    
    # Get metrics
    all_metrics = metrics.get_all_metrics()
    print(f"System health: {all_metrics['health']['status']} ({all_metrics['health']['overall_health']:.2f})")
    print(f"Total requests: {all_metrics['usage']['total_requests']}")
    print(f"Total errors: {all_metrics['errors']['total_errors']}")
    
    # Test metrics collection (briefly)
    print("Starting metrics collection for 2 seconds...")
    metrics.start_collection()
    time.sleep(2)
    metrics.stop_collection()
    print("Metrics collection stopped")
    
    print("SystemMetrics test completed successfully!")

if __name__ == "__main__":
    print("Testing new modules...")
    
    # Test memory indexer
    test_memory_indexer()
    
    # Test system metrics
    test_system_metrics()
    
    print("All tests completed successfully!")