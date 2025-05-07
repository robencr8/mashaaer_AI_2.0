/**
 * Generate HTML report from diagnostic results
 * @param {Object} results - Diagnostic results
 * @returns {string} - HTML report
 */
export const generateHtmlReport = (results) => {
  const { summary, tests, overallStatus, arabicSummary, englishSummary, systemInfo, timestamp } = results;
  
  // Convert timestamp to local date string
  const formattedDate = new Date(timestamp).toLocaleString('ar-SA');
  
  // Generate status badge CSS class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pass': return 'status-pass';
      case 'fail': return 'status-fail';
      case 'skip': return 'status-skip';
      default: return '';
    }
  };
  
  // Generate system info section
  let systemInfoHtml = '';
  for (const [key, value] of Object.entries(systemInfo)) {
    if (typeof value === 'object' && value !== null) {
      systemInfoHtml += `<div class="info-item"><span class="info-label">${key}:</span> <pre>${JSON.stringify(value, null, 2)}</pre></div>`;
    } else {
      systemInfoHtml += `<div class="info-item"><span class="info-label">${key}:</span> ${value}</div>`;
    }
  }
  
  // Generate test results rows
  const testRowsHtml = tests.map(test => {
    return `
      <tr>
        <td dir="rtl">${test.componentName}</td>
        <td>${test.componentNameEn}</td>
        <td><span class="status-badge ${getStatusClass(test.status)}">${test.status.toUpperCase()}</span></td>
        <td dir="rtl">${test.details}</td>
        <td>${test.detailsEn}</td>
      </tr>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>تقرير تشخيص نظام مشاعر | Mashaaer System Diagnostic Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          background-color: #f9f9f9;
        }
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #2c3e50;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .summary {
          padding: 20px;
          background-color: ${overallStatus === 'pass' ? '#ebf9eb' : '#fff0f0'};
          border-bottom: 1px solid #eee;
        }
        .system-info {
          padding: 20px;
          background-color: #f8f8ff;
          border-bottom: 1px solid #eee;
        }
        .info-item {
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
        }
        .results {
          padding: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          color: white;
        }
        .status-pass {
          background-color: #4caf50;
        }
        .status-fail {
          background-color: #f44336;
        }
        .status-skip {
          background-color: #ff9800;
        }
        .summary-stats {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          text-align: center;
        }
        .stat-item {
          padding: 15px;
          border-radius: 4px;
        }
        .stat-passed {
          background-color: rgba(76, 175, 80, 0.1);
          border-left: 4px solid #4caf50;
        }
        .stat-failed {
          background-color: rgba(244, 67, 54, 0.1);
          border-left: 4px solid #f44336;
        }
        .stat-skipped {
          background-color: rgba(255, 152, 0, 0.1);
          border-left: 4px solid #ff9800;
        }
        .footer {
          padding: 15px;
          text-align: center;
          color: #666;
          font-size: 0.9em;
          border-top: 1px solid #eee;
        }
        pre {
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          .report-container {
            box-shadow: none;
            max-width: 100%;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>تقرير تشخيص نظام مشاعر</h1>
          <h2>Mashaaer System Diagnostic Report</h2>
          <p>${formattedDate}</p>
        </div>
        
        <div class="summary">
          <h2>ملخص التشخيص | Diagnosis Summary</h2>
          <p dir="rtl">${arabicSummary}</p>
          <p>${englishSummary}</p>
          
          <div class="summary-stats">
            <div class="stat-item stat-passed">
              <h3>الاختبارات الناجحة | Passed</h3>
              <p class="stat-value">${summary.passed} / ${summary.total}</p>
            </div>
            <div class="stat-item stat-failed">
              <h3>الاختبارات الفاشلة | Failed</h3>
              <p class="stat-value">${summary.failed} / ${summary.total}</p>
            </div>
            <div class="stat-item stat-skipped">
              <h3>الاختبارات المتخطاة | Skipped</h3>
              <p class="stat-value">${summary.skipped} / ${summary.total}</p>
            </div>
          </div>
        </div>
        
        <div class="system-info">
          <h2>معلومات النظام | System Information</h2>
          ${systemInfoHtml}
        </div>
        
        <div class="results">
          <h2>نتائج الاختبارات | Test Results</h2>
          <table>
            <thead>
              <tr>
                <th dir="rtl">المكون</th>
                <th>Component</th>
                <th>Status</th>
                <th dir="rtl">التفاصيل</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${testRowsHtml}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>تم إنشاؤه بواسطة أداة تشخيص نظام مشاعر | Generated by Mashaaer System Diagnostics Tool</p>
          <button onclick="window.print()">طباعة التقرير | Print Report</button>
        </div>
      </div>
      
      <script>
        // Add any client-side interactions here if needed
        console.log('Diagnostic report loaded');
      </script>
    </body>
    </html>
  `;
};

/**
 * Save diagnostic results to local storage
 * @param {Object} results - Diagnostic results
 * @returns {boolean} - Success status
 */
export const saveDiagnosticResults = (results) => {
  try {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available, cannot save diagnostic results');
      return false;
    }
    
    const timestamp = new Date().toISOString();
    const key = `mashaaer_diagnostics_${timestamp.replace(/[:.]/g, '_')}`;
    
    // Store only essential information to save space
    const storageData = {
      timestamp,
      summary: results.summary,
      overallStatus: results.overallStatus,
      testResults: results.tests.map(test => ({
        componentId: test.componentId,
        status: test.status,
        error: test.error
      }))
    };
    
    localStorage.setItem(key, JSON.stringify(storageData));
    console.log(`✅ تم حفظ نتائج التشخيص: ${key}`);
    return true;
  } catch (error) {
    console.error('فشل حفظ نتائج التشخيص:', error);
    return false;
  }
};

