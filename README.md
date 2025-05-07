# Mashaaer Enhanced Project (Production Release)

## Overview
Mashaaer Enhanced is an advanced Arabic voice assistant with emotion detection, dialect support, and smart personal assistance capabilities. This project enhances the original Mashaaer application with additional features including subscription plans, integration with popular platforms, and a cosmic-themed UI.

## Production Release Information
This is the official production release (v1.0.0) of the Mashaaer Enhanced Project. After extensive testing and refinement through alpha and release candidate phases, we're proud to present a stable, feature-complete version with production-ready capabilities:

- **Production-Ready Authentication**: Fully implemented JWT-based authentication system with secure token handling
- **Complete Subscription System**: Finalized subscription tiers with proper usage limits enforcement
- **Comprehensive Security**: Protected API endpoints with proper authentication and authorization
- **Production Logging System**: Centralized logging with remote capabilities for production monitoring
- **Enhanced Reporting System**: Complete report generation with preview, multiple export formats, and clipboard integration

### Feedback and Support
We welcome your feedback on this production release. For support or to provide feedback:
1. Use the in-app support form (available in the System Status panel)
2. Submit issues on our GitHub repository
3. Contact our support team at support@mashaaer.com

For enterprise support options, please visit our website at https://mashaaer.com/enterprise

## Unique Value Proposition
Mashaaer stands out as the first Arabic-focused emotional intelligence assistant that combines:

- **Cultural Context Awareness**: Unlike generic AI assistants, Mashaaer understands Arabic cultural nuances and dialect variations, providing responses that resonate with users' cultural backgrounds.
- **Emotional Intelligence**: The system not only detects emotions but responds appropriately to them, creating a more human-like interaction experience.
- **Memory and Learning**: Mashaaer remembers past interactions and learns from them, building a relationship with the user over time.
- **Multi-modal Interaction**: Users can interact through text, voice, or facial expressions, making the experience more natural and accessible.
- **Privacy-Focused Design**: All processing can be done locally, ensuring user data remains private and secure.

### Problems Solved
- **Language Barrier**: Most AI assistants have limited Arabic support and poor understanding of dialectal variations
- **Emotional Disconnect**: Traditional assistants lack emotional intelligence and cultural context
- **Privacy Concerns**: Cloud-based assistants raise data privacy issues
- **Integration Complexity**: Difficulty connecting emotional analysis with practical applications

## Key Features

### Enhanced Emotion Detection
- Cultural context awareness for more accurate emotion recognition
- Support for various Arabic dialects
- Emotion timeline tracking and visualization
- Automatic emotion detection in Arabic text

### Voice Personality
- Customizable voice personalities
- Dialect-specific speech patterns
- Emotion-responsive voice modulation
- Automatic persona switching based on detected emotions

### Smart Personal Assistant
- Natural language understanding
- Contextual awareness
- Personalized responses
- Multi-dialect support

### Integration Modules
- PayPal integration for subscription payments
- WhatsApp integration for messaging and notifications
- Telegram integration for bot interactions

### Cosmic UI Theme
- Dark space background with star effects
- Celestial color palette
- Animated UI transitions
- Responsive design for all devices

### Subscription System
- Free trial period
- Multiple subscription tiers
- Referral program

### System Reporting
- Comprehensive system status reporting
- Component health monitoring
- User profile information
- Emotion statistics summary
- Performance metrics
- Feature availability based on subscription
- Interactive report preview before download
- Multiple export formats (JSON, Markdown, PDF)
- Copy to clipboard functionality
- Responsive report UI with real-time updates

## Recent Updates

### Modular Architecture Refactoring (New)
- Implemented a services-based architecture for better modularity and maintainability
- Created dedicated services for emotion detection, assistant, API, voice, memory, config, and theme
- Used dependency injection instead of global objects for better testability
- Added React Context API for accessing services throughout the component tree
- Separated business logic from UI components
- Extracted styles to separate CSS files

### React-Flask Integration (New)
- Integration with Flask backend via `/ask` endpoint
- Display of responses, character, and Mashaaer voice in React
- Fallback to local processing when backend is unavailable

