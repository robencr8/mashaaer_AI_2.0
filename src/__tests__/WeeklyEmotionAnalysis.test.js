import { generateWeeklyAnalysis } from '../components/WeeklyEmotionAnalysis.jsx';
import { generateWeeklyAnalysisPDF } from '../utils/pdf-export.js';

// Mock data for testing
const mockEmotionData = {
  entries: [
    {
      emotion: 'happy',
      intensity: 0.8,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      emotion: 'anxious',
      intensity: 0.6,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      emotion: 'sad',
      intensity: 0.5,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      emotion: 'happy',
      intensity: 0.7,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
    {
      emotion: 'angry',
      intensity: 0.9,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      emotion: 'neutral',
      intensity: 0.4,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
    },
    {
      emotion: 'confident',
      intensity: 0.8,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    },
    // Older entries that should be filtered out
    {
      emotion: 'surprised',
      intensity: 0.7,
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    }
  ]
};

// Test the weekly analysis generation
describe('Weekly Emotion Analysis', () => {
  test('generateWeeklyAnalysis should filter entries from the past week', () => {
    const analysis = generateWeeklyAnalysis(mockEmotionData);
    
    // Should only include entries from the past 7 days
    expect(analysis.summary.emotionCount).toBe(7);
    
    // Should identify the dominant emotion
    expect(analysis.summary.dominantEmotion).toBeDefined();
    
    // Should calculate average intensity
    expect(analysis.summary.averageIntensity).toBeGreaterThan(0);
    expect(analysis.summary.averageIntensity).toBeLessThanOrEqual(1);
    
    // Should calculate emotional stability
    expect(analysis.summary.emotionalStability).toBeGreaterThanOrEqual(0);
    expect(analysis.summary.emotionalStability).toBeLessThanOrEqual(100);
    
    // Should generate patterns by day
    expect(analysis.patterns).toBeDefined();
    expect(analysis.patterns.length).toBeGreaterThan(0);
    
    // Should generate insights
    expect(analysis.insights).toBeDefined();
    expect(analysis.insights.length).toBeGreaterThan(0);
    
    // Should generate recommendations
    expect(analysis.recommendations).toBeDefined();
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });
  
  test('generateWeeklyAnalysis should handle empty data', () => {
    const emptyData = { entries: [] };
    const analysis = generateWeeklyAnalysis(emptyData);
    
    // Should return default values for empty data
    expect(analysis.summary.dominantEmotion).toBe('حياد');
    expect(analysis.summary.emotionCount).toBe(0);
    expect(analysis.summary.averageIntensity).toBe(0);
    expect(analysis.summary.emotionalStability).toBe(0);
    expect(analysis.patterns).toEqual([]);
    expect(analysis.insights).toEqual([]);
    expect(analysis.recommendations).toEqual([]);
  });
});

// Test the PDF generation
describe('PDF Export', () => {
  test('generateWeeklyAnalysisPDF should create a PDF blob', () => {
    const analysis = generateWeeklyAnalysis(mockEmotionData);
    const pdfBlob = generateWeeklyAnalysisPDF(analysis);
    
    // Should return a Blob
    expect(pdfBlob).toBeInstanceOf(Blob);
    
    // Should have the correct MIME type
    expect(pdfBlob.type).toBe('text/html');
    
    // Should have content
    expect(pdfBlob.size).toBeGreaterThan(0);
  });
  
  test('generateWeeklyAnalysisPDF should handle null analysis', () => {
    const pdfBlob = generateWeeklyAnalysisPDF(null);
    
    // Should return null for null analysis
    expect(pdfBlob).toBeNull();
  });
});