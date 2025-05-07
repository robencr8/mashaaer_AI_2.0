/**
 * Mashaaer Enhanced Project
 * Emotion Timeline Module
 *
 * This module provides enhanced emotion timeline tracking and visualization
 * with advanced features like:
 * - Multi-dimensional emotion tracking
 * - Cultural context awareness
 * - Subscription-aware feature access
 * - Advanced visualization options
 * - Emotion pattern recognition
 */

class EmotionTimeline {
  constructor() {
    this.timelineData = null;
    this.subscriptionLevel = 'free';
    this.culturalContext = 'neutral';
    this.isInitialized = false;
    this.config = {
      storageKey: 'emotion-timeline-data',
      apiEndpoint: null
    };
    this.emotionColors = {
      happy: '#50fa7b',
      sad: '#6272a4',
      angry: '#ff5555',
      surprised: '#ffb86c',
      neutral: '#9370db',
      anxious: '#bd93f9',
      confident: '#f1fa8c'
    };

    // Add event listener for timeline view
    document.addEventListener('viewEmotionTimeline', this.handleViewTimelineRequest.bind(this));
  }

  /**
   * Handle the request to view the timeline
   * @param {Event} event - The event triggering the timeline view
   */
  handleViewTimelineRequest(event) {
    console.log('Timeline view requested', event);

    // Create timeline container if it doesn't exist
    let timelineContainer = document.getElementById('emotion-timeline-container');
    if (!timelineContainer) {
      timelineContainer = document.createElement('div');
      timelineContainer.id = 'emotion-timeline-container';
      timelineContainer.style.position = 'fixed';
      timelineContainer.style.top = '50%';
      timelineContainer.style.left = '50%';
      timelineContainer.style.transform = 'translate(-50%, -50%)';
      timelineContainer.style.backgroundColor = 'rgba(40, 42, 54, 0.95)'; // Dark cosmic background
      timelineContainer.style.padding = '20px';
      timelineContainer.style.borderRadius = '15px';
      timelineContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      timelineContainer.style.zIndex = '1002';
      timelineContainer.style.maxWidth = '90%';
      timelineContainer.style.maxHeight = '85%';
      timelineContainer.style.overflow = 'auto';
      timelineContainer.style.direction = 'rtl'; // RTL for Arabic
      timelineContainer.style.color = '#f8f8f2'; // Light text for dark background
      document.body.appendChild(timelineContainer);

      // Add star background effect
      this.addStarBackground(timelineContainer);
    }

    // Clear previous content
    timelineContainer.innerHTML = '';

    // Re-add star background after clearing
    this.addStarBackground(timelineContainer);

    // Add header with cosmic theme
    const header = document.createElement('h2');
    header.textContent = '✨ خط زمني شعوري ✨';
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.color = '#bd93f9'; // Purple cosmic color
    header.style.textShadow = '0 0 10px rgba(189, 147, 249, 0.5)'; // Glow effect
    timelineContainer.appendChild(header);

    // Add close button with cosmic theme
    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#ff79c6'; // Pink cosmic color
    closeButton.style.textShadow = '0 0 5px rgba(255, 121, 198, 0.5)'; // Glow effect
    closeButton.onclick = () => {
      timelineContainer.remove();
    };
    timelineContainer.appendChild(closeButton);

    // Add view toggle buttons
    const viewToggleContainer = document.createElement('div');
    viewToggleContainer.style.display = 'flex';
    viewToggleContainer.style.justifyContent = 'center';
    viewToggleContainer.style.marginBottom = '20px';
    viewToggleContainer.style.gap = '10px';

    const listViewButton = document.createElement('button');
    listViewButton.textContent = '📋 قائمة';
    listViewButton.style.backgroundColor = '#6272a4';
    listViewButton.style.border = 'none';
    listViewButton.style.borderRadius = '5px';
    listViewButton.style.padding = '8px 15px';
    listViewButton.style.cursor = 'pointer';
    listViewButton.style.color = 'white';

    const visualViewButton = document.createElement('button');
    visualViewButton.textContent = '🎨 عرض فني';
    visualViewButton.style.backgroundColor = '#44475a';
    visualViewButton.style.border = 'none';
    visualViewButton.style.borderRadius = '5px';
    visualViewButton.style.padding = '8px 15px';
    visualViewButton.style.cursor = 'pointer';
    visualViewButton.style.color = 'white';

    viewToggleContainer.appendChild(listViewButton);
    viewToggleContainer.appendChild(visualViewButton);
    timelineContainer.appendChild(viewToggleContainer);

    // Create containers for different views
    const listViewContainer = document.createElement('div');
    listViewContainer.id = 'emotion-list-view';
    listViewContainer.style.display = 'block';

    const visualViewContainer = document.createElement('div');
    visualViewContainer.id = 'emotion-visual-view';
    visualViewContainer.style.display = 'none';
    visualViewContainer.style.textAlign = 'center';

    // Add event listeners to toggle buttons
    listViewButton.addEventListener('click', () => {
      listViewButton.style.backgroundColor = '#6272a4';
      visualViewButton.style.backgroundColor = '#44475a';
      listViewContainer.style.display = 'block';
      visualViewContainer.style.display = 'none';
    });

    visualViewButton.addEventListener('click', () => {
      listViewButton.style.backgroundColor = '#44475a';
      visualViewButton.style.backgroundColor = '#6272a4';
      listViewContainer.style.display = 'none';
      visualViewContainer.style.display = 'block';
      this.renderVisualTimeline(visualViewContainer);
    });

    // Add timeline entries to list view
    if (this.timelineData && this.timelineData.entries && this.timelineData.entries.length > 0) {
      // Sort entries by timestamp (newest first)
      const sortedEntries = [...this.timelineData.entries].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Group entries by day
      const entriesByDay = {};
      sortedEntries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.toLocaleDateString('ar-SA');

        if (!entriesByDay[day]) {
          entriesByDay[day] = [];
        }

        entriesByDay[day].push(entry);
      });