### Text-to-Speech Enhancement (New)
- TTS button for each assistant message
- Integration with Flask TTS endpoint (`/api/tts`)
- Toggle between Flask TTS and Web Speech API
- Emotion-aware voice modulation

### Progressive Web App Support (New)
- Offline functionality with service worker caching
- Voice response caching for offline TTS playback
- Installable on devices via manifest.json
- Responsive design for all screen sizes
- Background sync for offline messages
- Production mode optimization for better performance

### Single-Package Distribution (New)
- Complete packaging of React + Flask + Models
- Windows executable (.exe) for easy distribution
- Automatic startup script for user convenience
- Comprehensive documentation

### Persona AutoSwitcher
- Automatically switches between different personas based on detected emotions
- Maps emotions (joy, sadness, anger, fear) to appropriate personas (funny friend, caring, advisor, poet)
- Enhances user experience by providing contextually appropriate responses

### Response Shaper
- Shapes responses based on detected emotions
- Adds empathetic prefixes to responses
- Makes responses more human-like and emotionally intelligent

### Memory Reactor
- Tracks emotional changes across a conversation
- Identifies dominant emotions in a session
- Provides insights about emotional trends
- Generates contextual reactions based on emotional history

### Enhanced Integration Flow
- Improved fallback_brain function that integrates all modules
- Sequential processing: response generation → emotion detection → persona switching → response shaping → memory reaction
- Comprehensive result with emotional context and memory insights

### Memory Indexer (New)
- Advanced indexing and retrieval capabilities for the memory system
- Keyword-based memory indexing for efficient searching
- Semantic categorization of memories
- Temporal indexing for time-based retrieval
- Emotional context indexing for emotion-based queries
- Cross-referencing between related memories

