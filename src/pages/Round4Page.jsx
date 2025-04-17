import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import qr from '../assets/qr-code.png';
import { updateProgress } from '../api.js'; // 👈 import API function

// These values will be provided by you later
const ROUND_4_CONFIG = {
  encryptedMessage: "b'gAAAAABoAB-Av3v3zZpHQzCi_r33n3kztO4iaDG53KFIOJuvVBbh51E-BuAf5IzlhayVX87wq-5UXAlbDCoqAeNdlyTVnVRA31MnRVCQswJhgBBqwAFOu07MWmZ-2Vn1Q9nRYW7XeolJ'", // Example binary message
  correctAnswer: 'Asla Hum bhi rakhte hai LADDAR', // Example decoded answer
  buttonsEscapeAttempts: 30 // After this many attempts, the button will stop moving
};

const Round4Page = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 50, left: 50 });
  const [buttonEscapeCount, setButtonEscapeCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userAnswer.trim().toLowerCase() === ROUND_4_CONFIG.correctAnswer.toLowerCase()) {
      setIsCorrect(true);

      try {
    
        await updateProgress( 4, 'completed'); // 👈 API call
        setTimeout(() => {
          setShowCongrats(true);
        }, 500);

        setTimeout(() => {
          setShowNextButton(true);
        }, 1000);
      } catch (error) {

        setIsCorrect(false);
        console.error('Failed to update progress:', error);
        alert('Something went wrong while saving your progress.');
      }
    } else {
      setAttempts(prev => prev + 1);
      setUserAnswer('');
    }
  };

  const moveButton = () => {
    if (buttonEscapeCount >= ROUND_4_CONFIG.buttonsEscapeAttempts) return;

    // Get panel dimensions
    const panel = document.querySelector('.round4-panel');
    const panelRect = panel.getBoundingClientRect();

    // Get button dimensions
    const buttonWidth = buttonRef.current?.offsetWidth || 100;
    const buttonHeight = buttonRef.current?.offsetHeight || 50;

    // Calculate random position within panel, ensuring the button stays within bounds
    const maxLeft = panelRect.width - buttonWidth - 100; // 10px padding from the edge
    const maxTop = panelRect.height - buttonHeight - 100; // 10px padding from the edge

    const newLeft = Math.min(panelRect.width - buttonWidth - 100, Math.max(100, Math.floor(Math.random() * maxLeft)));
    const newTop = Math.min(panelRect.height - buttonHeight - 100, Math.max(100, Math.floor(Math.random() * maxTop)));

    setButtonPosition({ top: newTop + panelRect.top, left: newLeft + panelRect.left });
    setButtonEscapeCount(prev => prev + 1);
  };

  const handleNextRound = () => {
    navigate('/round5');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-800 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-600 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.3s'}}></div>
      </div>
      
      <div className="z-10 max-w-4xl w-full relative round4-panel">
        <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
          Round 4: Decoded Message
        </h1>

        <div className="absolute top-4 right-4">
          <button 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-300 hover:shadow-cyan-500/50"
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
                    src= {qr}
                    alt="QR Code" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!isCorrect ? (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-cyan-900/50 shadow-2xl animate-fade-in">
            <div className="text-center mb-10">
              <p className="text-xl mb-6 text-cyan-300">Decode this message:</p>
              <div className="p-6 bg-gray-900/60 rounded-xl overflow-x-auto max-w-full border border-cyan-800/30">
                <code className="text-green-400 text-xl whitespace-pre-wrap break-all font-mono tracking-wider">
                  {ROUND_4_CONFIG.encryptedMessage}
                </code>
              </div>
            </div>
            
            <div className="mb-8 w-full max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter the decoded message"
                    className="w-full p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-lg placeholder-gray-500 transition-all font-code"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                >
                  Submit Answer
                </Button>
              </form>
            </div>

            {attempts > 0 && (
              <div className="text-pink-400 mb-6 text-center animate-shake">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  That's not correct. Try again! Attempts: {attempts}
                </div>
              </div>
            )}
            
            {/* Optional hint that can be shown after several attempts */}
            {attempts >= 3 && (
              <div className="mt-6 p-6 bg-gray-900/40 rounded-xl w-full max-w-md mx-auto border border-cyan-700/30 animate-fade-in">
                <p className="font-semibold mb-2 text-cyan-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Hint:
                </p>
                <p className="text-gray-300">Italian Spirit.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-cyan-800/30 shadow-2xl animate-fade-in">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Congratulations! 🎉</h2>
            <p className="text-xl mb-16 text-gray-300">You've decoded the message!</p>
            
            {showNextButton && (
              <>
                <div className="absolute" style={{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px`, zIndex: 50 }}>
                  <Button 
                    ref={buttonRef}
                    size="lg" 
                    onMouseEnter={buttonEscapeCount < ROUND_4_CONFIG.buttonsEscapeAttempts ? moveButton : undefined}
                    onClick={handleNextRound}
                    className={`bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform ${
                      buttonEscapeCount >= ROUND_4_CONFIG.buttonsEscapeAttempts ? 'animate-pulse-fast scale-105' : 'hover:scale-105'
                    }`}
                  >
                    Next Round
                  </Button>
                </div>
                
                {buttonEscapeCount < ROUND_4_CONFIG.buttonsEscapeAttempts && (
                  <p className="text-yellow-400 mt-24 animate-pulse fixed bottom-10 left-0 right-0">
                    Catch the button if you can!
                  </p>
                )}
                
                {buttonEscapeCount >= ROUND_4_CONFIG.buttonsEscapeAttempts && (
                  <p className="text-green-400 mt-24 animate-fade-in fixed bottom-10 left-0 right-0">
                    You win! Click the button to continue.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Add animations */}
      <style jsx>{`
        .font-code {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pulse-fast {
          animation: pulse 1.5s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Round4Page;