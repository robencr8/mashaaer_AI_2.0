export async function callWithFallback(prompt) {
  // قائمة النماذج (مرتبة حسب الأولوية)
  const models = [
    { name: 'primaryModel', callFunction: async () => primaryModelCall(prompt) },
    { name: 'secondaryModel', callFunction: async () => secondaryModelCall(prompt) },
    { name: 'tertiaryModel', callFunction: async () => tertiaryModelCall(prompt) }
  ];

  for (const model of models) {
    try {
      console.log(`⚡ Attempting to use model: ${model.name}`);
      const response = await model.callFunction(); // استدعاء النموذج
      if (response) {
        console.log(`✅ Model ${model.name} responded successfully.`);
        return response; // إعادة النتيجة في حال نجاح أحد النماذج
      }
    } catch (error) {
      console.warn(`⚠️ Model ${model.name} failed:`, error.message); // متابعة الخطأ إن وجد
    }
  }

  // إذا فشلت جميع النماذج
  throw new Error('🚫 All models failed to respond.');
}

// نموذج افتراضي (للشرح)
async function primaryModelCall(prompt) {
  // اكتب هنا منطق استدعاء النموذج الأساسي
  // مثال على استدعاء API لنموذج ذكاء صناعي
  return new Promise((resolve, reject) => {
    // محاكاة نجاح النموذج
    setTimeout(() => resolve(`Primary model response for prompt: ${prompt}`), 1000);
  });
}

// نموذج بديل أول
async function secondaryModelCall(prompt) {
  // استدعاء النموذج الثانوي
  return new Promise((resolve, reject) => {
    // محاكاة فشل النموذج
    setTimeout(() => reject(new Error('Secondary model is unavailable')), 1000);
  });
}

// نموذج بديل ثانٍ
async function tertiaryModelCall(prompt) {
  // استدعاء النموذج الثانوي
  return new Promise((resolve) => {
    // محاكاة نجاح النموذج
    setTimeout(() => resolve(`Tertiary model response for prompt: ${prompt}`), 1000);
  });
}