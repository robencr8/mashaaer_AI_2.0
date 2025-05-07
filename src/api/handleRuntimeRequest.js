import { callWithFallback } from './model_fallback_manager.js'; // استيراد مدير الـ Fallback

export async function handleRuntimeRequest(prompt, userProfile = {}) {
  try {
    console.log('🔍 Handling runtime request with prompt:', prompt);

    // إضافة معلومات المستخدم إلى السياق (النبرة، الصوت، وما إلى ذلك)
    const context = {
      prompt,
      preferredTone: userProfile.preferredTone || 'neutral', // نبرة الصوت
      preferredVoiceProfile: userProfile.preferredVoiceProfile || 'default' // الملف الصوتي
    };

    // استدعاء مدير Fallback لمعالجة الطلب
    const result = await callWithFallback(context.prompt);

    // إذا نجح fallback في استدعاء أحد النماذج
    return {
      success: true,
      result, // النتيجة الناتجة من النموذج
      metadata: {
        tone: context.preferredTone,
        voiceProfile: context.preferredVoiceProfile
      }
    };
  } catch (error) {
    console.error('❌ Error in handleRuntimeRequest:', error);

    return {
      success: false,
      error: error.message || 'An unknown error occurred.'
    };
  }
}