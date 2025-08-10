import React from 'react';
import Avatar from './components/Avatar';
import TextInput from './components/TextInput';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { Volume2, VolumeX } from 'lucide-react';

function App() {
  const { isLoading, isSpeaking, generateSpeech, stopSpeech } = useTextToSpeech();

  const handleTextSubmit = (text: string) => {
    generateSpeech(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            Text to Speech
          </h1>
          <p className="text-gray-500 text-lg">
            Type your message and watch me speak
          </p>
        </div>

        {/* Avatar Section */}
        <div className="flex justify-center mb-12">
          <Avatar isLoading={isLoading} isSpeaking={isSpeaking} />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-6">
          {/* Stop button (only show when speaking) */}
          {isSpeaking && (
            <button
              onClick={stopSpeech}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <VolumeX size={20} />
              <span>Stop Speaking</span>
            </button>
          )}

          {/* Text Input */}
          <TextInput onSubmit={handleTextSubmit} isLoading={isLoading} />

          {/* Instructions */}
          <div className="text-center text-gray-400 text-sm max-w-md">
            <p>Enter your text above and press send to generate speech</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-400 text-xs">
        <p>Powered by your Text-to-Speech model</p>
      </div>
    </div>
  );
}

export default App;