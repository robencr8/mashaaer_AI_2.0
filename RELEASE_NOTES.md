# مشاعر Enhanced - Beta Release Notes

## Version 1.0.1-beta (May 2025)

### 🆕 Markdown Report Export (v1.0.1)
- Implemented `generateMarkdownReport(result)` function to convert analysis results into a structured Markdown report.
- Integrated into `SystemReport` via export button.
- Report includes sections for complexity, duplicates, code smells, dependencies, and more.
- Tested and confirmed compatibility with GitHub/Notion rendering.

## Version 1.0.0-beta (May 2025)

We are excited to announce the public beta release of مشاعر Enhanced (Mashaaer Enhanced), an advanced Arabic voice assistant with emotion detection, dialect support, and voice customization capabilities.

### What's New in This Release

#### Core Features

- **Advanced Emotion Detection**: Our AI can now detect and respond to emotions in Arabic text and speech, with support for cultural context and dialect-specific patterns.
- **Multi-Dialect Support**: Full support for Gulf, Egyptian, Levantine, and Maghrebi dialects, with automatic dialect detection.
- **Voice Customization**: Choose from a variety of voice profiles or customize your own with different emotional tones.
- **Memory Indexer**: The assistant remembers past conversations and builds on them for a more personalized experience.
- **Response Shaper**: Responses are tailored to match your emotional state and communication style.
- **Persona AutoSwitcher**: The assistant can switch between different personas based on the context of the conversation.

#### New User Experience

- **Landing Page**: A new, user-friendly landing page that introduces the project and its features.
- **Authentication System**: Secure user authentication with JWT-based tokens.
- **Subscription Plans**: Three subscription tiers (Free, Basic, Premium) with different feature sets and usage limits.
- **Usage Tracking**: Transparent usage tracking with clear limits based on subscription plan.

#### Technical Improvements

- **Analytics Integration**: Google Analytics integration for tracking user interactions and system performance.
- **Session Logs**: Detailed session logs for better debugging and user experience improvement.
- **Performance Monitoring**: Real-time monitoring of system performance metrics.
- **Error Reporting**: Improved error reporting and handling.

### Known Issues

- Voice recognition may have reduced accuracy in noisy environments.
- Some dialect-specific idioms may not be correctly interpreted in the emotion detection system.
- The memory indexer may occasionally retrieve less relevant past conversations.
- Mobile performance may be slower than desktop, especially on older devices.

### Upcoming Features

- **Voice Recognition Improvements**: Enhanced accuracy in noisy environments.
- **Expanded Dialect Support**: Additional regional dialects and accents.
- **Mobile App**: Native mobile applications for iOS and Android.
- **Offline Mode**: Limited functionality when offline.
- **Group Conversations**: Support for multiple participants in a conversation.

### Beta Testing Guidelines

As a beta tester, your feedback is invaluable to us. Please:

1. **Report Bugs**: If you encounter any issues, please report them through the feedback form or by creating an issue on our GitHub repository.
2. **Provide Feedback**: Share your thoughts on the user experience, feature suggestions, or any other aspects of the application.
3. **Test Edge Cases**: Try using the assistant in different scenarios, with different dialects, and for various purposes.
4. **Monitor Performance**: Pay attention to response times, accuracy, and resource usage.

### How to Get Started

1. Create an account on [mashaaer-enhanced.example.com](https://mashaaer-enhanced.example.com)
2. Choose a subscription plan (Free, Basic, or Premium)
3. Customize your assistant's voice and personality
4. Start a conversation and explore the features

### Feedback Channels

- In-app feedback form
- Email: feedback@mashaaer-enhanced.example.com
- GitHub Issues: [github.com/mashaaer-enhanced/issues](https://github.com/mashaaer-enhanced/issues)
- Community Forum: [community.mashaaer-enhanced.example.com](https://community.mashaaer-enhanced.example.com)

Thank you for being part of our beta testing program. Your participation helps us create a better product for everyone.

---

## التغييرات الرئيسية في هذا الإصدار

### الميزات الأساسية

- **كشف المشاعر المتقدم**: يمكن للذكاء الاصطناعي الآن اكتشاف المشاعر في النص والكلام العربي والاستجابة لها، مع دعم السياق الثقافي وأنماط اللهجات المختلفة.
- **دعم اللهجات المتعددة**: دعم كامل للهجات الخليجية والمصرية والشامية والمغاربية، مع اكتشاف تلقائي للهجة.
- **تخصيص الصوت**: اختر من بين مجموعة متنوعة من ملفات تعريف الصوت أو قم بتخصيص صوتك الخاص بنغمات عاطفية مختلفة.
- **فهرس الذاكرة**: يتذكر المساعد المحادثات السابقة ويبني عليها لتجربة أكثر تخصيصًا.
- **مشكل الاستجابة**: يتم تصميم الردود لتتناسب مع حالتك العاطفية وأسلوب التواصل الخاص بك.
- **مبدل الشخصيات التلقائي**: يمكن للمساعد التبديل بين شخصيات مختلفة بناءً على سياق المحادثة.

### تجربة مستخدم جديدة

- **صفحة هبوط**: صفحة هبوط جديدة وسهلة الاستخدام تقدم المشروع وميزاته.
- **نظام المصادقة**: مصادقة آمنة للمستخدم باستخدام رموز JWT.
- **خطط الاشتراك**: ثلاث مستويات اشتراك (مجاني، أساسي، متميز) مع مجموعات ميزات وحدود استخدام مختلفة.
- **تتبع الاستخدام**: تتبع شفاف للاستخدام مع حدود واضحة بناءً على خطة الاشتراك.

### التحسينات التقنية

- **تكامل التحليلات**: تكامل Google Analytics لتتبع تفاعلات المستخدم وأداء النظام.
- **سجلات الجلسة**: سجلات جلسة مفصلة لتصحيح الأخطاء وتحسين تجربة المستخدم بشكل أفضل.
- **مراقبة الأداء**: مراقبة في الوقت الفعلي لمقاييس أداء النظام.
- **الإبلاغ عن الأخطاء**: تحسين الإبلاغ عن الأخطاء ومعالجتها.