/**
 * Load previous diagnostic results from local storage
 * @param {number} limit - Maximum number of results to retrieve
 * @returns {Array} - Previous diagnostic results
 */
export const loadPreviousDiagnostics = (limit = 5) => {
  try {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available, cannot load diagnostic results');
      return [];
    }
    
    const diagnosticsResults = [];
    const prefix = 'mashaaer_diagnostics_';
    
    // Find all diagnostic results in local storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const rawData = localStorage.getItem(key);
          const data = JSON.parse(rawData);
          diagnosticsResults.push({
            key,
            ...data
          });
        } catch (error) {
          console.warn(`Failed to parse stored diagnostic result: ${key}`, error);
        }
      }
    }
    
    // Sort by timestamp (newest first) and limit results
    return diagnosticsResults
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error('فشل تحميل نتائج التشخيص السابقة:', error);
    return [];
  }
};

/**
 * Compare two diagnostic results to detect system changes
 * @param {Object} currentResults - Current diagnostic results
 * @param {Object} previousResults - Previous diagnostic results
 * @returns {Object} - Comparison results highlighting changes
 */
export const compareDiagnosticResults = (currentResults, previousResults) => {
  if (!previousResults) {
    return { 
      hasPrevious: false,
      message: 'لا توجد نتائج سابقة للمقارنة | No previous results to compare'
    };
  }
  
  const changes = {
    hasPrevious: true,
    timestamp: {
      current: currentResults.timestamp,
      previous: previousResults.timestamp
    },
    overallStatus: {
      current: currentResults.overallStatus,
      previous: previousResults.overallStatus,
      changed: currentResults.overallStatus !== previousResults.overallStatus
    },
    components: []
  };
  
  // Map previous test results by component ID for easier lookup
  const previousTestsMap = {};
  if (previousResults.tests) {
    previousResults.tests.forEach(test => {
      previousTestsMap[test.componentId] = test;
    });
  }
  
  // Compare each component's status
  currentResults.tests.forEach(currentTest => {
    const previousTest = previousTestsMap[currentTest.componentId];
    
    if (previousTest) {
      const statusChanged = currentTest.status !== previousTest.status;
      
      changes.components.push({
        componentId: currentTest.componentId,
        componentName: currentTest.componentName,
        componentNameEn: currentTest.componentNameEn,
        current: currentTest.status,
        previous: previousTest.status,
        changed: statusChanged,
        improved: statusChanged && 
          ((previousTest.status === 'fail' && currentTest.status === 'pass') || 
           (previousTest.status === 'skip' && currentTest.status !== 'skip')),
        degraded: statusChanged && 
          ((previousTest.status === 'pass' && currentTest.status !== 'pass') || 
           (previousTest.status !== 'fail' && currentTest.status === 'fail'))
      });
    } else {
      // New component not in previous results
      changes.components.push({
        componentId: currentTest.componentId,
        componentName: currentTest.componentName,
        componentNameEn: currentTest.componentNameEn,
        current: currentTest.status,
        previous: 'unknown',
        changed: true,
        isNew: true
      });
    }
  });
  
  // Check for removed components (in previous but not in current)
  if (previousResults.tests) {
    const currentTestsMap = {};
    currentResults.tests.forEach(test => {
      currentTestsMap[test.componentId] = true;
    });
    
    previousResults.tests.forEach(previousTest => {
      if (!currentTestsMap[previousTest.componentId]) {
        changes.components.push({
          componentId: previousTest.componentId,
          componentName: previousTest.componentName,
          componentNameEn: previousTest.componentNameEn,
          current: 'unknown',
          previous: previousTest.status,
          changed: true,
          removed: true
        });
      }
    });
  }
  
  // Calculate overall changes
  const improvedComponents = changes.components.filter(c => c.improved);
  const degradedComponents = changes.components.filter(c => c.degraded);
  const newComponents = changes.components.filter(c => c.isNew);
  const removedComponents = changes.components.filter(c => c.removed);
  
  changes.summary = {
    totalChanges: changes.components.filter(c => c.changed).length,
    improved: improvedComponents.length,
    degraded: degradedComponents.length,
    new: newComponents.length,
    removed: removedComponents.length
  };
  
  // Generate messages
  let arabicMessage = '';
  let englishMessage = '';
  
  if (changes.summary.totalChanges === 0) {
    arabicMessage = 'لم يتم العثور على تغييرات منذ التشخيص السابق.';
    englishMessage = 'No changes detected since previous diagnosis.';
  } else {
    if (improvedComponents.length > 0) {
      arabicMessage += `تم تحسين ${improvedComponents.length} مكونات. `;
      englishMessage += `${improvedComponents.length} components improved. `;
    }
    
    if (degradedComponents.length > 0) {
      arabicMessage += `تراجعت حالة ${degradedComponents.length} مكونات. `;
      englishMessage += `${degradedComponents.length} components degraded. `;
    }
    
    if (newComponents.length > 0) {
      arabicMessage += `تمت إضافة ${newComponents.length} مكونات جديدة. `;
      englishMessage += `${newComponents.length} new components added. `;
    }
    
    if (removedComponents.length > 0) {
      arabicMessage += `تمت إزالة ${removedComponents.length} مكونات. `;
      englishMessage += `${removedComponents.length} components removed. `;
    }
  }
  
  changes.message = {
    arabic: arabicMessage.trim(),
    english: englishMessage.trim()
  };
  
  return changes;
};

