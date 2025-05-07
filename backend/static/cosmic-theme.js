/**
 * Cosmic Theme
 * 
 * This file initializes the cosmic theme for the Mashaaer Enhanced Project.
 * It defines a CosmicTheme class with methods for initializing and applying the theme.
 */

// Define the CosmicTheme class
class CosmicTheme {
  constructor() {
    this.isInitialized = false;
    this.settings = {
      accentColor: 'neutral', // لون السمة العام
      animationSpeed: 'normal', // سرعة الحركة في التصميم
      starDensity: 'medium', // كثافة النجوم
      starShape: 'circle', // الشكل الافتراضي للنجوم
    };
  }

  /**
   * تهيئة الثيم عند تشغيل التطبيق لأول مرة.
   */
  initialize() {
    if (!this.isInitialized) {
      console.log('CosmicTheme has been initialized.');
      this.isInitialized = true;
      this.setupCanvas();
      this.applyTheme();
    }
    return this;
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
    
    // Add cosmic-theme class to body
    document.body.classList.add('cosmic-theme');
    
    // Update canvas if it exists
    this.updateCanvas();
    
    return this;
  }

  /**
   * Setup canvas for cosmic background
   */
  setupCanvas() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create stars
    this.stars = [];
    const starCount = this.getStarCount();
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.05 + 0.01
      });
    }
    
    // Start animation
    this.animateCanvas();
  }
  
  /**
   * Animate the cosmic canvas
   */
  animateCanvas() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = this.getBackgroundColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      
      // Update star position
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      
      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    }
    
    // Request next frame
    requestAnimationFrame(() => this.animateCanvas());
  }
  
  /**
   * Update canvas based on current settings
   */
  updateCanvas() {
    if (!this.stars) return;
    
    // Update star count based on density
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const targetCount = this.getStarCount();
    const currentCount = this.stars.length;
    
    if (targetCount > currentCount) {
      // Add more stars
      for (let i = 0; i < targetCount - currentCount; i++) {
        this.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.05 + 0.01
        });
      }
    } else if (targetCount < currentCount) {
      // Remove excess stars
      this.stars = this.stars.slice(0, targetCount);
    }
  }
  
  /**
   * Get star count based on density setting
   */
  getStarCount() {
    const densityMap = {
      low: 50,
      medium: 100,
      high: 200
    };
    
    return densityMap[this.getStarDensity()] || 100;
  }

  /**
   * استرجاع لون الخلفية الرئيسي بناءً على اللون الحالي للسمة.
   * @returns {string} قيمة HEX - لون الخلفية
   */
  getBackgroundColor() {
    const colorMap = {
      cheerful: '#ffecd2', // لون مشرق
      warm: '#ffe4b5', // لون دافئ
      calm: '#e6f7ff', // لون هادئ
      curious: '#f5e6ff', // لون فضولي
      neutral: '#f8f9fa', // لون حيادي
      reassuring: '#e8ffe8', // لون مطمئن
      friendly: '#fffacd', // لون ودود
    };
    return colorMap[this.settings.accentColor] || '#ffffff'; // القيمة الافتراضية
  }

  /**
   * استرجاع لون الخلفية الثانوي بناءً على اللون الحالي للسمة.
   * @returns {string} قيمة HEX - اللون الثانوي
   */
  getSecondaryBackgroundColor() {
    const secondaryColorMap = {
      cheerful: '#ffe8b0',
      warm: '#ffd37b',
      calm: '#d9f0f8',
      curious: '#e2d3f5',
      neutral: '#e6e6e6',
      reassuring: '#d4f7d4',
      friendly: '#fff799',
    };
    return secondaryColorMap[this.settings.accentColor] || '#e0e0e0'; // القيمة الافتراضية
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
    return shapeMap[this.settings.starShape] || 'circle'; // القيمة الافتراضية
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

// Make the theme available globally
window.cosmicTheme = cosmicTheme;

// Initialize the theme when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initializing cosmic theme...");
  cosmicTheme.initialize();
});