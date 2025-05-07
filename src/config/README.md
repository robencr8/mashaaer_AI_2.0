# Mashaaer Enhanced Configuration System

This directory contains the configuration system for the Mashaaer Enhanced Project. The configuration system uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to search for and load configuration from various sources.

## Overview

The configuration system allows you to configure various aspects of the Mashaaer Enhanced Project, including:

- Theme settings
- Assistant preferences
- Emotion detection settings
- Integration configurations
- Subscription plans
- System settings

## How It Works

The configuration system uses cosmiconfig to search for configuration in the following places (in order):

1. A `mashaaer` property in `package.json`
2. A `.mashaaerrc` file in JSON or YAML format
3. A `.mashaaerrc.json`, `.mashaaerrc.yaml`, `.mashaaerrc.yml`, `.mashaaerrc.js`, or `.mashaaerrc.cjs` file
4. A `mashaaerrc`, `mashaaerrc.json`, `mashaaerrc.yaml`, `mashaaerrc.yml`, `mashaaerrc.js`, or `mashaaerrc.cjs` file inside a `.config` subdirectory
5. A `mashaaer.config.js` or `mashaaer.config.cjs` CommonJS module exporting an object

The configuration system will use the first configuration it finds. If no configuration is found, it will use default values.

## Usage

### In Your Application

```javascript
const configManager = require('./config/config');

// Initialize the configuration (async)
async function initializeApp() {
  await configManager.initialize();
  const config = configManager.getConfig();
  console.log('Configuration:', config);
  
  // Get specific configuration values
  const accentColor = configManager.get('theme.accentColor', 'neutral');
  const defaultDialect = configManager.get('assistant.defaultDialect', 'khaliji');
}

// Or initialize synchronously
function initializeAppSync() {
  configManager.initializeSync();
  const config = configManager.getConfig();
  console.log('Configuration:', config);
}
```

### Configuration File Example

Create a `mashaaer.config.js` file in your project root:

```javascript
module.exports = {
  // Theme configuration
  theme: {
    accentColor: 'warm',
    animationSpeed: 'normal',
    starDensity: 'high',
    starShape: 'star',
  },
  
  // Assistant configuration
  assistant: {
    defaultDialect: 'khaliji',
    defaultTone: 'cheerful',
    defaultVoiceProfile: 'GULF_FEMALE_ARIA',
  },
  
  // Emotion detection configuration
  emotion: {
    detectionEnabled: true,
    timelineEnabled: true,
    culturalContextEnabled: true,
    // Advanced emotion detection settings
    advanced: {
      sensitivityLevel: 'high',
      contextAwareness: true,
      dialectSpecificPatterns: true,
    }
  },
  
  // Other configurations...
};
```

Or use a `.mashaaerrc` file:

```json
{
  "theme": {
    "accentColor": "warm",
    "animationSpeed": "normal",
    "starDensity": "high",
    "starShape": "star"
  },
  "assistant": {
    "defaultDialect": "khaliji",
    "defaultTone": "cheerful",
    "defaultVoiceProfile": "GULF_FEMALE_ARIA"
  }
}
```

## API Reference

### ConfigManager

#### `initialize()`

Asynchronously initializes the configuration manager. Searches for configuration in various places and loads it.

Returns: `Promise<Object>` - The loaded configuration

#### `initializeSync()`

Synchronously initializes the configuration manager.

Returns: `Object` - The loaded configuration

#### `getConfig()`

Gets the current configuration.

Returns: `Object` - The current configuration

#### `get(key, defaultValue = null)`

Gets a specific configuration value.

- `key` (string): The configuration key (dot notation supported)
- `defaultValue` (any): The default value to return if the key is not found

Returns: `any` - The configuration value

#### `getDefaultConfig()`

Gets the default configuration.

Returns: `Object` - The default configuration

## Configuration Schema

The configuration object has the following structure:

```javascript
{
  theme: {
    accentColor: String,
    animationSpeed: String,
    starDensity: String,
    starShape: String,
  },
  assistant: {
    defaultDialect: String,
    defaultTone: String,
    defaultVoiceProfile: String,
  },
  emotion: {
    detectionEnabled: Boolean,
    timelineEnabled: Boolean,
    culturalContextEnabled: Boolean,
    advanced: {
      sensitivityLevel: String,
      contextAwareness: Boolean,
      dialectSpecificPatterns: Boolean,
    }
  },
  integration: {
    paypal: {
      enabled: Boolean,
      sandboxMode: Boolean,
      clientId: String,
      currency: String,
    },
    whatsapp: {
      enabled: Boolean,
      qrCodeRefreshInterval: Number,
      autoReconnect: Boolean,
    },
    telegram: {
      enabled: Boolean,
      botToken: String,
    },
  },
  subscription: {
    trialPeriodDays: Number,
    referralBonusDays: Number,
    plans: Array,
  },
  system: {
    debugMode: Boolean,
    logLevel: String,
    performanceMonitoring: Boolean,
    errorReporting: Boolean,
  }
}
```