      // Create day sections
      Object.keys(entriesByDay).forEach(day => {
        const daySection = document.createElement('div');
        daySection.style.marginBottom = '20px';

        const dayHeader = document.createElement('h3');
        dayHeader.textContent = day;
        dayHeader.style.color = '#f1fa8c'; // Yellow cosmic color
        dayHeader.style.borderBottom = '1px solid #6272a4';
        dayHeader.style.paddingBottom = '5px';
        daySection.appendChild(dayHeader);

        // Add entries for this day
        entriesByDay[day].forEach(entry => {
          const entryElement = document.createElement('div');
          entryElement.style.padding = '12px';
          entryElement.style.margin = '10px 0';
          entryElement.style.borderRadius = '8px';
          entryElement.style.backgroundColor = this.emotionColors[entry.emotion] || '#9370db';
          entryElement.style.color = '#ffffff';
          entryElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
          entryElement.style.transition = 'transform 0.2s ease';

          // Add hover effect
          entryElement.addEventListener('mouseover', () => {
            entryElement.style.transform = 'translateY(-3px)';
          });

          entryElement.addEventListener('mouseout', () => {
            entryElement.style.transform = 'translateY(0)';
          });

          const time = new Date(entry.timestamp).toLocaleTimeString('ar-SA');
          const emoji = this.getEmotionEmoji(entry.emotion);

          entryElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 24px;">${emoji}</span>
              <span style="font-size: 14px; opacity: 0.8;">${time}</span>
            </div>
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 5px;">${this.getEmotionName(entry.emotion)}</div>
            <div style="display: flex; align-items: center; margin-top: 8px;">
              <div style="flex: 1; height: 8px; background-color: rgba(255, 255, 255, 0.3); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${Math.round(entry.intensity * 100)}%; background-color: rgba(255, 255, 255, 0.8);"></div>
              </div>
              <span style="margin-right: 10px; font-weight: bold;">${Math.round(entry.intensity * 100)}%</span>
            </div>
          `;

          daySection.appendChild(entryElement);
        });

        listViewContainer.appendChild(daySection);
      });

      // Add visual representation placeholder
      const visualPlaceholder = document.createElement('div');
      visualPlaceholder.innerHTML = `
        <div style="margin: 20px 0;">
          <p style="font-size: 18px; margin-bottom: 10px;">انقر على "عرض فني" لرؤية تمثيل بصري لمشاعرك</p>
          <div style="font-size: 40px;">✨🌟✨</div>
        </div>
      `;
      visualViewContainer.appendChild(visualPlaceholder);

    } else {
      const noDataMessage = document.createElement('div');
      noDataMessage.style.textAlign = 'center';
      noDataMessage.style.padding = '40px 20px';

      const emoji = document.createElement('div');
      emoji.textContent = '🌱';
      emoji.style.fontSize = '48px';
      emoji.style.marginBottom = '20px';
      noDataMessage.appendChild(emoji);

      const text = document.createElement('p');
      text.textContent = 'لا توجد بيانات مشاعر متاحة بعد.';
      text.style.fontSize = '18px';
      noDataMessage.appendChild(text);

      const subtext = document.createElement('p');
      subtext.textContent = 'تفاعل مع مشاعر لبدء تسجيل مشاعرك.';
      subtext.style.fontSize = '14px';
      subtext.style.color = '#6272a4';
      subtext.style.marginTop = '10px';
      noDataMessage.appendChild(subtext);

      listViewContainer.appendChild(noDataMessage);
      visualViewContainer.appendChild(noDataMessage.cloneNode(true));
    }

    // Add containers to main container
    timelineContainer.appendChild(listViewContainer);
    timelineContainer.appendChild(visualViewContainer);

    // Add footer with stats
    if (this.timelineData && this.timelineData.stats) {
      const stats = this.timelineData.stats;

      const footerContainer = document.createElement('div');
      footerContainer.style.marginTop = '20px';
      footerContainer.style.padding = '10px';
      footerContainer.style.borderTop = '1px solid #6272a4';
      footerContainer.style.display = 'flex';
      footerContainer.style.justifyContent = 'space-around';

      // Most frequent emotion
      if (stats.mostFrequent) {
        const mostFrequentStat = document.createElement('div');
        mostFrequentStat.style.textAlign = 'center';
        mostFrequentStat.style.padding = '0 15px';

        const emoji = this.getEmotionEmoji(stats.mostFrequent);
        mostFrequentStat.innerHTML = `
          <div style="font-size: 24px; margin-bottom: 5px;">${emoji}</div>
          <div style="font-size: 14px; color: #6272a4;">المشاعر الأكثر</div>
          <div style="font-weight: bold;">${this.getEmotionName(stats.mostFrequent)}</div>
        `;

        footerContainer.appendChild(mostFrequentStat);
      }

      // Average intensity
      const intensityStat = document.createElement('div');
      intensityStat.style.textAlign = 'center';
      intensityStat.style.padding = '0 15px';

      intensityStat.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 5px;">📊</div>
        <div style="font-size: 14px; color: #6272a4;">متوسط الشدة</div>
        <div style="font-weight: bold;">${Math.round(stats.averageIntensity * 100)}%</div>
      `;

      footerContainer.appendChild(intensityStat);

      // Total entries
      const totalStat = document.createElement('div');
      totalStat.style.textAlign = 'center';
      totalStat.style.padding = '0 15px';

      totalStat.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 5px;">🔢</div>
        <div style="font-size: 14px; color: #6272a4;">عدد المشاعر</div>
        <div style="font-weight: bold;">${this.timelineData.entries.length}</div>
      `;

      footerContainer.appendChild(totalStat);

      timelineContainer.appendChild(footerContainer);
    }
  }

  /**
   * Add star background effect to container
   * @param {HTMLElement} container - Container to add stars to
   */
  addStarBackground(container) {
    // Create star container
    const starContainer = document.createElement('div');
    starContainer.className = 'star-background';
    starContainer.style.position = 'absolute';
    starContainer.style.top = '0';
    starContainer.style.left = '0';
    starContainer.style.width = '100%';
    starContainer.style.height = '100%';
    starContainer.style.overflow = 'hidden';
    starContainer.style.zIndex = '-1';

    // Add stars
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.position = 'absolute';
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite`;

      starContainer.appendChild(star);
    }

    // Add keyframes for twinkling animation
    if (!document.getElementById('star-animation')) {
      const style = document.createElement('style');
      style.id = 'star-animation';
      style.textContent = `
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(starContainer);
  }

  /**
   * Render visual timeline in the visual view container
   * @param {HTMLElement} container - Container to render the visual timeline in
   */
  renderVisualTimeline(container) {
    // Clear container
    container.innerHTML = '';

    if (!this.timelineData || !this.timelineData.entries || this.timelineData.entries.length === 0) {
      return;
    }

    // Create canvas for visualization
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth || 800;
    canvas.height = 400;
    canvas.style.maxWidth = '100%';
    canvas.style.margin = '0 auto';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Sort entries by timestamp
    const sortedEntries = [...this.timelineData.entries].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Draw cosmic background
    ctx.fillStyle = 'rgba(40, 42, 54, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 1.5;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    // Draw emotion flow
    if (sortedEntries.length > 1) {
      const padding = 40;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding * 2;

      // Map emotions to y-positions
      const emotions = ['happy', 'confident', 'neutral', 'anxious', 'sad', 'angry'];
      const emotionPositions = {};
      emotions.forEach((emotion, index) => {
        emotionPositions[emotion] = padding + (graphHeight / (emotions.length - 1)) * index;
      });

      // Calculate x-positions based on timestamps
      const startTime = new Date(sortedEntries[0].timestamp).getTime();
      const endTime = new Date(sortedEntries[sortedEntries.length - 1].timestamp).getTime();
      const timeRange = endTime - startTime;

      const points = sortedEntries.map(entry => {
        const time = new Date(entry.timestamp).getTime();
        const x = padding + ((time - startTime) / timeRange) * graphWidth;
        const y = emotionPositions[entry.emotion] || emotionPositions.neutral;

        return { x, y, emotion: entry.emotion, intensity: entry.intensity || 0.5 };
      });

      // Draw emotion flow line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];

        // Draw curved line
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }

      // Create gradient
      const gradient = ctx.createLinearGradient(padding, 0, canvas.width - padding, 0);
      gradient.addColorStop(0, 'rgba(80, 250, 123, 0.6)');
      gradient.addColorStop(0.3, 'rgba(241, 250, 140, 0.6)');
      gradient.addColorStop(0.7, 'rgba(189, 147, 249, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 85, 85, 0.6)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw emotion points
      points.forEach(point => {
        const color = this.emotionColors[point.emotion] || '#9370db';
        const radius = 5 + point.intensity * 5;

        // Draw glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${color}33`;
        ctx.fill();

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw emotion labels
      emotions.forEach(emotion => {
        const y = emotionPositions[emotion];
        const name = this.getEmotionName(emotion);

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(name, padding - 10, y + 5);
      });
    }

    // Add explanation text
    const explanation = document.createElement('p');
    explanation.textContent = 'هذا تمثيل بصري لرحلة مشاعرك عبر الزمن';
    explanation.style.marginTop = '20px';
    explanation.style.color = '#f8f8f2';
    container.appendChild(explanation);
  }

  /**
   * Get emoji for emotion
   * @param {string} emotion - Emotion name
   * @returns {string} - Emoji representing the emotion
   */
  getEmotionEmoji(emotion) {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
      anxious: '😰',
      confident: '💪'
    };

    return emojis[emotion] || '😐';
  }

  /**
   * Get localized emotion name
   * @param {string} emotion - Emotion name
   * @returns {string} - Localized emotion name
   */
  getEmotionName(emotion) {
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
  }

  /**
   * Initialize the emotion timeline
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) return this;

    this.config = { ...this.config, ...config };

    if (config.subscriptionLevel) {
      this.setSubscriptionLevel(config.subscriptionLevel);
    }

    if (config.culturalContext) {
      this.setCulturalContext(config.culturalContext);
    }

    this.timelineData = this.loadTimelineData();
    this.initEventListeners();
    this.createRouteHandler();

    this.isInitialized = true;
    console.log('Enhanced Emotion Timeline initialized');
    return this;
  }

  /**
   * Set the subscription level
   * @param {string} level - Subscription level ('free', 'basic', 'premium')
   */
  setSubscriptionLevel(level) {
    const validLevels = ['free', 'basic', 'premium'];
    if (validLevels.includes(level)) {
      this.subscriptionLevel = level;
      console.log(`Subscription level set to: ${level}`);
      return true;
    }
    console.warn(`Unknown subscription level: ${level}`);
    return false;
  }

  /**
   * Set the cultural context
   * @param {string} context - Cultural context
   */
  setCulturalContext(context) {
    this.culturalContext = context;
    console.log(`Cultural context set to: ${context}`);
    return true;
  }

  /**
   * Check if a feature is accessible based on subscription level
   * @param {string} feature - Feature name
   * @returns {boolean} Whether the feature is accessible
   */
  canAccessFeature(feature) {
    const featureAccess = {
      basicTimeline: ['free', 'basic', 'premium'],
      extendedHistory: ['basic', 'premium'],
      advancedVisualization: ['basic', 'premium'],
      emotionPatternRecognition: ['premium'],
      emotionExport: ['premium'],
      customTimeRanges: ['premium']
    };

    if (!featureAccess[feature]) {
      console.warn(`Unknown feature: ${feature}`);
      return false;
    }

    return featureAccess[feature].includes(this.subscriptionLevel);
  }

  /**
   * Load timeline data from storage
   * @returns {Object} Timeline data
   */
  loadTimelineData() {
    if (window.memoryDB) {
      const data = window.memoryDB.get(this.config.storageKey);
      if (data) {
        return this.validateTimelineData(data);
      }
    }

    const storedData = localStorage.getItem(this.config.storageKey);
    if (storedData) {
      try {
        return this.validateTimelineData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing emotion timeline data:', e);
        return this.createInitialTimelineData();
      }
    }

    return this.createInitialTimelineData();
  }

  /**
   * Validate timeline data structure and fix if necessary
   * @param {Object} data - Timeline data to validate
   * @returns {Object} Validated timeline data
   */
  validateTimelineData(data) {
    if (!data || typeof data !== 'object') {
      return this.createInitialTimelineData();
    }

    if (!Array.isArray(data.entries)) {
      data.entries = [];
    }

    if (!data.stats || typeof data.stats !== 'object') {
      data.stats = {
        mostFrequent: null,
        averageIntensity: 0,
        emotionCounts: {}
      };
    }

    if (!Array.isArray(data.patterns)) {
      data.patterns = [];
    }

    if (!data.lastUpdated) {
      data.lastUpdated = new Date().toISOString();
    }

    return data;
  }

  /**
   * Create initial timeline data structure
   * @returns {Object} Initial timeline data
   */
  createInitialTimelineData() {
    return {
      entries: [],
      stats: {
        mostFrequent: null,
        averageIntensity: 0,
        emotionCounts: {},
        emotionsByDay: {},
        emotionsByHour: {}
      },
      patterns: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save timeline data to storage
   */
  saveTimelineData() {
    this.timelineData.lastUpdated = new Date().toISOString();

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.timelineData));
    } catch (e) {
      console.error('Error saving emotion timeline data to localStorage:', e);
    }

    if (window.memoryDB) {
      window.memoryDB.set(this.config.storageKey, this.timelineData);
    }

    this.syncWithServer();
  }

