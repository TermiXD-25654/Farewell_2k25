import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';

// These values will be provided by you later
const ROUND_3_CONFIG = {
  correctAnswer: 'inspector',
  // This is the hidden message that will be visible in the browser inspector
  hiddenMessage: 'The password is: inspector'
};

const Round3Page = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Clue.............");
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (userAnswer.trim().toLowerCase() === ROUND_3_CONFIG.correctAnswer.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setAttempts(prev => prev + 1);
      setUserAnswer('');
    }
  };

  const handleNextRound = () => {
    navigate('/round4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
      </div>
      
      {/* HTML Comment that will be visible in the source code */}
      {/* <!-- 
        SECRET_MESSAGE: Looking at the page source? Good job!
        THE PASSCODE IS: inspector
        You found it! Now submit it in the form.
      --> */}
      
      <div className="z-10 max-w-4xl w-full">
        {!isCorrect ? (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-purple-900/50 shadow-2xl animate-fade-in">
            <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              Round 3: Secret Inspector
            </h1>
            
            <div className="text-center mb-12">
              <p className="text-3xl mb-6 font-code">
                Party belongs to those who <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-bold">inspect</span>
              </p>
              <div className="mb-6 flex items-center justify-center">
                <div className="w-16 h-1 bg-purple-700 rounded-full mx-2"></div>
                <div className="text-purple-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="w-16 h-1 bg-purple-700 rounded-full mx-2"></div>
              </div>
            
            </div>
            
            {/* Hidden message that will be visible in the page source/inspector */}
            <div className="hidden inspector-message">
              {/* This comment will be visible in the source code */}
              {/* ROUND_3_CONFIG.hiddenMessage */}
            </div>

            {/* Custom HTML element with data attribute */}
            <div data-secret="The secret code is: inspector" className="hidden"></div>
            
            <div className="mb-8 w-full max-w-md mx-auto relative">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl"></div>
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="relative group">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter the secret code"
                    className="w-full p-4 bg-gray-900/60 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg placeholder-gray-500 transition-all font-code"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                >
                  Submit Code
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
            
            {attempts >= 3 && (
              <div className="text-center mt-8">
                <p className="text-gray-400 text-sm italic animate-pulse">
                  The answer is hiding in plain sight... but not on this page's display.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-green-500/30 shadow-2xl animate-fade-in">
            <div className="mb-8 transform animate-bounce-slow">
              <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">Congratulations! 🎉</h2>
            <p className="text-xl mb-4 text-gray-300">You've discovered the secret code!</p>
            <p className="mb-10 text-gray-400">Your inspector skills are impressive.</p>
            
            <Button 
              size="lg" 
              onClick={handleNextRound}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Next Round
            </Button>
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
        .animate-bounce-slow {
          animation: bounce 2s infinite;
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Round3Page;