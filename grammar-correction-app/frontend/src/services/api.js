/**
 * API service for frontend communication with backend
 * Handles all HTTP requests and error handling
 */

import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data?.error?.message || 'Invalid request. Please check your input.');
        case 401:
          throw new Error('Unauthorized. Please check your credentials.');
        case 403:
          throw new Error('Access forbidden.');
        case 404:
          throw new Error('Service not found. Please try again later.');
        case 408:
          throw new Error('Request timeout. Please try again.');
        case 413:
          throw new Error('Text too large. Please reduce the text length.');
        case 429:
          throw new Error('Too many requests. Please wait before trying again.');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(data?.error?.message || `Server error: ${status}`);
      }
    } else if (error.request) {
      // Network error or no response
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      } else {
        throw new Error('Network error. Please check your internet connection.');
      }
    } else {
      // Other errors
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

/**
 * Grammar correction API methods
 */
export const grammarAPI = {
  /**
   * Correct grammar in provided text
   * @param {string} text - Text to correct
   * @param {string} language - Language code (optional)
   * @returns {Promise<Object>} - Correction results
   */
  async correctText(text, language = 'auto') {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Text is required and must be a string.');
      }

      if (text.trim().length === 0) {
        throw new Error('Text cannot be empty.');
      }

      if (text.length > 20000) {
        throw new Error('Text is too long. Maximum 20,000 characters allowed.');
      }

      const response = await api.post('/correct', {
        text: text.trim(),
        language
      });

      return response.data;
    } catch (error) {
      console.error('Grammar correction failed:', error.message);
      throw error;
    }
  },

  /**
   * Get supported languages
   * @returns {Promise<Array>} - List of supported languages
   */
  async getSupportedLanguages() {
    try {
      const response = await api.get('/languages');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch languages:', error.message);
      throw error;
    }
  },

  /**
   * Check service health
   * @returns {Promise<Object>} - Service health status
   */
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.message);
      throw error;
    }
  }
};

export default api;