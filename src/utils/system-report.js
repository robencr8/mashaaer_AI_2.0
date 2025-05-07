/**
 * Mashaaer Enhanced Project
 * System Report Module
 *
 * This module provides comprehensive system reporting functionality:
 * - Component status reporting
 * - System configuration overview
 * - User profile information
 * - Emotion statistics summary
 * - Performance metrics
 * - Feature availability based on subscription
 */

import { generateMarkdownReport } from './export/generateMarkdownReport.js';

class SystemReport {
  constructor() {
    this.isInitialized = false;
    this.reportData = {
      timestamp: null,
      systemInfo: {},
      componentStatus: {},
      userProfile: {},
      emotionStats: {},
      performanceMetrics: {},
      featureAvailability: {}
    };
    this.previewMode = false;
    this.currentPreviewFormat = null;
  }

  /**
   * Initialize the system report module
   */
  initialize() {
    if (this.isInitialized) return this;

    // Register route for system report
    if (window.router) {
      window.router.registerRoute('/system-report', () => {
        this.generateReport();
        this.displayReport();
      });
    }

    this.isInitialized = true;
    console.log('System Report module initialized');
    return this;
  }

  /**
   * Generate a comprehensive system report
   * @returns {Object} The generated report data
   */
  generateReport() {
    this.reportData.timestamp = new Date().toISOString();

    // Collect system information
    this.collectSystemInfo();

    // Collect component status
    this.collectComponentStatus();

    // Collect user profile
    this.collectUserProfile();

    // Collect emotion statistics
    this.collectEmotionStats();

    // Collect performance metrics
    this.collectPerformanceMetrics();

    // Collect feature availability
    this.collectFeatureAvailability();

    console.log('System report generated:', this.reportData);
    return this.reportData;
  }

