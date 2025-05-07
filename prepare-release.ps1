# Prepare Release Script for Mashaaer Enhanced Project
# This script prepares the release directory structure as described in the issue description

# Configuration
$appName = "MashaaerEnhanced"
$appVersion = "1.0.0"
$releaseDir = "release"
$distDir = "dist"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Mashaaer Enhanced Project - Prepare Release" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create release directory structure
Write-Host "Step 1: Creating release directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
New-Item -ItemType Directory -Force -Path "$releaseDir\docs" | Out-Null

# Step 2: Check if distributable files exist, if not create them
Write-Host "Step 2: Checking for distributable files..." -ForegroundColor Cyan
$installerPath = Get-ChildItem -Path $distDir -Filter "*.exe" -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1 -ExpandProperty FullName

if (-not $installerPath) {
    Write-Host "Distributable files not found. Running create-distributable.ps1..." -ForegroundColor Yellow
    .\create-distributable.ps1
    
    # Check again for the installer
    $installerPath = Get-ChildItem -Path $distDir -Filter "*.exe" -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1 -ExpandProperty FullName
    
    if (-not $installerPath) {
        Write-Host "❌ Failed to create distributable files" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Distributable files found" -ForegroundColor Green

# Step 3: Copy installer to release directory
Write-Host "Step 3: Copying installer to release directory..." -ForegroundColor Cyan
$installerName = "Mashaaer-Enhanced-Setup-v$appVersion.exe"
Copy-Item -Path $installerPath -Destination "$releaseDir\$installerName" -Force
Write-Host "✅ Installer copied to release directory" -ForegroundColor Green

# Step 4: Create or copy LICENSE.txt
Write-Host "Step 4: Creating LICENSE.txt..." -ForegroundColor Cyan
$licenseContent = @"
MIT License

Copyright (c) 2025 Mashaaer Enhanced Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@

# Check if LICENSE file exists, if not create it
if (Test-Path "LICENSE") {
    Copy-Item -Path "LICENSE" -Destination "$releaseDir\LICENSE.txt" -Force
} else {
    Set-Content -Path "$releaseDir\LICENSE.txt" -Value $licenseContent
}
Write-Host "✅ LICENSE.txt created" -ForegroundColor Green

# Step 5: Copy README.md
Write-Host "Step 5: Copying README.md..." -ForegroundColor Cyan
Copy-Item -Path "README.md" -Destination "$releaseDir\README.md" -Force
Write-Host "✅ README.md copied" -ForegroundColor Green

# Step 6: Create changelog.txt
Write-Host "Step 6: Creating changelog.txt..." -ForegroundColor Cyan
$changelogContent = @"
# Mashaaer Enhanced v$appVersion - Changelog

## New Features
- Emotion-aware intelligent assistant (Arabic & English)
- Voice synthesis with expressive tone control
- Self-awareness simulation + emotional memory
- Desktop-ready app via Electron
- Backend powered by Flask API
- Fallback to LLM engines if needed (OpenAI, Claude, etc.)
- Custom branded installer with setup wizard
- License activation system
- Unified installer for Flask + Electron

## Improvements
- Enhanced UI with cosmic theme
- Improved performance and stability
- Better Arabic dialect support
- More accurate emotion detection
- Streamlined installation process

## Bug Fixes
- Fixed issues with voice synthesis
- Resolved memory leaks in long conversations
- Fixed compatibility issues with Windows 11
- Corrected Arabic text rendering in UI
- Fixed installer issues on systems with limited permissions

## Documentation
- Added comprehensive user guides in English and Arabic
- Included activation guide
- Updated developer documentation
"@
Set-Content -Path "$releaseDir\changelog.txt" -Value $changelogContent
Write-Host "✅ changelog.txt created" -ForegroundColor Green

# Step 7: Create activation-guide.pdf (or .md as placeholder)
Write-Host "Step 7: Creating activation guide..." -ForegroundColor Cyan
$activationGuideContent = @"
# Mashaaer Enhanced - Activation Guide

## License Activation

### Step 1: Obtain a License Key
To use Mashaaer Enhanced, you need a valid license key. If you haven't received a license key, please contact support@mashaaer.com or purchase one from our website.

### Step 2: Launch the Application
When you first launch Mashaaer Enhanced, you'll be presented with the activation screen.

### Step 3: Enter Your License Information
1. Enter your license key in the format XXXX-XXXX-XXXX-XXXX
2. Enter your full name
3. Enter your email address
4. Click the "Activate License" button

### Step 4: Verification
The system will verify your license key. If valid, the application will start automatically.

### Troubleshooting
If you encounter any issues during activation:
1. Make sure you've entered the license key correctly
2. Check that your internet connection is working
3. Ensure your system date and time are correct
4. If problems persist, contact support@mashaaer.com

## License Management

### Viewing License Information
You can view your license information in the application by:
1. Opening the application
2. Clicking on "Help" in the menu
3. Selecting "License Information"

### Transferring Your License
If you need to transfer your license to another computer:
1. Deactivate the license on your current computer
2. Follow the activation steps on the new computer

For assistance with license transfers, please contact support@mashaaer.com
"@
Set-Content -Path "$releaseDir\activation-guide.md" -Value $activationGuideContent
Write-Host "✅ activation-guide.md created (PDF placeholder)" -ForegroundColor Green

# Step 8: Copy documentation files
Write-Host "Step 8: Copying documentation files..." -ForegroundColor Cyan

# English documentation
$englishDocContent = @"
# How to Run Mashaaer Enhanced

This guide provides instructions for running the Mashaaer Enhanced application.

## System Requirements

- Windows 10 or later
- 4GB RAM minimum, 8GB recommended
- 500MB free disk space
- Internet connection for activation and updates

## Installation

### Using the Installer

1. Run the installer (Mashaaer-Enhanced-Setup-v$appVersion.exe)
2. Follow the installation instructions
3. Launch the application from the desktop shortcut or start menu

### Using the Portable Version

1. Extract the zip file to a directory of your choice
2. Double-click the `start-electron.bat` file to start the application

## First Launch

When you first launch the application, you'll need to:

1. Activate your license (see activation-guide.pdf)
2. Complete the initial setup wizard
3. Choose your preferred language (Arabic or English)

## Using the Application

### Main Features

- **Emotion-aware Assistant**: Interact with the assistant using text or voice
- **Voice Synthesis**: Listen to responses with expressive tone control
- **Emotional Memory**: The assistant remembers past interactions and emotions
- **Self-awareness**: The assistant can reflect on its own responses

### Voice Commands

- "مرحبا" (Hello) - Greet the assistant
- "كيف حالك" (How are you) - Ask about the assistant's status
- "ما هو الطقس اليوم" (What's the weather today) - Ask about weather
- "تشغيل الموسيقى" (Play music) - Control media playback

## Troubleshooting

If you encounter any issues:

1. Make sure no other application is using port 5000
2. Check that all files are present in the application folder
3. Check the log files in the `logs` directory
4. Try running the application as administrator

For additional help, contact support@mashaaer.com
"@
Set-Content -Path "$releaseDir\docs\How-to-Run-Mashaaer.md" -Value $englishDocContent

# Arabic documentation
$arabicDocContent = @"
# كيفية تشغيل مشاعر المحسّن

يقدم هذا الدليل تعليمات لتشغيل تطبيق مشاعر المحسّن.

## متطلبات النظام

- ويندوز 10 أو أحدث
- ذاكرة وصول عشوائي 4 جيجابايت كحد أدنى، 8 جيجابايت موصى بها
- مساحة قرص فارغة 500 ميجابايت
- اتصال بالإنترنت للتفعيل والتحديثات

## التثبيت

### باستخدام المثبت

1. قم بتشغيل المثبت (Mashaaer-Enhanced-Setup-v$appVersion.exe)
2. اتبع تعليمات التثبيت
3. قم بتشغيل التطبيق من اختصار سطح المكتب أو قائمة البدء

### باستخدام النسخة المحمولة

1. استخرج ملف الضغط إلى دليل من اختيارك
2. انقر نقرًا مزدوجًا على ملف `start-electron.bat` لبدء التطبيق

## التشغيل الأول

عند تشغيل التطبيق لأول مرة، ستحتاج إلى:

1. تفعيل الترخيص الخاص بك (انظر activation-guide.pdf)
2. إكمال معالج الإعداد الأولي
3. اختيار لغتك المفضلة (العربية أو الإنجليزية)

## استخدام التطبيق

### الميزات الرئيسية

- **مساعد واعي بالمشاعر**: تفاعل مع المساعد باستخدام النص أو الصوت
- **تركيب الصوت**: استمع إلى الردود مع التحكم في نبرة الصوت التعبيرية
- **ذاكرة عاطفية**: يتذكر المساعد التفاعلات والمشاعر السابقة
- **الوعي الذاتي**: يمكن للمساعد التفكير في ردوده الخاصة

### الأوامر الصوتية

- "مرحبا" - تحية المساعد
- "كيف حالك" - السؤال عن حالة المساعد
- "ما هو الطقس اليوم" - السؤال عن الطقس
- "تشغيل الموسيقى" - التحكم في تشغيل الوسائط

## استكشاف الأخطاء وإصلاحها

إذا واجهت أي مشاكل:

1. تأكد من عدم استخدام أي تطبيق آخر للمنفذ 5000
2. تحقق من وجود جميع الملفات في مجلد التطبيق
3. تحقق من ملفات السجل في دليل `logs`
4. حاول تشغيل التطبيق كمسؤول

للحصول على مساعدة إضافية، اتصل بـ support@mashaaer.com
"@
Set-Content -Path "$releaseDir\docs\تشغيل-مشاعر-كامل.md" -Value $arabicDocContent -Encoding UTF8

Write-Host "✅ Documentation files created" -ForegroundColor Green

# Step 9: Create a public launch announcement draft
Write-Host "Step 9: Creating public launch announcement draft..." -ForegroundColor Cyan
$announcementContent = @"
# 🎉 Announcing Mashaaer Enhanced v$appVersion - Now Available!

We're thrilled to announce the official release of Mashaaer Enhanced, the advanced Arabic voice assistant with emotion detection, dialect support, and smart personal assistance capabilities.

## 🧠 What is Mashaaer Enhanced?

Mashaaer Enhanced is the first Arabic-focused emotional intelligence assistant that combines:

- **Cultural Context Awareness**: Understanding Arabic cultural nuances and dialect variations
- **Emotional Intelligence**: Detecting emotions and responding appropriately
- **Memory and Learning**: Building relationships with users over time
- **Multi-modal Interaction**: Text, voice, and facial expression support
- **Privacy-Focused Design**: Local processing for user data security

## ✨ Key Features

- **Emotion-aware intelligent assistant** supporting both Arabic & English
- **Voice synthesis with expressive tone control** that adapts to emotional context
- **Self-awareness simulation and emotional memory** for more human-like interactions
- **Desktop-ready application** via Electron for a seamless experience
- **Backend powered by Flask API** with fallback to LLM engines when needed
- **Custom branded installer** with easy setup wizard
- **License activation system** for secure distribution

## 🚀 Getting Started

1. Download the installer from our [official website](https://mashaaer.com/download) or [GitHub Releases](https://github.com/mashaaer-team/mashaaer-enhanced/releases)
2. Run the installer and follow the setup wizard
3. Activate your license (free trial available)
4. Start exploring the power of emotion-aware AI in your native language!

## 📚 Documentation

Comprehensive documentation is included with the installation:
- User guides in both English and Arabic
- Activation guide
- Troubleshooting tips

## 💬 Community & Support

Join our growing community:
- [Discord Server](https://discord.gg/mashaaer)
- [Community Forum](https://community.mashaaer.com)
- [Twitter](https://twitter.com/mashaaer_ai)

For support, contact us at support@mashaaer.com

## 🔮 What's Next?

We're already working on exciting new features for upcoming releases:
- Online activation server for license keys
- In-app updates system via GitHub API
- User feedback modal with emotional reporting

Download Mashaaer Enhanced today and experience the future of Arabic AI assistants!

#MashaaerEnhanced #ArabicAI #EmotionalIntelligence #VoiceAssistant
"@
Set-Content -Path "$releaseDir\launch-announcement.md" -Value $announcementContent
Write-Host "✅ Public launch announcement draft created" -ForegroundColor Green

# Step 10: Create analytics implementation guide
Write-Host "Step 10: Creating analytics implementation guide..." -ForegroundColor Cyan
$analyticsGuideContent = @"
# Mashaaer Enhanced - Analytics Implementation Guide

This guide provides instructions for implementing opt-in analytics tracking for Mashaaer Enhanced.

## Overview

Adding analytics tracking to Mashaaer Enhanced will help:
- Understand how users interact with the application
- Identify popular features and areas for improvement
- Track performance metrics and error rates
- Make data-driven decisions for future updates

## Implementation Options

### 1. Google Analytics Integration

#### Setup:
1. Create a Google Analytics 4 property
2. Add the following code to the main.js file in the Electron application:

\`\`\`javascript
// In main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const { trackEvent } = require('./analytics');

// Initialize analytics with opt-in setting
let analyticsEnabled = false;

// Handle analytics opt-in/opt-out
ipcMain.on('analytics:setEnabled', (event, enabled) => {
  analyticsEnabled = enabled;
  // Save user preference
  app.setAppUserModelData('analyticsEnabled', enabled);
});

// Track events only if user has opted in
ipcMain.on('analytics:trackEvent', (event, category, action, label, value) => {
  if (analyticsEnabled) {
    trackEvent(category, action, label, value);
  }
});
\`\`\`

2. Create an analytics.js file:

\`\`\`javascript
// analytics.js
const { app } = require('electron');
const ua = require('universal-analytics');

// Your Google Analytics tracking ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX';

// Create a visitor with anonymous ID
let visitor = null;

// Initialize analytics
function initAnalytics() {
  // Generate a persistent anonymous ID
  const userId = app.getAppUserModelData('anonymousId') || 
                 require('crypto').randomBytes(16).toString('hex');
  
  // Save the ID for future sessions
  app.setAppUserModelData('anonymousId', userId);
  
  // Create visitor
  visitor = ua(GA_TRACKING_ID, userId);
  
  // Track app start
  trackEvent('Application', 'Start', app.getVersion());
}

// Track events
function trackEvent(category, action, label, value) {
  if (!visitor) initAnalytics();
  
  visitor.event({
    ec: category,
    ea: action,
    el: label,
    ev: value
  }).send();
}

module.exports = {
  initAnalytics,
  trackEvent
};
\`\`\`

3. Add opt-in UI in the settings page:

\`\`\`jsx
// In SettingsPage.jsx
function SettingsPage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  
  useEffect(() => {
    // Load saved preference
    window.electron.invoke('settings:getAnalyticsEnabled')
      .then(enabled => setAnalyticsEnabled(enabled));
  }, []);
  
  const handleAnalyticsChange = (e) => {
    const enabled = e.target.checked;
    setAnalyticsEnabled(enabled);
    window.electron.send('analytics:setEnabled', enabled);
  };
  
  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Privacy</h3>
        
        <div className="setting-item">
          <input
            type="checkbox"
            id="analytics-opt-in"
            checked={analyticsEnabled}
            onChange={handleAnalyticsChange}
          />
          <label htmlFor="analytics-opt-in">
            Help improve Mashaaer Enhanced by sending anonymous usage data
          </label>
          <p className="setting-description">
            When enabled, we collect anonymous information about how you use the app,
            which features you use most, and any errors you encounter. We never collect
            personal information or the content of your conversations.
          </p>
        </div>
      </div>
    </div>
  );
}
\`\`\`

### 2. Self-hosted Analytics with Matomo

For users who prefer self-hosted analytics, Matomo provides an open-source alternative to Google Analytics.

#### Setup:
1. Set up a Matomo instance on your server
2. Follow similar implementation as above, but use the Matomo tracking API

### 3. Minimal Custom Analytics

For a lightweight solution, implement a simple custom analytics system:

\`\`\`javascript
// custom-analytics.js
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Your analytics endpoint
const ANALYTICS_ENDPOINT = 'https://analytics.mashaaer.com/collect';

// Get analytics log file path
const getLogFilePath = () => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'analytics.json');
};

// Save events locally until they can be sent
const saveEvent = (event) => {
  try {
    const logFilePath = getLogFilePath();
    let events = [];
    
    if (fs.existsSync(logFilePath)) {
      const data = fs.readFileSync(logFilePath, 'utf8');
      events = JSON.parse(data);
    }
    
    events.push({
      ...event,
      timestamp: new Date().toISOString(),
      appVersion: app.getVersion()
    });
    
    fs.writeFileSync(logFilePath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error saving analytics event:', error);
  }
};

// Send events to server
const sendEvents = () => {
  try {
    const logFilePath = getLogFilePath();
    
    if (!fs.existsSync(logFilePath)) return;
    
    const data = fs.readFileSync(logFilePath, 'utf8');
    const events = JSON.parse(data);
    
    if (events.length === 0) return;
    
    const payload = JSON.stringify({
      events,
      deviceId: app.getAppUserModelData('anonymousId'),
      platform: process.platform,
      osVersion: process.getSystemVersion()
    });
    
    const req = https.request(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    });
    
    req.on('response', (res) => {
      if (res.statusCode === 200) {
        // Clear sent events
        fs.writeFileSync(logFilePath, JSON.stringify([], null, 2));
      }
    });
    
    req.on('error', (error) => {
      console.error('Error sending analytics:', error);
    });
    
    req.write(payload);
    req.end();
  } catch (error) {
    console.error('Error sending analytics events:', error);
  }
};

module.exports = {
  trackEvent: (category, action, label, value) => {
    saveEvent({ category, action, label, value });
  },
  initAnalytics: () => {
    // Generate anonymous ID if not exists
    if (!app.getAppUserModelData('anonymousId')) {
      app.setAppUserModelData('anonymousId', 
        require('crypto').randomBytes(16).toString('hex'));
    }
    
    // Try to send events on startup
    sendEvents();
    
    // Schedule periodic sending
    setInterval(sendEvents, 30 * 60 * 1000); // Every 30 minutes
  }
};
\`\`\`

## Privacy Considerations

1. **Always make analytics opt-in**, never opt-out
2. Be transparent about what data is collected
3. Never collect personal information or conversation content
4. Provide a clear way to opt out at any time
5. Include a privacy policy explaining data usage

## Recommended Events to Track

- Application start/stop
- Feature usage (which features are used most)
- Error occurrences (for stability monitoring)
- Performance metrics (response times, memory usage)
- Session duration
- Language selection
- UI interactions (which screens are viewed most)

## Implementation Steps

1. Choose an analytics solution (Google Analytics, Matomo, or custom)
2. Add the analytics code to the application
3. Create an opt-in UI in the settings
4. Test to ensure analytics only work when opted in
5. Update the privacy policy to reflect analytics usage
6. Add analytics dashboard access for team members

## Dashboard Setup

Once analytics are implemented, set up a dashboard to visualize:
- Daily/monthly active users
- Feature usage statistics
- Error rates and types
- Performance metrics
- User retention

This will provide valuable insights for future development priorities.
"@
Set-Content -Path "$releaseDir\analytics-implementation-guide.md" -Value $analyticsGuideContent
Write-Host "✅ Analytics implementation guide created" -ForegroundColor Green

# Final summary
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Release Preparation Complete!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "The release directory has been prepared with the following structure:" -ForegroundColor Cyan
Write-Host "- $releaseDir/" -ForegroundColor Cyan
Write-Host "  |- Mashaaer-Enhanced-Setup-v$appVersion.exe" -ForegroundColor Cyan
Write-Host "  |- LICENSE.txt" -ForegroundColor Cyan
Write-Host "  |- README.md" -ForegroundColor Cyan
Write-Host "  |- changelog.txt" -ForegroundColor Cyan
Write-Host "  |- activation-guide.md" -ForegroundColor Cyan
Write-Host "  |- launch-announcement.md" -ForegroundColor Cyan
Write-Host "  |- analytics-implementation-guide.md" -ForegroundColor Cyan
Write-Host "  |- docs/" -ForegroundColor Cyan
Write-Host "     |- How-to-Run-Mashaaer.md" -ForegroundColor Cyan
Write-Host "     |- تشغيل-مشاعر-كامل.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the files in the release directory" -ForegroundColor Yellow
Write-Host "2. Convert .md files to PDF if needed" -ForegroundColor Yellow
Write-Host "3. Run upload-to-github.ps1 to upload to GitHub Releases" -ForegroundColor Yellow
Write-Host "4. Run upload-to-gdrive.ps1 to upload to Google Drive" -ForegroundColor Yellow
Write-Host "5. Use the launch announcement for social media and website" -ForegroundColor Yellow
Write-Host "6. Implement analytics tracking using the provided guide" -ForegroundColor Yellow
Write-Host ""