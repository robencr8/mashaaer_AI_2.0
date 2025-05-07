class EnvManager {
  constructor() {
    this.config = {
      // تضع هنا القيم الافتراضية مباشرة إذا أردت
    };
  }

  load() {
    console.log('✅ EnvManager: تحميل متغيرات البيئة - محاكي جاهز للـ Frontend');
    return true;
  }

  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  getApiKeyForModel(model) {
    return null; // تتعامل معها لاحقاً حسب الحاجة
  }

  getModelForFunction(functionType) {
    return null; // نفس الشيء
  }
}

const envManager = new EnvManager();
export default envManager;
