import React, { useState, useEffect } from 'react';
import './MashaaerArchive.css';
import emotionalLoreSystem from '../utils/emotional-lore-system.js';

/**
 * Mashaaer Archive Component
 * 
 * A comprehensive view of the user's emotional life, including:
 * - Top recurring emotions
 * - Trigger patterns
 * - Recovery techniques that work best
 * - Favorite tone styles
 * - Conversation sentiment graph over time
 * - Suggested next self-growth steps
 */
const MashaaerArchive = ({ isOpen, onClose }) => {
  // State for archive data
  const [emotionalData, setEmotionalData] = useState({
    topEmotions: [],
    triggerPatterns: [],
    recoveryTechniques: [],
    tonePreferences: [],
    sentimentHistory: [],
    growthSuggestions: []
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for time range filter
  const [timeRange, setTimeRange] = useState('month');
  
  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      loadArchiveData();
    }
  }, [isOpen, timeRange]);
  
  /**
   * Load archive data from emotional lore system
   */
  const loadArchiveData = () => {
    // In a real implementation, this would load data from the emotional lore system
    // For now, we'll use mock data
    
    // Try to get real data if available
    let realData = {};
    
    try {
      if (emotionalLoreSystem) {
        const emotionalThemes = emotionalLoreSystem.getEmotionalThemes();
        const memories = emotionalLoreSystem.getMemoriesByType('emotional_disclosure');
        
        // Use real data if available
        if (emotionalThemes && Object.keys(emotionalThemes).length > 0) {
          realData.topEmotions = processTopEmotions(emotionalThemes);
        }
        
        if (memories && memories.length > 0) {
          realData.triggerPatterns = extractTriggerPatterns(memories);
        }
      }
    } catch (error) {
      console.warn('Error loading real emotional data:', error);
    }
    
    // Merge real data with mock data
    setEmotionalData({
      topEmotions: realData.topEmotions || getMockTopEmotions(),
      triggerPatterns: realData.triggerPatterns || getMockTriggerPatterns(),
      recoveryTechniques: getMockRecoveryTechniques(),
      tonePreferences: getMockTonePreferences(),
      sentimentHistory: getMockSentimentHistory(),
      growthSuggestions: getMockGrowthSuggestions()
    });
  };
  
  /**
   * Process top emotions from emotional themes
   */
  const processTopEmotions = (emotionalThemes) => {
    // Extract emotions and their counts
    const emotions = Object.entries(emotionalThemes)
      .filter(([key, value]) => !key.includes('_keywords') && typeof value === 'number')
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return emotions;
  };
  
  /**
   * Extract trigger patterns from memories
   */
  const extractTriggerPatterns = (memories) => {
    // In a real implementation, this would analyze memories to find trigger patterns
    // For now, return a simplified version
    return [
      { trigger: 'Work stress', frequency: 8, associatedEmotions: ['anxiety', 'frustration'] },
      { trigger: 'Family conversations', frequency: 6, associatedEmotions: ['joy', 'occasional stress'] },
      { trigger: 'Social media', frequency: 5, associatedEmotions: ['envy', 'inspiration'] }
    ];
  };
  
  /**
   * Get mock top emotions data
   */
  const getMockTopEmotions = () => {
    return [
      { emotion: 'joy', count: 28 },
      { emotion: 'anxiety', count: 23 },
      { emotion: 'calm', count: 19 },
      { emotion: 'frustration', count: 15 },
      { emotion: 'hope', count: 12 }
    ];
  };
  
  /**
   * Get mock trigger patterns data
   */
  const getMockTriggerPatterns = () => {
    return [
      { trigger: 'Work deadlines', frequency: 12, associatedEmotions: ['anxiety', 'stress'] },
      { trigger: 'Family gatherings', frequency: 8, associatedEmotions: ['joy', 'occasional stress'] },
      { trigger: 'Morning routine', frequency: 7, associatedEmotions: ['calm', 'focus'] },
      { trigger: 'Social media', frequency: 6, associatedEmotions: ['comparison', 'distraction'] },
      { trigger: 'Evening relaxation', frequency: 5, associatedEmotions: ['relief', 'calm'] }
    ];
  };
  
  /**
   * Get mock recovery techniques data
   */
  const getMockRecoveryTechniques = () => {
    return [
      { technique: 'Deep breathing', effectiveness: 85, usageCount: 14 },
      { technique: 'Mindful walking', effectiveness: 78, usageCount: 9 },
      { technique: 'Journaling', effectiveness: 72, usageCount: 7 },
      { technique: 'Talking with friends', effectiveness: 68, usageCount: 5 },
      { technique: 'Meditation', effectiveness: 65, usageCount: 4 }
    ];
  };
  
  /**
   * Get mock tone preferences data
   */
  const getMockTonePreferences = () => {
    return [
      { tone: 'Gentle', preference: 32 },
      { tone: 'Encouraging', preference: 28 },
      { tone: 'Direct', preference: 18 },
      { tone: 'Humorous', preference: 15 },
      { tone: 'Poetic', preference: 7 }
    ];
  };
  
  /**
   * Get mock sentiment history data
   */
  const getMockSentimentHistory = () => {
    // Generate dates for the past month
    const dates = [];
    const sentiments = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate a sentiment value between -1 and 1
      // With a slight upward trend and some randomness
      const baseValue = -0.2 + (i / 30) * 0.5;
      const randomFactor = Math.random() * 0.4 - 0.2;
      sentiments.push(Math.max(-1, Math.min(1, baseValue + randomFactor)));
    }
    
    return { dates, sentiments };
  };
  
  /**
   * Get mock growth suggestions data
   */
  const getMockGrowthSuggestions = () => {
    return [
      {
        area: 'Stress Management',
        suggestion: 'Try incorporating a 5-minute breathing exercise before work meetings',
        relevance: 'Based on anxiety patterns around work deadlines'
      },
      {
        area: 'Emotional Awareness',
        suggestion: 'Practice naming your emotions with more specificity',
        relevance: 'Will help distinguish between different types of anxiety'
      },
      {
        area: 'Social Connection',
        suggestion: 'Schedule regular check-ins with supportive friends',
        relevance: 'You report feeling better after social connection'
      },
      {
        area: 'Joy Cultivation',
        suggestion: 'Document small moments of joy throughout your day',
        relevance: 'To strengthen your natural appreciation for positive moments'
      }
    ];
  };
  
  /**
   * Handle tab change
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  /**
   * Handle time range change
   */
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  // If the archive is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="mashaaer-archive-overlay">
      <div className="mashaaer-archive-container">
        <header className="archive-header">
          <h1>Mashaaer Archive</h1>
          <p>Your Emotional Knowledge Base</p>
          <button className="close-button" onClick={onClose}>×</button>
        </header>
        
        <div className="archive-time-filter">
          <span>Time Range: </span>
          <select value={timeRange} onChange={(e) => handleTimeRangeChange(e.target.value)}>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <nav className="archive-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'emotions' ? 'active' : ''} 
            onClick={() => handleTabChange('emotions')}
          >
            Emotions
          </button>
          <button 
            className={activeTab === 'patterns' ? 'active' : ''} 
            onClick={() => handleTabChange('patterns')}
          >
            Patterns
          </button>
          <button 
            className={activeTab === 'techniques' ? 'active' : ''} 
            onClick={() => handleTabChange('techniques')}
          >
            Techniques
          </button>
          <button 
            className={activeTab === 'growth' ? 'active' : ''} 
            onClick={() => handleTabChange('growth')}
          >
            Growth
          </button>
        </nav>
        
        <div className="archive-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="archive-overview">
              <div className="overview-section sentiment-graph">
                <h2>Your Emotional Journey</h2>
                <div className="chart-container">
                  <div className="placeholder-chart">
                    <p>Sentiment History Chart</p>
                    <p className="chart-description">
                      This chart shows your emotional well-being over time, with values ranging from very negative (-1) to very positive (1).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Top Emotion</h3>
                  <div className="card-content">
                    <div className="emotion-icon">
                      {emotionalData.topEmotions[0]?.emotion || 'Joy'}
                    </div>
                    <p>{emotionalData.topEmotions[0]?.count || 0} occurrences</p>
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Top Trigger</h3>
                  <div className="card-content">
                    <div className="trigger-icon">
                      {emotionalData.triggerPatterns[0]?.trigger || 'Work deadlines'}
                    </div>
                    <p>{emotionalData.triggerPatterns[0]?.frequency || 0} occurrences</p>
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Best Technique</h3>
                  <div className="card-content">
                    <div className="technique-icon">
                      {emotionalData.recoveryTechniques[0]?.technique || 'Deep breathing'}
                    </div>
                    <p>{emotionalData.recoveryTechniques[0]?.effectiveness || 0}% effective</p>
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Preferred Tone</h3>
                  <div className="card-content">
                    <div className="tone-icon">
                      {emotionalData.tonePreferences[0]?.tone || 'Gentle'}
                    </div>
                    <p>{emotionalData.tonePreferences[0]?.preference || 0} preference score</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Emotions Tab */}
          {activeTab === 'emotions' && (
            <div className="archive-emotions">
              <h2>Your Emotional Landscape</h2>
              
              <div className="emotions-charts">
                <div className="chart-container">
                  <h3>Top Recurring Emotions</h3>
                  <div className="placeholder-chart">
                    <p>Bar Chart of Top Emotions</p>
                    <ul className="emotion-list">
                      {emotionalData.topEmotions.map((emotion, index) => (
                        <li key={index}>
                          {emotion.emotion}: {emotion.count} occurrences
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="emotions-details">
                <h3>Emotional Insights</h3>
                <ul className="insights-list">
                  <li>
                    <span className="insight-title">Joy appears most often in the mornings</span>
                    <span className="insight-description">Your morning routines seem to set a positive tone for the day</span>
                  </li>
                  <li>
                    <span className="insight-title">Anxiety tends to peak mid-week</span>
                    <span className="insight-description">Wednesday and Thursday show higher stress patterns</span>
                  </li>
                  <li>
                    <span className="insight-title">Calm is your dominant evening emotion</span>
                    <span className="insight-description">Your wind-down routines are effective</span>
                  </li>
                  <li>
                    <span className="insight-title">Your emotional vocabulary is expanding</span>
                    <span className="insight-description">You've used 18 different emotion words in the past month</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Patterns Tab */}
          {activeTab === 'patterns' && (
            <div className="archive-patterns">
              <h2>Your Emotional Patterns</h2>
              
              <div className="patterns-section">
                <h3>Trigger Patterns</h3>
                <div className="patterns-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Trigger</th>
                        <th>Frequency</th>
                        <th>Associated Emotions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emotionalData.triggerPatterns.map((pattern, index) => (
                        <tr key={index}>
                          <td>{pattern.trigger}</td>
                          <td>{pattern.frequency} times</td>
                          <td>{pattern.associatedEmotions.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="patterns-section">
                <h3>Emotional Cycles</h3>
                <p className="patterns-insight">
                  Your emotional patterns tend to follow a weekly cycle, with energy and positivity 
                  peaking on Mondays and Fridays, while mid-week shows more focus and occasional stress.
                </p>
                <p className="patterns-insight">
                  You tend to experience deeper emotional reflection on Sunday evenings, 
                  which can sometimes lead to anticipatory anxiety for the week ahead.
                </p>
              </div>
            </div>
          )}
          
          {/* Techniques Tab */}
          {activeTab === 'techniques' && (
            <div className="archive-techniques">
              <h2>Your Recovery Techniques</h2>
              
              <div className="techniques-details">
                <h3>Technique Effectiveness</h3>
                <div className="techniques-cards">
                  {emotionalData.recoveryTechniques.map((technique, index) => (
                    <div className="technique-card" key={index}>
                      <h4>{technique.technique}</h4>
                      <div className="effectiveness-meter">
                        <div 
                          className="effectiveness-fill" 
                          style={{ width: `${technique.effectiveness}%` }}
                        ></div>
                        <span>{technique.effectiveness}%</span>
                      </div>
                      <p>Used {technique.usageCount} times</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="techniques-recommendations">
                <h3>Recommended Techniques to Try</h3>
                <ul className="recommendations-list">
                  <li>
                    <span className="recommendation-title">Progressive Muscle Relaxation</span>
                    <span className="recommendation-description">May help with your physical tension patterns</span>
                  </li>
                  <li>
                    <span className="recommendation-title">Gratitude Journaling</span>
                    <span className="recommendation-description">Could enhance your already positive morning mindset</span>
                  </li>
                  <li>
                    <span className="recommendation-title">5-4-3-2-1 Grounding Exercise</span>
                    <span className="recommendation-description">A quick technique for moments of acute anxiety</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Growth Tab */}
          {activeTab === 'growth' && (
            <div className="archive-growth">
              <h2>Your Growth Journey</h2>
              
              <div className="growth-progress">
                <h3>Emotional Growth Areas</h3>
                <div className="growth-areas">
                  <div className="growth-area">
                    <h4>Emotional Awareness</h4>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                    <p>75% - Advanced</p>
                  </div>
                  
                  <div className="growth-area">
                    <h4>Stress Management</h4>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <p>60% - Intermediate</p>
                  </div>
                  
                  <div className="growth-area">
                    <h4>Emotional Regulation</h4>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                    <p>65% - Intermediate</p>
                  </div>
                  
                  <div className="growth-area">
                    <h4>Positive Emotion Cultivation</h4>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '80%' }}></div>
                    </div>
                    <p>80% - Advanced</p>
                  </div>
                </div>
              </div>
              
              <div className="growth-suggestions">
                <h3>Suggested Next Steps</h3>
                <div className="suggestions-list">
                  {emotionalData.growthSuggestions.map((suggestion, index) => (
                    <div className="suggestion-card" key={index}>
                      <h4>{suggestion.area}</h4>
                      <p className="suggestion-text">{suggestion.suggestion}</p>
                      <p className="suggestion-relevance">{suggestion.relevance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MashaaerArchive;