### System Metrics (New)
- Comprehensive system performance and health monitoring
- Real-time tracking of CPU, memory usage, and response times
- Usage statistics including active users and requests per minute
- Module activation tracking and execution time analysis
- Error rate monitoring and categorization
- System health assessment with component-level details
- Trend analysis for performance metrics over time

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/mashaaer-enhanced.git
```

2. Navigate to the project directory:
```
cd mashaaer-enhanced
```

3. Install dependencies using the setup script (recommended):
```
.\setup.bat
```
OR
```
npm run setup
```

This setup script will:
- Install dependencies with the --legacy-peer-deps flag
- Properly enforce package resolutions specified in package.json
- Handle installation errors with automatic retries
- Fall back to clean reinstall if needed

4. Start the application:
```
.\start-full.bat
```
OR
```
npm start
```
OR
```
npm run dev
```

The `start-full.bat` script will:
- Start both the backend (Flask) and frontend (React) components
- Set up all necessary environment variables
- Fix common issues with tokenizers and runtime
- Handle installation errors with automatic retries

For more details, see [README.start-full.md](README.start-full.md).

For a complete list of available npm scripts and how to use them, see [NPM_SCRIPTS.md](NPM_SCRIPTS.md).

### Alternative Installation Methods

#### Standard npm install (if setup script fails)
```
npm install --legacy-peer-deps
```

#### Clean Reinstall (for persistent issues)
If you encounter persistent installation problems:
```
node scripts/clean-reinstall.js
```

This script will:
1. Remove node_modules and package-lock.json
2. Clean npm cache
3. Reinstall dependencies with proper configuration

### Python Backend Dependencies

The backend requires several Python packages including `transformers` and `tokenizers`. To install these dependencies:

```
cd backend
pip install -r requirements.txt
```

#### Troubleshooting Tokenizers Installation

If you encounter issues installing the `tokenizers` package (especially on Python 3.13+ or systems without Rust compiler), use our fix script:

```
.\fix-tokenizers-install.bat
```

This script will handle the installation in a way that works around the Rust compiler requirement. For more details, see [TOKENIZERS_INSTALL_FIX.md](TOKENIZERS_INSTALL_FIX.md).

#### Troubleshooting Frontend Dependencies Installation

If you encounter issues with the frontend dependencies installation or if the application is not working, use our fix script:

```
.\fix-npm-install.bat
```

This script will:
1. Clean up existing node_modules and package-lock.json
2. Enable proper resolution of dependency conflicts
3. Install critical dependencies with compatible versions
4. Configure webpack polyfills correctly
5. Reinstall all dependencies with the legacy OpenSSL provider

After running this script, you should be able to start the application normally with `.\start-mashaaer.ps1`.

For detailed information about the npm installation fix and the setup process, see [NPM_INSTALLATION_FIX.md](NPM_INSTALLATION_FIX.md).

#### Fixing Blank Page Issue

If you see a blank page when accessing the application, it might be because the React frontend build files are not properly copied to the Flask backend's static directory. To fix this issue, use one of our fix scripts:

For Command Prompt:
```
.\fix-blank-page.bat
```
or
```
.\frontend-build.bat
```

For PowerShell:
```
.\fix-blank-page.ps1
```
or
```
.\frontend-build.ps1
```

These scripts will:
1. Install dependencies
2. Build the React frontend
3. Copy the build files to the Flask backend's static directory
4. Create necessary template files

If you still see a blank page after running these scripts, you may need to fix the file paths in the launch.html template:

```
.\fix-frontend-paths.ps1
```
or
```
fix-frontend-paths.bat
```

After running one of these scripts, you should be able to access the application at http://127.0.0.1:5000.

For detailed information about this issue and the fix, see [REACT_FLASK_BUILD_GUIDE.md](REACT_FLASK_BUILD_GUIDE.md), [FRONTEND_BUILD_GUIDE.md](FRONTEND_BUILD_GUIDE.md), or [BLANK_PAGE_FIX.md](BLANK_PAGE_FIX.md).

#### Fixing MODULE_NOT_FOUND Errors with Lodash

If you encounter MODULE_NOT_FOUND errors related to lodash (e.g., "Cannot find module './_baseIsNative'"), use our dedicated fix script:

```
.\fix-lodash-error.bat
```

This script will:
1. Check your Node.js version for compatibility (Node.js v22+ may cause issues)
2. Clean node_modules and package-lock.json
3. Reinstall dependencies with the correct configuration
4. Verify that all critical packages and lodash modules are properly installed

This error is common when using Node.js v22+ with older libraries like react-scripts or html-webpack-plugin that depend on lodash.

For detailed information about this issue and the fix, see [LODASH_ERROR_FIX.md](LODASH_ERROR_FIX.md).

#### Fixing React Dev Utils Issues

If you encounter an error related to missing `react-dev-utils/getPublicUrlOrPath` when starting the application, use our dedicated fix script:

```
.\fix-react-dev-utils.bat
```

Or if you prefer PowerShell:

```
.\fix-react-dev-utils.ps1
```

This script will:
1. Remove the existing react-dev-utils package
2. Clean the npm cache
3. Reinstall react-dev-utils with the correct version
4. Verify that all required files are present

After running this script, you should be able to start the application normally with `npm start`.

You can also run the fix directly with npm:

```
npm run fix:react-dev-utils
```

For detailed information about this issue and the fix, see [REACT_DEV_UTILS_FIX.md](REACT_DEV_UTILS_FIX.md).

## Usage

### Basic Usage
Open the application in a web browser and interact with the assistant using voice or text input.

### Voice Commands
- "مرحبا" (Hello) - Greet the assistant
- "كيف حالك" (How are you) - Ask about the assistant's status
- "ما هو الطقس اليوم" (What's the weather today) - Ask about weather
- "تشغيل الموسيقى" (Play music) - Control media playback

### Subscription Features
- Basic tier: Emotion detection, voice customization
- Premium tier: All features including dialect support, integrations

## Detailed Use Cases

### 1. Customer Support Emotion Analysis
**Scenario**: A company uses Mashaaer to analyze customer support emails in Arabic.

**Example Implementation**:
```javascript
// Analyze incoming customer support email
const emailContent = "أنا غاضب جدًا لأن المنتج الذي اشتريته لا يعمل بشكل صحيح";
const emotionAnalysis = detectEmotion(emailContent);

