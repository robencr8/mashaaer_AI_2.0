/**
 * Mashaaer System Diagnostics UI
 * 
 * User interface components for running system diagnostics and displaying results.
 */

import React, { useState, useEffect } from 'react';
import { runSystemDiagnostics, generateHtmlReport, saveDiagnosticResults, loadPreviousDiagnostics, compareDiagnosticResults, getActionPlan, isSystemOperatingNormally } from './system-diagnostics.js';

/**
 * Main diagnostics panel component
 * Provides UI for running diagnostics and viewing results
 */
export const DiagnosticsPanel = ({ language = 'ar' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [previousResults, setPreviousResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [quickTest, setQuickTest] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [diagnosticHistory, setDiagnosticHistory] = useState([]);
  
  // Labels in Arabic and English
  const labels = {
    title: language === 'ar' ? 'تشخيص النظام' : 'System Diagnostics',
    runDiagnostics: language === 'ar' ? 'تشغيل التشخيص' : 'Run Diagnostics',
    quickTest: language === 'ar' ? 'اختبار سريع' : 'Quick Test',
    fullTest: language === 'ar' ? 'اختبار كامل' : 'Full Test',
    running: language === 'ar' ? 'جاري التشخيص...' : 'Running Diagnostics...',
    viewReport: language === 'ar' ? 'عرض التقرير الكامل' : 'View Full Report',
    showHistory: language === 'ar' ? 'عرض السجل السابق' : 'Show History',
    hideHistory: language === 'ar' ? 'إخفاء السجل' : 'Hide History',
    lastRun: language === 'ar' ? 'آخر تشغيل' : 'Last Run',
    status: language === 'ar' ? 'الحالة' : 'Status',
    changes: language === 'ar' ? 'التغييرات' : 'Changes',
    noResults: language === 'ar' ? 'لا توجد نتائج متاحة' : 'No results available',
    pass: language === 'ar' ? 'ناجح' : 'Pass',
    fail: language === 'ar' ? 'فشل' : 'Fail',
    actionPlan: language === 'ar' ? 'خطة العمل' : 'Action Plan',
    noHistory: language === 'ar' ? 'لا يوجد سجل تشخيص سابق' : 'No previous diagnostic history'
  };
  
  // Load previous diagnostics when component mounts
  useEffect(() => {
    const history = loadPreviousDiagnostics();
    setDiagnosticHistory(history);
    
    // Set the most recent result as the previous result
    if (history.length > 0) {
      setPreviousResults(history[0]);
    }
  }, []);
  
  // Run diagnostics
  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      const diagnosticResults = await runSystemDiagnostics({ quickTest });
      setResults(diagnosticResults);
      
      // Save results
      saveDiagnosticResults(diagnosticResults);
      
      // Compare with previous results if available
      if (previousResults) {
        const comparisonResults = compareDiagnosticResults(diagnosticResults, previousResults);
        setComparison(comparisonResults);
      }
      
      // Generate action plan
      const plan = getActionPlan(diagnosticResults);
      setActionPlan(plan);
      
      // Refresh diagnostic history
      const history = loadPreviousDiagnostics();
      setDiagnosticHistory(history);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // View full diagnostic report in a new window
  const viewFullReport = () => {
    if (!results) return;
    
    const reportHtml = generateHtmlReport(results);
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  };
  
  // Select previous diagnostic result from history
  const selectHistoricResult = (historicResult) => {
    setPreviousResults(historicResult);
    if (results) {
      const comparisonResults = compareDiagnosticResults(results, historicResult);
      setComparison(comparisonResults);
    }
  };
  
  // Render component
  return (
    <div className="diagnostics-panel" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="diagnostics-header">
        <h2>{labels.title}</h2>
        
        <div className="diagnostics-controls">
          <div className="test-type-toggle">
            <label>
              <input
                type="checkbox"
                checked={quickTest}
                onChange={() => setQuickTest(!quickTest)}
              />
              {quickTest ? labels.quickTest : labels.fullTest}
            </label>
          </div>
          
          <button 
            className="run-diagnostics-button"
            onClick={runDiagnostics}
            disabled={isRunning}
          >
            {isRunning ? labels.running : labels.runDiagnostics}
          </button>
        </div>
      </div>
      
      {/* Results Summary */}
      {results && (
        <div className={`diagnostics-results ${results.overallStatus}`}>
          <div className="results-summary">
            <h3>{language === 'ar' ? results.arabicSummary : results.englishSummary}</h3>
            
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">{language === 'ar' ? 'ناجح' : 'Passed'}</span>
                <span className="stat-value">{results.summary.passed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{language === 'ar' ? 'فاشل' : 'Failed'}</span>
                <span className="stat-value">{results.summary.failed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{language === 'ar' ? 'متخطى' : 'Skipped'}</span>
                <span className="stat-value">{results.summary.skipped}</span>
              </div>
            </div>
            
            <button className="view-report-button" onClick={viewFullReport}>
              {labels.viewReport}
            </button>
          </div>
          
          {/* Component Test Results */}
          <div className="component-results">
            <h3>{language === 'ar' ? 'نتائج المكونات' : 'Component Results'}</h3>
            <div className="results-grid">
              {results.tests.map((test) => (
                <div key={test.componentId} className={`component-card ${test.status}`}>
                  <h4>{language === 'ar' ? test.componentName : test.componentNameEn}</h4>
                  <div className={`status-badge ${test.status}`}>
                    {test.status.toUpperCase()}
                  </div>
                  <p>{language === 'ar' ? test.details : test.detailsEn}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Plan */}
          {actionPlan && (
            <div className="action-plan">
              <h3>{labels.actionPlan}</h3>
              <p>{language === 'ar' ? actionPlan.summaryArabic : actionPlan.summaryEnglish}</p>
              
              {actionPlan.hasIssues && (
                <div className="recommendations">
                  <h4>{language === 'ar' ? 'التوصيات' : 'Recommendations'}</h4>
                  <ul>
                    {actionPlan.recommendations.map((rec, index) => (
                      <li key={index}>{language === 'ar' ? rec.arabic : rec.english}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Comparison with previous results */}
          {comparison && comparison.hasPrevious && (
            <div className="results-comparison">
              <h3>{language === 'ar' ? 'مقارنة مع التشخيص السابق' : 'Comparison with Previous Diagnosis'}</h3>
              <p>{language === 'ar' ? comparison.message.arabic : comparison.message.english}</p>
              
              {comparison.summary.totalChanges > 0 && (
                <div className="changes-list">
                  <h4>{language === 'ar' ? 'التغييرات' : 'Changes'}</h4>
                  {comparison.components
                    .filter(c => c.changed)
                    .map((change, index) => (
                      <div key={index} className={`change-item ${change.improved ? 'improved' : change.degraded ? 'degraded' : ''}`}>
                        <span className="component-name">
                          {language === 'ar' ? change.componentName : change.componentNameEn}
                        </span>
                        <div className="change-indicator">
                          <span className={`status-badge ${change.previous}`}>
                            {change.previous.toUpperCase()}
                          </span>
                          <span className="change-arrow">→</span>
                          <span className={`status-badge ${change.current}`}>
                            {change.current.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Diagnostic History */}
      <div className="diagnostic-history-section">
        <button 
          className="toggle-history-button"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? labels.hideHistory : labels.showHistory}
        </button>
        
        {showHistory && (
          <div className="diagnostic-history">
            <h3>{language === 'ar' ? 'سجل التشخيص' : 'Diagnostic History'}</h3>
            
            {diagnosticHistory.length > 0 ? (
              <div className="history-list">
                {diagnosticHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className={`history-item ${item.overallStatus}`}
                    onClick={() => selectHistoricResult(item)}
                  >
                    <div className="history-date">
                      {new Date(item.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                    <div className={`history-status ${item.overallStatus}`}>
                      {item.overallStatus.toUpperCase()}
                    </div>
                    <div className="history-summary">
                      {`${item.summary.passed}/${item.summary.total} ${language === 'ar' ? 'ناجح' : 'passed'}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>{labels.noHistory}</p>
            )}
          </div>
        )}
      </div>
      
      {/* No Results Message */}
      {!results && !isRunning && (
        <div className="no-results-message">
          <p>{labels.noResults}</p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isRunning && (
        <div className="diagnostics-loading">
          <div className="loading-spinner"></div>
          <p>{labels.running}</p>
        </div>
      )}
      
      <style jsx>{`
        .diagnostics-panel {
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .diagnostics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 15px;
        }
        
        .diagnostics-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .run-diagnostics-button {
          background-color: #2c3e50;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .run-diagnostics-button:hover {
          background-color: #1a252f;
        }
        
        .run-diagnostics-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .view-report-button {
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .diagnostics-results {
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .diagnostics-results.pass {
          background-color: rgba(46, 204, 113, 0.1);
          border-left: 4px solid #2ecc71;
        }
        
        .diagnostics-results.fail {
          background-color: rgba(231, 76, 60, 0.1);
          border-left: 4px solid #e74c3c;
        }
        
        .summary-stats {
          display: flex;
          gap: 20px;
          margin: 15px 0;
        }
        
        .stat-item {
          background-color: white;
          border-radius: 4px;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }
        
        .stat-label {
          font-size: 0.9em;
          color: #7f8c8d;
        }
        
        .stat-value {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 5px;
        }
        
        .component-results {
          margin-top: 25px;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .component-card {
          background-color: white;
          border-radius: 6px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          position: relative;
        }
        
        .component-card.pass {
          border-top: 3px solid #2ecc71;
        }
        
        .component-card.fail {
          border-top: 3px solid #e74c3c;
        }
        
        .component-card.skip {
          border-top: 3px solid #f39c12;
        }
        
        .status-badge {
          display: inline-block;
          padding: 3px 6px;
          border-radius: 3px;
          font-size: 0.7em;
          font-weight: bold;
          color: white;
          position: absolute;
          top: 15px;
          right: 15px;
        }
        
        .status-badge.pass {
          background-color: #2ecc71;
        }
        
        .status-badge.fail {
          background-color: #e74c3c;
        }
        
        .status-badge.skip {
          background-color: #f39c12;
        }
        
        .status-badge.unknown {
          background-color: #95a5a6;
        }
        
        .action-plan {
          margin-top: 25px;
          background-color: white;
          border-radius: 6px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        
        .recommendations ul {
          margin-top: 10px;
          padding-left: 20px;
        }
        
        .recommendations li {
          margin-bottom: 8px;
        }
        
        .results-comparison {
          margin-top: 25px;
          background-color: white;
          border-radius: 6px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        
        .changes-list {
          margin-top: 15px;
        }
        
        .change-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f1f1;
        }
        
        .change-item.improved {
          background-color: rgba(46, 204, 113, 0.1);
        }
        
        .change-item.degraded {
          background-color: rgba(231, 76, 60, 0.1);
        }
        
        .change-arrow {
          margin: 0 8px;
          color: #7f8c8d;
        }
        
        .diagnostic-history-section {
          margin-top: 20px;
        }
        
        .toggle-history-button {
          background-color: transparent;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          color: #34495e;
          transition: background-color 0.2s;
        }
        
        .toggle-history-button:hover {
          background-color: #ecf0f1;
        }
        
        .diagnostic-history {
          margin-top: 15px;
        }
        
        .history-list {
          margin-top: 10px;
        }
        
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .history-item:hover {
          background-color: #f5f5f5;
        }
        
        .history-item.pass {
          border-left: 3px solid #2ecc71;
        }
        
        .history-item.fail {
          border-left: 3px solid #e74c3c;
        }
        
        .history-status {
          padding: 3px 6px;
          border-radius: 3px;
          font-size: 0.7em;
          font-weight: bold;
          color: white;
        }
        
        .history-status.pass {
          background-color: #2ecc71;
        }
        
        .history-status.fail {
          background-color: #e74c3c;
        }
        
        .no-results-message {
          text-align: center;
          padding: 30px;
          color: #7f8c8d;
        }
        
        .diagnostics-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* RTL specific styles */
        [dir="rtl"] .component-card {
          text-align: right;
        }
        
        [dir="rtl"] .status-badge {
          right: auto;
          left: 15px;
        }
        
        [dir="rtl"] .recommendations ul {
          padding-right: 20px;
          padding-left: 0;
        }
        
        [dir="rtl"] .history-item {
          border-left: none;
        }
        
        [dir="rtl"] .history-item.pass {
          border-right: 3px solid #2ecc71;
        }
        
        [dir="rtl"] .history-item.fail {
          border-right: 3px solid #e74c3c;
        }
      `}</style>
    </div>
  );
};

/**
 * Small diagnostics widget for embedding in other components
 * Shows system status and allows running quick diagnostics
 */
export const DiagnosticsWidget = ({ language = 'ar', onOpenFullDiagnostics }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  
  const checkSystem = async () => {
    setIsChecking(true);
    try {
      const results = await runSystemDiagnostics({ quickTest: true });
      const isNormal = isSystemOperatingNormally(results);
      setSystemStatus({
        isNormal,
        results,
        timestamp: new Date().toISOString()
      });
      saveDiagnosticResults(results);
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus({
        isNormal: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    // Check system status on mount
    checkSystem();
    
    // Schedule periodic checks every 30 minutes
    const intervalId = setInterval(checkSystem, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getStatusLabel = () => {
    if (!systemStatus) return language === 'ar' ? 'جاري الفحص...' : 'Checking...';
    if (systemStatus.isNormal) return language === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System operating normally';
    return language === 'ar' ? 'توجد مشكلات في النظام' : 'System issues detected';
  };
  
  return (
    <div className={`diagnostics-widget ${systemStatus?.isNormal ? 'normal' : 'issues'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="widget-status">
        <div className={`status-indicator ${systemStatus?.isNormal ? 'normal' : 'issues'}`}></div>
        <span className="status-label">{getStatusLabel()}</span>
      </div>
      
      <div className="widget-actions">
        <button 
          className="check-button" 
          onClick={checkSystem} 
          disabled={isChecking}
        >
          {isChecking 
            ? (language === 'ar' ? 'جاري الفحص...' : 'Checking...') 
            : (language === 'ar' ? 'فحص الآن' : 'Check Now')}
        </button>
        
        {onOpenFullDiagnostics && (
          <button 
            className="full-diagnostics-button" 
            onClick={onOpenFullDiagnostics}
          >
            {language === 'ar' ? 'تشخيص كامل' : 'Full Diagnostics'}
          </button>
        )}
      </div>
      
      {systemStatus && systemStatus.results && (
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">{systemStatus.results.summary.passed}</span>
            <span className="stat-label">{language === 'ar' ? 'ناجح' : 'Passed'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{systemStatus.results.summary.failed}</span>
            <span className="stat-label">{language === 'ar' ? 'فاشل' : 'Failed'}</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .diagnostics-widget {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding: 12px;
          margin: 10px 0;
          max-width: 300px;
        }
        
        .widget-status {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
          margin-left: 8px;
        }
        
        .status-indicator.normal {
          background-color: #2ecc71;
        }
        
        .status-indicator.issues {
          background-color: #e74c3c;
        }
        
        .widget-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        
        .check-button {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          background-color: #f8f9fa;
          cursor: pointer;
          flex: 1;
          font-size: 0.9em;
        }
        
        .check-button:hover {
          background-color: #e9ecef;
        }
        
        .check-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .full-diagnostics-button {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          background-color: #3498db;
          color: white;
          cursor: pointer;
          flex: 1;
          font-size: 0.9em;
        }
        
        .full-diagnostics-button:hover {
          background-color: #2980b9;
        }
        
        .quick-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 12px;
          border-top: 1px solid #f1f1f1;
          padding-top: 10px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.2em;
          font-weight: bold;
        }
        
        .stat-label {
          font-size: 0.8em;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default {
  DiagnosticsPanel,
  DiagnosticsWidget
};
