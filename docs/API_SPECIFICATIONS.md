# Mashaaer Enhanced Project - API Documentation

This document provides detailed API specifications for developers working with the Mashaaer Enhanced Project.

## Table of Contents
1. [Emotion Detection API](#emotion-detection-api)
2. [Voice Personality API](#voice-personality-api)
3. [Smart Assistant API](#smart-assistant-api)
4. [Integration APIs](#integration-apis)
5. [UI Theme API](#ui-theme-api)

## Emotion Detection API

### EnhancedEmotionDetection

#### Initialization
```javascript
const emotionDetection = new EnhancedEmotionDetection();
emotionDetection.initialize({
  defaultLanguage: 'ar',
  defaultDialect: 'standard',
  sensitivityLevel: 0.7
});
```

#### Methods

##### analyzeText(text)
Analyzes text to detect emotions.

**Parameters:**
- `text` (String): The text to analyze

**Returns:**
- Object: `{ emotion: String, intensity: Number }`

```javascript
const result = emotionDetection.analyzeText('أنا سعيد جداً اليوم!');
// Returns: { emotion: 'happy', intensity: 0.8 }
```

##### setDialect(dialect)
Sets the current dialect for more accurate emotion detection.

**Parameters:**
- `dialect` (String): One of 'standard', 'levantine', 'gulf', 'maghrebi', 'egyptian'

**Returns:**
- Boolean: Success status

##### setCulturalContext(context)
Sets the cultural context for emotion analysis.

**Parameters:**
- `context` (String): Cultural context identifier

**Returns:**
- Boolean: Success status

### EmotionTimeline

#### Initialization
```javascript
const emotionTimeline = new EmotionTimeline();
emotionTimeline.initialize({
  maxEntries: 100,
  storageKey: 'emotion_timeline_data'
});
```

#### Methods

##### addEmotion(emotion, intensity)
Adds an emotion entry to the timeline.

**Parameters:**
- `emotion` (String): Emotion identifier
- `intensity` (Number): Emotion intensity (0-1)

**Returns:**
- Object: The created emotion entry

##### getDominantEmotion(timeRange)
Gets the dominant emotion over a specified time range.

**Parameters:**
- `timeRange` (Object, optional): Time range specification

**Returns:**
- Object: `{ emotion: String, intensity: Number }`

##### getEmotionHistory(options)
Gets emotion history with filtering options.

**Parameters:**
- `options` (Object, optional): Filtering options

**Returns:**
- Array: Emotion entries

## Voice Personality API

### VoicePersonality

#### Initialization
```javascript
const voicePersonality = new VoicePersonality();
voicePersonality.initialize({
  defaultPersonality: 'cosmic',
  defaultDialect: 'standard',
  emotionResponsive: true
});
```

#### Methods

##### setPersonality(personality)
Sets the voice personality.

**Parameters:**
- `personality` (String): One of 'cosmic', 'professional', 'friendly', 'calm'

**Returns:**
- Boolean: Success status

##### applyDialectTraits(dialect)
Applies dialect-specific traits to the voice.

**Parameters:**
- `dialect` (String): One of 'standard', 'levantine', 'gulf', 'maghrebi', 'egyptian'

**Returns:**
- Boolean: Success status

##### processResponse(text, options)
Processes a response text according to personality and emotion settings.

**Parameters:**
- `text` (String): The text to process
- `options` (Object, optional): Processing options

**Returns:**
- String: Processed text

##### handleEmotionUpdate(event)
Handles emotion update events.

**Parameters:**
- `event` (Object): Event with emotion data

**Returns:**
- Boolean: Success status

## Smart Assistant API

### SmartPersonalAssistant

#### Initialization
```javascript
const assistant = new SmartPersonalAssistant();
assistant.initialize({
  defaultName: 'Mashaaer',
  defaultLanguage: 'ar',
  defaultDialect: 'standard',
  voiceEnabled: true
});
```

#### Methods

##### processUserMessage(message, isVoice)
Processes a user message and generates a response.

**Parameters:**
- `message` (String): User message text
- `isVoice` (Boolean, optional): Whether the message is from voice input

**Returns:**
- Void (triggers response event)

##### startListening()
Starts listening for speech input.

**Parameters:**
- None

**Returns:**
- Boolean: Success status

##### stopListening()
Stops listening for speech input.

**Parameters:**
- None

**Returns:**
- Boolean: Success status

##### getLanguageCode()
Gets the language code for speech recognition.

**Parameters:**
- None

**Returns:**
- String: Language code (e.g., 'ar-SA')

## Integration APIs

### PayPalIntegration

#### Initialization
```javascript
const paypalIntegration = new PayPalIntegration();
paypalIntegration.initialize({
  currency: 'USD',
  locale: 'en_US',
  sandbox: true
});
```

#### Methods

##### getSubscriptionPlans()
Gets available subscription plans.

**Parameters:**
- None

**Returns:**
- Object: Subscription plans

##### createSubscription(planId, userInfo)
Creates a subscription for a user.

**Parameters:**
- `planId` (String): Plan identifier
- `userInfo` (Object): User information

**Returns:**
- Promise: Subscription creation result

##### getPlanById(planId)
Gets a plan by its ID.

**Parameters:**
- `planId` (String): Plan identifier

**Returns:**
- Object: Plan details

### WhatsAppIntegration

#### Initialization
```javascript
const whatsAppIntegration = new WhatsAppIntegration();
whatsAppIntegration.initialize({
  notificationEnabled: true,
  autoReply: false
});
```

#### Methods

##### connect(phoneNumber)
Connects to WhatsApp with a phone number.

**Parameters:**
- `phoneNumber` (String): User's phone number

**Returns:**
- Promise: Connection result

##### sendMessage(recipient, message)
Sends a WhatsApp message.

**Parameters:**
- `recipient` (String): Recipient phone number
- `message` (String): Message text

**Returns:**
- Promise: Message sending result

##### storeSession()
Stores the current session.

**Parameters:**
- None

**Returns:**
- Boolean: Success status

### TelegramIntegration

#### Initialization
```javascript
const telegramIntegration = new TelegramIntegration();
telegramIntegration.initialize({
  notificationEnabled: true,
  autoReply: false
});
```

#### Methods

##### connect(username)
Connects to Telegram with a username.

**Parameters:**
- `username` (String): Telegram username

**Returns:**
- Promise: Connection result

##### sendMessage(chatId, message)
Sends a Telegram message.

**Parameters:**
- `chatId` (String): Chat identifier
- `message` (String): Message text

**Returns:**
- Promise: Message sending result

##### registerMessageHandler(type, handler)
Registers a message handler.

**Parameters:**
- `type` (String): Message type
- `handler` (Function): Handler function

**Returns:**
- Boolean: Success status

## UI Theme API

### CosmicTheme

#### Initialization
```javascript
const cosmicTheme = new CosmicTheme();
cosmicTheme.initialize({
  defaultMode: 'auto',
  animationSpeed: 'normal',
  starDensity: 'medium',
  accentColor: 'nebula'
});
```

#### Methods

##### applyTheme()
Applies the current theme settings.

**Parameters:**
- None

**Returns:**
- Boolean: Success status

##### getAccentColor()
Gets the current accent color.

**Parameters:**
- None

**Returns:**
- String: Hex color code

##### showSettingsUI()
Shows the theme settings UI.

**Parameters:**
- None

**Returns:**
- Void

##### saveSettings()
Saves the current theme settings.

**Parameters:**
- None

**Returns:**
- Boolean: Success status
