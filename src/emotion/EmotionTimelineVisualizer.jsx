import React, { useEffect, useRef, useState } from 'react';
import EmotionTimeline from './emotion-timeline.js';
import emotionRitualSystem from './emotion-ritual-system.js';
import WeeklyEmotionAnalysis from '../components/WeeklyEmotionAnalysis.jsx';
import '../components/WeeklyEmotionAnalysis.css';

/**
 * EmotionTimelineVisualizer Component
 * 
 * A React component that visualizes emotion timeline data using canvas rendering
 * and provides interactive timeline visualization with intelligent motivation system.
 */
const EmotionTimelineVisualizer = ({ timelineData, width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const [emotionTimeline] = useState(new EmotionTimeline());
  const [motivationSuggestion, setMotivationSuggestion] = useState(null);
  const [showWeeklyAnalysis, setShowWeeklyAnalysis] = useState(false);

  // Emotion colors mapping
  const emotionColors = {
    happy: '#50fa7b',
    sad: '#6272a4',
    angry: '#ff5555',
    surprised: '#ffb86c',
    neutral: '#9370db',
    anxious: '#bd93f9',
    confident: '#f1fa8c'
  };

  // Get emoji for emotion
  const getEmotionEmoji = (emotion) => {
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
  };

  // Get localized emotion name
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

  // Render the timeline visualization on canvas
  const renderTimelineVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = timelineData || emotionTimeline.timelineData;

    if (!data || !data.entries || data.entries.length === 0) {
      // Draw empty state
      ctx.fillStyle = 'rgba(40, 42, 54, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('لا توجد بيانات مشاعر متاحة بعد', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Sort entries by timestamp
    const sortedEntries = [...data.entries].sort((a, b) => 
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
        const color = emotionColors[point.emotion] || '#9370db';
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
        const name = getEmotionName(emotion);

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(name, padding - 10, y + 5);
      });
    }
  };

  // Generate motivation suggestions based on emotion frequency
  const generateMotivationSuggestions = (data) => {
    if (!data || !data.stats || !data.stats.emotionCounts) {
      return null;
    }

    const emotionCounts = data.stats.emotionCounts;
    const mostFrequent = data.stats.mostFrequent;
    const totalEntries = data.entries.length;

    // Calculate frequency percentages
    const frequencies = {};
    Object.keys(emotionCounts).forEach(emotion => {
      frequencies[emotion] = (emotionCounts[emotion] / totalEntries) * 100;
    });

    // Generate suggestions based on emotion patterns
    let suggestion = {
      type: 'general',
      emoji: '✨',
      title: 'اقتراح للتحسين',
      description: 'تأمل لبضع دقائق يومياً يمكن أن يساعد في تحسين حالتك المزاجية',
      actionText: 'ابدأ الآن'
    };

    // Specific suggestions based on most frequent emotion
    if (mostFrequent === 'anxious' && frequencies.anxious > 30) {
      suggestion = {
        type: 'breathing',
        emoji: '🧘‍♂️',
        title: 'تمارين تنفس للقلق',
        description: 'لاحظنا تكرار مشاعر القلق. جرب تمارين التنفس العميق 4-7-8 للمساعدة في تهدئة الأعصاب',
        actionText: 'تمرين التنفس'
      };
    } else if (mostFrequent === 'sad' && frequencies.sad > 25) {
      suggestion = {
        type: 'activity',
        emoji: '🚶‍♂️',
        title: 'نشاط خفيف للمزاج',
        description: 'المشي لمدة 15 دقيقة في الهواء الطلق يمكن أن يساعد في تحسين المزاج وتقليل مشاعر الحزن',
        actionText: 'تذكير لاحقاً'
      };
    } else if (mostFrequent === 'angry' && frequencies.angry > 20) {
      suggestion = {
        type: 'meditation',
        emoji: '🧠',
        title: 'تأمل للتحكم في الغضب',
        description: 'جرب جلسة تأمل قصيرة للمساعدة في التحكم في مشاعر الغضب وتحويلها إلى طاقة إيجابية',
        actionText: 'بدء التأمل'
      };
    } else if (mostFrequent === 'happy' && frequencies.happy > 40) {
      suggestion = {
        type: 'gratitude',
        emoji: '🙏',
        title: 'ممارسة الامتنان',
        description: 'أنت تشعر بالسعادة بشكل متكرر! حافظ على هذه المشاعر من خلال تدوين ثلاثة أشياء ممتن لها اليوم',
        actionText: 'تدوين الامتنان'
      };
    } else if (frequencies.neutral > 50) {
      suggestion = {
        type: 'exploration',
        emoji: '🔍',
        title: 'استكشاف المشاعر',
        description: 'لاحظنا أن مشاعرك محايدة في كثير من الأحيان. جرب أنشطة جديدة لاستكشاف نطاق أوسع من المشاعر',
        actionText: 'أفكار للأنشطة'
      };
    }

    return suggestion;
  };

  // Effect to render the visualization and generate suggestions when component mounts or data changes
  useEffect(() => {
    renderTimelineVisualization();

    if (timelineData) {
      const suggestion = generateMotivationSuggestions(timelineData);
      setMotivationSuggestion(suggestion);
    }
  }, [timelineData]);

  // Handle motivation action click
  const handleMotivationAction = (type) => {
    console.log(`Motivation action clicked: ${type}`);

    // Trigger appropriate ritual based on suggestion type
    switch(type) {
      case 'breathing':
        emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.breathing_exercise || {
          id: 'breathing_exercise',
          name: 'تمارين تنفس',
          actions: [{ type: 'breathing', content: 'تنفس ببطء... 4 ثوان شهيق... 4 ثوان احتفاظ... 6 ثوان زفير...' }]
        });
        break;
      case 'meditation':
        emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.meditation || {
          id: 'meditation',
          name: 'جلسة تأمل',
          actions: [{ type: 'meditation', content: 'تأمل في هدوء وركز على تنفسك...' }]
        });
        break;
      case 'activity':
        // Trigger activity suggestion
        alert('تم تعيين تذكير للنشاط البدني');
        break;
      default:
        // Default action
        alert('شكراً لاهتمامك بصحتك النفسية');
    }
  };

  return (
    <div className="emotion-timeline-visualizer">
      <div className="timeline-header">
        <h2 className="timeline-title">✨ خط زمني شعوري ✨</h2>
        <button 
          className="weekly-analysis-button"
          onClick={() => setShowWeeklyAnalysis(true)}
          style={{
            backgroundColor: '#bd93f9',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: '10px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff79c6'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#bd93f9'}
        >
          التحليل الأسبوعي
        </button>
      </div>

      {/* Weekly Analysis Component */}
      {showWeeklyAnalysis && (
        <WeeklyEmotionAnalysis 
          emotionData={timelineData} 
          onClose={() => setShowWeeklyAnalysis(false)} 
        />
      )}

      {/* Motivation Suggestion Card */}
      {motivationSuggestion && (
        <div className="motivation-card" style={{
          backgroundColor: 'rgba(68, 71, 90, 0.7)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(98, 114, 164, 0.5)',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>
            {motivationSuggestion.emoji}
          </div>
          <h3 style={{ 
            color: '#f8f8f2', 
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {motivationSuggestion.title}
          </h3>
          <p style={{ 
            color: '#f8f8f2', 
            margin: '0 0 15px 0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {motivationSuggestion.description}
          </p>
          <button 
            onClick={() => handleMotivationAction(motivationSuggestion.type)}
            style={{
              backgroundColor: '#bd93f9',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff79c6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#bd93f9'}
          >
            {motivationSuggestion.actionText}
          </button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          display: 'block',
          backgroundColor: 'rgba(40, 42, 54, 0.3)',
          borderRadius: '8px'
        }}
      />
      <p className="timeline-explanation">
        هذا تمثيل بصري لرحلة مشاعرك عبر الزمن
      </p>

      {timelineData && timelineData.stats && (
        <div className="timeline-stats">
          {timelineData.stats.mostFrequent && (
            <div className="stat-item">
              <div className="stat-emoji">{getEmotionEmoji(timelineData.stats.mostFrequent)}</div>
              <div className="stat-label">المشاعر الأكثر</div>
              <div className="stat-value">{getEmotionName(timelineData.stats.mostFrequent)}</div>
            </div>
          )}

          <div className="stat-item">
            <div className="stat-emoji">📊</div>
            <div className="stat-label">متوسط الشدة</div>
            <div className="stat-value">
              {Math.round((timelineData?.stats?.averageIntensity || 0) * 100)}%
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-emoji">🔢</div>
            <div className="stat-label">عدد المشاعر</div>
            <div className="stat-value">{timelineData?.entries?.length || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionTimelineVisualizer;
