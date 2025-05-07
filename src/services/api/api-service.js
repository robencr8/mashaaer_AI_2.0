/**
 * API Service
 * 
 * This service encapsulates the functionality for communicating with the backend.
 * It replaces the direct API calls in the application.
 */

import { handleRuntimeRequest } from '../../api/handleRuntimeRequest.js';
import { sendPromptToFlask } from '../../api/flask-api-service.js';
import { handleMultiengineRequest } from '../../api/llm_multiengine.js';

export class ApiService {
  constructor() {
    this.isInitialized = false;
    this.configService = null;
    this.useFlaskBackend = true;
    this.useMultiengine = true;
  }

  /**
   * Initialize the API service
   * @param {ConfigService} configService - Config service instance
   * @returns {ApiService} - This instance for chaining
   */
  initialize(configService) {
    if (this.isInitialized) return this;

    this.configService = configService;
    
    // Get configuration values
    this.useFlaskBackend = configService.get('api.useFlaskBackend', true);
    this.useMultiengine = configService.get('api.useMultiengine', true);
    
    this.isInitialized = true;
    console.log("✅ API service initialized");
    return this;
  }

  /**
   * Send a prompt to the backend
   * @param {string} prompt - User prompt
   * @param {Object} userProfile - User profile
   * @returns {Promise<Object>} - Response object
   */
  async sendPrompt(prompt, userProfile) {
    try {
      console.log('Sending prompt to backend:', prompt);
      
      // Try Flask backend first if enabled
      if (this.useFlaskBackend) {
        try {
          console.log('🚀 Sending request to Flask backend');
          const flaskResponse = await sendPromptToFlask(prompt, userProfile);
          
          if (flaskResponse.success) {
            console.log('✅ Response generated using Flask backend');
            return {
              success: true,
              result: flaskResponse.result || flaskResponse.response,
              metadata: flaskResponse.metadata || { model: 'flask-backend' }
            };
          }
          
          console.warn('⚠️ Flask backend failed');
        } catch (flaskError) {
          console.error('Error using Flask backend:', flaskError);
        }
      }
      
      // Try multiengine if enabled and Flask failed
      if (this.useMultiengine) {
        try {
          console.log('🚀 Sending request to LLM Multiengine');
          const llmResponse = await handleMultiengineRequest(prompt, userProfile);
          
          if (llmResponse.success) {
            console.log(`✅ Response generated using model: ${llmResponse.metadata?.model || 'default'}`);
            return {
              success: true,
              result: llmResponse.result,
              metadata: llmResponse.metadata || { model: 'default' }
            };
          }
          
          console.warn('⚠️ LLM Multiengine failed');
        } catch (llmError) {
          console.error('Error using LLM Multiengine:', llmError);
        }
      }
      
      // Fallback to runtime request
      console.log('🚀 Sending request to runtime handler');
      const runtimeResponse = await handleRuntimeRequest(prompt, userProfile);
      
      if (runtimeResponse.success) {
        console.log('✅ Response generated using runtime handler');
        return {
          success: true,
          result: runtimeResponse.result,
          metadata: runtimeResponse.metadata || { model: 'runtime' }
        };
      }
      
      // If all methods fail, return a failure response
      console.error('❌ All backend methods failed');
      return {
        success: false,
        error: 'All backend methods failed',
        fallbackMessage: 'تعذر معالجة الطلب الخاص بك، يرجى المحاولة مرة أخرى.'
      };
    } catch (error) {
      console.error('Error in sendPrompt:', error);
      return {
        success: false,
        error: error.message,
        fallbackMessage: 'حدث خطأ أثناء معالجة الطلب.'
      };
    }
  }

  /**
   * Send a request to the backend
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @returns {Promise<Object>} - Response object
   */
  async sendRequest(endpoint, data) {
    try {
      // Implementation for general API requests
      // This would be expanded in a real implementation
      console.log(`Sending request to ${endpoint}:`, data);
      
      // For now, just return a mock response
      return {
        success: true,
        result: { message: 'Mock response for ' + endpoint }
      };
    } catch (error) {
      console.error(`Error in sendRequest to ${endpoint}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}