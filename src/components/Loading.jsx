import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ loadingText = "Loading...", description = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        {/* Outer ripple effect */}
        <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-30"></div>
        
        {/* Inner spinner */}
        <div className="relative bg-white rounded-full p-3 shadow-lg">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      </div>
      
      {/* Loading text with animated dots */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{loadingText}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
        <div className="flex justify-center mt-2 space-x-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;