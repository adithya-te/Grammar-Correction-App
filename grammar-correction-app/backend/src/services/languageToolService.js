/**
 * Enhanced Grammar Service with Multiple Free Options
 * Supports multiple free grammar checking services with fallback
 */

const freeGrammarServices = require('./freeGrammarServices');

class GrammarService {
  constructor() {
    this.preferredService = process.env.GRAMMAR_SERVICE || 'free';
    this.useBasicFallback = process.env.USE_BASIC_CORRECTION === 'true';
    this.maxTextLength = parseInt(process.env.MAX_TEXT_LENGTH || '10000');
    
    console.log(`🔧 Grammar service initialized with preference: ${this.preferredService}`);
  }

  /**
   * Main method to correct text using free services
   * @param {string} text - Text to check and correct
   * @param {string} language - Language code (optional)
   * @returns {Promise<Object>} - Correction results
   */
  async correctText(text, language = 'auto') {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text input');
      }

      if (text.length > this.maxTextLength) {
        throw new Error(`Text too long. Maximum ${this.maxTextLength} characters allowed for free services.`);
      }

      console.log(`📝 Checking text of length: ${text.length} using free services`);

      const startTime = Date.now();
      
      // Use free grammar services
      const result = await freeGrammarServices.correctText(text, this.preferredService);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Grammar check completed in ${processingTime}ms using ${result.serviceUsed}`);

      // Add processing time to result
      result.statistics.processingTime = processingTime;
      
      return result;

    } catch (error) {
      console.error('❌ Grammar service error:', error.message);
      
      // If all services fail and basic fallback is enabled
      if (this.useBasicFallback) {
        console.log('🔄 Falling back to basic correction');
        return freeGrammarServices.basicCorrection(text);
      }
      
      throw error;
    }
  }

  /**
   * Get available free services
   * @returns {Promise<Array>} - List of available services
   */
  async getAvailableServices() {
    try {
      const healthCheck = await freeGrammarServices.healthCheck();
      
      const services = [
        {
          name: 'LanguageTool Free',
          id: 'languageTool',
          description: 'Official LanguageTool free API',
          status: healthCheck.languageTool,
          limits: 'Rate limited, no API key required'
        },
        {
          name: 'GrammarBot',
          id: 'grammarBot',
          description: 'Free grammar checking API',
          status: healthCheck.grammarBot,
          limits: 'Free tier available with registration'
        },
        {
          name: 'TextGears',
          id: 'textGears',
          description: 'AI-powered grammar checker',
          status: healthCheck.textGears,
          limits: 'Free tier with limited requests'
        },
        {
          name: 'Sapling AI',
          id: 'sapling',
          description: 'AI grammar and writing assistant',
          status: healthCheck.sapling,
          limits: 'Free tier available'
        },
        {
          name: 'Basic Correction',
          id: 'basic',
          description: 'Offline basic spell checking',
          status: 'healthy',
          limits: 'Always available, offline'
        }
      ];

      return services;
    } catch (error) {
      console.error('Error getting available services:', error.message);
      return [];
    }
  }

  /**
   * Health check for grammar service
   * @returns {Promise<Object>} - Service status
   */
  async healthCheck() {
    try {
      const healthResults = await freeGrammarServices.healthCheck();
      
      return {
        status: 'healthy',
        services: healthResults,
        preferredService: this.preferredService,
        fallbackEnabled: this.useBasicFallback,
        maxTextLength: this.maxTextLength
      };
    } catch (error) {
      console.error('Grammar service health check failed:', error.message);
      
      return {
        status: this.useBasicFallback ? 'degraded' : 'unhealthy',
        error: error.message,
        fallbackAvailable: this.useBasicFallback
      };
    }
  }

  /**
   * Get supported languages (basic list for free services)
   * @returns {Promise<Array>} - List of supported languages
   */
  async getSupportedLanguages() {
    // Most free services support these languages
    return [
      { name: 'Auto-detect', code: 'auto' },
      { name: 'English', code: 'en' },
      { name: 'English (US)', code: 'en-US' },
      { name: 'English (UK)', code: 'en-GB' },
      { name: 'Spanish', code: 'es' },
      { name: 'French', code: 'fr' },
      { name: 'German', code: 'de' },
      { name: 'Italian', code: 'it' },
      { name: 'Portuguese', code: 'pt' },
      { name: 'Russian', code: 'ru' }
    ];
  }
}

module.exports = new GrammarService();