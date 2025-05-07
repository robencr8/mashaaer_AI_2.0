import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import translationService from '../services/translationService.js';
import './TranslationAdmin.css';

/**
 * TranslationAdmin Component
 * 
 * An enhanced admin interface for managing translations with Supabase backend integration.
 * This component allows administrators to view, edit, and track changes to translations.
 */
const TranslationAdmin = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ui');
  const [translations, setTranslations] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [historyKey, setHistoryKey] = useState('');
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [subscription, setSubscription] = useState(null);

  // Categories of translations (will be loaded from backend)
  const defaultCategories = ['ui', 'tooltips', 'onboarding'];

  // Check if user is admin on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('translation-admin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
      // Generate a random user ID if not already set
      const storedUserId = localStorage.getItem('translation-admin-user-id');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('translation-admin-user-id', newUserId);
        setUserId(newUserId);
      }
    }

    // Check connection to Supabase
    const checkConnection = async () => {
      const connected = await translationService.checkConnection();
      setIsConnected(connected);
    };
    checkConnection();
  }, []);

  // Load languages and categories when admin status changes
  useEffect(() => {
    if (isAdmin && isConnected) {
      loadLanguages();
      loadCategories();
    }
  }, [isAdmin, isConnected]);

  // Load translations when language or category changes
  useEffect(() => {
    if (isAdmin && isConnected && selectedLanguage && selectedCategory) {
      loadTranslations();
      subscribeToChanges();
      updateUserActivity();
      loadActiveUsers();
    }

    return () => {
      // Unsubscribe when component unmounts or when language/category changes
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [selectedLanguage, selectedCategory, isAdmin, isConnected]);

  // Set up a timer to update user activity and load active users periodically
  useEffect(() => {
    if (isAdmin && isConnected && selectedLanguage && selectedCategory) {
      const interval = setInterval(() => {
        updateUserActivity();
        loadActiveUsers();
      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [selectedLanguage, selectedCategory, isAdmin, isConnected]);

  // Load languages from backend
  const loadLanguages = async () => {
    try {
      setIsLoading(true);
      const data = await translationService.getLanguages();
      if (data && data.length > 0) {
        setLanguages(data);
      } else {
        // Fallback to supported languages from the app
        const { supportedLanguages } = await import('../translations');
        setLanguages(supportedLanguages);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading languages:', error);
      setMessage('Error loading languages. Using default languages.');
      // Fallback to supported languages from the app
      const { supportedLanguages } = await import('../translations');
      setLanguages(supportedLanguages);
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Load categories from backend
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await translationService.getCategories();
      if (data && data.length > 0) {
        setCategories(data.map(cat => cat.name));
      } else {
        // Fallback to default categories
        setCategories(defaultCategories);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading categories:', error);
      setMessage('Error loading categories. Using default categories.');
      setCategories(defaultCategories);
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Load active users
  const loadActiveUsers = async () => {
    try {
      const data = await translationService.getActiveUsers();
      setActiveUsers(data);
    } catch (error) {
      console.error('Error loading active users:', error);
    }
  };

  // Update user activity
  const updateUserActivity = async () => {
    if (userId && selectedLanguage && selectedCategory) {
      await translationService.updateUserActivity(userId, selectedLanguage, selectedCategory);
    }
  };

  // Subscribe to translation changes
  const subscribeToChanges = () => {
    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = translationService.subscribeToTranslations(
      selectedLanguage,
      selectedCategory,
      (payload) => {
        // Reload translations when changes are detected
        loadTranslations();
      }
    );

    setSubscription(newSubscription);
  };

  // Handle admin login
  const handleLogin = () => {
    // In a real app, this would be a secure authentication process
    // For demo purposes, we're using a simple password check
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('translation-admin', 'true');

      // Generate a random user ID
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('translation-admin-user-id', newUserId);
      setUserId(newUserId);

      setPassword('');
      setMessage('Login successful!');

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } else {
      setMessage('Invalid password. Please try again.');

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('translation-admin');
    localStorage.removeItem('translation-admin-user-id');
    setUserId('');
    setMessage('Logged out successfully!');

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // Load translations for selected language and category
  const loadTranslations = async () => {
    try {
      setIsLoading(true);

      // Try to load from Supabase first
      if (isConnected) {
        const data = await translationService.getTranslations(selectedLanguage, selectedCategory);
        if (data) {
          setTranslations(data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to local JSON files if Supabase fails or is not connected
      try {
        const translationModule = await import(`../translations/locales/${selectedLanguage}.json`);
        setTranslations(translationModule.default[selectedCategory] || {});
      } catch (error) {
        console.error('Error loading local translations:', error);
        setMessage('Error loading translations. Please try again.');
        setTranslations({});
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading translations:', error);
      setMessage('Error loading translations. Please try again.');
      setTranslations({});
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Load translation history
  const loadTranslationHistory = async (key) => {
    try {
      setIsLoading(true);
      setHistoryKey(key);

      if (isConnected) {
        const history = await translationService.getTranslationHistory(selectedLanguage, selectedCategory, key);
        setTranslationHistory(history);
        setShowHistory(true);
      } else {
        setMessage('History is only available when connected to Supabase.');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading translation history:', error);
      setMessage('Error loading translation history. Please try again.');
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Restore a translation from history
  const restoreTranslation = async (value) => {
    try {
      setIsLoading(true);

      if (isConnected) {
        const success = await translationService.saveTranslation(
          selectedLanguage,
          selectedCategory,
          historyKey,
          value,
          userId
        );

        if (success) {
          setMessage(`Translation restored successfully!`);
          loadTranslations();
          setShowHistory(false);
        } else {
          setMessage('Error restoring translation. Please try again.');
        }
      } else {
        setMessage('Restoring is only available when connected to Supabase.');
      }

      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error restoring translation:', error);
      setMessage('Error restoring translation. Please try again.');
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Start editing a translation
  const startEditing = (key, value) => {
    setEditingKey(key);
    setEditingValue(value);
  };

  // Save edited translation
  const saveTranslation = async () => {
    try {
      setIsLoading(true);

      if (isConnected) {
        // Save to Supabase
        const success = await translationService.saveTranslation(
          selectedLanguage,
          selectedCategory,
          editingKey,
          editingValue,
          userId
        );

        if (success) {
          setMessage(`Translation for "${editingKey}" updated successfully!`);
          loadTranslations();
        } else {
          setMessage('Error saving translation. Please try again.');
        }
      } else {
        // Update local state only (for demo purposes)
        const updatedTranslations = { ...translations };
        updatedTranslations[editingKey] = editingValue;
        setTranslations(updatedTranslations);

        setMessage(`Translation for "${editingKey}" updated in local state only. Connect to Supabase to save permanently.`);
      }

      setEditingKey('');
      setEditingValue('');
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving translation:', error);
      setMessage('Error saving translation. Please try again.');
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingKey('');
    setEditingValue('');
  };

  // Toggle visibility of the admin panel
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Export translations
  const handleExport = async () => {
    try {
      setIsLoading(true);

      let exportData;
      if (isConnected) {
        exportData = await translationService.exportTranslations(selectedLanguage);
      } else {
        // Fallback to local JSON files
        const translationModule = await import(`../translations/locales/${selectedLanguage}.json`);
        exportData = translationModule.default;
      }

      if (exportData) {
        // Create a download link
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        const exportFileDefaultName = `${selectedLanguage}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        setMessage('Translations exported successfully!');
      } else {
        setMessage('Error exporting translations. Please try again.');
      }

      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error exporting translations:', error);
      setMessage('Error exporting translations. Please try again.');
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="translation-admin-container">
      {/* Admin panel toggle button */}
      <button 
        className="admin-toggle-button"
        onClick={toggleVisibility}
        title={isVisible ? 'Hide Translation Admin' : 'Show Translation Admin'}
      >
        🌐
      </button>

      {/* Admin panel */}
      {isVisible && (
        <div className="admin-panel" dir={language === 'ar' || language === 'ur' ? 'rtl' : 'ltr'}>
          <h2>Translation Management {isConnected ? '(Connected to Supabase)' : '(Local Mode)'}</h2>

          {/* Message display */}
          {message && (
            <div className="admin-message">
              {message}
            </div>
          )}

          {/* Login form */}
          {!isAdmin && (
            <div className="admin-login">
              <p>Please enter the admin password to continue:</p>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}

          {/* Admin interface */}
          {isAdmin && (
            <div className="admin-interface">
              {/* Translation history view */}
              {showHistory && (
                <div className="history-view">
                  {isLoading ? (
                    <div className="loading">Loading history...</div>
                  ) : (
                    <>
                      {translationHistory.length === 0 ? (
                        <p>No history available for this translation.</p>
                      ) : (
                        <table className="history-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Value</th>
                              <th>User</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {translationHistory.map((entry, index) => (
                              <tr key={index}>
                                <td>{new Date(entry.created_at).toLocaleString()}</td>
                                <td>{entry.value}</td>
                                <td>{entry.created_by}</td>
                                <td>
                                  <button onClick={() => restoreTranslation(entry.value)}>
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      <button 
                        className="back-button"
                        onClick={() => setShowHistory(false)}
                      >
                        Back to Translations
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Main translation interface */}
              {!showHistory && (
                <>
                  <div className="admin-controls">
                    <div className="control-group">
                      <label>Language:</label>
                      <select 
                        value={selectedLanguage} 
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="">Select a language</option>
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.nativeName} ({lang.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label>Category:</label>
                      <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        disabled={isLoading}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      className="export-button" 
                      onClick={handleExport}
                      disabled={!selectedLanguage || isLoading}
                    >
                      Export
                    </button>

                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>

                  {/* Active users */}
                  {activeUsers.length > 0 && (
                    <div className="active-users">
                      <h4>Active Users:</h4>
                      <div className="user-list">
                        {activeUsers.map((user, index) => (
                          <div key={index} className="active-user">
                            <span className="user-id">{user.user_id}</span>
                            <span className="user-language">{user.language}</span>
                            <span className="user-category">{user.category}</span>
                            <span className="user-time">
                              {new Date(user.last_active).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Translations table */}
                  {selectedLanguage && selectedCategory && (
                    <div className="translations-table-container">
                      {isLoading ? (
                        <div className="loading">Loading translations...</div>
                      ) : (
                        <table className="translations-table">
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Value</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(translations).map(([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>
                                  {editingKey === key ? (
                                    <textarea 
                                      value={editingValue} 
                                      onChange={(e) => setEditingValue(e.target.value)}
                                    />
                                  ) : (
                                    typeof value === 'string' ? value : JSON.stringify(value)
                                  )}
                                </td>
                                <td>
                                  {editingKey === key ? (
                                    <div className="edit-actions">
                                      <button onClick={saveTranslation}>Save</button>
                                      <button onClick={cancelEditing}>Cancel</button>
                                    </div>
                                  ) : (
                                    <div className="row-actions">
                                      <button 
                                        onClick={() => startEditing(key, value)}
                                        disabled={typeof value !== 'string'}
                                      >
                                        Edit
                                      </button>

                                      {isConnected && (
                                        <button 
                                          onClick={() => loadTranslationHistory(key)}
                                          title="View history"
                                        >
                                          History
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <button className="close-admin-button" onClick={toggleVisibility}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslationAdmin;
