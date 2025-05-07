export class CosmicTheme {
  constructor() {
    this.isInitialized = false;
    this.settings = {
      accentColor: 'neutral', // لون السمة العام
      animationSpeed: 'normal', // سرعة الحركة في التصميم
      starDensity: 'medium', // كثافة النجوم
      starShape: 'circle', // الشكل الافتراضي للنجوم
      currentEmotion: 'neutral', // الحالة العاطفية الحالية
    };
  }

  /**
   * تهيئة الثيم عند تشغيل التطبيق لأول مرة.
   */
  initialize() {
    if (!this.isInitialized) {
      console.log('CosmicTheme has been initialized.');
      this.isInitialized = true;
    }
  }

  /**
   * تطبيق الثيم باستخدام الإعدادات الحالية.
   */
  applyTheme() {
    console.log('Applying theme with settings:', this.settings);

    // تحديث خصائص CSS في المستند
    document.body.style.setProperty('--star-shape', this.getStarShape()); // تحديث شكل النجوم
    document.body.style.setProperty('--bg-primary', this.getBackgroundColor()); // تحديث اللون الرئيسي للخلفية
    document.body.style.setProperty('--bg-secondary', this.getSecondaryBackgroundColor()); // تحديث اللون الثانوي للخلفية
    document.body.style.setProperty('--animation-speed', this.getAnimationSpeed()); // تحديث سرعة الحركات
    document.body.style.setProperty('--star-density', this.getStarDensity()); // تحديث كثافة النجوم

    // Add emotion-based class to body
    this.updateEmotionClass();
  }

  /**
   * تحديث الحالة العاطفية وتطبيق الثيم المناسب
   * @param {string} emotion - الحالة العاطفية (calm, joy, stress, sadness, excitement, neutral)
   * @returns {CosmicTheme} - This instance for chaining
   */
  setEmotion(emotion) {
    // Map standard emotions to our emotion theme categories
    const emotionMap = {
      // Standard emotions from EmotionService
      happy: 'joy',
      sad: 'sadness',
      angry: 'stress',
      surprised: 'excitement',
      fearful: 'stress',
      disgusted: 'stress',
      neutral: 'neutral',
      cheerful: 'joy',
      warm: 'joy',
      calm: 'calm',
      curious: 'excitement',
      reassuring: 'calm',
      friendly: 'joy',

      // Direct mappings (already in our format)
      joy: 'joy',
      stress: 'stress',
      sadness: 'sadness',
      excitement: 'excitement'
    };

    // Set the current emotion (use the mapped version or default to neutral)
    this.settings.currentEmotion = emotionMap[emotion] || 'neutral';
    console.log(`Setting emotion theme: ${this.settings.currentEmotion} (from ${emotion})`);

    // Apply the theme with the new emotion
    this.applyTheme();

    return this;
  }

  /**
   * تحديث فئة CSS للحالة العاطفية على عنصر body
   * @private
   */
  updateEmotionClass() {
    // Remove all existing emotion classes
    const emotionClasses = ['emotion-calm', 'emotion-joy', 'emotion-stress', 
                           'emotion-sadness', 'emotion-excitement', 'emotion-neutral'];

    emotionClasses.forEach(cls => {
      document.body.classList.remove(cls);
    });

    // Add the current emotion class
    if (this.settings.currentEmotion) {
      document.body.classList.add(`emotion-${this.settings.currentEmotion}`);
    }
  }

  /**
   * استرجاع لون الخلفية الرئيسي بناءً على اللون الحالي للسمة أو الحالة العاطفية.
   * @returns {string} قيمة HEX - لون الخلفية
   */
  getBackgroundColor() {
    // Emotion-based color map (based on detected emotion)
    const emotionColorMap = {
      calm: '#e6f7ff',     // Blue - لون هادئ
      joy: '#fffde7',      // Yellow - لون الفرح
      stress: '#f3e5f5',   // Purple - لون التوتر
      sadness: '#f5f5f5',  // Grey - لون الحزن
      excitement: '#fff3e0', // Orange - لون الحماس
      neutral: '#f8f9fa',  // لون حيادي
    };

    // Original theme color map
    const themeColorMap = {
      cheerful: '#ffecd2', // لون مشرق
      warm: '#ffe4b5',     // لون دافئ
      calm: '#e6f7ff',     // لون هادئ
      curious: '#f5e6ff',  // لون فضولي
      neutral: '#f8f9fa',  // لون حيادي
      reassuring: '#e8ffe8', // لون مطمئن
      friendly: '#fffacd', // لون ودود
    };

    // If we have a current emotion set, use that for the color
    if (this.settings.currentEmotion && this.settings.currentEmotion !== 'neutral') {
      return emotionColorMap[this.settings.currentEmotion] || emotionColorMap.neutral;
    }

    // Otherwise fall back to the accent color
    return themeColorMap[this.settings.accentColor] || '#ffffff'; // القيمة الافتراضية
  }

  /**
   * استرجاع لون الخلفية الثانوي بناءً على اللون الحالي للسمة أو الحالة العاطفية.
   * @returns {string} قيمة HEX - اللون الثانوي
   */
  getSecondaryBackgroundColor() {
    // Emotion-based secondary color map
    const emotionSecondaryColorMap = {
      calm: '#d9f0f8',      // Lighter blue
      joy: '#fff8c4',       // Lighter yellow
      stress: '#e1bee7',    // Lighter purple
      sadness: '#e0e0e0',   // Lighter grey
      excitement: '#ffe0b2', // Lighter orange
      neutral: '#e6e6e6',   // Lighter neutral
    };

    // Original theme secondary color map
    const themeSecondaryColorMap = {
      cheerful: '#ffe8b0',
      warm: '#ffd37b',
      calm: '#d9f0f8',
      curious: '#e2d3f5',
      neutral: '#e6e6e6',
      reassuring: '#d4f7d4',
      friendly: '#fff799',
    };

    // If we have a current emotion set, use that for the color
    if (this.settings.currentEmotion && this.settings.currentEmotion !== 'neutral') {
      return emotionSecondaryColorMap[this.settings.currentEmotion] || emotionSecondaryColorMap.neutral;
    }

    // Otherwise fall back to the accent color
    return themeSecondaryColorMap[this.settings.accentColor] || '#e0e0e0'; // القيمة الافتراضية
  }

  /**
   * استرجاع شكل النجوم بناءً على الإعدادات.
   * @returns {string} الشكل المحدد
   */
  getStarShape() {
    const shapeMap = {
      khaliji: 'triangle', // النجوم على شكل مثلثات
      shami: 'star', // النجوم التقليدية
      masri: 'diamond', // النجوم على شكل ألماسات
      fusha: 'circle', // النجوم على شكل دوائر
    };
    return shapeMap[this.settings.accentColor] || 'circle'; // القيمة الافتراضية
  }

  /**
   * استرجاع سرعة الحركة بناءً على الإعدادات.
   * @returns {string} السرعة (سريع, عادي, بطيء)
   */
  getAnimationSpeed() {
    // إذا تم تعيين سرعة الحركة بشكل صريح، قم بإرجاعها
    if (this.settings.animationSpeed) {
      return this.settings.animationSpeed;
    }

    // وإلا، حدد بناءً على لون السمة
    const speedMap = {
      cheerful: 'fast',
      warm: 'normal',
      calm: 'slow',
      curious: 'normal',
      neutral: 'normal',
      reassuring: 'slow',
      friendly: 'fast',
    };
    return speedMap[this.settings.accentColor] || 'normal'; // القيمة الافتراضية
  }

  /**
   * استرجاع كثافة النجوم بناءً على الإعدادات.
   * @returns {string} الكثافة (منخفضة, متوسطة, عالية)
   */
  getStarDensity() {
    const densityMap = {
      cheerful: 'high',
      warm: 'medium',
      calm: 'low',
      curious: 'medium',
      neutral: 'medium',
      reassuring: 'low',
      friendly: 'high',
    };
    return densityMap[this.settings.accentColor] || 'medium'; // القيمة الافتراضية
  }
}

