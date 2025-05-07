import React, { useState, useEffect } from 'react';
import { getMissingNodes } from '../utils/memory-engine.js';

/**
 * Integration Settings Component
 * 
 * This component provides settings for various integrations,
 * including a feature to review missing nodes.
 */
const IntegrationSettings = () => {
  const [missingNodes, setMissingNodes] = useState([]);
  const [showMissingNodes, setShowMissingNodes] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  // Load missing nodes when the component mounts or when showMissingNodes changes
  useEffect(() => {
    if (showMissingNodes) {
      const nodes = getMissingNodes();
      setMissingNodes(nodes);
    }
  }, [showMissingNodes]);

  // Check if the entered admin key is valid
  const verifyAdminKey = () => {
    // In a real application, this would be a secure verification process
    // For this example, we're using a simple check against the .env value
    const validKey = process.env.REACT_APP_ADMIN_API_KEY || 'admin123';
    if (adminKey === validKey) {
      setIsAdmin(true);
    } else {
      alert('مفتاح الإدارة غير صحيح');
    }
  };

  // Format timestamp to a readable date and time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
  };

  return (
    <div id="integration-settings" className="integration-settings-container">
      <h2>إعدادات التكامل</h2>

      {!isAdmin ? (
        <div className="admin-login">
          <h3>تسجيل الدخول كمسؤول</h3>
          <div className="input-group">
            <label htmlFor="admin-key">مفتاح الإدارة:</label>
            <input 
              type="password" 
              id="admin-key" 
              value={adminKey} 
              onChange={(e) => setAdminKey(e.target.value)} 
              className="cosmic-input"
            />
          </div>
          <button onClick={verifyAdminKey} className="cosmic-button">تسجيل الدخول</button>
        </div>
      ) : (
        <div className="admin-panel">
          <h3>لوحة الإدارة</h3>

          <div className="missing-nodes-section">
            <div className="section-header">
              <h4>العقد المفقودة</h4>
              <button 
                onClick={() => setShowMissingNodes(!showMissingNodes)} 
                className="cosmic-button"
              >
                {showMissingNodes ? 'إخفاء' : 'عرض'} العقد المفقودة
              </button>
            </div>

            {showMissingNodes && (
              <div className="missing-nodes-list">
                {missingNodes.length === 0 ? (
                  <p>لا توجد عقد مفقودة مسجلة.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>المعرف</th>
                        <th>وقت التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {missingNodes.map((node, index) => (
                        <tr key={index}>
                          <td>{node.id}</td>
                          <td>{formatTimestamp(node.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <div className="other-settings">
            <h4>إعدادات أخرى</h4>
            <p>إعدادات إضافية للتكامل ستكون متاحة قريبًا.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationSettings;
