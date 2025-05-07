import json
import os
from datetime import datetime, timedelta
import time
import threading
import psutil
import logging
from collections import defaultdict, deque

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("data/system_metrics.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("system_metrics")

class SystemMetrics:
    """
    System Metrics for Mashaaer

    This class collects, analyzes, and reports various metrics about the system's
    performance, usage patterns, and health. It helps monitor the system's behavior
    and identify potential issues or areas for optimization.

    Features:
    - Performance monitoring (CPU, memory, response time)
    - Usage statistics (active users, requests per minute)
    - Module activation tracking
    - Error rate monitoring
    - System health assessment
    - Trend analysis over time
    """

    def __init__(self, collection_interval=60):
        """
        Initialize the system metrics collector

        Args:
            collection_interval (int): Interval in seconds for collecting metrics
        """
        self.collection_interval = collection_interval
        self.metrics_data = {
            'performance': {
                'cpu_usage': [],
                'memory_usage': [],
                'response_times': [],
                'average_response_time': 0
            },
            'usage': {
                'active_users': {},
                'requests_per_minute': [],
                'total_requests': 0,
                'requests_by_endpoint': defaultdict(int)
            },
            'modules': {
                'activations': defaultdict(int),
                'execution_times': defaultdict(list),
                'average_execution_times': {}
            },
            'errors': {
                'error_count': 0,
                'error_rate': 0,
                'errors_by_type': defaultdict(int),
                'errors_by_module': defaultdict(int)
            },
            'health': {
                'overall_health': 1.0,  # 0.0 to 1.0
                'component_health': {}
            },
            'last_collection': None,
            'last_updated': datetime.now().isoformat()
        }

        # Recent response times for calculating moving average
        self.recent_response_times = deque(maxlen=100)

        # Collection thread
        self.collection_thread = None
        self.stop_collection_flag = threading.Event()

        # Load existing metrics data
        self.load_metrics_data()

    def load_metrics_data(self):
        """Load metrics data from storage file"""
        metrics_path = 'data/system_metrics.json'
        try:
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                    # Convert defaultdict keys back from strings
                    self.metrics_data = data
                    self.metrics_data['usage']['requests_by_endpoint'] = defaultdict(int, data['usage']['requests_by_endpoint'])
                    self.metrics_data['modules']['activations'] = defaultdict(int, data['modules']['activations'])
                    self.metrics_data['modules']['execution_times'] = defaultdict(list, data['modules']['execution_times'])
                    self.metrics_data['errors']['errors_by_type'] = defaultdict(int, data['errors']['errors_by_type'])
                    self.metrics_data['errors']['errors_by_module'] = defaultdict(int, data['errors']['errors_by_module'])
        except Exception as e:
            logger.error(f"Error loading metrics data: {e}")
            # Keep default values if loading fails

    def save_metrics_data(self):
        """Save metrics data to storage file"""
        metrics_path = 'data/system_metrics.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(metrics_path), exist_ok=True)

            # Update last updated timestamp
            self.metrics_data['last_updated'] = datetime.now().isoformat()

            with open(metrics_path, 'w', encoding='utf-8') as f:
                json.dump(self.metrics_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving metrics data: {e}")

    def start_collection(self):
        """Start collecting metrics in a background thread"""
        if self.collection_thread and self.collection_thread.is_alive():
            logger.warning("Metrics collection already running")
            return False

        self.stop_collection_flag.clear()
        self.collection_thread = threading.Thread(target=self._collection_loop)
        self.collection_thread.daemon = True
        self.collection_thread.start()

        logger.info(f"Started metrics collection with interval {self.collection_interval}s")
        return True

    def stop_collection(self):
        """Stop collecting metrics"""
        if not self.collection_thread or not self.collection_thread.is_alive():
            logger.warning("Metrics collection not running")
            return False

        self.stop_collection_flag.set()
        self.collection_thread.join(timeout=5)

        logger.info("Stopped metrics collection")
        return True

    def _collection_loop(self):
        """Background loop for collecting metrics"""
        while not self.stop_collection_flag.is_set():
            try:
                self._collect_system_metrics()
                self._analyze_metrics()
                self.save_metrics_data()
            except Exception as e:
                logger.error(f"Error in metrics collection: {e}")

            # Sleep until next collection interval
            self.stop_collection_flag.wait(self.collection_interval)

    def _collect_system_metrics(self):
        """Collect current system metrics"""
        # Collect CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        self.metrics_data['performance']['cpu_usage'].append({
            'timestamp': datetime.now().isoformat(),
            'value': cpu_percent
        })

        # Limit the number of stored metrics
        if len(self.metrics_data['performance']['cpu_usage']) > 1440:  # 24 hours at 1-minute intervals
            self.metrics_data['performance']['cpu_usage'] = self.metrics_data['performance']['cpu_usage'][-1440:]

        # Collect memory usage
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        self.metrics_data['performance']['memory_usage'].append({
            'timestamp': datetime.now().isoformat(),
            'value': memory_percent
        })

        # Limit the number of stored metrics
        if len(self.metrics_data['performance']['memory_usage']) > 1440:
            self.metrics_data['performance']['memory_usage'] = self.metrics_data['performance']['memory_usage'][-1440:]

        # Update last collection timestamp
        self.metrics_data['last_collection'] = datetime.now().isoformat()

    def _analyze_metrics(self):
        """Analyze collected metrics to derive insights"""
        # Calculate average response time
        if self.recent_response_times:
            avg_response_time = sum(self.recent_response_times) / len(self.recent_response_times)
            self.metrics_data['performance']['average_response_time'] = avg_response_time

        # Calculate module average execution times
        for module, times in self.metrics_data['modules']['execution_times'].items():
            if times:
                self.metrics_data['modules']['average_execution_times'][module] = sum(times) / len(times)

        # Calculate error rate (errors per 100 requests)
        total_requests = self.metrics_data['usage']['total_requests']
        if total_requests > 0:
            error_rate = (self.metrics_data['errors']['error_count'] / total_requests) * 100
            self.metrics_data['errors']['error_rate'] = error_rate

        # Calculate system health
        self._calculate_system_health()

    def _calculate_system_health(self):
        """Calculate overall system health based on various metrics"""
        health_factors = {}

        # CPU health (lower is better)
        if self.metrics_data['performance']['cpu_usage']:
            recent_cpu = [entry['value'] for entry in self.metrics_data['performance']['cpu_usage'][-10:]]
            avg_cpu = sum(recent_cpu) / len(recent_cpu) if recent_cpu else 0
            cpu_health = max(0, 1 - (avg_cpu / 100))
            health_factors['cpu'] = cpu_health

        # Memory health (lower is better)
        if self.metrics_data['performance']['memory_usage']:
            recent_memory = [entry['value'] for entry in self.metrics_data['performance']['memory_usage'][-10:]]
            avg_memory = sum(recent_memory) / len(recent_memory) if recent_memory else 0
            memory_health = max(0, 1 - (avg_memory / 100))
            health_factors['memory'] = memory_health

        # Response time health (lower is better)
        if self.metrics_data['performance']['average_response_time'] > 0:
            # Consider response times over 1000ms as unhealthy
            response_health = max(0, 1 - (self.metrics_data['performance']['average_response_time'] / 1000))
            health_factors['response_time'] = response_health

        # Error rate health (lower is better)
        if self.metrics_data['errors']['error_rate'] > 0:
            # Consider error rates over 5% as unhealthy
            error_health = max(0, 1 - (self.metrics_data['errors']['error_rate'] / 5))
            health_factors['error_rate'] = error_health

        # Calculate overall health (weighted average)
        if health_factors:
            weights = {
                'cpu': 0.2,
                'memory': 0.2,
                'response_time': 0.3,
                'error_rate': 0.3
            }

            weighted_sum = 0
            total_weight = 0

            for factor, value in health_factors.items():
                weight = weights.get(factor, 0.1)
                weighted_sum += value * weight
                total_weight += weight

            overall_health = weighted_sum / total_weight if total_weight > 0 else 0.5
            self.metrics_data['health']['overall_health'] = overall_health
            self.metrics_data['health']['component_health'] = health_factors

    def record_request(self, endpoint, user_id=None, response_time=None):
        """
        Record a request to the system

        Args:
            endpoint (str): The API endpoint or function called
            user_id (str, optional): The user ID making the request
            response_time (float, optional): Response time in milliseconds
        """
        # Increment total requests
        self.metrics_data['usage']['total_requests'] += 1

        # Record request by endpoint
        self.metrics_data['usage']['requests_by_endpoint'][endpoint] += 1

        # Record active user
        if user_id:
            self.metrics_data['usage']['active_users'][user_id] = datetime.now().isoformat()

        # Record response time
        if response_time is not None:
            self.metrics_data['performance']['response_times'].append({
                'timestamp': datetime.now().isoformat(),
                'endpoint': endpoint,
                'value': response_time
            })

            # Add to recent response times for moving average
            self.recent_response_times.append(response_time)

            # Limit the number of stored response times
            if len(self.metrics_data['performance']['response_times']) > 1000:
                self.metrics_data['performance']['response_times'] = self.metrics_data['performance']['response_times'][-1000:]

        # Calculate requests per minute
        self._update_requests_per_minute()

    def _update_requests_per_minute(self):
        """Update the requests per minute metric"""
        now = datetime.now()
        current_minute = now.replace(second=0, microsecond=0).isoformat()

        # Find or create the current minute entry
        found = False
        for entry in self.metrics_data['usage']['requests_per_minute']:
            if entry['timestamp'] == current_minute:
                entry['count'] += 1
                found = True
                break

        if not found:
            self.metrics_data['usage']['requests_per_minute'].append({
                'timestamp': current_minute,
                'count': 1
            })

        # Limit to last 60 minutes
        if len(self.metrics_data['usage']['requests_per_minute']) > 60:
            self.metrics_data['usage']['requests_per_minute'] = self.metrics_data['usage']['requests_per_minute'][-60:]

    def record_module_activation(self, module_name, execution_time=None):
        """
        Record a module activation

        Args:
            module_name (str): The name of the module activated
            execution_time (float, optional): Execution time in milliseconds
        """
        # Increment activation count
        self.metrics_data['modules']['activations'][module_name] += 1

        # Record execution time if provided
        if execution_time is not None:
            self.metrics_data['modules']['execution_times'][module_name].append(execution_time)

            # Limit the number of stored execution times
            if len(self.metrics_data['modules']['execution_times'][module_name]) > 100:
                self.metrics_data['modules']['execution_times'][module_name] = self.metrics_data['modules']['execution_times'][module_name][-100:]

    def record_error(self, error_type, module_name=None, details=None):
        """
        Record an error

        Args:
            error_type (str): The type of error
            module_name (str, optional): The module where the error occurred
            details (str, optional): Additional error details
        """
        # Increment error count
        self.metrics_data['errors']['error_count'] += 1

        # Record error by type
        self.metrics_data['errors']['errors_by_type'][error_type] += 1

        # Record error by module if provided
        if module_name:
            self.metrics_data['errors']['errors_by_module'][module_name] += 1

        # Log the error
        error_message = f"Error: {error_type}"
        if module_name:
            error_message += f" in module {module_name}"
        if details:
            error_message += f" - {details}"

        logger.error(error_message)

    def get_performance_metrics(self, time_period='day'):
        """
        Get performance metrics for a specific time period

        Args:
            time_period (str): 'hour', 'day', or 'week'

        Returns:
            dict: Performance metrics
        """
        # Calculate the start time based on the time period
        now = datetime.now()
        if time_period == 'hour':
            start_time = now - timedelta(hours=1)
        elif time_period == 'day':
            start_time = now - timedelta(days=1)
        elif time_period == 'week':
            start_time = now - timedelta(weeks=1)
        else:
            start_time = now - timedelta(days=1)  # Default to day

        start_time_str = start_time.isoformat()

        # Filter metrics by time period
        cpu_metrics = [entry for entry in self.metrics_data['performance']['cpu_usage'] 
                      if entry['timestamp'] >= start_time_str]

        memory_metrics = [entry for entry in self.metrics_data['performance']['memory_usage'] 
                         if entry['timestamp'] >= start_time_str]

        response_metrics = [entry for entry in self.metrics_data['performance']['response_times'] 
                           if entry['timestamp'] >= start_time_str]

        # Calculate averages
        avg_cpu = sum(entry['value'] for entry in cpu_metrics) / len(cpu_metrics) if cpu_metrics else 0
        avg_memory = sum(entry['value'] for entry in memory_metrics) / len(memory_metrics) if memory_metrics else 0
        avg_response = sum(entry['value'] for entry in response_metrics) / len(response_metrics) if response_metrics else 0

        return {
            'time_period': time_period,
            'average_cpu': avg_cpu,
            'average_memory': avg_memory,
            'average_response_time': avg_response,
            'current_cpu': cpu_metrics[-1]['value'] if cpu_metrics else 0,
            'current_memory': memory_metrics[-1]['value'] if memory_metrics else 0,
            'cpu_trend': self._calculate_trend([entry['value'] for entry in cpu_metrics]) if cpu_metrics else 'stable',
            'memory_trend': self._calculate_trend([entry['value'] for entry in memory_metrics]) if memory_metrics else 'stable',
            'response_trend': self._calculate_trend([entry['value'] for entry in response_metrics]) if response_metrics else 'stable'
        }

    def _calculate_trend(self, values, window_size=10):
        """
        Calculate the trend of a series of values

        Args:
            values (list): List of numeric values
            window_size (int): Window size for trend calculation

        Returns:
            str: 'increasing', 'decreasing', or 'stable'
        """
        if len(values) < window_size:
            return 'stable'

        # Compare average of first half to average of second half
        half_size = len(values) // 2
        first_half = values[:half_size]
        second_half = values[half_size:]

        first_avg = sum(first_half) / len(first_half)
        second_avg = sum(second_half) / len(second_half)

        # Calculate percent change
        percent_change = ((second_avg - first_avg) / first_avg) * 100 if first_avg > 0 else 0

        if percent_change > 10:
            return 'increasing'
        elif percent_change < -10:
            return 'decreasing'
        else:
            return 'stable'

    def get_usage_metrics(self):
        """
        Get usage metrics

        Returns:
            dict: Usage metrics
        """
        # Calculate active users (active in the last 24 hours)
        now = datetime.now()
        day_ago = (now - timedelta(days=1)).isoformat()

        active_users = [user_id for user_id, last_active in self.metrics_data['usage']['active_users'].items()
                       if last_active >= day_ago]

        # Calculate current requests per minute
        current_rpm = 0
        if self.metrics_data['usage']['requests_per_minute']:
            current_minute = self.metrics_data['usage']['requests_per_minute'][-1]
            current_rpm = current_minute['count']

        # Calculate average requests per minute
        rpm_values = [entry['count'] for entry in self.metrics_data['usage']['requests_per_minute']]
        avg_rpm = sum(rpm_values) / len(rpm_values) if rpm_values else 0

        # Get top endpoints
        top_endpoints = sorted(
            self.metrics_data['usage']['requests_by_endpoint'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        return {
            'active_users_count': len(active_users),
            'total_requests': self.metrics_data['usage']['total_requests'],
            'current_requests_per_minute': current_rpm,
            'average_requests_per_minute': avg_rpm,
            'top_endpoints': [{'endpoint': endpoint, 'count': count} for endpoint, count in top_endpoints]
        }

    def get_module_metrics(self):
        """
        Get module activation metrics

        Returns:
            dict: Module metrics
        """
        # Get top activated modules
        top_modules = sorted(
            self.metrics_data['modules']['activations'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]

        # Get modules by average execution time
        modules_by_execution_time = sorted(
            self.metrics_data['modules']['average_execution_times'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]

        return {
            'top_activated_modules': [{'module': module, 'count': count} for module, count in top_modules],
            'modules_by_execution_time': [{'module': module, 'avg_time': time} for module, time in modules_by_execution_time]
        }

    def get_error_metrics(self):
        """
        Get error metrics

        Returns:
            dict: Error metrics
        """
        # Get top error types
        top_error_types = sorted(
            self.metrics_data['errors']['errors_by_type'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        # Get modules with most errors
        modules_with_errors = sorted(
            self.metrics_data['errors']['errors_by_module'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        return {
            'total_errors': self.metrics_data['errors']['error_count'],
            'error_rate': self.metrics_data['errors']['error_rate'],
            'top_error_types': [{'type': error_type, 'count': count} for error_type, count in top_error_types],
            'modules_with_errors': [{'module': module, 'count': count} for module, count in modules_with_errors]
        }

    def get_system_health(self):
        """
        Get system health metrics

        Returns:
            dict: System health metrics
        """
        health_status = "healthy"
        if self.metrics_data['health']['overall_health'] < 0.6:
            health_status = "degraded"
        elif self.metrics_data['health']['overall_health'] < 0.3:
            health_status = "critical"

        return {
            'overall_health': self.metrics_data['health']['overall_health'],
            'status': health_status,
            'component_health': self.metrics_data['health']['component_health']
        }

    def get_all_metrics(self):
        """
        Get all metrics

        Returns:
            dict: All metrics
        """
        return {
            'performance': self.get_performance_metrics(),
            'usage': self.get_usage_metrics(),
            'modules': self.get_module_metrics(),
            'errors': self.get_error_metrics(),
            'health': self.get_system_health(),
            'last_updated': self.metrics_data['last_updated']
        }

# Example usage
if __name__ == "__main__":
    metrics = SystemMetrics(collection_interval=60)

    # Start metrics collection
    metrics.start_collection()

    # Simulate some activity
    metrics.record_request("/api/chat", "user123", 150)
    metrics.record_module_activation("dream_simulator", 200)

    # Get metrics
    all_metrics = metrics.get_all_metrics()
    print(f"System health: {all_metrics['health']['status']} ({all_metrics['health']['overall_health']:.2f})")

    # Stop metrics collection
    metrics.stop_collection()
