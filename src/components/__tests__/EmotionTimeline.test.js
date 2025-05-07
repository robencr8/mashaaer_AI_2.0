import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmotionTimeline from '../EmotionTimeline.jsx';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('EmotionTimeline', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the component with title', () => {
    render(<EmotionTimeline />);
    expect(screen.getByText('Emotion Timeline')).toBeInTheDocument();
  });

  test('displays "No emotion data available" when no data exists', () => {
    render(<EmotionTimeline />);
    expect(screen.getByText('No emotion data available.')).toBeInTheDocument();
  });

  test('loads and displays emotion data from localStorage', () => {
    // Setup mock data
    const mockTimelineData = {
      entries: [
        { emotion: 'happy', intensity: 0.8, timestamp: '2023-01-01T12:00:00.000Z' },
        { emotion: 'sad', intensity: 0.5, timestamp: '2023-01-01T12:05:00.000Z' }
      ]
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockTimelineData));

    render(<EmotionTimeline />);

    // Check if data is displayed
    expect(screen.getByText(/happy/)).toBeInTheDocument();
    expect(screen.getByText(/sad/)).toBeInTheDocument();
    expect(screen.getByText(/Intensity: 0.80/)).toBeInTheDocument();
    expect(screen.getByText(/Intensity: 0.50/)).toBeInTheDocument();
  });

  test('handles localStorage parsing errors gracefully', () => {
    // Setup invalid JSON data
    mockLocalStorage.getItem.mockReturnValueOnce('invalid-json');

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<EmotionTimeline />);

    // Should show no data message
    expect(screen.getByText('No emotion data available.')).toBeInTheDocument();

    // Should have logged an error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error parsing timeline data:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  test('updates when emotionUpdate event is fired', async () => {
    render(<EmotionTimeline />);

    // Initially no data
    expect(screen.getByText('No emotion data available.')).toBeInTheDocument();

    // Dispatch emotion update event wrapped in act
    act(() => {
      const emotionUpdateEvent = new CustomEvent('emotionUpdate', {
        detail: {
          emotion: 'surprised',
          intensity: 0.9,
          timestamp: '2023-01-01T12:10:00.000Z'
        }
      });
      document.dispatchEvent(emotionUpdateEvent);
    });

    // Wait for the component to update and then check for the new emotion
    await waitFor(() => {
      expect(screen.getByText(/surprised/)).toBeInTheDocument();
      expect(screen.getByText(/Intensity: 0.90/)).toBeInTheDocument();
    });
  });

  test('applies correct color styling based on emotion', () => {
    // Setup mock data with different emotions
    const mockTimelineData = {
      entries: [
        { emotion: 'happy', intensity: 0.8, timestamp: '2023-01-01T12:00:00.000Z' },
        { emotion: 'angry', intensity: 0.7, timestamp: '2023-01-01T12:05:00.000Z' },
        { emotion: 'unknown', intensity: 0.6, timestamp: '2023-01-01T12:10:00.000Z' }
      ]
    };

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockTimelineData));

    render(<EmotionTimeline />);

    // Get all list items
    const listItems = screen.getAllByRole('listitem');

    // Check if colors are applied correctly
    expect(listItems[0]).toHaveStyle({ color: '#50fa7b' }); // happy color
    expect(listItems[1]).toHaveStyle({ color: '#ff5555' }); // angry color
    expect(listItems[2]).toHaveStyle({ color: '#000' }); // default color for unknown emotion
  });

  test('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<EmotionTimeline />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'emotionUpdate',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
