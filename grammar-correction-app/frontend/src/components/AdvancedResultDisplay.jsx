/**
 * Advanced Result Display Component
 * Professional-grade display with comprehensive analysis and explanations
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  Eye, 
  EyeOff, 
  BarChart3,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  Zap
} from 'lucide-react';

const AdvancedResultDisplay = ({ result, onCopy, onDownload }) => {
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { original, corrected, corrections, analysis, statistics } = result;
  const hasChanges = original !== corrected;

  // Group corrections by category with enhanced information
  const correctionsByCategory = corrections.reduce((acc, correction) => {
    const category = correction.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(correction);
    return acc;
  }, {});

  // Get category colors and icons
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'Grammar': { color: 'bg-red-100 text-red-800', icon: '📚', priority: 'high' },
      'Spelling': { color: 'bg-blue-100 text-blue-800', icon: '✏️', priority: 'high' },
      'Tense': { color: 'bg-purple-100 text-purple-800', icon: '⏰', priority: 'high' },
      'Pronoun': { color: 'bg-green-100 text-green-800', icon: '👤', priority: 'medium' },
      'Article': { color: 'bg-yellow-100 text-yellow-800', icon: '📝', priority: 'medium' },
      'Preposition': { color: 'bg-indigo-100 text-indigo-800', icon: '🔗', priority: 'medium' },
      'Collocation': { color: 'bg-pink-100 text-pink-800', icon: '🤝', priority: 'medium' },
      'Idiom': { color: 'bg-orange-100 text-orange-800', icon: '💭', priority: 'low' },
      'Style': { color: 'bg-cyan-100 text-cyan-800', icon: '✨', priority: 'low' },
      'Punctuation': { color: 'bg-gray-100 text-gray-800', icon: '🔤', priority: 'medium' },
      'Other': { color: 'bg-gray-100 text-gray-800', icon: '📄', priority: 'low' }
    };
    return categoryMap[category] || categoryMap['Other'];
  };

  // Calculate improvement score
  const improvementScore = Math.round(
    ((statistics.totalErrors - (statistics.totalErrors - statistics.correctedErrors)) / 
     Math.max(statistics.totalErrors, 1)) * 100
  );

  // Filter corrections by selected category
  const filteredCorrections = selectedCategory === 'all' 
    ? corrections 
    : corrections.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Results Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {hasChanges ? (
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Analysis Complete
                  </h2>
                  <p className="text-blue-700 mt-1">
                    Professional grammar correction with {statistics.correctedErrors} improvements
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Excellent Writing!
                  </h2>
                  <p className="text-green-700 mt-1">
                    Your text is grammatically sound and well-written
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
              className="flex items-center px-4 py-2 text-sm bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-colors duration-200"
            >
              {showAdvancedAnalysis ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showAdvancedAnalysis ? 'Hide' : 'Show'} Analysis
            </button>
            
            <div className="flex items-center px-4 py-2 bg-white rounded-md border border-gray-200">
              <Zap className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {statistics.correctedErrors}
            </div>
            <div className="text-sm text-gray-600 mt-1">Corrections</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {analysis.qualityScore || 85}
            </div>
            <div className="text-sm text-gray-600 mt-1">Quality Score</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-purple-600">
              {analysis.confidenceScore || 92}%
            </div>
            <div className="text-sm text-gray-600 mt-1">AI Confidence</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-orange-600">
              {analysis.errorCategories?.length || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Error Types</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">
              {Math.round(statistics.processingTime / 1000)}s
            </div>
            <div className="text-sm text-gray-600 mt-1">Processing</div>
          </div>
        </div>
      </div>

      {/* Advanced Analysis Panel */}
      {showAdvancedAnalysis && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Detailed Linguistic Analysis</h3>
          </div>
          
          {/* Linguistic Coverage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">Grammar & Structure</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Verb Tenses</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {analysis.linguisticCoverage?.verbTenses || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Subject-Verb Agreement</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {analysis.linguisticCoverage?.grammar || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Pronouns</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {analysis.linguisticCoverage?.pronouns || 0} fixes
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Usage & Style</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Articles (a/an/the)</span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                    {analysis.linguisticCoverage?.articles || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Prepositions</span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                    {analysis.linguisticCoverage?.prepositions || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Collocations</span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                    {analysis.linguisticCoverage?.collocations || 0} fixes
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Accuracy & Polish</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Spelling</span>
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                    {analysis.linguisticCoverage?.spelling || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Idioms & Phrases</span>
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                    {analysis.linguisticCoverage?.idioms || 0} fixes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Style Improvements</span>
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                    {analysis.linguisticCoverage?.style || 0} fixes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Model Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Brain className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">AI Processing Details</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-3">Models Used</h5>
                <div className="space-y-2">
                  {result.models?.map((model, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">{model}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-3">Processing Stats</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{statistics.processingTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className="font-medium">{analysis.confidenceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Used:</span>
                    <span className="font-medium">{result.serviceUsed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Text Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Text */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 text-red-600 mr-2" />
                Original Text
              </h3>
              <button
                onClick={() => onCopy(original)}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Copy original text"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-red-50 p-4 rounded-md border max-h-96 overflow-y-auto">
                {original}
              </div>
            </div>
          </div>
        </div>

        {/* Corrected Text */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                AI-Corrected Text
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onCopy(corrected)}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                  title="Copy corrected text"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
                
                <button
                  onClick={() => onDownload(corrected, 'ai-corrected-text.txt')}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                  title="Download corrected text"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-green-50 p-4 rounded-md border max-h-96 overflow-y-auto">
                {corrected}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Corrections with Explanations */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
              AI Corrections & Explanations ({corrections.length})
            </h3>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                {showExplanations ? 'Hide' : 'Show'} Explanations
              </button>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="all">All Categories</option>
                {Object.keys(correctionsByCategory).map(category => (
                  <option key={category} value={category}>
                    {category} ({correctionsByCategory[category].length})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(correctionsByCategory).map(([category, categoryCorrections]) => {
              const categoryInfo = getCategoryInfo(category);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? categoryInfo.color + ' ring-2 ring-offset-2 ring-blue-500'
                      : categoryInfo.color + ' hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                  }`}
                >
                  <span className="mr-2">{categoryInfo.icon}</span>
                  {category} ({categoryCorrections.length})
                </button>
              );
            })}
          </div>

          {/* Corrections List */}
          <div className="space-y-4">
            {filteredCorrections.map((correction, index) => {
              const categoryInfo = getCategoryInfo(correction.category);
              
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded">
                            "{correction.original}"
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-lg font-bold text-green-600 bg-green-100 px-3 py-1 rounded">
                            "{correction.correction}"
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                          {categoryInfo.icon} {correction.category}
                        </span>
                        
                        {correction.confidence && (
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-600">
                              {correction.confidence}% confidence
                            </span>
                          </div>
                        )}
                        
                        <div className={`px-2 py-1 rounded text-xs ${
                          categoryInfo.priority === 'high' ? 'bg-red-100 text-red-800' :
                          categoryInfo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {categoryInfo.priority} priority
                        </div>
                      </div>
                      
                      {showExplanations && correction.message && (
                        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                          <div className="flex items-start">
                            <Lightbulb className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-blue-800 font-medium mb-1">
                                Grammar Rule:
                              </p>
                              <p className="text-sm text-blue-700">
                                {correction.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Changes Message */}
      {!hasChanges && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-8">
            <Award className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Outstanding Writing Quality!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Our advanced AI analysis found your text to be grammatically excellent 
              and professionally written. No corrections were needed.
            </p>
            
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Grammar Perfect</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Spelling Correct</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Style Appropriate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedResultDisplay;