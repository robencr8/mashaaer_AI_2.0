import axios from 'axios'; // استخدام axios لاستدعاء APIs (تأكد من تثبيته في المشروع)

const API_TIMEOUT = 5000; // وقت المهلة الافتراضي للطلبات (5 ثوانٍ)

export async function callPrimaryModelAPI(prompt) {
  try {
    const response = await axios.post('https://api.primarymodel.com/v1/generate', {
      prompt: prompt,
    }, {
      timeout: API_TIMEOUT
    });

    return response.data.result; // استرجاع النتيجة من النموذج الأساسي
  } catch (error) {
    throw new Error(`Primary model API call failed: ${error.message}`);
  }
}

export async function callSecondaryModelAPI(prompt) {
  try {
    const response = await axios.post('https://api.secondarymodel.com/v1/generate', {
      prompt: prompt,
    }, {
      timeout: API_TIMEOUT
    });

    return response.data.result; // استرجاع النتيجة من النموذج البديل الأول
  } catch (error) {
    throw new Error(`Secondary model API call failed: ${error.message}`);
  }
}

export async function callTertiaryModelAPI(prompt) {
  try {
    const response = await axios.post('https://api.tertiarymodel.com/v1/generate', {
      prompt: prompt,
    }, {
      timeout: API_TIMEOUT
    });

    return response.data.result; // استرجاع النتيجة من النموذج البديل الثاني
  } catch (error) {
    throw new Error(`Tertiary model API call failed: ${error.message}`);
  }
}