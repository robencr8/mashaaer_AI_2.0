import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../context/services-context.js';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { authService } = useServices();

  const handleGetStarted = () => {
    navigate('/assistant');
  };

  const handleLogin = () => {
    // For demo purposes, we'll just navigate to the assistant page
    // In a real implementation, this would show a login modal
    authService.login('demo_user', 'password')
      .then(() => {
        navigate('/assistant');
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  };

  const handleRegister = () => {
    // For demo purposes, we'll just navigate to the assistant page
    // In a real implementation, this would show a registration modal
    authService.register('demo_user', 'password', 'demo@example.com')
      .then(() => {
        navigate('/assistant');
      })
      .catch(error => {
        console.error('Registration failed:', error);
      });
  };

  return (
    <div className="landing-page">
      <div className="stars-background"></div>
      
      <header className="landing-header">
        <div className="logo-container">
          <div className="logo">مشاعر</div>
          <div className="logo-enhanced">Enhanced</div>
        </div>
        <nav className="landing-nav">
          <button onClick={handleLogin} className="nav-button">تسجيل الدخول</button>
          <button onClick={handleRegister} className="nav-button register-button">إنشاء حساب</button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">مشاعر Enhanced</h1>
            <h2 className="hero-subtitle">مساعد ذكي يفهم مشاعرك</h2>
            <p className="hero-description">
              مساعد صوتي عربي متقدم مع كشف المشاعر، ودعم اللهجات، وتخصيص الصوت
            </p>
            <button onClick={handleGetStarted} className="get-started-button">
              ابدأ الآن
            </button>
          </div>
          <div className="hero-image">
            <div className="assistant-preview">
              {/* Placeholder for assistant preview image */}
              <div className="preview-placeholder">
                <span className="preview-icon">🗣️</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">المميزات الرئيسية</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">😊</div>
              <h3 className="feature-title">كشف المشاعر</h3>
              <p className="feature-description">
                يفهم مشاعرك ويستجيب بطريقة مناسبة لحالتك النفسية
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗣️</div>
              <h3 className="feature-title">دعم اللهجات</h3>
              <p className="feature-description">
                يدعم مختلف اللهجات العربية ويتكيف مع أسلوب حديثك
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔊</div>
              <h3 className="feature-title">تخصيص الصوت</h3>
              <p className="feature-description">
                اختر من بين مجموعة متنوعة من الأصوات والشخصيات
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">ذاكرة متقدمة</h3>
              <p className="feature-description">
                يتذكر المحادثات السابقة ويبني عليها لتجربة أكثر شخصية
              </p>
            </div>
          </div>
        </section>

        <section className="plans-section">
          <h2 className="section-title">خطط الاشتراك</h2>
          <div className="plans-grid">
            <div className="plan-card free-plan">
              <h3 className="plan-title">مجاني</h3>
              <div className="plan-price">$0</div>
              <ul className="plan-features">
                <li>كشف المشاعر الأساسي</li>
                <li>صوت أساسي</li>
                <li>50 طلب يومياً</li>
                <li>جلسات لمدة 15 دقيقة</li>
                <li>5 محادثات مخزنة</li>
              </ul>
              <button onClick={handleGetStarted} className="plan-button">ابدأ مجاناً</button>
            </div>
            <div className="plan-card basic-plan">
              <h3 className="plan-title">أساسي</h3>
              <div className="plan-price">$9.99</div>
              <ul className="plan-features">
                <li>كشف المشاعر المتقدم</li>
                <li>تخصيص الصوت</li>
                <li>200 طلب يومياً</li>
                <li>جلسات لمدة 60 دقيقة</li>
                <li>20 محادثة مخزنة</li>
              </ul>
              <button onClick={handleGetStarted} className="plan-button">اشترك الآن</button>
            </div>
            <div className="plan-card premium-plan">
              <h3 className="plan-title">متميز</h3>
              <div className="plan-price">$19.99</div>
              <ul className="plan-features">
                <li>كشف المشاعر المتقدم</li>
                <li>تخصيص الصوت</li>
                <li>دعم اللهجات</li>
                <li>طلبات غير محدودة</li>
                <li>جلسات غير محدودة</li>
                <li>100 محادثة مخزنة</li>
              </ul>
              <button onClick={handleGetStarted} className="plan-button premium-button">اشترك الآن</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-links">
          <a href="/privacy">سياسة الخصوصية</a>
          <a href="/terms">شروط الاستخدام</a>
          <a href="/support">الدعم</a>
          <a href="/about">عن المشروع</a>
        </div>
        <div className="footer-copyright">
          © 2025 مشاعر Enhanced. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;