import React, { useState, useEffect } from 'react';
import EmotionTimelineVisualizer from '../emotion/EmotionTimelineVisualizer.jsx';
import axios from 'axios';
import './AdvancedEmotionTimeline.css';

/**
 * AdvancedEmotionTimeline Component
 * 
 * A premium version of the emotion timeline with advanced features
 * like detailed analysis, pattern recognition, and interactive visualizations.
 */
const AdvancedEmotionTimeline = () => {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('standard'); // standard, detailed, patterns

  // Fetch emotion timeline data
  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/emotion-timeline');
      
      // Process and enhance the data with advanced analytics
      const enhancedData = enhanceTimelineData(response.data.timeline);
      
      setTimelineData({
        entries: response.data.timeline,
        stats: enhancedData.stats,
        patterns: enhancedData.patterns
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching emotion timeline:', err);
      setError('Failed to load emotion timeline data. Please try again later.');
      setLoading(false);
    }
  };

  // Enhance timeline data with advanced analytics
  const enhanceTimelineData = (timeline) => {
    if (!timeline || timeline.length === 0) {
      return { stats: {}, patterns: [] };
    }

    // Count emotions
    const emotionCounts = {};
    timeline.forEach(entry => {
      if (!emotionCounts[entry.emotion]) {
        emotionCounts[entry.emotion] = 0;
      }
      emotionCounts[entry.emotion]++;
    });

    // Find dominant emotion
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    // Calculate average intensity
    const totalIntensity = timeline.reduce((sum, entry) => sum + (entry.intensity || 0.5), 0);
    const averageIntensity = totalIntensity / timeline.length;

    // Identify patterns
    const patterns = identifyPatterns(timeline);

    return {
      stats: {
        emotionCounts,
        mostFrequent: dominantEmotion,
        averageIntensity,
        totalEntries: timeline.length
      },
      patterns
    };
  };

  // Identify patterns in the timeline data
  const identifyPatterns = (timeline) => {
    // This would be more sophisticated in a real implementation
    const patterns = [];
    
    // Group by day
    const entriesByDay = {};
    timeline.forEach(entry => {
      const date = new Date(entry.timestamp);
      const day = date.toLocaleDateString('ar-SA', { weekday: 'long' });
      
      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }
      
      entriesByDay[day].push(entry);
    });
    
    // Find dominant emotion for each day
    Object.keys(entriesByDay).forEach(day => {
      const dayEntries = entriesByDay[day];
      const emotionCounts = {};
      
      dayEntries.forEach(entry => {
        if (!emotionCounts[entry.emotion]) {
          emotionCounts[entry.emotion] = 0;
        }
        emotionCounts[entry.emotion]++;
      });
      
      const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
        emotionCounts[a] > emotionCounts[b] ? a : b
      );
      
      patterns.push({
        day,
        dominantEmotion,
        count: dayEntries.length
      });
    });
    
    return patterns;
  };

  // Handle analysis mode change
  const handleModeChange = (mode) => {
    setAnalysisMode(mode);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="advanced-timeline">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل بيانات المشاعر...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="advanced-timeline">
        <div className="error-container">
          <h3>خطأ</h3>
          <p>{error}</p>
          <button onClick={fetchTimelineData}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-timeline">
      <div className="timeline-controls">
        <h2>تحليل المشاعر المتقدم</h2>
        <div className="mode-selector">
          <button 
            className={analysisMode === 'standard' ? 'active' : ''}
            onClick={() => handleModeChange('standard')}
          >
            قياسي
          </button>
          <button 
            className={analysisMode === 'detailed' ? 'active' : ''}
            onClick={() => handleModeChange('detailed')}
          >
            تفصيلي
          </button>
          <button 
            className={analysisMode === 'patterns' ? 'active' : ''}
            onClick={() => handleModeChange('patterns')}
          >
            أنماط
          </button>
        </div>
      </div>
      
      {/* Standard mode shows the regular timeline visualizer */}
      {analysisMode === 'standard' && (
        <EmotionTimelineVisualizer timelineData={timelineData} />
      )}
      
      {/* Detailed mode shows additional statistics */}
      {analysisMode === 'detailed' && (
        <div className="detailed-analysis">
          <EmotionTimelineVisualizer timelineData={timelineData} />
          
          <div className="detailed-stats">
            <h3>إحصائيات تفصيلية</h3>
            <div className="stats-grid">
              {timelineData && timelineData.stats && Object.keys(timelineData.stats.emotionCounts).map(emotion => (
                <div className="stat-card" key={emotion}>
                  <h4>{getEmotionName(emotion)}</h4>
                  <div className="stat-value">{timelineData.stats.emotionCounts[emotion]}</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill"
                      style={{ 
                        width: `${(timelineData.stats.emotionCounts[emotion] / timelineData.stats.totalEntries) * 100}%`,
                        backgroundColor: getEmotionColor(emotion)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Patterns mode shows identified patterns */}
      {analysisMode === 'patterns' && (
        <div className="patterns-analysis">
          <EmotionTimelineVisualizer timelineData={timelineData} />
          
          <div className="patterns-container">
            <h3>أنماط المشاعر</h3>
            <div className="patterns-grid">
              {timelineData && timelineData.patterns && timelineData.patterns.map((pattern, index) => (
                <div className="pattern-card" key={index}>
                  <h4>{pattern.day}</h4>
                  <div className="pattern-emotion" style={{ color: getEmotionColor(pattern.dominantEmotion) }}>
                    {getEmotionName(pattern.dominantEmotion)}
                  </div>
                  <div className="pattern-count">{pattern.count} مشاعر</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get emotion name in Arabic
const getEmotionName = (emotion) => {
  const names = {
    happy: 'سعيد',
    sad: 'حزين',
    angry: 'غاضب',
    surprised: 'متفاجئ',
    neutral: 'محايد',
    anxious: 'قلق',
    confident: 'واثق'
  };
  
  return names[emotion] || emotion;
};

// Helper function to get emotion color
const getEmotionColor = (emotion) => {
  const colors = {
    happy: '#50fa7b',
    sad: '#6272a4',
    angry: '#ff5555',
    surprised: '#ffb86c',
    neutral: '#9370db',
    anxious: '#bd93f9',
    confident: '#f1fa8c'
  };
  
  return colors[emotion] || '#9370db';
};

export default AdvancedEmotionTimeline;