// Create a singleton instance
const cosmicTheme = new CosmicTheme();

/**
 * Initialize the cosmic theme
 */
export function initializeCosmicTheme() {
  document.body.classList.add('cosmic-theme');
  cosmicTheme.initialize();
  cosmicTheme.applyTheme();
  console.log("Cosmic theme initialized!");

  // Make the theme available globally for legacy code
  window.cosmicTheme = cosmicTheme;
}

/**
 * Get the cosmic theme instance
 * @returns {CosmicTheme} The cosmic theme instance
 */
export function getCosmicTheme() {
  return cosmicTheme;
}

/**
 * مثال الاستخدام:
 * --------------------------------
 * - لتحديث إعدادات الثيم عند اختيار نبرة أو لهجة معينة:
 * 
 * import { getCosmicTheme } from './theme/cosmic-theme';
 * 
 * const theme = getCosmicTheme();
 * theme.settings.accentColor = 'cheerful'; // اختيار النبرة
 * theme.settings.starShape = 'khaliji'; // اختيار اللهجة
 * theme.applyTheme(); // تطبيق الثيم بالتعديلات
 * 
 * --------------------------------
 * - لتفعيل الثيم عند بدء تشغيل التطبيق:
 * 
 * import { initializeCosmicTheme } from './theme/cosmic-theme';
 * 
 * useEffect(() => {
 *   initializeCosmicTheme();
 * }, []);
 */
