/**
 * Result Display Component
 * Shows original vs corrected text side by side with corrections details
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
  CheckCircle2
} from 'lucide-react';

const ResultDisplay = ({ result, onCopy, onDownload }) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const { original, corrected, corrections, language, statistics } = result;
  
  const hasChanges = original !== corrected;
  
  // Group corrections by category
  const correctionsByCategory = corrections.reduce((acc, correction) => {
    const category = correction.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(correction);
    return acc;
  }, {});

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Grammar': 'bg-red-100 text-red-800',
      'Spelling': 'bg-blue-100 text-blue-800',
      'Punctuation': 'bg-green-100 text-green-800',
      'Typography': 'bg-purple-100 text-purple-800',
      'Style': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {hasChanges ? (
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-2" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {hasChanges ? 'Corrections Applied' : 'No Corrections Needed'}
            </h2>
          </div>
          
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            {showStatistics ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {showStatistics ? 'Hide' : 'Show'} Stats
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <div className="text-2xl font-bold text-indigo-600">
              {statistics.appliedCorrections}
            </div>
            <div className="text-sm text-gray-600">Corrections</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <div className="text-2xl font-bold text-green-600">
              {statistics.totalMatches}
            </div>
            <div className="text-sm text-gray-600">Issues Found</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <div className="text-2xl font-bold text-blue-600">
              {statistics.originalLength}
            </div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(statistics.processingTime)}ms
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      {showStatistics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Detailed Statistics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">
                Language: <strong>{language.name || 'Unknown'}</strong>
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">
                Processing Time: <strong>{Math.round(statistics.processingTime)}ms</strong>
              </span>
            </div>
            
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-gray-600">
                Accuracy: <strong>{corrections.length > 0 ? Math.round((statistics.appliedCorrections / statistics.totalMatches) * 100) : 100}%</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Text Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Original Text</h3>
              <button
                onClick={() => onCopy(original)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                title="Copy original text"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md border max-h-96 overflow-y-auto">
                {original}
              </div>
            </div>
          </div>
        </div>

        {/* Corrected Text */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Corrected Text</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onCopy(corrected)}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                  title="Copy corrected text"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
                
                <button
                  onClick={() => onDownload(corrected, 'corrected-text.txt')}
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

      {/* Corrections Details */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Corrections Applied ({corrections.length})
          </h3>
          
          {/* Group corrections by category */}
          {Object.entries(correctionsByCategory).map(([category, categoryCorrections]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="flex items-center text-md font-medium text-gray-800 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getCategoryColor(category)}`}>
                  {category}
                </span>
                ({categoryCorrections.length} {categoryCorrections.length === 1 ? 'correction' : 'corrections'})
              </h4>
              
              <div className="space-y-3">
                {categoryCorrections.map((correction, index) => (
                  <div key={index} className="bg-gray-50 rounded-md p-4 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                              "{correction.original}"
                            </span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                              "{correction.correction}"
                            </span>
                          </div>
                        </div>
                        
                        {correction.message && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Issue:</strong> {correction.message}
                          </p>
                        )}
                        
                        {correction.ruleId && correction.ruleId !== 'unknown' && (
                          <p className="text-xs text-gray-500">
                            Rule ID: {correction.ruleId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Changes Message */}
      {!hasChanges && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Perfect! No corrections needed.
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your text appears to be grammatically correct and well-written. 
              No spelling or grammar issues were found.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;