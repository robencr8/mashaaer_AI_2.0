import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a real application, these would be environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Translation Service
 * 
 * This service handles all interactions with the Supabase backend for translation management.
 * It provides functions for fetching, saving, and tracking translations.
 */
const translationService = {
  /**
   * Initialize the translation service
   */
  init: () => {
    console.log('Translation service initialized');
    // Check if we're connected to Supabase
    translationService.checkConnection();
  },

  /**
   * Check connection to Supabase
   * @returns {Promise<boolean>} True if connected, false otherwise
   */
  checkConnection: async () => {
    try {
      const { error } = await supabase.from('health_check').select('*').limit(1);
      if (error) {
        console.error('Error connecting to Supabase:', error);
        return false;
      }
      console.log('Connected to Supabase successfully');
      return true;
    } catch (error) {
      console.error('Error checking Supabase connection:', error);
      return false;
    }
  },

  /**
   * Get all translations for a specific language and category
   * @param {string} language - Language code (e.g., 'en', 'ar')
   * @param {string} category - Category (e.g., 'ui', 'tooltips', 'onboarding')
   * @returns {Promise<Object>} Translations object
   */
  getTranslations: async (language, category) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language', language)
        .eq('category', category);

      if (error) {
        console.error('Error fetching translations:', error);
        return null;
      }

      // Transform the data into the expected format
      const transformedData = {};
      data.forEach(item => {
        transformedData[item.key] = item.value;
      });

      return transformedData;
    } catch (error) {
      console.error('Error in getTranslations:', error);
      return null;
    }
  },

  /**
   * Save a translation
   * @param {string} language - Language code
   * @param {string} category - Category
   * @param {string} key - Translation key
   * @param {string} value - Translation value
   * @param {string} userId - ID of the user making the change
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  saveTranslation: async (language, category, key, value, userId) => {
    try {
      // First check if the translation exists
      const { data: existingData, error: fetchError } = await supabase
        .from('translations')
        .select('*')
        .eq('language', language)
        .eq('category', category)
        .eq('key', key)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking existing translation:', fetchError);
        return false;
      }

      // If it exists, update it
      if (existingData) {
        // Save the old version to history first
        await translationService.saveTranslationHistory(
          existingData.id,
          existingData.language,
          existingData.category,
          existingData.key,
          existingData.value,
          userId
        );

        // Then update the translation
        const { error: updateError } = await supabase
          .from('translations')
          .update({ 
            value, 
            updated_at: new Date().toISOString(),
            updated_by: userId
          })
          .eq('id', existingData.id);

        if (updateError) {
          console.error('Error updating translation:', updateError);
          return false;
        }
      } else {
        // If it doesn't exist, insert it
        const { error: insertError } = await supabase
          .from('translations')
          .insert({
            language,
            category,
            key,
            value,
            created_at: new Date().toISOString(),
            created_by: userId,
            updated_at: new Date().toISOString(),
            updated_by: userId
          });

        if (insertError) {
          console.error('Error inserting translation:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in saveTranslation:', error);
      return false;
    }
  },

  /**
   * Save a translation to the history table
   * @param {number} translationId - ID of the translation
   * @param {string} language - Language code
   * @param {string} category - Category
   * @param {string} key - Translation key
   * @param {string} value - Translation value
   * @param {string} userId - ID of the user making the change
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  saveTranslationHistory: async (translationId, language, category, key, value, userId) => {
    try {
      const { error } = await supabase
        .from('translation_history')
        .insert({
          translation_id: translationId,
          language,
          category,
          key,
          value,
          created_at: new Date().toISOString(),
          created_by: userId
        });

      if (error) {
        console.error('Error saving translation history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveTranslationHistory:', error);
      return false;
    }
  },

  /**
   * Get translation history for a specific translation
   * @param {string} language - Language code
   * @param {string} category - Category
   * @param {string} key - Translation key
   * @returns {Promise<Array>} Array of history entries
   */
  getTranslationHistory: async (language, category, key) => {
    try {
      // First get the translation ID
      const { data: translation, error: translationError } = await supabase
        .from('translations')
        .select('id')
        .eq('language', language)
        .eq('category', category)
        .eq('key', key)
        .single();

      if (translationError) {
        console.error('Error fetching translation:', translationError);
        return [];
      }

      // Then get the history
      const { data: history, error: historyError } = await supabase
        .from('translation_history')
        .select('*')
        .eq('translation_id', translation.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Error fetching translation history:', historyError);
        return [];
      }

      return history;
    } catch (error) {
      console.error('Error in getTranslationHistory:', error);
      return [];
    }
  },

  /**
   * Get all languages
   * @returns {Promise<Array>} Array of language objects
   */
  getLanguages: async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching languages:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getLanguages:', error);
      return [];
    }
  },

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of category objects
   */
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  },

  /**
   * Subscribe to translation changes
   * @param {string} language - Language code
   * @param {string} category - Category
   * @param {Function} callback - Callback function to call when translations change
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToTranslations: (language, category, callback) => {
    const subscription = supabase
      .channel(`translations-${language}-${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations',
          filter: `language=eq.${language}&category=eq.${category}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      }
    };
  },

  /**
   * Get all users who are currently editing translations
   * @returns {Promise<Array>} Array of user objects
   */
  getActiveUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('active_users')
        .select('*')
        .gt('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Active in the last 5 minutes

      if (error) {
        console.error('Error fetching active users:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getActiveUsers:', error);
      return [];
    }
  },

  /**
   * Update user's active status
   * @param {string} userId - User ID
   * @param {string} language - Language code the user is editing
   * @param {string} category - Category the user is editing
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  updateUserActivity: async (userId, language, category) => {
    try {
      const { error } = await supabase
        .from('active_users')
        .upsert({
          user_id: userId,
          language,
          category,
          last_active: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserActivity:', error);
      return false;
    }
  },

  /**
   * Export all translations for a language
   * @param {string} language - Language code
   * @returns {Promise<Object>} Translations object
   */
  exportTranslations: async (language) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language', language);

      if (error) {
        console.error('Error exporting translations:', error);
        return null;
      }

      // Transform the data into the expected format
      const result = {};
      data.forEach(item => {
        if (!result[item.category]) {
          result[item.category] = {};
        }
        result[item.category][item.key] = item.value;
      });

      return result;
    } catch (error) {
      console.error('Error in exportTranslations:', error);
      return null;
    }
  },

  /**
   * Import translations for a language
   * @param {string} language - Language code
   * @param {Object} translations - Translations object
   * @param {string} userId - ID of the user making the change
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  importTranslations: async (language, translations, userId) => {
    try {
      // Start a transaction
      const { error } = await supabase.rpc('import_translations', {
        p_language: language,
        p_translations: JSON.stringify(translations),
        p_user_id: userId
      });

      if (error) {
        console.error('Error importing translations:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in importTranslations:', error);
      return false;
    }
  }
};

export default translationService;
