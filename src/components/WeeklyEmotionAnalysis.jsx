import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emotionRitualSystem from '../emotion/emotion-ritual-system.js';
import { generateWeeklyAnalysisPDF, downloadPDF, emailPDF } from '../utils/pdf-export.js';

/**
 * Weekly Emotion Analysis Component
 * 
 * This component provides an automatic weekly analysis of the user's emotional state,
 * including patterns, insights, and personalized recommendations.
 */
const WeeklyEmotionAnalysis = ({ emotionData, onClose }) => {
  const [weeklyAnalysis, setWeeklyAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('summary');
  const [showSharingOptions, setShowSharingOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Analyze emotion data when component mounts
    analyzeWeeklyEmotions();
  }, [emotionData]);

  /**
   * Analyze weekly emotions and generate insights
   */
  const analyzeWeeklyEmotions = () => {
    setIsLoading(true);

    // In a real implementation, this would make an API call to get the analysis
    // For now, we'll simulate the analysis with a timeout
    setTimeout(() => {
      const analysis = generateWeeklyAnalysis(emotionData);
      setWeeklyAnalysis(analysis);
      setIsLoading(false);
    }, 1000);
  };

  /**
   * Generate weekly analysis from emotion data
   * @param {Object} data - Emotion data with entries
   * @returns {Object} - Analysis results
   */
  export const generateWeeklyAnalysis = (data) => {
    if (!data || !data.entries || data.entries.length === 0) {
      return {
        summary: {
          dominantEmotion: 'حياد',
          emotionCount: 0,
          averageIntensity: 0,
          emotionalStability: 0
        },
        patterns: [],
        insights: [],
        recommendations: []
      };
    }

    // Filter entries from the past week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyEntries = data.entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= oneWeekAgo && entryDate <= now;
    });

    if (weeklyEntries.length === 0) {
      return {
        summary: {
          dominantEmotion: 'حياد',
          emotionCount: 0,
          averageIntensity: 0,
          emotionalStability: 0
        },
        patterns: [],
        insights: [],
        recommendations: []
      };
    }

    // Count emotions
    const emotionCounts = {};
    weeklyEntries.forEach(entry => {
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
    const totalIntensity = weeklyEntries.reduce((sum, entry) => sum + (entry.intensity || 0.5), 0);
    const averageIntensity = totalIntensity / weeklyEntries.length;

    // Group entries by day
    const entriesByDay = {};
    weeklyEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const day = date.toLocaleDateString('ar-SA', { weekday: 'long' });

      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }

      entriesByDay[day].push(entry);
    });

    // Find patterns by day
    const patterns = [];
    Object.keys(entriesByDay).forEach(day => {
      const dayEntries = entriesByDay[day];
      const dayEmotionCounts = {};

      dayEntries.forEach(entry => {
        if (!dayEmotionCounts[entry.emotion]) {
          dayEmotionCounts[entry.emotion] = 0;
        }
        dayEmotionCounts[entry.emotion]++;
      });

      const dominantDayEmotion = Object.keys(dayEmotionCounts).reduce((a, b) => 
        dayEmotionCounts[a] > dayEmotionCounts[b] ? a : b
      );

      patterns.push({
        day,
        dominantEmotion: dominantDayEmotion,
        emotionCount: dayEntries.length,
        averageIntensity: dayEntries.reduce((sum, entry) => sum + (entry.intensity || 0.5), 0) / dayEntries.length
      });
    });

    // Calculate emotional stability (lower variance = higher stability)
    const intensities = weeklyEntries.map(entry => entry.intensity || 0.5);
    const intensityVariance = calculateVariance(intensities);
    const emotionalStability = Math.max(0, Math.min(100, 100 - intensityVariance * 100));

    // Generate insights
    const insights = generateInsights(weeklyEntries, patterns, dominantEmotion, emotionCounts);

    // Generate recommendations
    const recommendations = generateRecommendations(dominantEmotion, patterns, emotionalStability);

    return {
      summary: {
        dominantEmotion,
        emotionCount: weeklyEntries.length,
        averageIntensity,
        emotionalStability
      },
      patterns,
      insights,
      recommendations
    };
  };

  /**
   * Calculate variance of an array of numbers
   */
  const calculateVariance = (arr) => {
    if (arr.length === 0) return 0;

    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const squareDiffs = arr.map(val => {
      const diff = val - mean;
      return diff * diff;
    });

    return squareDiffs.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  /**
   * Generate insights based on weekly emotion data
   */
  const generateInsights = (entries, patterns, dominantEmotion, emotionCounts) => {
    const insights = [];

    // Insight about dominant emotion
    if (dominantEmotion) {
      insights.push({
        type: 'dominant',
        text: `كان "${getEmotionName(dominantEmotion)}" هو شعورك السائد هذا الأسبوع.`
      });
    }

    // Insight about emotional patterns by day
    if (patterns.length > 1) {
      const happyDays = patterns.filter(p => p.dominantEmotion === 'happy' || p.dominantEmotion === 'confident');
      const stressDays = patterns.filter(p => p.dominantEmotion === 'anxious' || p.dominantEmotion === 'angry');

      if (happyDays.length > 0) {
        insights.push({
          type: 'pattern',
          text: `تميل إلى الشعور بالسعادة أكثر في ${happyDays.map(d => d.day).join(' و ')}.`
        });
      }

      if (stressDays.length > 0) {
        insights.push({
          type: 'pattern',
          text: `تميل إلى الشعور بالتوتر أكثر في ${stressDays.map(d => d.day).join(' و ')}.`
        });
      }
    }

    // Insight about emotional variety
    const emotionVariety = Object.keys(emotionCounts).length;
    if (emotionVariety >= 4) {
      insights.push({
        type: 'variety',
        text: `عبرت عن ${emotionVariety} مشاعر مختلفة هذا الأسبوع، مما يدل على وعي عاطفي جيد.`
      });
    } else if (emotionVariety <= 2) {
      insights.push({
        type: 'variety',
        text: `عبرت عن عدد محدود من المشاعر هذا الأسبوع (${emotionVariety}). قد يكون من المفيد استكشاف مجموعة أوسع من المشاعر.`
      });
    }

    // Insight about intensity
    const highIntensityEntries = entries.filter(e => (e.intensity || 0.5) > 0.7);
    if (highIntensityEntries.length > entries.length * 0.5) {
      insights.push({
        type: 'intensity',
        text: 'عشت مشاعر قوية الشدة في معظم الأوقات هذا الأسبوع.'
      });
    }

    return insights;
  };

  /**
   * Generate recommendations based on weekly analysis
   */
  const generateRecommendations = (dominantEmotion, patterns, emotionalStability) => {
    const recommendations = [];

    // Recommendation based on dominant emotion
    if (dominantEmotion === 'anxious' || dominantEmotion === 'stressed') {
      recommendations.push({
        type: 'ritual',
        title: 'تمارين تنفس للاسترخاء',
        text: 'جرب تمارين التنفس العميق 4-7-8 للمساعدة في تقليل التوتر والقلق.',
        action: 'breathing_exercise'
      });
    } else if (dominantEmotion === 'sad') {
      recommendations.push({
        type: 'ritual',
        title: 'نشاط بدني خفيف',
        text: 'المشي لمدة 15 دقيقة في الهواء الطلق يمكن أن يساعد في تحسين المزاج.',
        action: 'physical_activity'
      });
    } else if (dominantEmotion === 'angry') {
      recommendations.push({
        type: 'ritual',
        title: 'تأمل للتحكم في الغضب',
        text: 'جرب جلسة تأمل قصيرة للمساعدة في التحكم في مشاعر الغضب.',
        action: 'meditation'
      });
    } else if (dominantEmotion === 'happy') {
      recommendations.push({
        type: 'ritual',
        title: 'ممارسة الامتنان',
        text: 'حافظ على هذه المشاعر الإيجابية من خلال تدوين ثلاثة أشياء تشعر بالامتنان لها كل يوم.',
        action: 'gratitude_practice'
      });
    }

    // Recommendation based on emotional stability
    if (emotionalStability < 50) {
      recommendations.push({
        type: 'habit',
        title: 'روتين يومي منتظم',
        text: 'قد يساعدك الالتزام بروتين يومي منتظم في تحقيق استقرار عاطفي أكبر.',
        action: 'routine'
      });
    }

    // General recommendation for emotional awareness
    recommendations.push({
      type: 'awareness',
      title: 'تسمية المشاعر بدقة',
      text: 'حاول تسمية مشاعرك بمزيد من الدقة والتفصيل لتعزيز الوعي العاطفي.',
      action: 'naming'
    });

    return recommendations;
  };

  /**
   * Get localized emotion name
   */
  const getEmotionName = (emotion) => {
    const names = {
      happy: 'سعيد',
      sad: 'حزين',
      angry: 'غاضب',
      surprised: 'متفاجئ',
      neutral: 'محايد',
      anxious: 'قلق',
      confident: 'واثق',
      stressed: 'متوتر'
    };

    return names[emotion] || emotion;
  };

  /**
   * Handle recommendation action
   */
  const handleRecommendationAction = (action) => {
    if (action === 'breathing_exercise') {
      emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.breathing_exercise);
    } else if (action === 'meditation') {
      emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.meditation);
    } else if (action === 'physical_activity') {
      emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.physical_activity);
    } else if (action === 'gratitude_practice') {
      emotionRitualSystem.triggerRitual(emotionRitualSystem.rituals.gratitude_practice);
    } else {
      alert(`سيتم تنفيذ الإجراء: ${action}`);
    }
  };

  /**
   * Handle sharing the analysis
   */
  const handleShareAnalysis = () => {
    // Generate PDF report
    const pdfBlob = generateWeeklyAnalysisPDF(weeklyAnalysis);

    if (!pdfBlob) {
      alert('حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.');
      return;
    }

    // Show sharing options
    setShowSharingOptions(true);
  };

  /**
   * Handle downloading the analysis as PDF
   */
  const handleDownloadAnalysis = () => {
    const pdfBlob = generateWeeklyAnalysisPDF(weeklyAnalysis);

    if (!pdfBlob) {
      alert('حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.');
      return;
    }

    // Download the PDF
    downloadPDF(pdfBlob, `تحليل-المشاعر-الأسبوعي-${new Date().toISOString().split('T')[0]}.html`);

    // Hide sharing options
    setShowSharingOptions(false);
  };

  /**
   * Handle emailing the analysis
   */
  const handleEmailAnalysis = () => {
    // In a real implementation, this would prompt for an email address
    const userEmail = prompt('أدخل عنوان البريد الإلكتروني لإرسال التحليل:');

    if (!userEmail) return;

    const pdfBlob = generateWeeklyAnalysisPDF(weeklyAnalysis);

    if (!pdfBlob) {
      alert('حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.');
      return;
    }

    // Email the PDF
    emailPDF(
      pdfBlob, 
      userEmail, 
      'التحليل الأسبوعي للمشاعر', 
      'مرفق التحليل الأسبوعي لمشاعرك مع التوصيات المخصصة.'
    );

    // Hide sharing options
    setShowSharingOptions(false);
  };

  /**
   * Handle section change
   */
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <div className="weekly-analysis-container loading">
        <div className="loading-spinner"></div>
        <p>جاري تحليل بياناتك العاطفية...</p>
      </div>
    );
  }

  return (
    <div className="weekly-analysis-container">
      <header className="analysis-header">
        <h1>التحليل الأسبوعي للمشاعر</h1>
        <p>تحليل تلقائي لحالتك العاطفية خلال الأسبوع الماضي</p>
        <button className="close-button" onClick={onClose}>×</button>
      </header>

      <nav className="analysis-tabs">
        <button 
          className={activeSection === 'summary' ? 'active' : ''} 
          onClick={() => handleSectionChange('summary')}
        >
          الملخص
        </button>
        <button 
          className={activeSection === 'patterns' ? 'active' : ''} 
          onClick={() => handleSectionChange('patterns')}
        >
          الأنماط
        </button>
        <button 
          className={activeSection === 'insights' ? 'active' : ''} 
          onClick={() => handleSectionChange('insights')}
        >
          الرؤى
        </button>
        <button 
          className={activeSection === 'recommendations' ? 'active' : ''} 
          onClick={() => handleSectionChange('recommendations')}
        >
          التوصيات
        </button>
      </nav>

      <div className="analysis-content">
        {/* Summary Section */}
        {activeSection === 'summary' && weeklyAnalysis && (
          <div className="analysis-summary">
            <div className="summary-cards">
              <div className="summary-card">
                <h3>الشعور السائد</h3>
                <div className="card-content">
                  <div className="emotion-icon">
                    {getEmotionName(weeklyAnalysis.summary.dominantEmotion)}
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h3>عدد المشاعر</h3>
                <div className="card-content">
                  <div className="count-value">
                    {weeklyAnalysis.summary.emotionCount}
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h3>متوسط الشدة</h3>
                <div className="card-content">
                  <div className="intensity-value">
                    {Math.round(weeklyAnalysis.summary.averageIntensity * 100)}%
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h3>الاستقرار العاطفي</h3>
                <div className="card-content">
                  <div className="stability-value">
                    {Math.round(weeklyAnalysis.summary.emotionalStability)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="summary-chart">
              <h3>رحلتك العاطفية هذا الأسبوع</h3>
              <div className="chart-placeholder">
                <p>رسم بياني للمشاعر على مدار الأسبوع</p>
              </div>
            </div>

            <div className="summary-actions">
              <button className="share-button" onClick={handleShareAnalysis}>
                مشاركة التحليل
              </button>

              {showSharingOptions && (
                <div className="sharing-options" style={{
                  backgroundColor: 'rgba(68, 71, 90, 0.9)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <button 
                    onClick={handleDownloadAnalysis}
                    style={{
                      backgroundColor: '#50fa7b',
                      color: '#282a36',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>⬇️</span>
                    <span>تنزيل كملف</span>
                  </button>

                  <button 
                    onClick={handleEmailAnalysis}
                    style={{
                      backgroundColor: '#8be9fd',
                      color: '#282a36',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📧</span>
                    <span>إرسال بالبريد الإلكتروني</span>
                  </button>

                  <button 
                    onClick={() => setShowSharingOptions(false)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ff5555',
                      border: '1px solid #ff5555',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patterns Section */}
        {activeSection === 'patterns' && weeklyAnalysis && (
          <div className="analysis-patterns">
            <h2>أنماط المشاعر الأسبوعية</h2>

            {weeklyAnalysis.patterns.length > 0 ? (
              <div className="patterns-by-day">
                <h3>المشاعر حسب اليوم</h3>
                <div className="patterns-table">
                  <table>
                    <thead>
                      <tr>
                        <th>اليوم</th>
                        <th>الشعور السائد</th>
                        <th>عدد المشاعر</th>
                        <th>متوسط الشدة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyAnalysis.patterns.map((pattern, index) => (
                        <tr key={index}>
                          <td>{pattern.day}</td>
                          <td>{getEmotionName(pattern.dominantEmotion)}</td>
                          <td>{pattern.emotionCount}</td>
                          <td>{Math.round(pattern.averageIntensity * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="no-data-message">
                لا توجد بيانات كافية لتحليل الأنماط الأسبوعية.
              </p>
            )}

            <div className="patterns-visualization">
              <h3>التوزيع اليومي للمشاعر</h3>
              <div className="chart-placeholder">
                <p>رسم بياني لتوزيع المشاعر حسب اليوم</p>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        {activeSection === 'insights' && weeklyAnalysis && (
          <div className="analysis-insights">
            <h2>رؤى من بياناتك العاطفية</h2>

            {weeklyAnalysis.insights.length > 0 ? (
              <div className="insights-list">
                {weeklyAnalysis.insights.map((insight, index) => (
                  <div className={`insight-card ${insight.type}`} key={index}>
                    <div className="insight-icon">
                      {insight.type === 'dominant' && '🔍'}
                      {insight.type === 'pattern' && '📊'}
                      {insight.type === 'variety' && '🎭'}
                      {insight.type === 'intensity' && '📈'}
                    </div>
                    <p className="insight-text">{insight.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">
                لا توجد بيانات كافية لاستخلاص رؤى أسبوعية.
              </p>
            )}

            <div className="insights-summary">
              <h3>ملخص الرؤى</h3>
              <p>
                تعكس هذه الرؤى أنماط المشاعر التي تم رصدها خلال الأسبوع الماضي.
                استخدم هذه المعلومات لفهم أفضل لحالتك العاطفية وتحسين رفاهيتك.
              </p>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {activeSection === 'recommendations' && weeklyAnalysis && (
          <div className="analysis-recommendations">
            <h2>توصيات مخصصة</h2>

            {weeklyAnalysis.recommendations.length > 0 ? (
              <div className="recommendations-list">
                {weeklyAnalysis.recommendations.map((recommendation, index) => (
                  <div className={`recommendation-card ${recommendation.type}`} key={index}>
                    <h3>{recommendation.title}</h3>
                    <p>{recommendation.text}</p>
                    <button 
                      className="action-button"
                      onClick={() => handleRecommendationAction(recommendation.action)}
                    >
                      تطبيق التوصية
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">
                لا توجد بيانات كافية لتقديم توصيات مخصصة.
              </p>
            )}

            <div className="recommendations-footer">
              <button className="share-button" onClick={handleShareAnalysis}>
                مشاركة التوصيات
              </button>

              {showSharingOptions && (
                <div className="sharing-options" style={{
                  backgroundColor: 'rgba(68, 71, 90, 0.9)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <button 
                    onClick={handleDownloadAnalysis}
                    style={{
                      backgroundColor: '#50fa7b',
                      color: '#282a36',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>⬇️</span>
                    <span>تنزيل كملف</span>
                  </button>

                  <button 
                    onClick={handleEmailAnalysis}
                    style={{
                      backgroundColor: '#8be9fd',
                      color: '#282a36',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📧</span>
                    <span>إرسال بالبريد الإلكتروني</span>
                  </button>

                  <button 
                    onClick={() => setShowSharingOptions(false)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ff5555',
                      border: '1px solid #ff5555',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyEmotionAnalysis;
