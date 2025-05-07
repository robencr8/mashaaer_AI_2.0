import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './DreamMode.css';
import emotionalLoreSystem from '../utils/emotional-lore-system.js';
import synestheticFeedback from '../emotion/synesthetic-feedback.js';

/**
 * Dream Mode Component
 * 
 * A surreal UI with floating thoughts, abstract expressions, and emotional metaphors.
 * Users can interact with emotions visually, drag fear into a "light bubble",
 * push joy higher, and link memories across stars like constellations.
 */
const DreamMode = ({ isActive, onClose, userEmotions = [], memories = [] }) => {
  const [thoughts, setThoughts] = useState([]);
  const [emotionBubbles, setEmotionBubbles] = useState([]);
  const [memoryStars, setMemoryStars] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [lightBubble, setLightBubble] = useState({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.2 });
  const [journalEntry, setJournalEntry] = useState('');
  const containerRef = useRef(null);
  const draggedItemRef = useRef(null);
  const connectionStartRef = useRef(null);

  // Initialize dream mode elements
  useEffect(() => {
    if (isActive) {
      // Create floating thoughts
      const newThoughts = generateThoughts();
      setThoughts(newThoughts);
      
      // Create emotion bubbles from user emotions
      const newEmotionBubbles = generateEmotionBubbles(userEmotions);
      setEmotionBubbles(newEmotionBubbles);
      
      // Create memory stars from memories
      const newMemoryStars = generateMemoryStars(memories);
      setMemoryStars(newMemoryStars);
      
      // Apply dream mode synesthetic feedback
      synestheticFeedback.setEmotion('calm', 0.7);
      
      // Add ambient sound
      playAmbientSound();
    } else {
      // Clean up when dream mode is deactivated
      stopAmbientSound();
    }
    
    return () => {
      stopAmbientSound();
    };
  }, [isActive, userEmotions, memories]);
  
  /**
   * Generate floating thoughts
   */
  const generateThoughts = () => {
    const thoughtTexts = [
      'What brings you peace?',
      'Remember that moment of joy...',
      'Breathe and let go',
      'What are you grateful for today?',
      'Visualize your calm place',
      'Notice how you feel right now'
    ];
    
    return thoughtTexts.map((text, index) => ({
      id: `thought-${index}`,
      text,
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.8,
      opacity: Math.random() * 0.5 + 0.3,
      scale: Math.random() * 0.5 + 0.8,
      rotation: Math.random() * 30 - 15
    }));
  };
  
  /**
   * Generate emotion bubbles from user emotions
   */
  const generateEmotionBubbles = (emotions) => {
    const defaultEmotions = ['joy', 'fear', 'sadness', 'anger', 'peace', 'hope'];
    const emotionsToUse = emotions.length > 0 ? emotions : defaultEmotions;
    
    return emotionsToUse.map((emotion, index) => ({
      id: `emotion-${index}`,
      text: emotion,
      x: 100 + (index * 150),
      y: window.innerHeight * 0.7,
      color: getEmotionColor(emotion),
      size: getEmotionSize(emotion),
      draggable: true
    }));
  };
  
  /**
   * Generate memory stars from memories
   */
  const generateMemoryStars = (memories) => {
    const defaultMemories = [
      { text: 'A childhood memory', emotion: 'joy' },
      { text: 'A recent challenge', emotion: 'fear' },
      { text: 'A moment of pride', emotion: 'confidence' },
      { text: 'A peaceful moment', emotion: 'calm' }
    ];
    
    const memoriesToUse = memories.length > 0 ? memories : defaultMemories;
    
    return memoriesToUse.map((memory, index) => ({
      id: `memory-${index}`,
      text: memory.text || memory.message || memory.narrativeDescription || 'A memory',
      emotion: memory.emotion || 'neutral',
      x: 150 + Math.random() * (window.innerWidth - 300),
      y: 150 + Math.random() * (window.innerHeight - 300),
      brightness: 0.7 + Math.random() * 0.3,
      size: 10 + Math.random() * 20,
      connectable: true
    }));
  };
  
  /**
   * Get color for an emotion
   */
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: '#f1fa8c',
      happiness: '#f1fa8c',
      fear: '#6272a4',
      anxiety: '#6272a4',
      sadness: '#8be9fd',
      grief: '#8be9fd',
      anger: '#ff5555',
      frustration: '#ff5555',
      peace: '#50fa7b',
      calm: '#50fa7b',
      hope: '#bd93f9',
      love: '#ff79c6',
      confidence: '#ffb86c',
      neutral: '#f8f8f2'
    };
    
    return emotionColors[emotion.toLowerCase()] || '#f8f8f2';
  };
  
  /**
   * Get size for an emotion bubble
   */
  const getEmotionSize = (emotion) => {
    const emotionSizes = {
      joy: 80,
      happiness: 80,
      fear: 60,
      anxiety: 60,
      sadness: 70,
      grief: 70,
      anger: 75,
      frustration: 75,
      peace: 85,
      calm: 85,
      hope: 80,
      love: 90,
      confidence: 85,
      neutral: 70
    };
    
    return emotionSizes[emotion.toLowerCase()] || 70;
  };
  
  /**
   * Play ambient sound for dream mode
   */
  const playAmbientSound = () => {
    // In a real implementation, this would play ambient sound
    console.log('Playing dream mode ambient sound');
  };
  
  /**
   * Stop ambient sound
   */
  const stopAmbientSound = () => {
    // In a real implementation, this would stop ambient sound
    console.log('Stopping dream mode ambient sound');
  };
  
  /**
   * Handle drag start for draggable elements
   */
  const handleDragStart = (e, item) => {
    draggedItemRef.current = item;
    
    if (item.connectable) {
      connectionStartRef.current = item;
    }
  };
  
  /**
   * Handle drag end for draggable elements
   */
  const handleDragEnd = (e, info, item) => {
    // Update position of the dragged item
    if (item.id.startsWith('emotion-')) {
      setEmotionBubbles(prev => 
        prev.map(emotion => 
          emotion.id === item.id 
            ? { ...emotion, x: info.point.x, y: info.point.y } 
            : emotion
        )
      );
      
      // Check if emotion was dragged into light bubble
      const distance = Math.sqrt(
        Math.pow(info.point.x - lightBubble.x, 2) + 
        Math.pow(info.point.y - lightBubble.y, 2)
      );
      
      if (distance < 100) {
        handleEmotionInLightBubble(item);
      }
    } else if (item.id.startsWith('memory-')) {
      setMemoryStars(prev => 
        prev.map(memory => 
          memory.id === item.id 
            ? { ...memory, x: info.point.x, y: info.point.y } 
            : memory
        )
      );
    }
    
    // Reset refs
    draggedItemRef.current = null;
  };
  
  /**
   * Handle when an emotion is dragged into the light bubble
   */
  const handleEmotionInLightBubble = (emotion) => {
    // Visual feedback
    setActiveEmotion(emotion.text);
    
    // In a real implementation, this would trigger a transformation animation
    console.log(`Transforming emotion: ${emotion.text}`);
    
    // Apply synesthetic feedback
    synestheticFeedback.setEmotion(emotion.text, 0.9);
    
    // Generate a reflection based on the emotion
    const reflection = generateReflectionForEmotion(emotion.text);
    
    // Add reflection as a new thought
    setThoughts(prev => [
      ...prev, 
      {
        id: `thought-reflection-${Date.now()}`,
        text: reflection,
        x: lightBubble.x - 100,
        y: lightBubble.y - 100,
        opacity: 1,
        scale: 1.2,
        rotation: 0,
        isReflection: true
      }
    ]);
  };
  
  /**
   * Generate a reflection for an emotion
   */
  const generateReflectionForEmotion = (emotion) => {
    const reflections = {
      joy: "Your joy is a light that illuminates everything around you.",
      happiness: "Happiness flows through you like a gentle stream.",
      fear: "Your fear has been transformed into courage.",
      anxiety: "As anxiety dissolves, notice the space it leaves behind.",
      sadness: "Sadness carries wisdom; listen to what it's teaching you.",
      grief: "Grief is love with nowhere to go. Let it flow through you.",
      anger: "Your anger has been heard and acknowledged.",
      frustration: "Frustration transforms into patience when given space.",
      peace: "Peace is your natural state, always available to return to.",
      calm: "Calm spreads through you like ripples on still water.",
      hope: "Hope is the star that guides even in the darkest night.",
      love: "Love connects all things, including all parts of yourself.",
      confidence: "Confidence grows from the seeds of your experiences.",
      neutral: "In neutrality, you can observe without judgment."
    };
    
    return reflections[emotion.toLowerCase()] || "This emotion is teaching you something important.";
  };
  
  /**
   * Handle mouse down on a connectable item
   */
  const handleMouseDown = (e, item) => {
    if (item.connectable) {
      connectionStartRef.current = item;
    }
  };
  
  /**
   * Handle mouse up on a connectable item
   */
  const handleMouseUp = (e, item) => {
    if (connectionStartRef.current && item.connectable && connectionStartRef.current.id !== item.id) {
      // Create a new connection between two memory stars
      const newConnection = {
        id: `connection-${connectionStartRef.current.id}-${item.id}`,
        start: connectionStartRef.current,
        end: item,
        color: getConnectionColor(connectionStartRef.current, item)
      };
      
      setConnections(prev => [...prev, newConnection]);
      
      // Visual feedback
      console.log(`Connected: ${connectionStartRef.current.text} with ${item.text}`);
      
      // In a real implementation, this would trigger a connection animation
      // and possibly generate insights about the connection
      
      const connectionInsight = generateConnectionInsight(connectionStartRef.current, item);
      
      // Add insight as a new thought
      setThoughts(prev => [
        ...prev, 
        {
          id: `thought-insight-${Date.now()}`,
          text: connectionInsight,
          x: (connectionStartRef.current.x + item.x) / 2,
          y: (connectionStartRef.current.y + item.y) / 2 - 50,
          opacity: 1,
          scale: 1.2,
          rotation: 0,
          isInsight: true
        }
      ]);
    }
    
    connectionStartRef.current = null;
  };
  
  /**
   * Get color for a connection between two items
   */
  const getConnectionColor = (item1, item2) => {
    // Blend the colors of the two emotions
    const color1 = getEmotionColor(item1.emotion);
    const color2 = getEmotionColor(item2.emotion);
    
    // In a real implementation, this would blend the colors
    // For now, just return a default color
    return '#bd93f9';
  };
  
  /**
   * Generate an insight for a connection between two memories
   */
  const generateConnectionInsight = (memory1, memory2) => {
    return `I notice a connection between ${memory1.text} and ${memory2.text}. What does this reveal about your journey?`;
  };
  
  /**
   * Handle journal entry change
   */
  const handleJournalChange = (e) => {
    setJournalEntry(e.target.value);
  };
  
  /**
   * Save journal entry
   */
  const saveJournalEntry = () => {
    if (!journalEntry.trim()) return;
    
    // In a real implementation, this would save the journal entry
    console.log('Saving journal entry:', journalEntry);
    
    // Add the journal entry as a memory star
    const newMemoryStar = {
      id: `memory-journal-${Date.now()}`,
      text: journalEntry,
      emotion: activeEmotion || 'neutral',
      x: 150 + Math.random() * (window.innerWidth - 300),
      y: 150 + Math.random() * (window.innerHeight - 300),
      brightness: 1,
      size: 15,
      connectable: true,
      isJournal: true
    };
    
    setMemoryStars(prev => [...prev, newMemoryStar]);
    
    // Clear the journal entry
    setJournalEntry('');
    
    // Visual feedback
    console.log('Journal entry added as a memory star');
  };
  
  // If dream mode is not active, don't render anything
  if (!isActive) return null;
  
  return (
    <div className="dream-mode-container" ref={containerRef}>
      {/* Background */}
      <div className="dream-mode-background"></div>
      
      {/* Light bubble */}
      <motion.div 
        className="light-bubble"
        style={{ 
          left: lightBubble.x, 
          top: lightBubble.y 
        }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.9, 0.8]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3 
        }}
      >
        <span>Transform Emotions Here</span>
      </motion.div>
      
      {/* Connections between memory stars */}
      <svg className="connections-svg">
        {connections.map(connection => (
          <line
            key={connection.id}
            x1={connection.start.x}
            y1={connection.start.y}
            x2={connection.end.x}
            y2={connection.end.y}
            stroke={connection.color}
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.7"
          />
        ))}
      </svg>
      
      {/* Floating thoughts */}
      {thoughts.map(thought => (
        <motion.div
          key={thought.id}
          className={`floating-thought ${thought.isReflection ? 'reflection' : ''} ${thought.isInsight ? 'insight' : ''}`}
          style={{
            left: thought.x,
            top: thought.y,
            opacity: thought.opacity,
            rotate: thought.rotation
          }}
          animate={{
            y: [thought.y - 10, thought.y + 10, thought.y - 10],
            opacity: [thought.opacity, thought.opacity + 0.2, thought.opacity]
          }}
          transition={{
            repeat: Infinity,
            duration: 5 + Math.random() * 3
          }}
        >
          {thought.text}
        </motion.div>
      ))}
      
      {/* Emotion bubbles */}
      {emotionBubbles.map(emotion => (
        <motion.div
          key={emotion.id}
          className="emotion-bubble"
          style={{
            left: emotion.x,
            top: emotion.y,
            backgroundColor: emotion.color,
            width: emotion.size,
            height: emotion.size
          }}
          drag={emotion.draggable}
          dragConstraints={containerRef}
          onDragStart={(e) => handleDragStart(e, emotion)}
          onDragEnd={(e, info) => handleDragEnd(e, info, emotion)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {emotion.text}
        </motion.div>
      ))}
      
      {/* Memory stars */}
      {memoryStars.map(memory => (
        <motion.div
          key={memory.id}
          className={`memory-star ${memory.isJournal ? 'journal-memory' : ''}`}
          style={{
            left: memory.x,
            top: memory.y,
            backgroundColor: getEmotionColor(memory.emotion),
            width: memory.size,
            height: memory.size,
            filter: `brightness(${memory.brightness})`
          }}
          drag={true}
          dragConstraints={containerRef}
          onDragStart={(e) => handleDragStart(e, memory)}
          onDragEnd={(e, info) => handleDragEnd(e, info, memory)}
          onMouseDown={(e) => handleMouseDown(e, memory)}
          onMouseUp={(e) => handleMouseUp(e, memory)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="memory-tooltip">{memory.text}</div>
        </motion.div>
      ))}
      
      {/* Journal panel */}
      <div className="dream-journal-panel">
        <h3>Dream Journal</h3>
        <textarea
          value={journalEntry}
          onChange={handleJournalChange}
          placeholder="Capture your thoughts and feelings here..."
        />
        <button onClick={saveJournalEntry}>Save as Memory</button>
      </div>
      
      {/* Controls */}
      <div className="dream-mode-controls">
        <button className="close-button" onClick={onClose}>Exit Dream Mode</button>
        <div className="dream-mode-help">
          <p>Drag emotions into the light bubble to transform them</p>
          <p>Connect memory stars to discover insights</p>
          <p>Journal your thoughts to create new memories</p>
        </div>
      </div>
    </div>
  );
};

export default DreamMode;