// Generate appropriate response based on detected emotion
if (emotionAnalysis.type === 'angry' && emotionAnalysis.confidence > 0.7) {
  // Prioritize this customer's issue and route to senior support
  customerTicket.priority = 'high';
  customerTicket.assignTo = 'senior-support-team';

  // Generate empathetic response
  const response = `نأسف جدًا لتجربتك السلبية. نحن نتفهم إحباطك ونود حل المشكلة فورًا. سيتواصل معك أحد كبار المختصين خلال ساعة.`;
}
```

### 2. Dialect-Aware Virtual Assistant
**Scenario**: A government portal serving citizens from different Arabic-speaking regions.

**Example Implementation**:
The system automatically detects the user's dialect from their input and adjusts responses accordingly:
# Mashaaer Enhanced Project

## Installation Instructions

### Clean Installation (Recommended)

If you encounter any installation issues or need to start fresh:

#### Option 1: Using the included script
- **Egyptian Dialect Input**: "عايز أعرف إزاي أقدم على الخدمة دي"
- **System Response**: "ممكن تقدم على الخدمة دي من خلال الموقع الإلكتروني أو التطبيق. محتاج مساعدة تانية؟"

- **Gulf Dialect Input**: "أبغى أعرف كيف أقدم على هالخدمة"
- **System Response**: "تقدر تقدم على الخدمة من خلال الموقع الإلكتروني أو التطبيق. تبغى مساعدة ثانية؟"

### 3. Emotional Health Monitoring
**Scenario**: A mental health application that tracks user emotional states over time.

**Example Implementation**:
```javascript
// Track emotional states over time
const emotionTimeline = window.mashaaerComponents.emotionalMemory.getEmotionalTrend();

// Analyze trends
const dominantEmotion = emotionTimeline[0].emotion;
const emotionalTrend = emotionTimeline.map(entry => entry.trend);

// Generate insights
if (dominantEmotion === 'sad' && emotionalTrend.filter(e => e === 'sad').length > 3) {
  // Suggest mood-improving activities
  suggestActivity('تمارين التنفس العميق');
  suggestActivity('المشي في الهواء الطلق');

  // Offer professional resources if appropriate
  if (user.preferences.healthSupport) {
    offerProfessionalResources();
  }
}
```

### 4. Personalized Learning Assistant
**Scenario**: An educational platform that adapts to student emotional states.

**Example Implementation**:
When a student shows frustration with a difficult math problem, the system:
1. Detects the frustration emotion from text input: "مش فاهم حاجة من المسألة دي!"
2. Adjusts the teaching approach:
   - Breaks down the problem into smaller steps
   - Uses more encouraging language: "أنت قريب من الحل، دعنا نحاول بطريقة أخرى..."
   - Offers a different explanation method based on the student's learning style
3. Monitors emotional response to the new approach and further adapts if needed

### 5. Multi-Modal Business Meeting Assistant
**Scenario**: A virtual meeting assistant that captures and analyzes emotions during business discussions.

**Example Implementation**:
During a virtual business meeting:
1. The system analyzes facial expressions of participants (premium feature)
2. Detects voice tone and emotional cues in speech
3. Provides real-time insights to the meeting facilitator:
   - "3 participants showed confusion during the technical explanation"
   - "Excitement levels increased when discussing the new product features"
4. Generates a post-meeting report with emotional engagement metrics and recommendations for follow-up

## System Architecture and Workflows

### Component Interaction Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User Interface │     │  Core Services  │     │ External Systems│
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Voice/Text Input│────▶│Emotion Detection│     │  Flask Backend  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       ▼                       │
┌────────▼────────┐     ┌─────────────────┐     ┌────────▼────────┐
│ UI Components   │◀────│ Memory System   │     │  LLM Processing │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       ▼                       │
┌────────▼────────┐     ┌─────────────────┐     ┌────────▼────────┐
│Response Display │◀────│Assistant Service│◀────│ API Integration │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Key Workflow Processes

#### 1. User Input Processing Flow

1. User provides input via text or voice
2. Input is processed for emotion detection
3. Detected emotion is stored in memory system
4. Input is sent to the assistant service
5. Assistant service queries the Flask backend or fallback LLM
6. Response is generated with appropriate emotional context
7. Response is displayed to the user with matching emotional tone

#### 2. Emotion Detection and Response Flow

```
User Input ──▶ Text Analysis ──▶ Emotion Classification ──▶ Intensity Scoring
                                          │
                                          ▼
