import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function InterviewRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Socket
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('agent_response_text', (data) => {
      setAgentResponse(data.text);
      // TTS
      const utterance = new SpeechSynthesisUtterance(data.text);
      window.speechSynthesis.speak(utterance);
    });

    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        
        // Send to server
        if (socketRef.current) {
          socketRef.current.emit('candidate_audio_transcript', { text: result });
        }
      };
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto mt-10 rounded-2xl p-8 shadow-sm animate-fade-in relative overflow-hidden flex flex-col items-center space-y-8">
      <div className="w-full flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          Live Technical Interview
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Candidate: John Doe
        </span>
      </div>

      {/* Main Interview Area */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Agent Persona */}
        <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
             {/* Simple Audio Visualizer Mock */}
             <div className={`absolute w-full h-full bg-white/20 scale-150 rounded-full transition-transform duration-300 ${agentResponse ? 'animate-ping' : ''}`}></div>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
             </svg>
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">AI Interviewer</h3>
          <p className="text-sm text-center italic text-slate-500 dark:text-slate-400 min-h-[60px]">
            {agentResponse || "Waiting to speak..."}
          </p>
        </div>

        {/* Candidate Controls & Proctoring */}
        <div className="flex flex-col items-center justify-center space-y-6 w-full">
          {/* Proctoring Video Feed */}
          <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700 shadow-inner">
            <video 
              autoPlay 
              muted 
              className="w-full h-full object-cover opacity-70"
              ref={video => {
                if (video && !video.srcObject) {
                  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => video.srcObject = stream)
                    .catch(console.error);
                }
              }}
            />
            <div className="absolute top-2 left-2 bg-red-500/80 px-2 py-1 rounded text-xs text-white font-bold flex items-center gap-1 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              PROCTORING ACTIVE
            </div>
          </div>

          <button 
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-slate-200'}`}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-white dark:text-slate-900'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner border border-slate-100 dark:border-slate-700 min-h-[100px]">
            <p className="text-sm font-medium text-slate-400 mb-2">Live Transcript</p>
            <p className="text-slate-700 dark:text-slate-300">
              {transcript || "Click the microphone and start speaking..."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
