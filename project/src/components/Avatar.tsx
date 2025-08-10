import React from 'react';

interface AvatarProps {
  isLoading: boolean;
  isSpeaking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isLoading, isSpeaking }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Avatar Circle */}
        <div 
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center transition-all duration-300 ${
            isSpeaking ? 'scale-110 shadow-lg shadow-blue-400/50' : 'scale-100'
          } ${isLoading ? 'animate-pulse' : ''}`}
        >
          {/* Simple face */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex space-x-3 mb-2">
              <div 
                className={`w-3 h-3 bg-white rounded-full transition-all duration-200 ${
                  isSpeaking ? 'animate-pulse' : ''
                }`}
              />
              <div 
                className={`w-3 h-3 bg-white rounded-full transition-all duration-200 ${
                  isSpeaking ? 'animate-pulse' : ''
                }`}
              />
            </div>
            
            {/* Mouth */}
            <div 
              className={`w-6 h-3 border-2 border-white rounded-full border-t-0 transition-all duration-150 ${
                isSpeaking ? 'animate-bounce' : ''
              }`}
            />
          </div>
        </div>
        
        {/* Speaking indicator rings */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
            <div className="absolute inset-0 w-32 h-32 rounded-full border border-purple-400 animate-pulse" />
          </>
        )}
      </div>
      
      {/* Status text */}
      <div className="text-center">
        {isLoading && (
          <p className="text-gray-500 text-sm animate-pulse">Generating speech...</p>
        )}
        {isSpeaking && (
          <p className="text-blue-600 text-sm font-medium">Speaking...</p>
        )}
        {!isLoading && !isSpeaking && (
          <p className="text-gray-400 text-sm">Ready to speak</p>
        )}
      </div>
    </div>
  );
};

export default Avatar;