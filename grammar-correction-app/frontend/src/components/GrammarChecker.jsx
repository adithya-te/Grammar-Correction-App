/**
 * Production Grammar Checker Component
 * Advanced AI-powered grammar correction interface
 */

import React, { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Copy, Download, Brain, Zap } from 'lucide-react';
import TextInput from './TextInput';
import LoadingSpinner from './LoadingSpinner';
import { grammarAPI } from '../services/api';

const ProductionGrammarChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage('');
    }, 5000);
  }, []);

  // Main "Correct All" function
  const handleCorrection = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to check.');
      clearMessages();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');
    setResult(null);

    try {
      console.log('🚀 Starting Advanced AI Grammar Correction...');
      const response = await grammarAPI.correctText(text);
      
      if (response.success) {
        setResult(response.data);
        const correctionCount = response.data.statistics.correctedErrors;
        
        if (correctionCount === 0) {
          setSuccessMessage('✨ Excellent! Your text is already perfect.');
        } else {
          setSuccessMessage(`🤖 AI found and corrected ${correctionCount} issue${correctionCount > 1 ? 's' : ''} with ${response.data.analysis.confidenceScore}% confidence.`);
        }
        
        console.log(`✅ Advanced correction completed: ${correctionCount} fixes applied`);
        console.log(`🎯 Quality score: ${response.data.analysis.qualityScore}/100`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Advanced correction failed:', err.message);
      setError(`AI Error: ${err.message}`);
      setResult(null);
    } finally {
      setLoading(false);
      clearMessages();
    }
  }, [text, clearMessages]);

  // Handle text copy
  const handleCopy = useCallback(async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setSuccessMessage('📋 Text copied to clipboard!');
      clearMessages();
    } catch (err) {
      setError('Failed to copy text to clipboard.');
      clearMessages();
    }
  }, [clearMessages]);

  // Handle text download
  const handleDownload = useCallback((textToDownload, filename) => {
    try {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage(`📄 Downloaded ${filename}`);
      clearMessages();
    } catch (err) {
      setError('Failed to download file.');
      clearMessages();
    }
  }, [clearMessages]);

  // Clear all data
  const handleClear = useCallback(() => {
    setText('');
    setResult(null);
    setError(null);
    setSuccessMessage('');
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCorrection();
    }
  }, [handleCorrection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Brain className="h-16 w-16 text-indigo-600 mr-4" />
              <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Advanced AI Grammar Correction
              </h1>
              <div className="flex items-center text-lg text-indigo-700">
                <span className="px-3 py-1 bg-indigo-100 rounded-full text-sm font-medium mr-3">
                  🤖 Powered by Hugging Face AI
                </span>
                <span className="text-gray-600">Professional-Grade Results</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Experience enterprise-level grammar correction with comprehensive linguistic coverage. 
            Our advanced AI analyzes and corrects <strong>all aspects</strong> of your writing including 
            verb tenses, pronouns, articles, collocations, and style.
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            🎯 Complete Linguistic Coverage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">⏰</div>
              <div className="text-xs text-red-800">Verb Tenses</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">👤</div>
              <div className="text-xs text-blue-800">Pronouns</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs text-green-800">Articles</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">🔗</div>
              <div className="text-xs text-purple-800">Prepositions</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">🤝</div>
              <div className="text-xs text-yellow-800">Collocations</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">💭</div>
              <div className="text-xs text-pink-800">Idioms</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">✏️</div>
              <div className="text-xs text-indigo-800">Spelling</div>
            </div>
            <div className="bg-cyan-50 p-3 rounded-lg">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-xs text-cyan-800">Style</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-8">
          <TextInput
            text={text}
            setText={setText}
            onCorrect={handleCorrection}
            onClear={handleClear}
            loading={loading}
            onKeyDown={handleKeyDown}
            placeholder="Enter your text here... Our advanced AI will analyze and correct all grammar, spelling, and style issues with professional accuracy."
            maxLength={15000}
          />
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleCorrection}
            disabled={loading || !text.trim()}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
            ) : (
              <Brain className="h-6 w-6 mr-3" />
            )}
            <div className="text-left">
              <div className="text-lg">
                {loading ? 'AI Processing...' : 'Correct All'}
              </div>
              <div className="text-xs opacity-90">
                Advanced AI Analysis
              </div>
            </div>
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="flex items-center px-6 py-4 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
          >
            Clear All
          </button>

          {result && result.corrected && (
            <>
              <button
                onClick={() => handleCopy(result.corrected)}
                className="flex items-center px-6 py-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy Corrected
              </button>

              <button
                onClick={() => handleDownload(result.corrected, 'ai-corrected-text.txt')}
                className="flex items-center px-6 py-4 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </button>
            </>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🤖 Advanced AI Processing
                </h3>
                <p className="text-gray-600 mb-4">
                  Our AI is analyzing your text with comprehensive linguistic coverage...
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <span>✓ Checking grammar rules</span>
                  <span>✓ Analyzing style</span>
                  <span>✓ Scoring confidence</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Results Display */}
        {result && !loading && (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mr-3" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      AI Analysis Complete
                    </h2>
                    <p className="text-green-700 text-lg">
                      {result.statistics.correctedErrors > 0 
                        ? `Applied ${result.statistics.correctedErrors} professional corrections`
                        : 'Your writing is already excellent!'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {result.statistics.correctedErrors}
                  </div>
                  <div className="text-gray-600">Corrections Applied</div>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {result.analysis.qualityScore || 95}
                  </div>
                  <div className="text-gray-600">Quality Score</div>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {result.analysis.confidenceScore}%
                  </div>
                  <div className="text-gray-600">AI Confidence</div>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {Math.round(result.statistics.processingTime / 1000)}s
                  </div>
                  <div className="text-gray-600">Processing Time</div>
                </div>
              </div>
            </div>

            {/* Side-by-side Text Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Text */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      📝 Original Text
                    </h3>
                    <button
                      onClick={() => handleCopy(result.original)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-100"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="whitespace-pre-wrap text-gray-700 bg-red-50 p-6 rounded-xl border max-h-96 overflow-y-auto">
                    {result.original}
                  </div>
                </div>
              </div>

              {/* Corrected Text */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      🤖 AI-Corrected Text
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(result.corrected)}
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-green-100"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                      
                      <button
                        onClick={() => handleDownload(result.corrected, 'ai-corrected-text.txt')}
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-green-100"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-6 rounded-xl border max-h-96 overflow-y-auto">
                    {result.corrected}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Corrections */}
            {result.corrections && result.corrections.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  🔍 Detailed Analysis & Explanations ({result.corrections.length} corrections)
                </h3>
                
                <div className="space-y-6">
                  {result.corrections.map((correction, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-lg font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                              "{correction.original}"
                            </span>
                            <span className="text-gray-400 text-xl">→</span>
                            <span className="text-lg font-semibold text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                              "{correction.correction}"
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {correction.category}
                            </span>
                            
                            {correction.confidence && (
                              <span className="text-sm text-gray-600">
                                🎯 {correction.confidence}% confidence
                              </span>
                            )}
                          </div>
                          
                          {correction.message && (
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                              <p className="text-blue-800 text-sm">
                                <strong>Rule:</strong> {correction.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Changes Message */}
            {result.original === result.corrected && (
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <div className="text-center">
                  <div className="text-8xl mb-6">🏆</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Outstanding Writing Quality!
                  </h3>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Our advanced AI analysis found your text to be grammatically excellent 
                    and professionally written. No corrections were needed.
                  </p>
                  
                  <div className="flex justify-center space-x-8 text-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <span className="text-gray-700">Grammar Perfect</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <span className="text-gray-700">Style Excellent</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <span className="text-gray-700">Professional Quality</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            🚀 How to Use Your Advanced AI Grammar Tool
          </h2>
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">1</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Enter Your Text</h4>
                <p className="text-gray-600">Type or paste any text up to 15,000 characters. Our AI handles emails, essays, reports, and more.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">2</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Click "Correct All"</h4>
                <p className="text-gray-600">Our advanced AI analyzes all aspects: grammar, spelling, style, tenses, pronouns, and more.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">3</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Review & Learn</h4>
                <p className="text-gray-600">See detailed explanations for each correction with confidence scores and grammar rules.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 mt-1">4</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Copy or Download</h4>
                <p className="text-gray-600">Get your professionally corrected text ready for use in any document or application.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionGrammarChecker;