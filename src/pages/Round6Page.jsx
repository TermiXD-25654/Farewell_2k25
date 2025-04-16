import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import croreAudio from '../assets/crore.mp3';

// CSS-based confetti instead of react-confetti package
const CSSConfetti = () => {
  return (
    <div className="confetti-container">
      {Array.from({ length: 300 }).map((_, index) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animDuration = Math.random() * 3 + 2;
        const animDelay = Math.random() * 2;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        return (
          <div
            key={index}
            className="confetti"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              backgroundColor: color,
              animationDuration: `${animDuration}s`,
              animationDelay: `${animDelay}s`
            }}
          />
        );
      })}
    </div>
  );
};

const Round6Page = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const croreRef = useRef(null);
  // Prevent crore audio from playing more than once
  const playedRef = useRef(false);
  const navigate = useNavigate();

  // Prepare crore audio
  useEffect(() => {
    // Initialize incoming call croretone
    const crore = new Audio(croreAudio);
    crore.preload = 'auto';
    croreRef.current = crore;

    return () => {
      // Cleanup croretone on unmount
      if (croreRef.current) {
        croreRef.current.pause();
        croreRef.current.currentTime = 0;
      }
    };
  }, []);

  // Play crore audio at final celebration stage
  useEffect(() => {
    if (celebrationStage === 3 && croreRef.current && !playedRef.current) {
      const playPromise = croreRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Audio playback blocked or failed:', error);
          console.log('Retrying audio playback on user interaction');
          const retryAudio = () => {
            croreRef.current.play().catch((retryError) => {
              console.error('Retry failed:', retryError);
            });
            document.removeEventListener('click', retryAudio);
          };
          document.addEventListener('click', retryAudio);
        });
      }
      playedRef.current = true;
    }
  }, [celebrationStage]);

  // Start celebration sequence
  useEffect(() => {
    // Show confetti immediately
    setShowConfetti(true);

    // Sequence of celebration stages, all within 3 seconds
    const stageTimers = [
      setTimeout(() => setCelebrationStage(1), 1000),
      setTimeout(() => setCelebrationStage(2), 2000),
      setTimeout(() => setCelebrationStage(3), 3000),
    ];

    return () => {
      stageTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Show CSS confetti animation */}
      {showConfetti && <CSSConfetti />}
      
      {/* Hint button */}
      <div className="absolute top-4 right-4">
        <button 
          className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:crore-4 focus:crore-indigo-300 hover:shadow-indigo-500/50"
          onClick={() => setShowHint(true)}
        >
          <span className="text-2xl text-white animate-pulse">💡</span>
        </button>
      </div>

      {showHint && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full relative">
            <Button 
              variant="destructive" 
              className="absolute top-4 right-4"
              onClick={() => setShowHint(false)}
            >
              Close
            </Button>
            <h3 className="text-2xl font-bold mb-4 text-purple-300">Scan the QR Code</h3>
            <div className="flex justify-center items-center">
              <div className="relative w-1/4 h-1/4 border-4 border-dashed border-green-500 rounded-lg">
                <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-green-500/50 to-transparent"></div>
                <img 
                  src="/src/assets/round6-qr-code.jpg" 
                  alt="QR Code" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-72 h-72 bg-pink-600 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="z-10 max-w-4xl w-full text-center animate-fade-up">
        <div className="mb-8">
          <div className={`transition-all duration-1000 transform ${celebrationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <h1 className="p-2 text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Congratulations! 🎉
            </h1>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 transform ${celebrationStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <p className="text-3xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">
              You've Completed All Challenges!
            </p>
          </div>
        </div>
        
        <div className={`space-y-12 transition-all duration-1000 delay-500 transform ${celebrationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-800/40 backdrop-blur-lg p-10 rounded-3xl border border-indigo-500/30 shadow-2xl">
            <div className="flex justify-center mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-16 mx-1 rounded-full animate-equalizer"
                  style={{ 
                    backgroundColor: `rgba(${129 + i * 20}, ${140 + i * 10}, ${255}, 1)`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${0.8 + i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Webhunt 2K25
            </h2>
            
            <p className="text-xl text-gray-300 mb-6">
              Thanks for participating in our web challenge!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'].map((round, i) => (
                <div 
                  key={i}
                  className="bg-gray-900/60 px-3 py-2 rounded-lg border border-indigo-500/20 flex items-center justify-center"
                >
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-gray-300">{round}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center items-center">
              <div className="relative w-1/4 h-1/4 border-4 border-dashed border-green-500 rounded-lg">
                <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-green-500/50 to-transparent"></div>
                <img 
                  src="/src/assets/round5-image.jpg" 
                  alt="QR Code" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-400 text-lg">Farewell 2K25!</p>
            <p className="text-gray-500 mt-2">Created with ❤️ by JUNIORS</p>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out;
        }
        .animate-equalizer {
          animation: equalizer 1s ease-in-out infinite;
        }
        
        /* Confetti styles */
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
          overflow: hidden;
        }
        
        .confetti {
          position: absolute;
          top: -100px;
          animation: fall linear forwards;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes equalizer {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        
        @keyframes fall {
          0% {
            top: -100px;
            transform: rotate(0deg) translateX(0);
          }
          25% {
            transform: rotate(45deg) translateX(50px);
          }
          50% {
            transform: rotate(-20deg) translateX(-30px);
          }
          75% {
            transform: rotate(180deg) translateX(30px);
          }
          100% {
            top: 100vh;
            transform: rotate(360deg) translateX(-30px);
          }
        }
      `}</style>
    </div>
  );
};

export default Round6Page;