  /**
   * Sync timeline data with the server
   */
  syncWithServer() {
    if (!this.config.apiEndpoint || !this.canAccessFeature('emotionExport')) return;

    const syncData = {
      entries: this.timelineData.entries.slice(-50),
      stats: this.timelineData.stats,
      lastUpdated: this.timelineData.lastUpdated,
      culturalContext: this.culturalContext
    };

    fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(syncData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Emotion timeline synced with server:', data);
    })
    .catch(error => {
      console.error('Error syncing emotion timeline with server:', error);
    });
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    document.addEventListener('emotionUpdate', this.handleEmotionUpdate.bind(this));
    document.addEventListener('viewEmotionTimeline', this.handleViewTimelineRequest.bind(this));
  }

  /**
   * Handle emotion update events
   * @param {Event} event - Event containing emotion updates
   */
  handleEmotionUpdate(event) {
    const { emotion, intensity } = event.detail;

    this.timelineData.entries.push({
      emotion,
      intensity,
      timestamp: new Date().toISOString()
    });

    this.updateStats(emotion, intensity);
    this.saveTimelineData();
    console.log(`Emotion update: ${emotion} (${intensity})`);
  }

  /**
   * Update timeline stats
   * @param {string} emotion - Emotion being updated
   * @param {number} intensity - Intensity of the emotion
   */
  updateStats(emotion, intensity) {
    const stats = this.timelineData.stats;

    if (!stats.emotionCounts[emotion]) {
      stats.emotionCounts[emotion] = 0;
    }
    stats.emotionCounts[emotion] += 1;

    const totalEntries = this.timelineData.entries.length;
    stats.averageIntensity = (stats.averageIntensity * (totalEntries - 1) + intensity) / totalEntries;

    stats.mostFrequent = Object.keys(stats.emotionCounts).reduce((a, b) =>
      stats.emotionCounts[a] > stats.emotionCounts[b] ? a : b
    );
  }

  /**
   * Create route handler for /emotions
   */
  createRouteHandler() {
    if (window.router) {
      window.router.registerRoute('/emotions', () => {
        this.handleViewTimelineRequest();
      });
    }
  }
}

export default EmotionTimeline;
