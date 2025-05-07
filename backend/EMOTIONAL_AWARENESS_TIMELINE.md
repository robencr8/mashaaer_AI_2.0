# Emotional Self-Awareness and Timeline System

This document explains the emotional self-awareness and timeline systems in the Mashaaer project.

## Overview

The Mashaaer project has been enhanced with two new components:

1. **Emotional Self-Awareness Engine**: A system that tracks and analyzes emotional patterns over time, generates self-aware responses based on emotional history, and provides insights about the user's emotional state.

2. **Emotional Timeline System**: A system that records emotional changes over time, provides visualization data for emotional trends, identifies significant emotional events, and integrates with the emotional self-awareness engine.

These components work together to create a more emotionally intelligent assistant that can understand and respond to the user's emotional state in a more nuanced and personalized way.

## Emotional Self-Awareness Engine

### Key Features

- **Emotional Pattern Analysis**: Analyzes emotional patterns over time to identify trends, triggers, and recurring patterns.
- **Self-Aware Response Generation**: Generates responses that acknowledge the user's emotional state and history.
- **Multilingual Support**: Works with both Arabic and English inputs and generates responses in the appropriate language.
- **Emotional Trigger Identification**: Identifies topics or contexts that consistently evoke specific emotions.
- **Configurable Behavior**: Allows customization of awareness threshold, analysis depth, response frequency, and language preference.

### Usage

```python
from emotional_self_awareness import EmotionalSelfAwareness

# Initialize the emotional self-awareness engine
awareness = EmotionalSelfAwareness()

# Analyze emotional patterns for a session
analysis = awareness.analyze_emotional_patterns("session_123")

# Generate a self-aware response
response = awareness.generate_self_aware_response("session_123", "ar")  # Arabic
# or
response = awareness.generate_self_aware_response("session_123", "en")  # English

# Update configuration
awareness.update_config({
    "awareness_threshold": 0.7,
    "analysis_depth": "deep",
    "response_frequency": 0.5,
    "language_preference": "auto"
})
```

### Analysis Results

The `analyze_emotional_patterns` method returns a dictionary with the following information:

- **trend**: The emotional trend (improving, deteriorating, fluctuating, stable_positive, stable_negative, stable_neutral, insufficient_data)
- **confidence**: Confidence level in the trend analysis (0.0-1.0)
- **triggers**: Topics that trigger specific emotions
- **patterns**: Detected emotional patterns
- **dominant_emotion**: The most frequent emotion in recent interactions
- **timeline_length**: Number of emotional events analyzed

## Emotional Timeline System

### Key Features

- **Timeline Data Retrieval**: Retrieves emotional timeline data for visualization.
- **Emotion Distribution Calculation**: Calculates the distribution of emotions over time.
- **Emotion Transition Tracking**: Tracks transitions between emotions.
- **Significant Event Identification**: Identifies significant emotional events.
- **Multiple Visualization Formats**: Provides data in different formats for visualization (JSON, chart, timeline).
- **Time Period Filtering**: Filters timeline data by different time periods (day, week, month, quarter).

### Usage

```python
from emotional_timeline import EmotionalTimeline

# Initialize the emotional timeline system
timeline = EmotionalTimeline()

# Get timeline data
timeline_data = timeline.get_timeline_data("session_123")

# Get emotion distribution
distribution = timeline.get_emotion_distribution("session_123")

# Get emotion transitions
transitions = timeline.get_emotion_transitions("session_123")

# Get visualization data in different formats
json_data = timeline.get_visualization_data("session_123", "json")
chart_data = timeline.get_visualization_data("session_123", "chart")
timeline_data = timeline.get_visualization_data("session_123", "timeline")

# Filter by time period
day_data = timeline.get_timeline_data("session_123", "day")
week_data = timeline.get_timeline_data("session_123", "week")
month_data = timeline.get_timeline_data("session_123", "month")
quarter_data = timeline.get_timeline_data("session_123", "quarter")

# Update configuration
timeline.update_config({
    "default_time_period": "week",
    "significant_event_threshold": 0.7,
    "visualization_resolution": "high",
    "include_text_samples": True
})
```

### Timeline Data

The `get_timeline_data` method returns a dictionary with the following information:

- **emotions**: List of emotion data points with timestamp, emotion, and color
- **valence**: List of valence data points with timestamp and valence value
- **significant_events**: List of significant emotional events
- **summary**: Summary of the timeline including dominant emotion, average valence, emotional stability, and trend

## Integration with Existing System

The emotional self-awareness and timeline systems integrate with the existing system through:

1. **Emotional Memory**: Both systems use the emotional memory module to access the emotion timeline.
2. **Emotion Engine**: Both systems use the emotion engine for standardizing emotions and translating between languages.
3. **Memory Store**: The systems can optionally use the memory store for accessing additional context.

## Visualization Examples

### Emotion Distribution (Pie Chart)

The emotion distribution can be visualized as a pie chart showing the percentage of each emotion:

```
Emotion distribution:
  happiness: 33.3%
  sadness: 16.7%
  anger: 16.7%
  fear: 16.7%
  neutral: 16.7%
```

### Emotional Valence (Line Chart)

The emotional valence can be visualized as a line chart showing the positivity/negativity of emotions over time:

```
Valence timeline:
  +1.0 |    *         *
       |   *           *
   0.0 |  *             *
       |     *     *
  -1.0 |      *****
       +----------------------
          Time →
```

### Emotion Transitions (Sankey Diagram)

The emotion transitions can be visualized as a Sankey diagram showing how emotions flow from one to another:

```
Emotion transitions:
  neutral → happiness: 1 times
  happiness → sadness: 1 times
  sadness → anger: 1 times
  anger → fear: 1 times
  fear → happiness: 1 times
  happiness → neutral: 1 times
```

## Testing

A test script is provided to verify the functionality of both systems:

```bash
python test_emotional_awareness.py
```

This script:
1. Sets up test data with various emotional patterns
2. Tests the emotional self-awareness engine
3. Tests the emotional timeline system
4. Tests different visualization formats
5. Tests time period filtering

## Future Improvements

Potential future improvements to the emotional self-awareness and timeline systems include:

1. **More Sophisticated Pattern Detection**: Implementing more advanced algorithms for detecting complex emotional patterns.
2. **Real-time Visualization**: Adding real-time visualization of emotional changes during conversations.
3. **Predictive Emotional Analysis**: Predicting future emotional states based on past patterns.
4. **Personalized Response Strategies**: Adapting response strategies based on what has been effective for a specific user.
5. **Integration with External Events**: Correlating emotional patterns with external events or calendar data.
6. **Emotional Health Insights**: Providing insights and suggestions for emotional well-being.