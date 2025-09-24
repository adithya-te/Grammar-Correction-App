/**
 * Text Input Component
 * Handles text input with character count and validation
 */

import React, { useRef, useEffect } from 'react';
import { FileText, X } from 'lucide-react';

const TextInput = ({ 
  text, 
  setText, 
  onCorrect, 
  onClear, 
  loading, 
  onKeyDown 
}) => {
  const textareaRef = useRef(null);
  const maxLength = 20000;
  const isNearLimit = text.length > maxLength * 0.9;
  const isOverLimit = text.length > maxLength;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  }, [text]);

  // Handle paste events
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const newText = text + pastedText;
    
    if (newText.length > maxLength) {
      e.preventDefault();
      const remainingChars = maxLength - text.length;
      if (remainingChars > 0) {
        setText(text + pastedText.slice(0, remainingChars));
      }
    }
  };

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };

  // Sample texts for quick testing
  const sampleTexts = [
    "This are a example sentence with some grammar mistake that need to be fix.",
    "The quick brown fox jump over the lazy dogs. Its a beautifull day today.",
    "I have went to the store yesterday and buy some groceries for dinner tonight."
  ];

  const loadSampleText = (sample) => {
    setText(sample);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Enter Your Text
              </h3>
            </div>
            
            {text && (
              <button
                onClick={onClear}
                disabled={loading}
                className="flex items-center text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors duration-200"
                title="Clear text"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="p-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={onKeyDown}
              onPaste={handlePaste}
              placeholder="Type or paste your text here... (Press Ctrl+Enter to check grammar)"
              disabled={loading}
              className={`w-full min-h-32 max-h-96 p-4 border rounded-md resize-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                isOverLimit
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : isNearLimit
                  ? 'border-yellow-300 focus:ring-yellow-500 bg-yellow-50'
                  : 'border-gray-300 focus:ring-indigo-500'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            
            {/* Character count */}
            <div className={`absolute bottom-2 right-2 text-sm px-2 py-1 rounded ${
              isOverLimit
                ? 'text-red-700 bg-red-100'
                : isNearLimit
                ? 'text-yellow-700 bg-yellow-100'
                : 'text-gray-500 bg-gray-100'
            }`}>
              {text.length.toLocaleString()} / {maxLength.toLocaleString()}
            </div>
          </div>

          {/* Error message for over limit */}
          {isOverLimit && (
            <p className="mt-2 text-sm text-red-600">
              Text exceeds maximum length. Please reduce by {(text.length - maxLength).toLocaleString()} characters.
            </p>
          )}

          {/* Warning for near limit */}
          {isNearLimit && !isOverLimit && (
            <p className="mt-2 text-sm text-yellow-600">
              Warning: Approaching character limit ({(maxLength - text.length).toLocaleString()} characters remaining).
            </p>
          )}
        </div>

        {/* Sample texts */}
        {!text && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Try these sample texts:
              </p>
              <div className="space-y-2">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleText(sample)}
                    disabled={loading}
                    className="block w-full text-left p-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    <span className="font-medium">Sample {index + 1}:</span>{' '}
                    {sample.length > 100 ? `${sample.slice(0, 100)}...` : sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Press <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">Enter</kbd> to check grammar quickly
        </p>
      </div>
    </div>
  );
};

export default TextInput;