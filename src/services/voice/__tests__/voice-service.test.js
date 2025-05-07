import { VoiceService } from '../voice-service.js';
import { speakWithElevenLabs } from '../../../utils/text-to-speech.js';
import { playVoiceResponse } from '../../../static/js/MashaaerVoice.js';

// Mock dependencies
jest.mock('../../../utils/text-to-speech', () => ({
  speakWithElevenLabs: jest.fn()
}));

jest.mock('../../../static/js/MashaaerVoice', () => ({
  playVoiceResponse: jest.fn()
}));

describe('VoiceService', () => {
  let voiceService;
  let mockConfigService;
  let mockEmotionService;
  let mockSpeechSynthesis;
  let mockUtterance;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock SpeechSynthesisUtterance
    mockUtterance = {
      pitch: 1.0,
      rate: 1.0,
      lang: '',
      voice: null
    };
    global.SpeechSynthesisUtterance = jest.fn(() => mockUtterance);
    
    // Mock speechSynthesis
    mockSpeechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      speaking: false,
      getVoices: jest.fn().mockReturnValue([
        { name: 'Arabic Voice', lang: 'ar-SA' },
        { name: 'English Voice', lang: 'en-US' },
        { name: 'Gulf Voice', lang: 'ar-SA' }
      ])
    };
    
    // Assign to window
    global.window = Object.create(window);
    global.window.speechSynthesis = mockSpeechSynthesis;
    
    // Mock config service
    mockConfigService = {
      get: jest.fn((key, defaultValue) => defaultValue),
      set: jest.fn()
    };
    
    // Mock emotion service
    mockEmotionService = {
      getEmotionColor: jest.fn()
    };
    
    // Create service instance
    voiceService = new VoiceService();
  });

  afterEach(() => {
    // Clean up
    delete global.SpeechSynthesisUtterance;
    delete global.window.speechSynthesis;
  });

  test('should initialize with default values', () => {
    expect(voiceService.isInitialized).toBe(false);
    expect(voiceService.voiceEnabled).toBe(true);
    expect(voiceService.useElevenLabs).toBe(false);
    expect(voiceService.elevenlabsApiKey).toBe('');
  });

  test('should initialize with config service values', () => {
    // Setup mock config values
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      if (key === 'voice.enabled') return false;
      if (key === 'voice.useElevenLabs') return true;
      if (key === 'voice.elevenlabsApiKey') return 'test-api-key';
      return defaultValue;
    });
    
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    expect(voiceService.isInitialized).toBe(true);
    expect(voiceService.voiceEnabled).toBe(false);
    expect(voiceService.useElevenLabs).toBe(true);
    expect(voiceService.elevenlabsApiKey).toBe('test-api-key');
  });

  test('should not re-initialize if already initialized', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    const initialConfigService = voiceService.configService;
    
    // Try to initialize again with different config
    const newMockConfigService = { ...mockConfigService };
    voiceService.initialize(newMockConfigService, mockEmotionService);
    
    // Should still have the original config service
    expect(voiceService.configService).toBe(initialConfigService);
  });

  test('should not speak when voice is disabled', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    voiceService.voiceEnabled = false;
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    voiceService.speakReply('Hello', 'happy');
    
    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    expect(speakWithElevenLabs).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Voice is disabled. Would speak:', 'Hello');
    
    consoleSpy.mockRestore();
  });

  test('should use ElevenLabs when enabled and API key is available', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    voiceService.useElevenLabs = true;
    voiceService.elevenlabsApiKey = 'valid-key';
    
    voiceService.speakReply('Hello', 'happy', 'Gulf');
    
    expect(speakWithElevenLabs).toHaveBeenCalledWith('Hello', 'happy', 'Gulf');
    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
  });

  test('should fall back to browser TTS if ElevenLabs fails', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    voiceService.useElevenLabs = true;
    voiceService.elevenlabsApiKey = 'valid-key';
    
    // Make ElevenLabs throw an error
    speakWithElevenLabs.mockImplementation(() => {
      throw new Error('ElevenLabs error');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    voiceService.speakReply('Hello', 'happy', 'Gulf');
    
    expect(speakWithElevenLabs).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error using ElevenLabs TTS:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test('should apply emotion settings to speech utterance', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    voiceService.speakWithBrowserTTS('Hello', 'angry');
    
    // Check if angry emotion settings were applied
    expect(mockUtterance.pitch).toBe(1.5); // angry pitch
    expect(mockUtterance.rate).toBe(1.3); // angry rate
    expect(mockUtterance.lang).toBe('ar-SA'); // Arabic language
  });

  test('should use default emotion settings if emotion not found', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    voiceService.speakWithBrowserTTS('Hello', 'unknown-emotion');
    
    // Check if neutral (default) emotion settings were applied
    expect(mockUtterance.pitch).toBe(1.0); // neutral pitch
    expect(mockUtterance.rate).toBe(1.0); // neutral rate
  });

  test('should select voice based on voice profile', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    voiceService.speakWithBrowserTTS('Hello', 'neutral', 'Gulf');
    
    // Should have selected the Gulf voice
    expect(mockUtterance.voice).toEqual({ name: 'Gulf Voice', lang: 'ar-SA' });
  });

  test('should cancel current speech before speaking new text', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    mockSpeechSynthesis.speaking = true;
    
    voiceService.speakWithBrowserTTS('Hello');
    
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  test('should handle errors during speech synthesis', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    // Make speechSynthesis.speak throw an error
    mockSpeechSynthesis.speak.mockImplementation(() => {
      throw new Error('Speech synthesis error');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    voiceService.speakWithBrowserTTS('Hello');
    
    expect(consoleSpy).toHaveBeenCalledWith('Error during speech synthesis:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test('should play voice response using MashaaerVoice', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    const options = { text: 'Hello', emotion: 'happy' };
    voiceService.playVoiceResponse(options);
    
    expect(playVoiceResponse).toHaveBeenCalledWith(options);
  });

  test('should fall back to speakReply if playVoiceResponse fails', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    // Make playVoiceResponse throw an error
    playVoiceResponse.mockImplementation(() => {
      throw new Error('Play voice response error');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const speakReplySpy = jest.spyOn(voiceService, 'speakReply').mockImplementation(() => {});
    
    const options = { text: 'Hello', emotion: 'happy', voiceProfile: 'Gulf' };
    voiceService.playVoiceResponse(options);
    
    expect(playVoiceResponse).toHaveBeenCalled();
    expect(speakReplySpy).toHaveBeenCalledWith('Hello', 'happy', 'Gulf');
    expect(consoleSpy).toHaveBeenCalledWith('Error playing voice response:', expect.any(Error));
    
    consoleSpy.mockRestore();
    speakReplySpy.mockRestore();
  });

  test('should set voice enabled state and update config', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    voiceService.setVoiceEnabled(false);
    
    expect(voiceService.voiceEnabled).toBe(false);
    expect(mockConfigService.set).toHaveBeenCalledWith('voice.enabled', false);
  });

  test('should get available voices', () => {
    voiceService.initialize(mockConfigService, mockEmotionService);
    
    const voices = voiceService.getAvailableVoices();
    
    expect(voices).toEqual([
      { name: 'Arabic Voice', lang: 'ar-SA' },
      { name: 'English Voice', lang: 'en-US' },
      { name: 'Gulf Voice', lang: 'ar-SA' }
    ]);
  });

  test('should return empty array if speechSynthesis is not available', () => {
    delete global.window.speechSynthesis;
    voiceService = new VoiceService();
    
    const voices = voiceService.getAvailableVoices();
    
    expect(voices).toEqual([]);
  });
});