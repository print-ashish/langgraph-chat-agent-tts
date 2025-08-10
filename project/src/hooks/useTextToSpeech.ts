// import { useState, useRef, useCallback } from 'react';

// interface UseTextToSpeechReturn {
//   isLoading: boolean;
//   isSpeaking: boolean;
//   generateSpeech: (text: string) => Promise<void>;
//   stopSpeech: () => void;
// }

// export const useTextToSpeech = (): UseTextToSpeechReturn => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const generateSpeech = useCallback(async (text: string) => {
//     if (!text.trim()) return;

//     setIsLoading(true);
    
//     try {
//       // Optional: Simulate processing time
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Use your speech.wav file from public directory
//       const audioUrl = '/speech.wav';
      
//       // Stop any currently playing audio
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
      
//       // Create new audio instance
//       const audio = new Audio(audioUrl);
//       audioRef.current = audio;
      
//       // Set up event listeners
//       audio.onloadstart = () => {
//         console.log('Audio loading started');
//       };
      
//       audio.oncanplaythrough = () => {
//         console.log('Audio can play through');
//         setIsLoading(false);
//       };
      
//       audio.onloadeddata = () => {
//         console.log('Audio data loaded');
//         setIsLoading(false);
//         setIsSpeaking(true);
//       };
      
//       audio.onplay = () => {
//         console.log('Audio started playing');
//         setIsSpeaking(true);
//       };
      
//       audio.onended = () => {
//         console.log('Audio playback ended');
//         setIsSpeaking(false);
//       };
      
//       audio.onerror = (e) => {
//         console.error('Audio error:', e);
//         setIsLoading(false);
//         setIsSpeaking(false);
//         alert('Error: Could not load audio file. Make sure speech.wav is in the public folder.');
//       };
      
//       audio.onpause = () => {
//         console.log('Audio paused');
//         setIsSpeaking(false);
//       };
      
//       // Set audio properties (optional)
//       audio.volume = 1.0; // Full volume
//       audio.playbackRate = 1.0; // Normal speed
      
//       // Start playing
//       await audio.play();
      
//     } catch (error) {
//       console.error('Error generating speech:', error);
//       setIsLoading(false);
//       setIsSpeaking(false);
      
//       // Handle specific errors
//       if (error instanceof Error) {
//         if (error.name === 'NotAllowedError') {
//           alert('Audio playback blocked. Please interact with the page first or check browser settings.');
//         } else if (error.name === 'NotSupportedError') {
//           alert('Audio format not supported by your browser.');
//         } else {
//           alert('Error playing audio: ' + error.message);
//         }
//       }
//     }
//   }, []);

//   const stopSpeech = useCallback(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     setIsSpeaking(false);
//     console.log('Speech stopped');
//   }, []);

//   return {
//     isLoading,
//     isSpeaking,
//     generateSpeech,
//     stopSpeech,
//   };
// };

import { useState, useRef, useCallback } from 'react';

interface UseTextToSpeechReturn {
  isLoading: boolean;
  isSpeaking: boolean;
  chatText: string | null;
  generateSpeech: (query: string) => Promise<void>;
  stopSpeech: () => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatText, setChatText] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    
    try {
      // Call backend API to get chatbot text + audio
      const threadId = "ashish"
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query,  thread_id: threadId  }),
      });

      if (!res.ok) throw new Error(`Chat API failed: ${res.statusText}`);

      const data = await res.json();
      setChatText(data.text); // store chatbot text

      // Create audio URL from base64 string
      const audioUrl = `data:audio/wav;base64,${data.audio}`;

      // Stop previous audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadeddata = () => {
        setIsLoading(false);
        setIsSpeaking(true);
      };
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (e) => {
        console.error("Audio error:", e);
        setIsLoading(false);
        setIsSpeaking(false);
        alert("Error playing audio");
      };

      await audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  return {
    isLoading,
    isSpeaking,
    chatText,
    generateSpeech,
    stopSpeech,
  };
};
