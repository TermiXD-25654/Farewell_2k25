import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import welcomeCallAudio from '../assets/welcome-call-audio.mp3';

// Use the imported audio file directly
const VOICE_MESSAGE_URL = welcomeCallAudio;

// Log the audio URL to verify it's correct
console.log('Audio file URL:', VOICE_MESSAGE_URL);

const WelcomePage = () => {
  const [callState, setCallState] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initial callState:', callState);
    
    // Simulate incoming call after a short delay
    const timer = setTimeout(() => {
      console.log('Setting callState to incoming');
      setCallState('incoming');
    }, 1500);

    // Initialize audio element with improved configuration
    const audioElement = new Audio();
    audioElement.src = VOICE_MESSAGE_URL;
    audioElement.preload = 'auto'; // Ensure audio is preloaded
    
    // Add more detailed logging for audio loading
    audioElement.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and can play through');
      setAudioReady(true);
    });
    
    audioElement.addEventListener('loadeddata', () => {
      console.log('Audio data loaded successfully');
    });
    
    audioElement.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      console.error('Audio error code:', audioElement.error ? audioElement.error.code : 'unknown');
      console.error('Audio src:', audioElement.src);
      
      // Try to recover by creating an alternative audio element
      setTimeout(() => {
        const altAudio = new Audio(VOICE_MESSAGE_URL);
        audioRef.current = altAudio;
        console.log('Created alternative audio element');
      }, 1000);
    });
    
    audioElement.addEventListener('ended', () => {
      console.log('Audio ended, setting callState to ended');
      setCallState('ended');
    });
    
    // Try to load the audio file
    audioElement.load();
    
    audioRef.current = audioElement;

    // Enable audio on first user interaction
    const enableAudio = () => {
      const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//tUZAAAA");
      silentAudio.play().then(() => {
        console.log('Audio context unlocked by user interaction');
      }).catch(e => console.log('Failed to unlock audio context', e));
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', enableAudio);
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement.removeEventListener('ended', () => {
          setCallState('ended');
        });
      }
    };
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('Current callState:', callState);
  }, [callState]);

  const handleAnswerCall = () => {
    console.log('Call answered, setting state to active');
    setCallState('active');
    if (audioRef.current) {
      // Try to play the audio with better error handling
      audioRef.current.currentTime = 0; // Reset audio to beginning
      
      // Add volume control to ensure it's audible
      audioRef.current.volume = 1.0;
      
      console.log('Attempting to play audio...');
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully');
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            
            // Try a different approach to play audio
            console.log('Trying alternative approach to play audio...');
            
            // Create a new audio element and try to play it immediately
            const newAudio = new Audio(VOICE_MESSAGE_URL);
            newAudio.volume = 1.0;
            newAudio.addEventListener('ended', () => setCallState('ended'));
            
            newAudio.play()
              .then(() => {
                console.log('Alternative audio playing successfully');
                audioRef.current = newAudio;
              })
              .catch(e => {
                console.error('Alternative audio playback failed:', e);
                
                // Add visible button for user to manually trigger audio
                alert('Audio playback failed. Please click anywhere on the page to enable audio.');
                
                // Add a click handler to the document to try playing again when user interacts
                const clickHandler = () => {
                  const userTriggeredAudio = new Audio(VOICE_MESSAGE_URL);
                  userTriggeredAudio.volume = 1.0;
                  userTriggeredAudio.addEventListener('ended', () => setCallState('ended'));
                  
                  userTriggeredAudio.play()
                    .then(() => {
                      console.log('User-triggered audio now playing');
                      audioRef.current = userTriggeredAudio;
                      document.removeEventListener('click', clickHandler);
                    })
                    .catch(e => console.error('Still failed to play audio:', e));
                };
                
                document.addEventListener('click', clickHandler);
              });
          });
      }
    } else {
      console.error('Audio element not initialized');
      
      // Try to create and play a new audio element as a fallback
      const fallbackAudio = new Audio(VOICE_MESSAGE_URL);
      fallbackAudio.volume = 1.0;
      fallbackAudio.addEventListener('ended', () => setCallState('ended'));
      
      fallbackAudio.play()
        .then(() => {
          console.log('Fallback audio playing');
          audioRef.current = fallbackAudio;
        })
        .catch(e => console.error('Fallback audio failed:', e));
    }
  };

  const handleContinue = () => {
    navigate('/round1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-indigo-600 opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="z-10 transition-all duration-500 ease-out transform">
        <div className="mb-10 text-center">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Webhunt 2K25</h1>
          <p className="text-gray-400 text-xl">The Ultimate Web Challenge</p>
        </div>
        
        {callState === null && (
          <div className="text-xl flex items-center gap-2 animate-pulse">
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Initializing...
          </div>
        )}

        {callState === 'incoming' && (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-700 transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-xl font-semibold">Webhunt</h2>
                  <p className="text-green-400 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                    Incoming call...
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="destructive" 
                className="rounded-full w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 transition-transform duration-300 transform hover:scale-105 hover:rotate-12"
                onClick={() => setCallState('ended')}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </Button>
              
              <Button 
                className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16 flex items-center justify-center transition-transform duration-300 transform hover:scale-105 hover:rotate-12"
                onClick={handleAnswerCall}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </Button>
            </div>
          </div>
        )}

        {callState === 'active' && (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-700 transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-2xl shadow-lg pulse-animation">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-xl font-semibold">Webhunt</h2>
                  <p className="text-green-400">
                    <span className="animate-bounce inline-block mr-2">📱</span>
                    Call in progress...
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-4">
              {/* Audio wave animation */}
              <div className="flex items-center justify-center h-10 space-x-1 mb-8">
                <div className="w-1 h-6 bg-green-500 rounded-full animate-soundwave"></div>
                <div className="w-1 h-10 bg-green-500 rounded-full animate-soundwave" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-8 bg-green-500 rounded-full animate-soundwave" style={{animationDelay: '0.4s'}}></div>
                <div className="w-1 h-4 bg-green-500 rounded-full animate-soundwave" style={{animationDelay: '0.6s'}}></div>
                <div className="w-1 h-10 bg-green-500 rounded-full animate-soundwave" style={{animationDelay: '0.8s'}}></div>
                <div className="w-1 h-6 bg-green-500 rounded-full animate-soundwave" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="destructive" 
                className="rounded-full w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setCallState('ended');
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </Button>
            </div>
          </div>
        )}

        {callState === 'ended' && (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 shadow-2xl transition-all animate-fade-in">
            <svg className="w-20 h-20 mx-auto mb-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Call Ended</h2>
            <p className="mb-8 text-xl text-gray-300">Are you ready for the challenge?</p>
            <Button 
              size="lg" 
              onClick={handleContinue}
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Webhunt
            </Button>
          </div>
        )}
      </div>

      {/* Add some style for the pulsing animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        .animate-soundwave {
          animation: soundwave 1.2s infinite ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }
        @keyframes soundwave {
          0% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;