Response Generation ◀── Persona Selection ◀── Memory Context ◀── Cultural Context
       │
       ▼
Voice Modulation ──▶ UI Adaptation ──▶ Response Delivery
```

#### 3. Memory System Workflow

1. New interaction is received
2. Episodic memory stores the specific interaction details
3. Memory indexer categorizes and indexes the memory
4. Semantic memory extracts and stores general knowledge
5. Memory consolidation periodically processes and optimizes stored memories
6. Related memories are cross-referenced for faster retrieval
7. Memory retrieval provides context for future interactions

## System Bootstrapping

The project includes a comprehensive bootstrapping process that initializes all system components in the correct order. This process ensures proper dependency management and error handling.

To bootstrap the entire system:

```powershell
# Run with administrator privileges
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
```

The bootstrapping process:
1. Starts the backend server
2. Initializes backend components
3. Starts the frontend application
4. Initializes frontend services
5. Monitors system health

For detailed information about the bootstrapping process, see the [Bootstrapping Documentation](docs/BOOTSTRAPPING.md).

## Development

### Project Structure
- `/src` - Source code
  - `/api` - API services including Flask backend integration
  - `/assistant` - Smart personal assistant
  - `/config` - Configuration system using cosmiconfig
  - `/context` - React context providers for services
  - `/emotion` - Emotion detection and timeline
  - `/integration` - Third-party integrations
  - `/services` - Service modules for business logic
    - `/api` - API service
    - `/assistant` - Assistant service
    - `/config` - Configuration service
    - `/emotion` - Emotion service
    - `/memory` - Memory service
    - `/theme` - Theme service
    - `/voice` - Voice service
  - `/static` - Static assets including voice module
  - `/ui` - User interface components
  - `/utils` - Utility modules including system reporting
  - `/voice` - Voice personality
- `/public` - Public assets
  - `manifest.json` - PWA manifest file
  - `service-worker.js` - Service worker for offline functionality
- `/docs` - Documentation
- `/tests` - Test suite
- `/backend` - Flask backend with memory store
  - `memory_indexer.py` - Advanced memory indexing and retrieval
  - `system_metrics.py` - System performance and health monitoring
- `/packaging` - Packaging scripts for distribution

## Performance Considerations

### Resource Optimization

Mashaaer is designed with performance in mind, particularly for Arabic language processing which can be resource-intensive. Key performance optimizations include:

1. **Lazy Loading of Components**
   - Heavy components like facial emotion detection are loaded only when needed
   - Models are loaded progressively based on user interaction patterns

2. **Memory Management**
   - Automatic memory consolidation to prevent unbounded growth
   - Configurable limits on memory storage size
   - Periodic cleanup of unused memories

3. **Processing Optimization**
   - Local processing for sensitive operations to reduce latency
   - Batched API calls to external services
   - Caching of frequently accessed data and responses

4. **Response Time Targets**
   - Text analysis: < 100ms for basic emotion detection
   - Voice processing: < 300ms for real-time interaction
   - Complex responses: < 1.5s for full context-aware responses

### Performance Monitoring

The system includes built-in performance monitoring through the `SystemMetrics` module:

```javascript
// Access performance metrics
const metrics = await fetch('/api/metrics').then(res => res.json());

