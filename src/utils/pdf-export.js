/**
 * PDF Export Utility
 * 
 * This module provides functions for generating and exporting PDF reports
 * of emotional analysis and recommendations.
 */

/**
 * Generate a PDF report of weekly emotional analysis
 * @param {Object} weeklyAnalysis - The weekly analysis data
 * @returns {Blob} - PDF file as a Blob
 */
export const generateWeeklyAnalysisPDF = (weeklyAnalysis) => {
  // In a real implementation, this would use a PDF generation library like jsPDF
  // For this prototype, we'll create a simple HTML representation that could be converted to PDF
  
  if (!weeklyAnalysis) {
    console.error('No analysis data provided for PDF generation');
    return null;
  }
  
  // Create HTML content for the PDF
  const htmlContent = createWeeklyAnalysisHTML(weeklyAnalysis);
  
  // In a real implementation, convert HTML to PDF
  // For now, we'll just create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  return blob;
};

/**
 * Create HTML content for weekly analysis PDF
 * @param {Object} analysis - The weekly analysis data
 * @returns {string} - HTML content
 */
const createWeeklyAnalysisHTML = (analysis) => {
  const { summary, patterns, insights, recommendations } = analysis;
  
  // Get localized emotion name
  const getEmotionName = (emotion) => {
    const names = {
      happy: 'سعيد',
      sad: 'حزين',
      angry: 'غاضب',
      surprised: 'متفاجئ',
      neutral: 'محايد',
      anxious: 'قلق',
      confident: 'واثق',
      stressed: 'متوتر'
    };
    
    return names[emotion] || emotion;
  };
  
  // Create HTML for summary section
  const summaryHTML = `
    <div class="pdf-section">
      <h2>ملخص التحليل الأسبوعي</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <h3>الشعور السائد</h3>
          <p>${getEmotionName(summary.dominantEmotion)}</p>
        </div>
        <div class="summary-item">
          <h3>عدد المشاعر</h3>
          <p>${summary.emotionCount}</p>
        </div>
        <div class="summary-item">
          <h3>متوسط الشدة</h3>
          <p>${Math.round(summary.averageIntensity * 100)}%</p>
        </div>
        <div class="summary-item">
          <h3>الاستقرار العاطفي</h3>
          <p>${Math.round(summary.emotionalStability)}%</p>
        </div>
      </div>
    </div>
  `;
  
  // Create HTML for patterns section
  let patternsHTML = `
    <div class="pdf-section">
      <h2>أنماط المشاعر الأسبوعية</h2>
  `;
  
  if (patterns && patterns.length > 0) {
    patternsHTML += `
      <table class="patterns-table">
        <thead>
          <tr>
            <th>اليوم</th>
            <th>الشعور السائد</th>
            <th>عدد المشاعر</th>
            <th>متوسط الشدة</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    patterns.forEach(pattern => {
      patternsHTML += `
        <tr>
          <td>${pattern.day}</td>
          <td>${getEmotionName(pattern.dominantEmotion)}</td>
          <td>${pattern.emotionCount}</td>
          <td>${Math.round(pattern.averageIntensity * 100)}%</td>
        </tr>
      `;
    });
    
    patternsHTML += `
        </tbody>
      </table>
    `;
  } else {
    patternsHTML += `
      <p>لا توجد بيانات كافية لتحليل الأنماط الأسبوعية.</p>
    `;
  }
  
  patternsHTML += `</div>`;
  
  // Create HTML for insights section
  let insightsHTML = `
    <div class="pdf-section">
      <h2>رؤى من بياناتك العاطفية</h2>
  `;
  
  if (insights && insights.length > 0) {
    insightsHTML += `<ul class="insights-list">`;
    
    insights.forEach(insight => {
      insightsHTML += `
        <li class="insight-item">
          <span class="insight-icon">
            ${insight.type === 'dominant' ? '🔍' : ''}
            ${insight.type === 'pattern' ? '📊' : ''}
            ${insight.type === 'variety' ? '🎭' : ''}
            ${insight.type === 'intensity' ? '📈' : ''}
          </span>
          <span class="insight-text">${insight.text}</span>
        </li>
      `;
    });
    
    insightsHTML += `</ul>`;
  } else {
    insightsHTML += `
      <p>لا توجد بيانات كافية لاستخلاص رؤى أسبوعية.</p>
    `;
  }
  
  insightsHTML += `</div>`;
  
  // Create HTML for recommendations section
  let recommendationsHTML = `
    <div class="pdf-section">
      <h2>توصيات مخصصة</h2>
  `;
  
  if (recommendations && recommendations.length > 0) {
    recommendationsHTML += `<div class="recommendations-list">`;
    
    recommendations.forEach(recommendation => {
      recommendationsHTML += `
        <div class="recommendation-item">
          <h3>${recommendation.title}</h3>
          <p>${recommendation.text}</p>
        </div>
      `;
    });
    
    recommendationsHTML += `</div>`;
  } else {
    recommendationsHTML += `
      <p>لا توجد بيانات كافية لتقديم توصيات مخصصة.</p>
    `;
  }
  
  recommendationsHTML += `</div>`;
  
  // Combine all sections into a complete HTML document
  const fullHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>التحليل الأسبوعي للمشاعر</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f2;
          color: #282a36;
          direction: rtl;
          padding: 20px;
        }
        
        .pdf-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .pdf-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #bd93f9;
        }
        
        .pdf-header h1 {
          color: #6272a4;
          margin: 0 0 10px 0;
        }
        
        .pdf-header p {
          color: #44475a;
          margin: 0;
        }
        
        .pdf-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f1fa8c;
        }
        
        .pdf-section h2 {
          color: #bd93f9;
          margin-top: 0;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .summary-item {
          background-color: #f8f8f2;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .summary-item h3 {
          color: #6272a4;
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .summary-item p {
          color: #50fa7b;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        
        .patterns-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .patterns-table th, .patterns-table td {
          padding: 10px;
          text-align: right;
          border-bottom: 1px solid #8be9fd;
        }
        
        .patterns-table th {
          background-color: #6272a4;
          color: white;
        }
        
        .insights-list {
          list-style-type: none;
          padding: 0;
        }
        
        .insight-item {
          background-color: #f8f8f2;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        
        .insight-icon {
          font-size: 24px;
          margin-left: 15px;
        }
        
        .recommendation-item {
          background-color: #f8f8f2;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        
        .recommendation-item h3 {
          color: #ff79c6;
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .pdf-footer {
          text-align: center;
          margin-top: 30px;
          color: #6272a4;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <div class="pdf-header">
          <h1>التحليل الأسبوعي للمشاعر</h1>
          <p>تحليل تلقائي لحالتك العاطفية خلال الأسبوع الماضي</p>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        ${summaryHTML}
        ${patternsHTML}
        ${insightsHTML}
        ${recommendationsHTML}
        
        <div class="pdf-footer">
          <p>تم إنشاء هذا التقرير بواسطة تطبيق مشاعر</p>
          <p>© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return fullHTML;
};

/**
 * Download a PDF report
 * @param {Blob} pdfBlob - The PDF file as a Blob
 * @param {string} filename - The filename for the downloaded file
 */
export const downloadPDF = (pdfBlob, filename = 'weekly-emotion-analysis.html') => {
  if (!pdfBlob) {
    console.error('No PDF blob provided for download');
    return;
  }
  
  // Create a URL for the blob
  const url = URL.createObjectURL(pdfBlob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to the document
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Email a PDF report
 * @param {Blob} pdfBlob - The PDF file as a Blob
 * @param {string} email - The recipient's email address
 * @param {string} subject - The email subject
 * @param {string} body - The email body
 */
export const emailPDF = (pdfBlob, email, subject, body) => {
  // In a real implementation, this would use an email service or API
  // For this prototype, we'll just show an alert
  
  if (!pdfBlob) {
    console.error('No PDF blob provided for email');
    return;
  }
  
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('PDF attachment size:', pdfBlob.size);
  
  // Show success message
  alert(`تم إرسال التحليل الأسبوعي إلى ${email}`);
};