  /**
   * Collect system information
   */
  collectSystemInfo() {
    this.reportData.systemInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateTime: new Date().toLocaleString('ar-SA')
    };
  }

  /**
   * Collect component status information
   */
  collectComponentStatus() {
    const components = window.mashaaerComponents || {};

    this.reportData.componentStatus = {
      emotionDetection: {
        initialized: components.emotionDetection?.isInitialized || false,
        culturalContext: components.emotionDetection?.culturalContext || 'unknown'
      },
      emotionTimeline: {
        initialized: components.emotionTimeline?.isInitialized || false,
        entriesCount: components.emotionTimeline?.timelineData?.entries?.length || 0
      },
      assistant: {
        initialized: !!components.assistant,
        language: components.assistant?.userProfile?.language || 'unknown'
      },
      cosmicTheme: {
        initialized: window.cosmicTheme?.isInitialized || false,
        accentColor: window.cosmicTheme?.settings?.accentColor || 'unknown'
      }
    };
  }

  /**
   * Collect user profile information
   */
  collectUserProfile() {
    const assistant = window.mashaaerComponents?.assistant;

    this.reportData.userProfile = {
      preferredDialect: assistant?.userProfile?.preferredDialect || 'unknown',
      preferredTone: assistant?.userProfile?.preferredTone || 'unknown',
      preferredVoiceProfile: assistant?.userProfile?.preferredVoiceProfile || 'unknown',
      language: assistant?.userProfile?.language || 'unknown',
      subscriptionLevel: window.mashaaerComponents?.emotionDetection?.subscriptionLevel || 'unknown'
    };
  }

  /**
   * Collect emotion statistics
   */
  collectEmotionStats() {
    const timeline = window.mashaaerComponents?.emotionTimeline;

    if (timeline && timeline.timelineData && timeline.timelineData.stats) {
      const stats = timeline.timelineData.stats;

      this.reportData.emotionStats = {
        mostFrequentEmotion: stats.mostFrequent || 'unknown',
        averageIntensity: stats.averageIntensity || 0,
        emotionCounts: stats.emotionCounts || {},
        totalEmotionEntries: timeline.timelineData.entries?.length || 0,
        lastUpdated: timeline.timelineData.lastUpdated || 'unknown'
      };
    } else {
      this.reportData.emotionStats = {
        status: 'unavailable',
        reason: 'Emotion timeline not initialized or no data available'
      };
    }
  }

  /**
   * Collect performance metrics
   */
  collectPerformanceMetrics() {
    // Basic performance metrics
    const performance = window.performance || {};

    this.reportData.performanceMetrics = {
      memoryUsage: performance.memory ? {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB',
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024)) + ' MB'
      } : 'unavailable',
      navigationTiming: performance.timing ? {
        pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart + ' ms',
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart + ' ms'
      } : 'unavailable'
    };
  }

  /**
   * Collect feature availability information
   */
  collectFeatureAvailability() {
    const emotionDetection = window.mashaaerComponents?.emotionDetection;
    const emotionTimeline = window.mashaaerComponents?.emotionTimeline;

    this.reportData.featureAvailability = {
      basicEmotionDetection: emotionDetection?.canAccessFeature('basicEmotionDetection') || false,
      advancedEmotionDetection: emotionDetection?.canAccessFeature('advancedEmotionDetection') || false,
      facialEmotionDetection: emotionDetection?.canAccessFeature('facialEmotionDetection') || false,
      emotionTimeline: emotionDetection?.canAccessFeature('emotionTimeline') || false,
      basicTimeline: emotionTimeline?.canAccessFeature('basicTimeline') || false,
      extendedHistory: emotionTimeline?.canAccessFeature('extendedHistory') || false,
      advancedVisualization: emotionTimeline?.canAccessFeature('advancedVisualization') || false,
      emotionPatternRecognition: emotionTimeline?.canAccessFeature('emotionPatternRecognition') || false,
      emotionExport: emotionTimeline?.canAccessFeature('emotionExport') || false,
      customTimeRanges: emotionTimeline?.canAccessFeature('customTimeRanges') || false
    };
  }

  /**
   * Display the system report in the UI
   */
  displayReport() {
    // Create report container if it doesn't exist
    let reportContainer = document.getElementById('system-report-container');
    if (!reportContainer) {
      reportContainer = document.createElement('div');
      reportContainer.id = 'system-report-container';
      reportContainer.style.position = 'fixed';
      reportContainer.style.top = '50%';
      reportContainer.style.left = '50%';
      reportContainer.style.transform = 'translate(-50%, -50%)';
      reportContainer.style.backgroundColor = 'var(--bg-primary, #ffffff)';
      reportContainer.style.padding = '20px';
      reportContainer.style.borderRadius = '10px';
      reportContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      reportContainer.style.zIndex = '1002';
      reportContainer.style.maxWidth = '80%';
      reportContainer.style.maxHeight = '80%';
      reportContainer.style.overflow = 'auto';
      reportContainer.style.direction = 'rtl'; // RTL for Arabic
      document.body.appendChild(reportContainer);
    }

    // Clear previous content
    reportContainer.innerHTML = '';

    // Add header
    const header = document.createElement('h2');
    header.textContent = 'تقرير النظام الشامل';
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    reportContainer.appendChild(header);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      this.previewMode = false;
      this.currentPreviewFormat = null;
      reportContainer.remove();
    };
    reportContainer.appendChild(closeButton);

    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.innerHTML = `<strong>وقت التقرير:</strong> ${new Date(this.reportData.timestamp).toLocaleString('ar-SA')}`;
    timestamp.style.marginBottom = '20px';
    timestamp.style.textAlign = 'center';
    reportContainer.appendChild(timestamp);

    // If in preview mode, show the preview
    if (this.previewMode && this.currentPreviewFormat) {
      this.showPreview(reportContainer);
      return;
    }

    // Add export buttons container
    const exportButtonsContainer = document.createElement('div');
    exportButtonsContainer.style.display = 'flex';
    exportButtonsContainer.style.justifyContent = 'center';
    exportButtonsContainer.style.gap = '10px';
    exportButtonsContainer.style.marginBottom = '20px';
    exportButtonsContainer.style.flexWrap = 'wrap';

    // Add JSON preview button
    const previewJsonButton = document.createElement('button');
    previewJsonButton.textContent = 'معاينة التقرير (JSON)';
    previewJsonButton.style.padding = '8px 16px';
    previewJsonButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    previewJsonButton.style.color = 'white';
    previewJsonButton.style.border = 'none';
    previewJsonButton.style.borderRadius = '5px';
    previewJsonButton.style.cursor = 'pointer';
    previewJsonButton.style.margin = '5px';
    previewJsonButton.onclick = () => {
      this.previewMode = true;
      this.currentPreviewFormat = 'json';
      this.displayReport();
    };
    exportButtonsContainer.appendChild(previewJsonButton);

    // Add JSON export button
    const exportJsonButton = document.createElement('button');
    exportJsonButton.textContent = 'تصدير التقرير (JSON)';
    exportJsonButton.style.padding = '8px 16px';
    exportJsonButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    exportJsonButton.style.color = 'white';
    exportJsonButton.style.border = 'none';
    exportJsonButton.style.borderRadius = '5px';
    exportJsonButton.style.cursor = 'pointer';
    exportJsonButton.style.margin = '5px';
    exportJsonButton.onclick = () => this.exportReport();
    exportButtonsContainer.appendChild(exportJsonButton);

    // Add Markdown preview button
    const previewMarkdownButton = document.createElement('button');
    previewMarkdownButton.textContent = 'معاينة التقرير (Markdown)';
    previewMarkdownButton.style.padding = '8px 16px';
    previewMarkdownButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    previewMarkdownButton.style.color = 'white';
    previewMarkdownButton.style.border = 'none';
    previewMarkdownButton.style.borderRadius = '5px';
    previewMarkdownButton.style.cursor = 'pointer';
    previewMarkdownButton.style.margin = '5px';
    previewMarkdownButton.onclick = () => {
      this.previewMode = true;
      this.currentPreviewFormat = 'markdown';
      this.displayReport();
    };
    exportButtonsContainer.appendChild(previewMarkdownButton);

    // Add Markdown export button
    const exportMarkdownButton = document.createElement('button');
    exportMarkdownButton.textContent = 'تصدير التقرير (Markdown)';
    exportMarkdownButton.style.padding = '8px 16px';
    exportMarkdownButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    exportMarkdownButton.style.color = 'white';
    exportMarkdownButton.style.border = 'none';
    exportMarkdownButton.style.borderRadius = '5px';
    exportMarkdownButton.style.cursor = 'pointer';
    exportMarkdownButton.style.margin = '5px';
    exportMarkdownButton.onclick = () => this.exportMarkdownReport();
    exportButtonsContainer.appendChild(exportMarkdownButton);

    // Add PDF preview button
    const previewPdfButton = document.createElement('button');
    previewPdfButton.textContent = 'معاينة التقرير (PDF)';
    previewPdfButton.style.padding = '8px 16px';
    previewPdfButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    previewPdfButton.style.color = 'white';
    previewPdfButton.style.border = 'none';
    previewPdfButton.style.borderRadius = '5px';
    previewPdfButton.style.cursor = 'pointer';
    previewPdfButton.style.margin = '5px';
    previewPdfButton.onclick = () => {
      this.previewMode = true;
      this.currentPreviewFormat = 'pdf';
      this.displayReport();
    };
    exportButtonsContainer.appendChild(previewPdfButton);

    // Add PDF export button
    const exportPdfButton = document.createElement('button');
    exportPdfButton.textContent = 'تصدير التقرير (PDF)';
    exportPdfButton.style.padding = '8px 16px';
    exportPdfButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    exportPdfButton.style.color = 'white';
    exportPdfButton.style.border = 'none';
    exportPdfButton.style.borderRadius = '5px';
    exportPdfButton.style.cursor = 'pointer';
    exportPdfButton.style.margin = '5px';
    exportPdfButton.onclick = () => this.exportPdfReport();
    exportButtonsContainer.appendChild(exportPdfButton);

    // Add Copy to Clipboard button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'نسخ إلى الحافظة';
    copyButton.style.padding = '8px 16px';
    copyButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.margin = '5px';
    copyButton.onclick = () => this.copyReportToClipboard();
    exportButtonsContainer.appendChild(copyButton);

    reportContainer.appendChild(exportButtonsContainer);

    // Add sections
    this.addReportSection(reportContainer, 'معلومات النظام', this.reportData.systemInfo);
    this.addReportSection(reportContainer, 'حالة المكونات', this.reportData.componentStatus);
    this.addReportSection(reportContainer, 'ملف المستخدم', this.reportData.userProfile);
    this.addReportSection(reportContainer, 'إحصائيات المشاعر', this.reportData.emotionStats);
    this.addReportSection(reportContainer, 'مقاييس الأداء', this.reportData.performanceMetrics);
    this.addReportSection(reportContainer, 'توفر الميزات', this.reportData.featureAvailability);
  }

  /**
   * Add a section to the report display
   * @param {HTMLElement} container - The container element
   * @param {string} title - Section title
   * @param {Object} data - Section data
   */
  addReportSection(container, title, data) {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';
    section.style.padding = '10px';
    section.style.backgroundColor = 'var(--bg-secondary, #f0f0f0)';
    section.style.borderRadius = '5px';

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = title;
    sectionTitle.style.marginTop = '0';
    section.appendChild(sectionTitle);

    const sectionContent = document.createElement('div');

    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.style.margin = '5px 0';

        let displayValue = value;
        if (typeof value === 'object' && value !== null) {
          displayValue = JSON.stringify(value, null, 2);
        }

        item.innerHTML = `<strong>${this.formatKey(key)}:</strong> ${displayValue}`;
        sectionContent.appendChild(item);
      });
    } else {
      sectionContent.textContent = String(data);
    }

    section.appendChild(sectionContent);
    container.appendChild(section);
  }

  /**
   * Format a key for display
   * @param {string} key - The key to format
   * @returns {string} Formatted key
   */
  formatKey(key) {
    // Convert camelCase to words with spaces and capitalize first letter
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Export the report as a JSON file
   */
  exportReport() {
    const dataStr = JSON.stringify(this.reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileName = `mashaaer-system-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }

  /**
   * Export the report as a Markdown file
   */
  exportMarkdownReport() {
    const markdown = generateMarkdownReport({
      filename: 'تقرير النظام الشامل',
      analysis: {
        complexity: this.reportData.performanceMetrics?.memoryUsage ? [
          { name: 'استخدام الذاكرة', complexity: this.reportData.performanceMetrics.memoryUsage.usedJSHeapSize || 'غير متوفر' }
        ] : [],
        duplication: [],
        codeSmells: [],
        dependencies: Object.entries(this.reportData.componentStatus || {}).map(([key, value]) => 
          `${key}: ${value.initialized ? 'مُفعّل' : 'غير مُفعّل'}`
        )
      },
      summary: {
        description: 'تقرير شامل عن حالة النظام والمكونات والأداء',
        message: `تم إنشاء هذا التقرير في ${new Date(this.reportData.timestamp).toLocaleString('ar-SA')}`,
        performance: this.reportData.performanceMetrics?.navigationTiming || {}
      }
    });

    const dataUri = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown);
    const exportFileName = `mashaaer-system-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.md`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }

  /**
   * Generate a report and return it as an object (for API use)
   * @returns {Object} The report data
   */
  getReportData() {
    return this.generateReport();
  }

  /**
   * Show a preview of the report in the specified format
   * @param {HTMLElement} container - The container element to show the preview in
   */
  showPreview(container) {
    // Create a back button
    const backButton = document.createElement('button');
    backButton.textContent = 'العودة إلى التقرير';
    backButton.style.padding = '8px 16px';
    backButton.style.backgroundColor = 'var(--accent-color, #9370db)';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    backButton.style.margin = '0 auto 20px auto';
    backButton.style.display = 'block';
    backButton.onclick = () => {
      this.previewMode = false;
      this.currentPreviewFormat = null;
      this.displayReport();
    };
    container.appendChild(backButton);

    // Create a preview container
    const previewContainer = document.createElement('div');
    previewContainer.style.backgroundColor = 'var(--bg-secondary, #f0f0f0)';
    previewContainer.style.padding = '20px';
    previewContainer.style.borderRadius = '5px';
    previewContainer.style.maxHeight = '60vh';
    previewContainer.style.overflow = 'auto';
    previewContainer.style.marginBottom = '20px';
    previewContainer.style.whiteSpace = 'pre-wrap';
    previewContainer.style.fontFamily = 'monospace';
    previewContainer.style.direction = this.currentPreviewFormat === 'markdown' ? 'rtl' : 'ltr';

    // Generate preview content based on format
    let previewContent = '';
    let downloadButton = null;

    switch (this.currentPreviewFormat) {
      case 'json':
        previewContent = JSON.stringify(this.reportData, null, 2);
        previewContainer.style.textAlign = 'left';
        downloadButton = this.createDownloadButton('تنزيل (JSON)', () => this.exportReport());
        break;
      case 'markdown':
        previewContent = this.generateMarkdownPreview();
        previewContainer.style.textAlign = 'right';
        downloadButton = this.createDownloadButton('تنزيل (Markdown)', () => this.exportMarkdownReport());
        break;
      case 'pdf':
        previewContent = 'جاري تحميل معاينة PDF...';
        previewContainer.style.textAlign = 'center';

        // Create an iframe for PDF preview
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '500px';
        iframe.style.border = 'none';

        // Load jsPDF from CDN
        this.loadJsPDF().then(() => {
          const pdfDataUri = this.generatePdfPreview();
          iframe.src = pdfDataUri;
          previewContainer.innerHTML = '';
          previewContainer.appendChild(iframe);
        }).catch(error => {
          previewContainer.textContent = 'فشل في تحميل معاينة PDF: ' + error.message;
        });

        downloadButton = this.createDownloadButton('تنزيل (PDF)', () => this.exportPdfReport());
        break;
      default:
        previewContent = 'صيغة غير مدعومة';
    }

    // Set preview content
    if (this.currentPreviewFormat !== 'pdf') {
      previewContainer.textContent = previewContent;
    }

    container.appendChild(previewContainer);

    // Add copy to clipboard button
    const copyButton = this.createDownloadButton('نسخ إلى الحافظة', () => {
      this.copyReportToClipboard(this.currentPreviewFormat);

      // Show copy success message
      const successMessage = document.createElement('div');
      successMessage.textContent = 'تم النسخ إلى الحافظة بنجاح!';
      successMessage.style.backgroundColor = '#4CAF50';
      successMessage.style.color = 'white';
      successMessage.style.padding = '10px';
      successMessage.style.borderRadius = '5px';
      successMessage.style.textAlign = 'center';
      successMessage.style.marginTop = '10px';

      // Remove the message after 2 seconds
      container.appendChild(successMessage);
      setTimeout(() => {
        successMessage.remove();
      }, 2000);
    });

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '10px';

    // Add buttons
    if (downloadButton) {
      buttonContainer.appendChild(downloadButton);
    }
    buttonContainer.appendChild(copyButton);

    container.appendChild(buttonContainer);
  }

  /**
   * Create a download button
   * @param {string} text - Button text
   * @param {Function} onClick - Click handler
   * @returns {HTMLElement} The button element
   */
  createDownloadButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '8px 16px';
    button.style.backgroundColor = 'var(--accent-color, #9370db)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.onclick = onClick;
    return button;
  }

  /**
   * Generate a Markdown preview
   * @returns {string} Markdown content
   */
  generateMarkdownPreview() {
    return generateMarkdownReport({
      filename: 'تقرير النظام الشامل',
      analysis: {
        complexity: this.reportData.performanceMetrics?.memoryUsage ? [
          { name: 'استخدام الذاكرة', complexity: this.reportData.performanceMetrics.memoryUsage.usedJSHeapSize || 'غير متوفر' }
        ] : [],
        duplication: [],
        codeSmells: [],
        dependencies: Object.entries(this.reportData.componentStatus || {}).map(([key, value]) => 
          `${key}: ${value.initialized ? 'مُفعّل' : 'غير مُفعّل'}`
        )
      },
      summary: {
        description: 'تقرير شامل عن حالة النظام والمكونات والأداء',
        message: `تم إنشاء هذا التقرير في ${new Date(this.reportData.timestamp).toLocaleString('ar-SA')}`,
        performance: this.reportData.performanceMetrics?.navigationTiming || {}
      }
    });
  }

  /**
   * Load jsPDF library from CDN
   * @returns {Promise} Promise that resolves when jsPDF is loaded
   */
  loadJsPDF() {
    return new Promise((resolve, reject) => {
      if (window.jspdf) {
        resolve(window.jspdf);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve(window.jspdf);
      script.onerror = (error) => reject(new Error('Failed to load jsPDF library'));
      document.head.appendChild(script);
    });
  }

  /**
   * Generate a PDF preview
   * @returns {string} Data URI for the PDF
   */
  generatePdfPreview() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set RTL mode for Arabic
    doc.setR2L(true);

    // Add title
    doc.setFontSize(24);
    doc.text('تقرير النظام الشامل', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Add timestamp
    doc.setFontSize(12);
    doc.text(`وقت التقرير: ${new Date(this.reportData.timestamp).toLocaleString('ar-SA')}`, 
      doc.internal.pageSize.width / 2, 30, { align: 'center' });

    // Add sections
    let yPosition = 40;
    const sections = [
      { title: 'معلومات النظام', data: this.reportData.systemInfo },
      { title: 'حالة المكونات', data: this.reportData.componentStatus },
      { title: 'ملف المستخدم', data: this.reportData.userProfile },
      { title: 'إحصائيات المشاعر', data: this.reportData.emotionStats },
      { title: 'مقاييس الأداء', data: this.reportData.performanceMetrics },
      { title: 'توفر الميزات', data: this.reportData.featureAvailability }
    ];

    sections.forEach(section => {
      // Add section title
      doc.setFontSize(16);
      doc.text(section.title, 10, yPosition);
      yPosition += 10;

      // Add section content
      doc.setFontSize(10);
      if (typeof section.data === 'object' && section.data !== null) {
        Object.entries(section.data).forEach(([key, value]) => {
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
            displayValue = JSON.stringify(value);
          }

          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.text(`${this.formatKey(key)}: ${displayValue}`, 15, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text(String(section.data), 15, yPosition);
        yPosition += 7;
      }

      yPosition += 5;
    });

    return doc.output('datauristring');
  }

  /**
   * Export the report as a PDF file
   */
  exportPdfReport() {
    this.loadJsPDF().then(() => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set RTL mode for Arabic
      doc.setR2L(true);

      // Add title
      doc.setFontSize(24);
      doc.text('تقرير النظام الشامل', doc.internal.pageSize.width / 2, 20, { align: 'center' });

      // Add timestamp
      doc.setFontSize(12);
      doc.text(`وقت التقرير: ${new Date(this.reportData.timestamp).toLocaleString('ar-SA')}`, 
        doc.internal.pageSize.width / 2, 30, { align: 'center' });

      // Add sections
      let yPosition = 40;
      const sections = [
        { title: 'معلومات النظام', data: this.reportData.systemInfo },
        { title: 'حالة المكونات', data: this.reportData.componentStatus },
        { title: 'ملف المستخدم', data: this.reportData.userProfile },
        { title: 'إحصائيات المشاعر', data: this.reportData.emotionStats },
        { title: 'مقاييس الأداء', data: this.reportData.performanceMetrics },
        { title: 'توفر الميزات', data: this.reportData.featureAvailability }
      ];

      sections.forEach(section => {
        // Add section title
        doc.setFontSize(16);
        doc.text(section.title, 10, yPosition);
        yPosition += 10;

        // Add section content
        doc.setFontSize(10);
        if (typeof section.data === 'object' && section.data !== null) {
          Object.entries(section.data).forEach(([key, value]) => {
            let displayValue = value;
            if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value);
            }

            // Check if we need a new page
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }

            doc.text(`${this.formatKey(key)}: ${displayValue}`, 15, yPosition);
            yPosition += 7;
          });
        } else {
          doc.text(String(section.data), 15, yPosition);
          yPosition += 7;
        }

        yPosition += 5;
      });

      // Save the PDF
      const exportFileName = `mashaaer-system-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      doc.save(exportFileName);
    }).catch(error => {
      console.error('Failed to export PDF:', error);
      alert('فشل في تصدير التقرير بصيغة PDF. يرجى المحاولة مرة أخرى لاحقًا.');
    });
  }

  /**
   * Copy the report to the clipboard
   * @param {string} format - The format to copy (json, markdown, pdf)
   */
  copyReportToClipboard(format = 'json') {
    let content = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(this.reportData, null, 2);
        break;
      case 'markdown':
        content = this.generateMarkdownPreview();
        break;
      case 'pdf':
        alert('لا يمكن نسخ تنسيق PDF إلى الحافظة. يرجى اختيار تنسيق آخر.');
        return;
      default:
        content = JSON.stringify(this.reportData, null, 2);
    }

    // Use the Clipboard API to copy the content
    navigator.clipboard.writeText(content)
      .then(() => {
        console.log('Report copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy report to clipboard:', err);

        // Fallback method for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();

        try {
          document.execCommand('copy');
          console.log('Report copied to clipboard (fallback)');
        } catch (err) {
          console.error('Failed to copy report to clipboard (fallback):', err);
          alert('فشل في نسخ التقرير إلى الحافظة. يرجى المحاولة مرة أخرى لاحقًا.');
        }

        document.body.removeChild(textarea);
      });
  }
}

export default SystemReport;
