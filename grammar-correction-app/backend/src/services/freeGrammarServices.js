/**
 * Smart Free Grammar Service - Uses Your Existing API Keys
 * Works with: LanguageTool Free, TextGears (your key), Sapling (your key), Basic offline
 */

const axios = require('axios');

class SmartFreeGrammarService {
  constructor() {
    this.timeout = 30000;
    
    // Your API keys from environment
    this.textGearsKey = process.env.TEXTGEARS_API_KEY;
    this.saplingKey = process.env.SAPLING_API_KEY;
    
    console.log('🔧 Smart Grammar Service initialized');
    console.log(`📡 TextGears API: ${this.textGearsKey ? '✅ Available' : '❌ No key'}`);
    console.log(`🧠 Sapling API: ${this.saplingKey ? '✅ Available' : '❌ No key'}`);
    console.log('🆓 LanguageTool Free: ✅ Always available');
    console.log('🔧 Basic Correction: ✅ Always available');
  }

  /**
   * Main correction method - tries services in order of quality
   */
  async correctText(text, language = 'auto') {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    if (text.length > 8000) {
      throw new Error('Text too long. Maximum 8,000 characters.');
    }

    console.log(`🔍 Checking text (${text.length} chars) with available services...`);

    // Try services in order of preference
    const services = [
      // 1. Sapling AI (if you have key) - Best quality
      ...(this.saplingKey ? [() => this.useSaplingAI(text)] : []),
      
      // 2. TextGears (if you have key) - Good quality  
      ...(this.textGearsKey ? [() => this.useTextGears(text, language)] : []),
      
      // 3. LanguageTool Free - Always available
      () => this.useLanguageToolFree(text, language),
      
      // 4. Basic correction - Always works
      () => this.useBasicCorrection(text)
    ];

    let lastError;
    for (let i = 0; i < services.length; i++) {
      try {
        const result = await services[i]();
        const serviceName = this.getServiceName(i);
        console.log(`✅ Success using ${serviceName}`);
        
        return {
          ...result,
          serviceUsed: serviceName,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        const serviceName = this.getServiceName(i);
        console.log(`❌ ${serviceName} failed:`, error.message);
        lastError = error;
        
        // If this is the last service, still try to return basic correction
        if (i === services.length - 1) {
          return this.useBasicCorrection(text);
        }
        continue;
      }
    }

    // Fallback to basic correction if all else fails
    return this.useBasicCorrection(text);
  }

  /**
   * Get service name based on index
   */
  getServiceName(index) {
    const names = [];
    if (this.saplingKey) names.push('Sapling AI');
    if (this.textGearsKey) names.push('TextGears');
    names.push('LanguageTool Free');
    names.push('Basic Correction');
    
    return names[index] || 'Unknown Service';
  }

  /**
   * Sapling AI Grammar Checker (Your API Key)
   */
  async useSaplingAI(text) {
    if (!this.saplingKey) {
      throw new Error('Sapling API key not available');
    }

    try {
      const response = await axios.post(
        'https://api.sapling.ai/api/v1/edits',
        {
          text: text,
          session_id: `session_${Date.now()}`
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.saplingKey}`
          }
        }
      );

      return this.processSaplingResponse(text, response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Sapling API key invalid');
      }
      if (error.response?.status === 429) {
        throw new Error('Sapling API rate limit exceeded');
      }
      throw new Error(`Sapling API error: ${error.message}`);
    }
  }

  /**
   * TextGears API (Your API Key)
   */
  async useTextGears(text, language = 'en') {
    if (!this.textGearsKey) {
      throw new Error('TextGears API key not available');
    }

    try {
      const response = await axios.get('https://api.textgears.com/grammar', {
        params: {
          text: text,
          language: language === 'auto' ? 'en-US' : language,
          ai: true,
          key: this.textGearsKey
        },
        timeout: this.timeout
      });

      return this.processTextGearsResponse(text, response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('TextGears API key invalid');
      }
      if (error.response?.status === 429) {
        throw new Error('TextGears API rate limit exceeded');
      }
      throw new Error(`TextGears API error: ${error.message}`);
    }
  }

  /**
   * LanguageTool Free API (No Key Required)
   */
  async useLanguageToolFree(text, language = 'auto') {
    try {
      const params = new URLSearchParams({
        text: text,
        language: language,
        enabledOnly: 'false'
      });

      const response = await axios.post(
        'https://api.languagetool.org/v2/check',
        params,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      return this.processLanguageToolResponse(text, response.data);
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('LanguageTool rate limit exceeded');
      }
      throw new Error(`LanguageTool error: ${error.message}`);
    }
  }

  /**
   * Basic offline correction (Always works)
   */
  useBasicCorrection(text) {
    console.log('🔧 Using basic offline correction');
    
    const corrections = [];
    let correctedText = text;

    // Enhanced basic corrections
    const basicCorrections = {
      // Common spelling mistakes
      'teh': 'the', 'adn': 'and', 'ot': 'to', 'fo': 'of',
      'recieve': 'receive', 'seperate': 'separate', 'occurance': 'occurrence',
      'definately': 'definitely', 'untill': 'until', 'begining': 'beginning',
      'writting': 'writing', 'thier': 'their', 'freind': 'friend',
      'wich': 'which', 'whcih': 'which', 'alot': 'a lot',
      
      // Grammar patterns
      'could of': 'could have', 'would of': 'would have', 'should of': 'should have',
      'its a': "it's a", 'youre': "you're", 'dont': "don't", 'cant': "can't",
      
      // Common typos
      'hte': 'the', 'nad': 'and', 'si': 'is', 'ti': 'it'
    };

    // Apply corrections
    for (const [wrong, correct] of Object.entries(basicCorrections)) {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      const matches = correctedText.match(regex);
      
      if (matches) {
        correctedText = correctedText.replace(regex, correct);
        corrections.push({
          original: wrong,
          correction: correct,
          message: `Common ${wrong.includes(' ') ? 'grammar' : 'spelling'} mistake`,
          category: wrong.includes(' ') ? 'Grammar' : 'Spelling'
        });
      }
    }

    // Fix spacing and capitalization
    if (correctedText.includes('  ')) {
      correctedText = correctedText.replace(/\s+/g, ' ');
      corrections.push({
        original: 'multiple spaces',
        correction: 'single space',
        message: 'Fixed spacing',
        category: 'Formatting'
      });
    }

    // Capitalize after periods
    correctedText = correctedText.replace(/\.\s+[a-z]/g, match => 
      match.slice(0, -1) + match.slice(-1).toUpperCase()
    );

    return {
      originalText: text,
      correctedText: correctedText,
      corrections: corrections,
      language: { name: 'English', code: 'en' },
      statistics: {
        totalMatches: corrections.length,
        appliedCorrections: corrections.length,
        originalLength: text.length,
        correctedLength: correctedText.length,
        processingTime: 150
      }
    };
  }

  /**
   * Process Sapling AI response
   */
  processSaplingResponse(originalText, response) {
    const { edits = [] } = response;
    let correctedText = originalText;
    const appliedCorrections = [];

    const sortedEdits = edits.sort((a, b) => b.start - a.start);

    for (const edit of sortedEdits) {
      const { start, end, replacement } = edit;

      if (replacement) {
        const before = correctedText.substring(0, start);
        const after = correctedText.substring(end);
        correctedText = before + replacement + after;

        appliedCorrections.push({
          original: originalText.substring(start, end),
          correction: replacement,
          message: edit.general_error_type || 'Grammar/Spelling error',
          category: edit.error_type || 'Grammar'
        });
      }
    }

    return {
      originalText,
      correctedText,
      corrections: appliedCorrections.reverse(),
      language: { name: 'English', code: 'en' },
      statistics: {
        totalMatches: edits.length,
        appliedCorrections: appliedCorrections.length,
        originalLength: originalText.length,
        correctedLength: correctedText.length,
        processingTime: 600
      }
    };
  }

  /**
   * Process TextGears response
   */
  processTextGearsResponse(originalText, response) {
    const { errors = [] } = response;
    let correctedText = originalText;
    const appliedCorrections = [];

    const sortedErrors = errors.sort((a, b) => b.offset - a.offset);

    for (const error of sortedErrors) {
      const { offset, length, better = [] } = error;
      const bestReplacement = better[0] || '';

      if (bestReplacement) {
        const before = correctedText.substring(0, offset);
        const after = correctedText.substring(offset + length);
        correctedText = before + bestReplacement + after;

        appliedCorrections.push({
          original: originalText.substring(offset, offset + length),
          correction: bestReplacement,
          message: error.description || 'Grammar/Spelling error',
          category: error.type || 'Grammar'
        });
      }
    }

    return {
      originalText,
      correctedText,
      corrections: appliedCorrections.reverse(),
      language: { name: 'English', code: 'en' },
      statistics: {
        totalMatches: errors.length,
        appliedCorrections: appliedCorrections.length,
        originalLength: originalText.length,
        correctedLength: correctedText.length,
        processingTime: 400
      }
    };
  }

  /**
   * Process LanguageTool response
   */
  processLanguageToolResponse(originalText, response) {
    const { matches = [], language = {} } = response;
    const sortedMatches = matches
      .filter(match => match.replacements && match.replacements.length > 0)
      .sort((a, b) => b.offset - a.offset);

    let correctedText = originalText;
    const appliedCorrections = [];

    for (const match of sortedMatches) {
      const { offset, length, replacements, message, rule } = match;
      const bestReplacement = replacements[0]?.value || '';

      if (bestReplacement) {
        const before = correctedText.substring(0, offset);
        const after = correctedText.substring(offset + length);
        correctedText = before + bestReplacement + after;

        appliedCorrections.push({
          original: originalText.substring(offset, offset + length),
          correction: bestReplacement,
          message: message || 'Grammar/Spelling error',
          category: rule?.category?.name || 'Grammar',
          ruleId: rule?.id || 'unknown'
        });
      }
    }

    return {
      originalText,
      correctedText,
      corrections: appliedCorrections.reverse(),
      language: {
        name: language.name || 'English',
        code: language.code || 'en'
      },
      statistics: {
        totalMatches: matches.length,
        appliedCorrections: appliedCorrections.length,
        originalLength: originalText.length,
        correctedLength: correctedText.length,
        processingTime: 300
      }
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    const results = {
      basic: 'healthy'
    };
    
    // Test LanguageTool Free
    try {
      await this.useLanguageToolFree('Hello world');
      results.languageToolFree = 'healthy';
    } catch (error) {
      results.languageToolFree = 'unhealthy';
    }

    // Test TextGears if key available
    if (this.textGearsKey) {
      try {
        await this.useTextGears('Hello world');
        results.textGears = 'healthy';
      } catch (error) {
        results.textGears = 'unhealthy';
      }
    }

    // Test Sapling if key available
    if (this.saplingKey) {
      try {
        await this.useSaplingAI('Hello world');
        results.sapling = 'healthy';
      } catch (error) {
        results.sapling = 'unhealthy';
      }
    }
    
    return results;
  }
}

module.exports = new SmartFreeGrammarService();