// Example metrics available
console.log(`Average response time: ${metrics.performance.avgResponseTime}ms`);
console.log(`Memory usage: ${metrics.performance.memoryUsage}MB`);
console.log(`Active users: ${metrics.usage.activeUsers}`);
```

## Scaling Strategy

Mashaaer is designed to scale from individual users to enterprise deployments:

### Horizontal Scaling

1. **Microservices Architecture**
   - Each major component (emotion detection, memory system, etc.) can be deployed as a separate service
   - Services can be scaled independently based on demand

2. **Stateless Design**
   - Core processing components are stateless for easy replication
   - User state is maintained in dedicated storage services

3. **Load Balancing**
   - API gateway routes requests to appropriate service instances
   - Automatic distribution of processing load across available resources

### Vertical Scaling

1. **Resource Allocation**
   - Memory allocation can be increased for larger knowledge bases
   - CPU allocation can be adjusted for more complex emotion processing

2. **Model Complexity Tiers**
   - Basic tier: Lightweight models suitable for edge devices
   - Standard tier: Balanced models for most deployments
   - Advanced tier: Complex models for enterprise use cases

### Multi-Region Deployment

For global deployments, Mashaaer supports multi-region configuration:

1. **Region-Specific Models**
   - Dialect models optimized for specific regions
   - Cultural context adapters for regional variations

2. **Data Residency Compliance**
   - User data can be kept in specific regions for compliance
   - Processing can be restricted to specific geographic areas

3. **Latency Optimization**
   - Edge caching for frequently accessed resources
   - Regional API endpoints for reduced latency

### Deployment

#### Standard Deployment
For production deployment, use the provided PowerShell script:

```powershell
# Run with administrator privileges
powershell -ExecutionPolicy Bypass -File e2e_deploy.ps1
```

The deployment script:
1. Checks for required tools (Node.js, npm, Python, pip)
2. Uses production environment configuration if available (.env.production)
3. Installs dependencies for both frontend and backend
4. Runs tests to ensure everything is working correctly
5. Builds the frontend for production
6. Prepares the application for deployment

For specific hosting platforms (AWS, Heroku, etc.), uncomment and configure the relevant deployment commands in the script.

#### Single-Package Distribution (New)
To package the entire application (React + Flask + Models) into a single executable:

```powershell
# Navigate to the packaging directory
cd packaging

# Run the packaging script
.\package-app.ps1
```

The packaging script:
1. Builds the React frontend for production
2. Sets up a Python virtual environment and installs dependencies
3. Creates a PyInstaller spec file for the Flask backend
4. Packages everything into a single executable
5. Creates a zip archive for distribution

The packaged application will be available in `packaging/dist/MashaaerEnhanced-1.0.0.zip`.

## API Documentation

Mashaaer provides comprehensive APIs for integration with other applications and services.

### Core APIs

#### Emotion Detection API

```javascript
// Import the emotion detection module
import { detectEmotion } from '../emotion/enhanced-emotion-detection.js';

// Detect emotion in text
const emotion = detectEmotion("أنا سعيد جدًا بهذا الخبر");
console.log(emotion); // { type: 'happy', confidence: 0.85 }

// Use the emotion in your application
if (emotion.type === 'happy' && emotion.confidence > 0.7) {
  // Respond to happy emotion
}
```

#### Assistant API

```javascript
// Import the assistant module
import SmartPersonalAssistant from '../assistant/smart-personal-assistant.js';

// Create and initialize an assistant instance
const assistant = new SmartPersonalAssistant({
  language: 'ar',
  voiceEnabled: true,
  emotionAware: true
});
assistant.initialize();

// Process a user message
const response = await assistant.handleUserMessage("كيف يمكنني تحسين مزاجي اليوم؟");
console.log(response);
// {
//   text: "يمكنك تحسين مزاجك من خلال ممارسة الرياضة أو الاستماع إلى الموسيقى...",
//   emotion: { type: 'neutral', confidence: 0.6 },
//   tone: 'cheerful',
//   pitch: 1.2,
//   model: 'flask-backend'
// }
```

### Backend REST APIs

The Flask backend provides RESTful APIs for memory management and system metrics:

#### Memory API Endpoints

| Endpoint | Method | Description | Example Request |
|----------|--------|-------------|----------------|
| `/api/memory/episodic` | POST | Store an episodic memory | `{ "input": "user message", "response": "system response", "emotion": "happy" }` |
| `/api/memory/episodic` | GET | Retrieve episodic memories | Query params: `text`, `emotion`, `limit` |
| `/api/memory/semantic/:category` | POST | Store a semantic memory | `{ "key": "name", "value": "John" }` |
| `/api/memory/semantic/:category` | GET | Retrieve semantic memories | Query param: `key` (optional) |
| `/api/memory/user/summary` | GET | Get user summary | N/A |
| `/api/memory/search` | GET | Search memories | Query params: `query`, `category`, `emotion`, `time_period` |

#### System Metrics API

| Endpoint | Method | Description | Example Response Fields |
|----------|--------|-------------|------------------------|
| `/api/metrics` | GET | Get system metrics | `performance`, `usage`, `modules`, `errors`, `health` |
| `/api/metrics/record` | POST | Record system event | `{ "type": "request\|module\|error", "data": {} }` |

### WebSocket Events

For real-time updates, Mashaaer provides WebSocket events:

```javascript
// Connect to WebSocket
const socket = new WebSocket('ws://localhost:5000/ws');

