/**
 * Production Grammar Controller
 * Handles advanced AI grammar correction requests
 */

const huggingFaceService = require('../services/huggingFaceGrammarService');

class ProductionGrammarController {
  /**
   * MAIN "Correct All" Button Endpoint
   * POST /api/correct
   */
  async correctText(req, res, next) {
    try {
      const { text, options = {} } = req.body;

      // Validate input
      if (!text) {
        return res.status(400).json({
          error: 'Missing text field',
          message: 'Text is required in request body',
          example: { 
            text: 'Your text to correct here',
            options: { style: 'formal' }
          }
        });
      }

      if (typeof text !== 'string') {
        return res.status(400).json({
          error: 'Invalid text format',
          message: 'Text must be a string'
        });
      }

      if (text.trim().length === 0) {
        return res.status(400).json({
          error: 'Empty text',
          message: 'Text cannot be empty'
        });
      }

      const maxLength = parseInt(process.env.MAX_TEXT_LENGTH || '15000');
      if (text.length > maxLength) {
        return res.status(400).json({
          error: 'Text too long',
          message: `Maximum ${maxLength} characters allowed`,
          currentLength: text.length
        });
      }

      console.log(`🚀 ADVANCED AI CORRECTION REQUEST:`);
      console.log(`📝 Text length: ${text.length} characters`);
      console.log(`🤖 Using Hugging Face AI models`);

      // Process with AI
      const startTime = Date.now();
      const result = await huggingFaceService.correctText(text, options);
      const totalTime = Date.now() - startTime;

      console.log(`✅ AI CORRECTION COMPLETED:`);
      console.log(`⏱️  Total time: ${totalTime}ms`);
      console.log(`🔧 Corrections applied: ${result.statistics.correctedErrors}`);
      console.log(`🎯 Confidence: ${result.analysis.confidenceScore}%`);

      // Return comprehensive response
      res.status(200).json({
        success: true,
        data: {
          original: result.originalText,
          corrected: result.correctedText,
          corrections: result.corrections,
          analysis: result.analysis,
          statistics: {
            ...result.statistics,
            totalProcessingTime: totalTime
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          processingTime: totalTime,
          hasChanges: result.originalText !== result.correctedText,
          serviceUsed: result.serviceUsed,
          modelsUsed: result.models,
          aiPowered: true,
          features: [
            'Verb Tense Correction',
            'Subject-Verb Agreement',
            'Pronoun Usage',
            'Article Correction (a/an/the)',
            'Preposition Fixes',
            'Collocation Corrections',
            'Idiom Improvements',
            'Spelling Correction',
            'Punctuation Fixes',
            'Style Enhancements',
            'Redundancy Removal',
            'Confidence Scoring'
          ]
        }
      });

    } catch (error) {
      console.error('❌ AI CORRECTION ERROR:', error.message);
      
      // Enhanced error handling
      if (error.message.includes('HUGGINGFACE_API_KEY')) {
        return res.status(401).json({
          error: 'API Key Required',
          message: 'Hugging Face API key is missing or invalid',
          solution: 'Check your HUGGINGFACE_API_KEY in .env file'
        });
      }

      if (error.response?.status === 429 || error.message.includes('rate limit')) {
        return res.status(429).json({
          error: 'Rate Limit Exceeded',
          message: 'Too many requests to AI service',
          retryAfter: 60
        });
      }

      next(error);
    }
  }

  /**
   * Get supported languages and features
   * GET /api/languages
   */
  async getSupportedLanguages(req, res, next) {
    try {
      const languages = [
        { name: 'English (US)', code: 'en-US', primary: true },
        { name: 'English (UK)', code: 'en-GB', primary: true },
        { name: 'English (General)', code: 'en', primary: true }
      ];
      
      res.status(200).json({
        success: true,
        data: languages,
        meta: {
          timestamp: new Date().toISOString(),
          count: languages.length
        }
      });

    } catch (error) {
      console.error('❌ Error fetching languages:', error.message);
      next(error);
    }
  }

  /**
   * Health check
   * GET /api/health
   */
  async healthCheck(req, res, next) {
    try {
      console.log('🔍 Advanced AI service health check');
      
      const healthStatus = await huggingFaceService.healthCheck();
      
      if (healthStatus.status === 'healthy') {
        res.status(200).json({
          success: true,
          status: 'healthy',
          service: 'Advanced AI Grammar Correction',
          data: healthStatus,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          status: healthStatus.status,
          message: 'AI service degraded, fallback available',
          data: healthStatus,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('❌ Health check error:', error.message);
      next(error);
    }
  }
}

module.exports = new ProductionGrammarController();