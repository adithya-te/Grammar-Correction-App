/**
 * Loading Spinner Component
 * Displays loading animation during grammar checking
 */

import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        {/* Outer spinning circle */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200">
          <div className="rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      {/* Loading text with animation */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Checking Your Text
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-600">Analyzing grammar and spelling</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      
      {/* Progress steps */}
      <div className="mt-6 w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Sending text</span>
          <span>Processing</span>
          <span>Generating results</span>
        </div>
        
        {/* Animated progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
      
      {/* Additional loading messages */}
      <div className="mt-6 text-center max-w-sm">
        <p className="text-sm text-gray-500">
          This may take a few seconds depending on text length...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;