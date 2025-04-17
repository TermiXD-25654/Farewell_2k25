import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import qr from '../assets/qr-code.png';
import { updateProgress } from '../api.js'; // 👈 import API function

const ROUND_1_CONFIG = {
  puzzleEmojis: '🙏🏻 💦🤰 EMR ⚰ 💀',
  correctAnswer: 'WELCOME TO EMR FAREWELL 2025',
  hints: [
    'Think about what you use to solve puzzles',
    'The first emoji represents your head',
    'The last emoji is about observation',
  ],
  maxAttemptsBeforeHint: 3,
};

const Round1Page = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userAnswer.trim().toLowerCase() === ROUND_1_CONFIG.correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      try {
        const username = localStorage.getItem('username'); // 👈 get username
        await updateProgress( 1, 'completed'); // 👈 API call
        setTimeout(() => {
          setShowCongrats(true);
        }, 500);
      } catch (error) {
        console.error('Failed to update progress:', error);
        alert('Something went wrong while saving your progress.');
      }
    } else {
      setAttempts((prev) => prev + 1);
      setUserAnswer('');
    }
  };

  useEffect(() => {
    if (attempts >= ROUND_1_CONFIG.maxAttemptsBeforeHint && !showHint) {
      setShowHint(true);
    }
  }, [attempts, showHint]);

  const handleHintClick = () => {
    setCurrentHintIndex((prev) => (prev + 1) % ROUND_1_CONFIG.hints.length);
  };

  const handleNextRound = () => {
    navigate('/round2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 hover:shadow-purple-500/50"
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
                  src={qr}
                  alt="QR Code"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="z-10 max-w-4xl w-full">
        {!showCongrats ? (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-purple-900/50 shadow-2xl animate-fade-in">
            <h1 className="p-2 text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              Round 1: Emoji Puzzle
            </h1>

            <div className="text-7xl mb-10 text-center filter drop-shadow-lg animate-float">
              {ROUND_1_CONFIG.puzzleEmojis}
            </div>

            <div className="mb-8 w-full max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="w-full p-4 bg-gray-800/60 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg placeholder-gray-400 transition-all"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                >
                  Submit Answer
                </Button>
              </form>
            </div>

            {attempts > 0 && !isCorrect && (
              <div className="text-pink-400 mb-6 text-center animate-shake">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  That's not correct. Try again! Attempts: {attempts}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-green-500/30 shadow-2xl animate-fade-in">
            <div className="mb-8 transform animate-bounce-slow">
              <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <h2 className="p-4 text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
              Congratulations! 🎉
            </h2>
            <p className="text-xl mb-8 text-gray-300">You've solved the emoji puzzle!</p>

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

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Round1Page;
