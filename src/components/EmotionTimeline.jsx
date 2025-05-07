import React, { useEffect, useState } from 'react';

const EmotionTimeline = () => {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Function to fetch timeline data from local storage or API
    const fetchTimelineData = () => {
      const storedData = localStorage.getItem('emotionTimelineData');
      if (storedData) {
        try {
          setTimelineData(JSON.parse(storedData).entries || []);
        } catch (e) {
          console.error('Error parsing timeline data:', e);
        }
      }
    };

    fetchTimelineData();

    // Optionally, add an event listener to sync updates in real-time
    const onEmotionUpdate = (event) => {
      const { emotion, intensity, timestamp } = event.detail;
      setTimelineData((currentData) => [
        ...currentData,
        { emotion, intensity, timestamp }
      ]);
    };

    document.addEventListener('emotionUpdate', onEmotionUpdate);

    return () => {
      document.removeEventListener('emotionUpdate', onEmotionUpdate);
    };
  }, []);

  return (
    <div id="emotion-timeline" className="p-4">
      <h2 className="text-lg font-semibold mb-4">Emotion Timeline</h2>
      <ul>
        {timelineData.length > 0 ? (
          timelineData.map((entry, index) => (
            <li
              key={index}
              className="mb-2"
              style={{ color: getEmotionColor(entry.emotion) }}
            >
              {new Date(entry.timestamp).toLocaleTimeString()} - {entry.emotion} 
              (Intensity: {entry.intensity.toFixed(2)})
            </li>
          ))
        ) : (
          <p>No emotion data available.</p>
        )}
      </ul>
    </div>
  );
};

// Utility function to get emotion color (optional, can use predefined classes)
const getEmotionColor = (emotion) => {
  const emotionColors = {
    happy: '#50fa7b',
    sad: '#6272a4',
    angry: '#ff5555',
    surprised: '#ffb86c',
    neutral: '#9370db',
    anxious: '#bd93f9',
    confident: '#f1fa8c',
  };
  return emotionColors[emotion] || '#000';
};

export default EmotionTimeline;