// Listen for emotion updates
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'emotionUpdate') {
    console.log('New emotion detected:', data.emotion);
    updateUI(data.emotion);
  }
});

// Send user input via WebSocket
function sendMessage(text) {
  socket.send(JSON.stringify({
    type: 'userMessage',
    text: text
  }));
}
```

## Security Considerations

### Data Protection

Mashaaer implements several layers of data protection:

1. **Local Processing**
   - Sensitive data is processed locally when possible
   - Personal information is stored on the user's device by default

2. **Encryption**
   - All communication with external services uses TLS/SSL
   - Stored data is encrypted at rest using AES-256
   - Memory store files use encrypted format

3. **Data Minimization**
   - Only necessary data is collected and stored
   - Automatic data pruning removes unnecessary historical data
   - Users can configure data retention policies

### Authentication and Authorization

1. **User Authentication**
   - Production-ready JWT-based authentication for API access
   - Token validation and expiration handling with automatic refresh
   - Secure token storage and transmission
   - OAuth2 integration for third-party service access
   - Session management with automatic expiration

2. **Permission Levels**
   - Role-based access control for multi-user deployments
   - Feature access tied to subscription levels
   - Granular API permissions
   - Subscription-based usage limits enforcement

3. **API Security**
   - Protected sensitive endpoints (/api/tts, /ask)
   - Authentication token required for all API requests
   - Subscription plan validation for API access
   - Rate limiting based on subscription tier

### Production Logging

1. **Centralized Logging**
   - Comprehensive logging system for production environments
   - Remote logging with secure transmission
   - Configurable log levels and filtering
   - Batch logging with automatic flushing

2. **Session Analysis**
   - Detailed session tracking and analysis
   - User interaction logging for behavior analysis
   - Performance monitoring and bottleneck identification
   - Error tracking with context information

3. **Monitoring Dashboard**
   - Real-time system status monitoring
   - Usage statistics and trends
   - Error rate visualization
   - Resource utilization tracking

### Vulnerability Prevention

1. **Input Validation**
   - All user inputs are sanitized to prevent injection attacks
   - API parameters are strictly validated
   - Rate limiting prevents abuse

2. **Dependency Management**
   - Regular security audits of dependencies
   - Automated vulnerability scanning in CI/CD pipeline
   - Prompt patching of identified vulnerabilities

For detailed security information, see the [Security Documentation](SECURITY.md).

## Interactive Documentation

Mashaaer provides interactive documentation to help developers understand and use the system:

1. **Swagger UI**
   - Available at `/docs` when running in development mode
   - Try API endpoints directly from the browser
   - View request/response schemas

2. **Component Playground**
   - Available at `/playground` in development mode
   - Experiment with UI components and their properties
   - Test emotion detection with live examples

3. **Tutorial Mode**
   - Step-by-step guides for common integration scenarios
   - Interactive code examples with editable parameters
   - Live result preview

To access the interactive documentation, start the application in development mode and navigate to the `/docs` or `/playground` endpoints.

### Configuration
The application uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration management. You can configure the application in several ways:

1. Create a `mashaaer.config.js` file in the project root:
```js
module.exports = {
  theme: {
    accentColor: 'warm',
    starDensity: 'high',
  },
  assistant: {
    defaultDialect: 'khaliji',
    defaultTone: 'cheerful',
  },
  // See /src/config/README.md for full configuration options
};
```

2. Add a `.mashaaerrc` file in JSON or YAML format
3. Add a `mashaaer` property in your `package.json`

For detailed configuration options, see the [configuration documentation](/src/config/README.md).

### Feature Management

The application includes a robust feature management system that allows for controlled rollout of new features and enterprise-specific customizations.

#### Feature Configuration

To configure features, add a `features` section to your configuration:

```js
module.exports = {
  // Other configuration...

  // Feature management configuration
  features: {
    enabled: true,
    featureFlags: [
      {
        id: 'advanced-emotion-detection',
        name: 'Advanced Emotion Detection',
        enabled: true,
        description: 'Enhanced emotion detection with improved accuracy and dialect support',
        requiredSubscription: 'premium'
      },
      {
        id: 'memory-indexer',
        name: 'Memory Indexer',
        enabled: true,
        description: 'Advanced memory indexing and retrieval capabilities',
        requiredSubscription: 'basic'
      },
      {
        id: 'voice-personality-v2',
        name: 'Voice Personality V2',
        enabled: true,
        description: 'Next generation voice personality with improved emotion response',
        requiredSubscription: 'premium'
      }
    ],
    telemetryEnabled: true
  }
};
```

#### Feature Access Control

Features are managed by the `FeatureService`, which provides methods to check if features are enabled based on subscription level and configuration.

To check if a feature is enabled in your code:

```javascript
// Using the featureService directly
if (featureService.isFeatureEnabled('advanced-emotion-detection')) {
  // Use the advanced emotion detection feature
}

