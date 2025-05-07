/**
 * Mashaaer Enhanced Project
 * LLM Multiengine Turbo
 * 
 * This module provides the ability to run multiple AI models (GPT-4, Gemini, Claude, Mistral)
 * in the same session and intelligently select the most appropriate model for each request.
 */

import { callWithFallback } from './model_fallback_manager.js';

class LLMMultiengine {
  constructor(config = {}) {
    this.config = {
      defaultModel: 'gpt4',
      enabledModels: ['gpt4', 'gemini', 'claude', 'mistral'],
      apiKeys: {
        openai: process.env.OPENAI_API_KEY || config.openaiApiKey,
        google: process.env.GOOGLE_API_KEY || config.googleApiKey,
        anthropic: process.env.ANTHROPIC_API_KEY || config.anthropicApiKey,
        mistral: process.env.MISTRAL_API_KEY || config.mistralApiKey
      },
      ...config
    };

    this.modelStrengths = {
      gpt4: {
        reasoning: 0.9,
        creativity: 0.8,
        knowledge: 0.85,
        arabicFluency: 0.75
      },
      gemini: {
        reasoning: 0.85,
        creativity: 0.8,
        knowledge: 0.9,
        arabicFluency: 0.7
      },
      claude: {
        reasoning: 0.85,
        creativity: 0.9,
        knowledge: 0.8,
        arabicFluency: 0.7
      },
      mistral: {
        reasoning: 0.8,
        creativity: 0.75,
        knowledge: 0.75,
        arabicFluency: 0.8
      }
    };

    this.lastUsedModel = null;
    this.modelUsageCount = {
      gpt4: 0,
      gemini: 0,
      claude: 0,
      mistral: 0
    };
  }

  /**
   * Select the most appropriate model based on the request context
   * @param {Object} context - Request context including prompt and user preferences
   * @returns {string} - Selected model name
   */
  selectModel(context) {
    // Extract task type from context if available
    const taskType = context.taskType || this.detectTaskType(context.prompt);

    // Get available models (filter out any disabled models)
    const availableModels = this.config.enabledModels.filter(model => 
      this.config.apiKeys[this.getApiKeyName(model)]
    );

    if (availableModels.length === 0) {
      console.warn('No models are available. Using fallback mechanism.');
      return this.config.defaultModel;
    }

    // If task type is specified, select the best model for that task
    if (taskType) {
      const scores = {};

      availableModels.forEach(model => {
        let score = 0;

        switch (taskType) {
          case 'reasoning':
            score = this.modelStrengths[model].reasoning;
            break;
          case 'creativity':
            score = this.modelStrengths[model].creativity;
            break;
          case 'knowledge':
            score = this.modelStrengths[model].knowledge;
            break;
          case 'arabic':
            score = this.modelStrengths[model].arabicFluency;
            break;
          default:
            // For unknown task types, use a balanced approach
            score = (
              this.modelStrengths[model].reasoning + 
              this.modelStrengths[model].creativity + 
              this.modelStrengths[model].knowledge + 
              this.modelStrengths[model].arabicFluency
            ) / 4;
        }

        // Add a small random factor to prevent always choosing the same model
        score += Math.random() * 0.1;

        scores[model] = score;
      });

      // Select the model with the highest score
      const selectedModel = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
      );

      console.log(`Selected model ${selectedModel} for task type ${taskType}`);
      return selectedModel;
    }

    // If no task type is specified, use a round-robin approach
    const leastUsedModel = availableModels.reduce((a, b) => 
      this.modelUsageCount[a] < this.modelUsageCount[b] ? a : b
    );