/**
 * Get a recommended action plan based on diagnostic results
 * @param {Object} results - Diagnostic results
 * @returns {Object} - Action plan with recommendations
 */
export const getActionPlan = (results) => {
  const failedTests = results.tests.filter(test => test.status === 'fail');
  const actionPlan = {
    hasIssues: failedTests.length > 0,
    criticalIssues: [],
    recommendations: []
  };
  
  // Define critical components that need immediate attention
  const criticalComponents = ['memory', 'flask_api', 'llm_engine'];
  
  // Check for critical issues
  failedTests.forEach(test => {
    const isCritical = criticalComponents.includes(test.componentId);
    
    const issue = {
      componentId: test.componentId,
      componentName: test.componentName,
      componentNameEn: test.componentNameEn,
      details: test.details,
      detailsEn: test.detailsEn,
      error: test.error,
      isCritical
    };
    
    if (isCritical) {
      actionPlan.criticalIssues.push(issue);
    }
    
    // Add recommendation based on component type
    switch (test.componentId) {
      case 'memory':
        actionPlan.recommendations.push({
          arabic: 'التحقق من تكوين نظام الذاكرة وضمان تحميل المكونات بشكل صحيح',
          english: 'Check memory system configuration and ensure components are loaded correctly'
        });
        break;
      case 'emotion':
        actionPlan.recommendations.push({
          arabic: 'التحقق من نظام الكشف عن المشاعر وتحديث النماذج إذا لزم الأمر',
          english: 'Check emotion detection system and update models if necessary'
        });
        break;
      case 'voice':
        actionPlan.recommendations.push({
          arabic: 'التحقق من تكوين نظام الصوت وتوفر الأصوات العربية',
          english: 'Check voice system configuration and availability of Arabic voices'
        });
        break;
      case 'flask_api':
        actionPlan.recommendations.push({
          arabic: 'التحقق من تشغيل خادم Flask والاتصال بالشبكة',
          english: 'Check if Flask server is running and network connectivity'
        });
        break;
      case 'llm_engine':
        actionPlan.recommendations.push({
          arabic: 'التحقق من تكوين محرك اللغة وتوفر النماذج المطلوبة',
          english: 'Check LLM engine configuration and availability of required models'
        });
        break;
      case 'browser_api':
        actionPlan.recommendations.push({
          arabic: 'التحقق من توافق المتصفح وتمكين واجهات برمجة التطبيقات المطلوبة',
          english: 'Check browser compatibility and enable required APIs'
        });
        break;
      default:
        actionPlan.recommendations.push({
          arabic: `مراجعة مكون "${test.componentName}" والتحقق من التكوين`,
          english: `Review "${test.componentNameEn}" component and check configuration`
        });
    }
  });
  
  // Add general recommendations if there are issues
  if (actionPlan.hasIssues) {
    actionPlan.recommendations.push({
      arabic: 'إعادة تحميل التطبيق قد يحل بعض المشكلات المؤقتة',
      english: 'Reloading the application may resolve some temporary issues'
    });
    
    // Add more severe recommendation if there are critical issues
    if (actionPlan.criticalIssues.length > 0) {
      actionPlan.recommendations.push({
        arabic: 'قد تحتاج إلى إعادة تثبيت أو تحديث النظام إذا استمرت المشكلات الحرجة',
        english: 'You may need to reinstall or update the system if critical issues persist'
      });
    }
  }
  
  // Generate summary messages
  if (actionPlan.criticalIssues.length > 0) {
    actionPlan.summaryArabic = `يوجد ${actionPlan.criticalIssues.length} مشكلات حرجة تتطلب اهتمامًا فوريًا.`;
    actionPlan.summaryEnglish = `There are ${actionPlan.criticalIssues.length} critical issues that require immediate attention.`;
  } else if (failedTests.length > 0) {
    actionPlan.summaryArabic = `يوجد ${failedTests.length} مشكلات غير حرجة يمكن معالجتها لتحسين الأداء.`;
    actionPlan.summaryEnglish = `There are ${failedTests.length} non-critical issues that can be addressed to improve performance.`;
  } else {
    actionPlan.summaryArabic = 'لا توجد مشكلات تتطلب اهتمامًا. النظام يعمل بشكل جيد.';
    actionPlan.summaryEnglish = 'No issues require attention. The system is functioning well.';
  }
  
  return actionPlan;
};

/**
 * Check if the system is operating within normal parameters
 * @param {Object} diagnosticResults - Results from system diagnostics
 * @returns {boolean} - Whether the system is operating normally
 */
export const isSystemOperatingNormally = (diagnosticResults) => {
  if (!diagnosticResults) return false;
  
  // System is considered to be operating normally if:
  // 1. All critical components are passing
  // 2. At least 75% of all components are passing
  
  const criticalComponents = ['memory', 'flask_api', 'llm_engine'];
  const tests = diagnosticResults.tests || [];
  
  // Check if all critical components are passing
  const criticalTests = tests.filter(test => criticalComponents.includes(test.componentId));
  const allCriticalPassing = criticalTests.every(test => test.status === 'pass');
  
  if (!allCriticalPassing) return false;
  
  // Check overall pass rate
  const passedTests = tests.filter(test => test.status === 'pass');
  const passRate = passedTests.length / tests.length;
  
  return passRate >= 0.75; // At least 75% of tests passing
};
