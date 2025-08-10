import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-4 pr-12 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[80px]"
          disabled={isLoading}
          rows={3}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="absolute bottom-3 right-3 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default TextInput;