// Or using the services context in React components
const { featureService } = useServices();
if (featureService.isFeatureEnabled('memory-indexer')) {
  // Use the memory indexer feature
}
```

#### Feature Status

The system status panel displays information about available features, including which ones are enabled for your subscription level. To view this information, click on the System Status panel to expand it.

### Running Tests

#### Comprehensive Testing

The project includes comprehensive testing capabilities to ensure all components of the application are functioning correctly:

```bash
# Run all tests (app, emotion, UI, backend)
npm run test:all

# Run specific test suites
npm run test:app      # Test all app functions
npm run test:emotion  # Test emotion detection
npm run test:ui       # Test UI components
npm run test:backend  # Test backend functionality
```

#### Quick App Testing

For a quick test of all app functions, you can use the provided batch file:

```bash
# Simply double-click this file in the project root
run-app-test.bat
```

This will run a comprehensive test of all application components and provide a detailed report.

For detailed information about testing app functions, see [TEST_APP_FUNCTIONS.md](TEST_APP_FUNCTIONS.md).

#### Legacy Tests
```
cd tests
node run-tests.js
```

## Documentation

- [Setup Guide](SETUP_GUIDE.md) - Instructions for setting up the project
- [NPM Installation Fix](NPM_INSTALLATION_FIX.md) - Detailed information about the npm installation fix and setup process
- [React Dev Utils Fix](REACT_DEV_UTILS_FIX.md) - Guide for fixing the react-dev-utils missing module issue
- [Security Information](SECURITY.md) - Security status and recommendations
- [Flask Integration](docs/FLASK_INTEGRATION.md) - Details about the Flask backend integration
- [PWA Guide](docs/PWA_GUIDE.md) - Information about the Progressive Web App features
- [PWA Voice Caching](docs/PWA_VOICE_CACHING.md) - Guide for offline voice caching in production mode
- [Bootstrapping Documentation](docs/BOOTSTRAPPING.md) - Details about the system bootstrapping process
- [Architectural Patterns](docs/PATTERNS.md) - Information about the architectural patterns used in the project
- [Console Error Handling](docs/CONSOLE_ERROR_HANDLING.md) - Guide for handling console errors from browser extensions
- [Testing App Functions](TEST_APP_FUNCTIONS.md) - Comprehensive guide for testing all application functions
- 📄 [Improvement Plan](docs/plan.md) - Comprehensive roadmap for enhancing the project with rationale for each proposed change

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Original Mashaaer project team
- Contributors to the enhanced version
