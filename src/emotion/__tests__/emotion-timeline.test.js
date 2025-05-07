import React from 'react';
import { render, screen } from '@testing-library/react';
import EmotionTimeline from '../emotion-timeline.js';
import EmotionTimelineVisualizer from '../EmotionTimelineVisualizer.jsx';

// Mock canvas and context for testing
const mockContext = {
  fillRect: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  stroke: jest.fn(),
  font: '',
  textAlign: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0
};

// Mock canvas element
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

describe("Emotion Timeline", () => {
  test("should initialize without errors", () => {
    const timeline = new EmotionTimeline();
    expect(timeline).toBeDefined();
    expect(typeof timeline.initialize).toBe("function");
  });

  test("should have proper subscription levels", () => {
    const timeline = new EmotionTimeline();
    timeline.initialize();
    
    expect(timeline.setSubscriptionLevel('free')).toBe(true);
    expect(timeline.setSubscriptionLevel('basic')).toBe(true);
    expect(timeline.setSubscriptionLevel('premium')).toBe(true);
    expect(timeline.setSubscriptionLevel('invalid')).toBe(false);
  });

  test("should track emotion updates", () => {
    const timeline = new EmotionTimeline();
    timeline.initialize();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Trigger emotion update event
    const event = new CustomEvent('emotionUpdate', {
      detail: { emotion: 'happy', intensity: 0.8 }
    });
    document.dispatchEvent(event);
    
    // Check if localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});

describe("Emotion Timeline Visualizer", () => {
  test("renders without crashing", () => {
    render(<EmotionTimelineVisualizer />);
    expect(screen.getByText(/خط زمني شعوري/i)).toBeInTheDocument();
  });

  test("renders empty state when no data is provided", () => {
    render(<EmotionTimelineVisualizer timelineData={null} />);
    expect(screen.getByText(/خط زمني شعوري/i)).toBeInTheDocument();
    
    // Canvas should be rendered
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    // Context methods should be called for empty state
    expect(mockContext.fillRect).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalled();
  });

  test("renders with sample data", () => {
    const sampleData = {
      entries: [
        { emotion: 'happy', intensity: 0.8, timestamp: '2025-05-01T10:00:00Z' },
        { emotion: 'sad', intensity: 0.6, timestamp: '2025-05-01T14:00:00Z' },
        { emotion: 'angry', intensity: 0.9, timestamp: '2025-05-01T18:00:00Z' }
      ],
      stats: {
        mostFrequent: 'happy',
        averageIntensity: 0.77,
        emotionCounts: { happy: 1, sad: 1, angry: 1 }
      }
    };
    
    render(<EmotionTimelineVisualizer timelineData={sampleData} />);
    
    // Title should be rendered
    expect(screen.getByText(/خط زمني شعوري/i)).toBeInTheDocument();
    
    // Stats should be rendered
    expect(screen.getByText(/المشاعر الأكثر/i)).toBeInTheDocument();
    expect(screen.getByText(/متوسط الشدة/i)).toBeInTheDocument();
    expect(screen.getByText(/عدد المشاعر/i)).toBeInTheDocument();
    
    // Canvas should be rendered
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});