import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * HelpPage Component
 * 
 * This component displays README documentation within the application
 * using react-markdown for rendering the content.
 */
const HelpPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('ar'); // Default to Arabic

  // Parse URL parameters to get language
  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam && (langParam === 'ar' || langParam === 'en')) {
        setLanguage(langParam);
      }
    }
  }, []);

  useEffect(() => {
    // Function to fetch README content
    const fetchReadmeContent = async () => {
      setLoading(true);
      try {
        const fileName = language === 'ar' ? 'README.ar.md' : 'README.en.md';
        const response = await fetch(fileName);

        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}`);
        }

        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading README:', err);
        setError(`فشل تحميل المحتوى: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReadmeContent();
  }, [language]);

  // Function to handle language toggle
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  };

  // Function to close the help page
  const handleClose = () => {
    // Use the router to navigate back
    if (window.router) {
      window.router.navigate('/');
    }
  };

  return (
    <div className="help-page-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(40, 42, 54, 0.95)', // Dark cosmic background
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'auto',
      direction: language === 'ar' ? 'rtl' : 'ltr',
      color: '#f8f8f2' // Light text for dark background
    }}>
      {/* Star background effect */}
      <div className="star-background" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1
      }}>
        {/* Stars will be added dynamically via CSS */}
      </div>

      {/* Header with cosmic theme */}
      <div className="help-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #6272a4',
        paddingBottom: '10px'
      }}>
        <h2 style={{
          color: '#bd93f9', // Purple cosmic color
          textShadow: '0 0 10px rgba(189, 147, 249, 0.5)', // Glow effect
          margin: 0
        }}>
          {language === 'ar' ? '📖 تعليمات الاستخدام' : '📖 User Instructions'}
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Language toggle button */}
          <button 
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: '1px solid #ff79c6',
              borderRadius: '5px',
              padding: '5px 10px',
              color: '#ff79c6',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Close button */}
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#ff79c6',
              textShadow: '0 0 5px rgba(255, 121, 198, 0.5)' // Glow effect
            }}
          >
            ✖
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="help-content" style={{
        backgroundColor: 'rgba(68, 71, 90, 0.3)',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {loading ? (
          <div className="loading-indicator" style={{
            textAlign: 'center',
            padding: '40px'
          }}>
            <div className="loading-spinner" style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 121, 198, 0.3)',
              borderRadius: '50%',
              borderTop: '4px solid #ff79c6',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : error ? (
          <div className="error-message" style={{
            color: '#ff5555',
            textAlign: 'center',
            padding: '20px'
          }}>
            <p>⚠️ {error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'none',
                border: '1px solid #ff5555',
                borderRadius: '5px',
                padding: '5px 10px',
                color: '#ff5555',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        ) : (
          <div className="markdown-content" style={{
            lineHeight: '1.6',
            fontSize: '16px'
          }}>
            <ReactMarkdown
              children={content}
              components={{
                // Customize the rendering of different elements
                h1: ({node, ...props}) => <h1 style={{color: '#ff79c6', marginTop: '1.5em', marginBottom: '0.5em'}} {...props} />,
                h2: ({node, ...props}) => <h2 style={{color: '#bd93f9', marginTop: '1.2em', marginBottom: '0.5em'}} {...props} />,
                h3: ({node, ...props}) => <h3 style={{color: '#50fa7b', marginTop: '1em', marginBottom: '0.5em'}} {...props} />,
                a: ({node, ...props}) => <a style={{color: '#8be9fd', textDecoration: 'none'}} {...props} />,
                p: ({node, ...props}) => <p style={{marginBottom: '1em'}} {...props} />,
                ul: ({node, ...props}) => <ul style={{marginBottom: '1em', paddingLeft: '2em'}} {...props} />,
                ol: ({node, ...props}) => <ol style={{marginBottom: '1em', paddingLeft: '2em'}} {...props} />,
                li: ({node, ...props}) => <li style={{marginBottom: '0.5em'}} {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code style={{backgroundColor: 'rgba(40, 42, 54, 0.5)', padding: '0.2em 0.4em', borderRadius: '3px'}} {...props} />
                    : <code style={{display: 'block', backgroundColor: 'rgba(40, 42, 54, 0.8)', padding: '1em', borderRadius: '5px', overflowX: 'auto'}} {...props} />,
                pre: ({node, ...props}) => <pre style={{margin: '1em 0', backgroundColor: 'transparent'}} {...props} />,
                blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid #6272a4', paddingLeft: '1em', marginLeft: '0', marginRight: '0', color: '#f1fa8c'}} {...props} />,
                hr: ({node, ...props}) => <hr style={{border: 'none', borderBottom: '1px solid #6272a4', margin: '2em 0'}} {...props} />,
                table: ({node, ...props}) => <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '1em'}} {...props} />,
                th: ({node, ...props}) => <th style={{textAlign: 'left', padding: '0.5em', borderBottom: '2px solid #6272a4'}} {...props} />,
                td: ({node, ...props}) => <td style={{padding: '0.5em', borderBottom: '1px solid #44475a'}} {...props} />
              }}
            />
          </div>
        )}
      </div>

      {/* Add keyframes for loading spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Star twinkling animation */
          @keyframes twinkle {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }

          /* Add stars to background */
          .star-background::before {
            content: '';
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            box-shadow: 
              0 0 10px 1px white,
              100px 20px 1px white,
              200px 40px 1px white,
              300px 60px 1px white,
              400px 80px 1px white,
              500px 100px 1px white,
              600px 120px 1px white,
              700px 140px 1px white,
              800px 160px 1px white,
              900px 180px 1px white,
              150px 220px 1px white,
              250px 240px 1px white,
              350px 260px 1px white,
              450px 280px 1px white,
              550px 300px 1px white,
              650px 320px 1px white,
              750px 340px 1px white,
              850px 360px 1px white,
              950px 380px 1px white,
              125px 420px 1px white,
              225px 440px 1px white,
              325px 460px 1px white,
              425px 480px 1px white,
              525px 500px 1px white,
              625px 520px 1px white,
              725px 540px 1px white,
              825px 560px 1px white,
              925px 580px 1px white;
            animation: twinkle 4s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default HelpPage;
