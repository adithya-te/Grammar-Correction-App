/**
 * Production Grammar Correction Routes
 */

const express = require('express');
const grammarController = require('../controllers/grammarController');

const router = express.Router();

// POST /api/correct - MAIN "Correct All" Button
router.post('/correct', grammarController.correctText);

// GET /api/languages - Get supported languages
router.get('/languages', grammarController.getSupportedLanguages);

// GET /api/health - Health check
router.get('/health', grammarController.healthCheck);

// GET /api - API info
router.get('/', (req, res) => {
  res.json({
    name: 'Advanced AI Grammar Correction API',
    version: '2.0.0',
    description: 'Professional grammar correction using Hugging Face AI',
    
    endpoints: {
      'POST /api/correct': {
        description: '🎯 MAIN "Correct All" - Advanced AI grammar correction',
        features: [
          'Verb tenses & aspect rules',
          'Subject-verb agreement', 
          'Pronoun corrections',
          'Article usage (a/an/the)',
          'Prepositions & collocations',
          'Idioms & natural usage',
          'Redundancy detection',
          'Spelling & punctuation',
          'Style improvements'
        ]
      }
    },
    
    capabilities: [
      '🤖 Multiple AI models',
      '📚 Complete linguistic coverage',
      '🎯 Professional accuracy',
      '⚡ Fast processing',
      '📊 Confidence scoring',
      '🔍 Error categorization'
    ],
    
    timestamp: new Date().toISOString(),
    status: 'Production Ready'
  });
});

module.exports = router;