    return leastUsedModel;
  }

  /**
   * Detect the task type from the prompt
   * @param {string} prompt - User prompt
   * @returns {string|null} - Detected task type or null if unknown
   */
  detectTaskType(prompt) {
    const prompt_lower = prompt.toLowerCase();

    // Check for reasoning tasks
    if (
      prompt_lower.includes('لماذا') || 
      prompt_lower.includes('كيف') || 
      prompt_lower.includes('اشرح') ||
      prompt_lower.includes('حلل') ||
      prompt_lower.includes('فسر')
    ) {
      return 'reasoning';
    }

    // Check for creative tasks
    if (
      prompt_lower.includes('اكتب قصة') || 
      prompt_lower.includes('اكتب شعر') || 
      prompt_lower.includes('تخيل') ||
      prompt_lower.includes('ابتكر') ||
      prompt_lower.includes('إبداع')
    ) {
      return 'creativity';
    }

    // Check for knowledge tasks
    if (
      prompt_lower.includes('ما هو') || 
      prompt_lower.includes('من هو') || 
      prompt_lower.includes('متى') ||
      prompt_lower.includes('أين') ||
      prompt_lower.includes('معلومات عن')
    ) {
      return 'knowledge';
    }

    // Default to null if no specific task type is detected
    return null;
  }

  /**
   * Get the API key name for a given model
   * @param {string} model - Model name
   * @returns {string} - API key name
   */
  getApiKeyName(model) {
    switch (model) {
      case 'gpt4':
        return 'openai';
      case 'gemini':
        return 'google';
      case 'claude':
        return 'anthropic';
      case 'mistral':
        return 'mistral';
      default:
        return 'openai';
    }
  }

  /**
   * Generate a meaningful response based on the prompt
   * @param {string} prompt - User prompt
   * @returns {string} - Generated response
   */
  generateResponse(prompt) {
    const prompt_lower = prompt.toLowerCase();

    // Check for greetings
    if (
      prompt_lower.includes('مرحبا') || 
      prompt_lower.includes('السلام عليكم') ||
      prompt_lower.includes('صباح الخير') ||
      prompt_lower.includes('مساء الخير') ||
      prompt_lower.includes('أهلا')
    ) {
      return 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟';
    }

    // Check for questions about the weather
    if (
      prompt_lower.includes('الطقس') || 
      prompt_lower.includes('الجو') ||
      prompt_lower.includes('درجة الحرارة')
    ) {
      return 'لا أستطيع الوصول إلى معلومات الطقس الحالية، ولكن يمكنني مساعدتك في أمور أخرى.';
    }

    // Check for questions about time
    if (
      prompt_lower.includes('الوقت') || 
      prompt_lower.includes('الساعة')
    ) {
      return `الوقت الحالي هو ${new Date().toLocaleTimeString('ar-SA')}.`;
    }

    // Check for help requests
    if (
      prompt_lower.includes('ساعدني') || 
      prompt_lower.includes('مساعدة') ||
      prompt_lower.includes('كيف يمكنني')
    ) {
      return 'أنا هنا للمساعدة! يمكنني الإجابة على أسئلتك، وتقديم معلومات، والمساعدة في حل المشكلات. ما الذي تحتاج مساعدة فيه؟';
    }

    // Default response for other prompts
    return 'شكراً لسؤالك. يمكنني مساعدتك في العديد من المواضيع. هل هناك شيء محدد تود معرفة المزيد عنه؟';
  }

  /**
   * Call the specified model with the given prompt
   * @param {string} model - Model name
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Model response
   */
  async callModel(model, prompt) {
    switch (model) {
      case 'gpt4':
        return this.callGPT4(prompt);
      case 'gemini':
        return this.callGemini(prompt);
      case 'claude':
        return this.callClaude(prompt);
      case 'mistral':
        return this.callMistral(prompt);
      default:
        throw new Error(`Unknown model: ${model}`);
    }
  }

  /**
   * Call GPT-4 model
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Model response
   */
  async callGPT4(prompt) {
    // This is a placeholder. In a real implementation, you would call the OpenAI API.
    console.log(`Calling GPT-4 with prompt: ${prompt}`);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.modelUsageCount.gpt4++;
        this.lastUsedModel = 'gpt4';
        resolve(this.generateResponse(prompt));
      }, 1000);
    });
  }

  /**
   * Call Gemini model
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Model response
   */
  async callGemini(prompt) {
    // This is a placeholder. In a real implementation, you would call the Google Gemini API.
    console.log(`Calling Gemini with prompt: ${prompt}`);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.modelUsageCount.gemini++;
        this.lastUsedModel = 'gemini';
        resolve(this.generateResponse(prompt));
      }, 1000);
    });
  }

  /**
   * Call Claude model
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Model response
   */
  async callClaude(prompt) {
    // This is a placeholder. In a real implementation, you would call the Anthropic Claude API.
    console.log(`Calling Claude with prompt: ${prompt}`);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.modelUsageCount.claude++;
        this.lastUsedModel = 'claude';
        resolve(this.generateResponse(prompt));
      }, 1000);
    });
  }

  /**
   * Call Mistral model
   * @param {string} prompt - User prompt
   * @returns {Promise<string>} - Model response
   */
  async callMistral(prompt) {
    // This is a placeholder. In a real implementation, you would call the Mistral API.
    console.log(`Calling Mistral with prompt: ${prompt}`);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.modelUsageCount.mistral++;
        this.lastUsedModel = 'mistral';
        resolve(this.generateResponse(prompt));
      }, 1000);
    });
  }

  /**
   * Process a request using the multiengine approach
   * @param {Object} context - Request context including prompt and user preferences
   * @returns {Promise<Object>} - Response object with result and metadata
   */
  async processRequest(context) {
    try {
      // Select the most appropriate model
      const selectedModel = context.forceModel || this.selectModel(context);

      console.log(`Using model: ${selectedModel} for request`);

      // Call the selected model
      const response = await this.callModel(selectedModel, context.prompt);

      return {
        success: true,
        result: response,
        metadata: {
          model: selectedModel,
          tone: context.preferredTone || 'neutral',
          voiceProfile: context.preferredVoiceProfile || 'default'
        }
      };
    } catch (error) {
      console.error('Error in LLM Multiengine:', error);

      // If the selected model fails, fall back to the traditional fallback mechanism
      try {
        console.log('Falling back to traditional fallback mechanism');
        const fallbackResponse = await callWithFallback(context.prompt);

        return {
          success: true,
          result: fallbackResponse,
          metadata: {
            model: 'fallback',
            tone: context.preferredTone || 'neutral',
            voiceProfile: context.preferredVoiceProfile || 'default'
          }
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: fallbackError.message || 'An unknown error occurred in LLM Multiengine.'
        };
      }
    }
  }
}

// Create a singleton instance
const llmMultiengine = new LLMMultiengine();

export default llmMultiengine;

/**
 * Enhanced version of handleRuntimeRequest that uses the LLM Multiengine
 * @param {string} prompt - User prompt
 * @param {Object} userProfile - User profile with preferences
 * @returns {Promise<Object>} - Response object with result and metadata
 */
export async function handleMultiengineRequest(prompt, userProfile = {}) {
  try {
    console.log('🔍 Handling multiengine request with prompt:', prompt);

    // Create context object with prompt and user preferences
    const context = {
      prompt,
      preferredTone: userProfile.preferredTone || 'neutral',
      preferredVoiceProfile: userProfile.preferredVoiceProfile || 'default',
      taskType: userProfile.taskType || null,
      forceModel: userProfile.forceModel || null
    };

    // Process the request using the LLM Multiengine
    return await llmMultiengine.processRequest(context);
  } catch (error) {
    console.error('❌ Error in handleMultiengineRequest:', error);

    return {
      success: false,
      error: error.message || 'An unknown error occurred in handleMultiengineRequest.'
    };
  }
}
