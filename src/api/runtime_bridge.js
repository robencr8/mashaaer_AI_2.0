import { handleRuntimeRequest } from './handleRuntimeRequest.js'; // تأكد من المسار الصحيح للملف

export async function runtimeBridgeHandler(req, res) {
  try {
    const { prompt, userProfile } = req.body; // إقرأ الطلب ومعلومات المستخدم من Body

    // استدعاء دالة معالجة الطلب مع fallback
    const result = await handleRuntimeRequest(prompt, userProfile);

    if (result.success) {
      res.json({
        success: true,
        response: result.result, // الرد الناتج من دالة handleRuntimeRequest
        metadata: result.metadata // البيانات الوصفية (النبرة، اللهجة، الصوت)
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error // رسالة الخطأ
      });
    }
  } catch (error) {
    console.error('❌ Error in runtimeBridgeHandler:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred in runtime_bridge.'
    });
  }
}