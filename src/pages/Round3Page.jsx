import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import qr from "../assets/qr-code.png";
import { updateProgress } from '../api.js'; // 👈 import API function

// These values will be provided by you later
const ROUND_3_CONFIG = {
  correctAnswer: "SYNCPAGLU",
  // This is the hidden message that will be visible in the browser inspector
  hiddenMessage: "The password is: inspector",
};

const Round3Page = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // console.image('https://drive.google.com/file/d/1OxmmvRAZNpA0zE_g5wywFF9Hye8wxXLE/view?usp=sharing');
    console.log(
      "%c ",
      "font-size: 4px; padding: 50px 1500px; background: url('data:image/jpeg;base64,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') no-repeat"
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userAnswer.trim().toLowerCase() ===
      ROUND_3_CONFIG.correctAnswer.toLowerCase()
    ) {
      setIsCorrect(true);
      try {
        await updateProgress(3, "completed"); // 👈 API call
        setTimeout(() => {
          setShowCongrats(true);
        }, 500);
      } catch (error) {
        setIsCorrect(false);
        console.error("Failed to update progress:", error);
        alert("Something went wrong while saving your progress.");
      }
    } else {
      setAttempts((prev) => prev + 1);
      setUserAnswer("");
    }
  };

  const handleNextRound = () => {
    navigate("/UpS6M2lnZl8_uhVnsBFUxBxCCorh");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.2s" }}
        ></div>
      </div>

      {/* Hint button */}
      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-purple-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300 hover:shadow-gray-500/50"
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
            <h3 className="text-2xl font-bold mb-4 text-purple-300">
              Scan the QR Code
            </h3>
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

      {/* HTML Comment that will be visible in the source code */}
      {/* <!-- 
        SECRET_MESSAGE: Looking at the page source? Good job!
        THE PASSCODE IS: inspector
        You found it! Now submit it in the form.
      --> */}

      <div className="z-10 max-w-4xl w-full">
        {!isCorrect ? (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-purple-900/50 shadow-2xl animate-fade-in">
            <h1 className="p-2 text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              Round 3: Secret Inspector
            </h1>

            <div className="text-center mb-12">
              <p className="text-3xl mb-6 font-code">
                Party belongs to those who{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-bold">
                  inspect
                </span>
              </p>
              <div className="mb-6 flex items-center justify-center">
                <div className="w-16 h-1 bg-purple-700 rounded-full mx-2"></div>
                <div className="text-purple-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
            <div
              data-secret="The secret code is: inspector"
              className="hidden"
            ></div>

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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  That's not correct. Try again! Attempts: {attempts}
                </div>
              </div>
            )}

            {attempts >= 3 && (
              <div className="text-center mt-8">
                <p className="text-gray-400 text-sm italic animate-pulse">
                  The answer is hiding in plain sight... but not on this page's
                  display.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-green-500/30 shadow-2xl animate-fade-in">
            <div className="mb-8 transform animate-bounce-slow">
              <svg
                className="w-24 h-24 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>

            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
              Congratulations! 🎉
            </h2>
            <p className="text-xl mb-4 text-gray-300">
              You've discovered the secret code!
            </p>
            <p className="mb-10 text-gray-400">
              Your inspector skills are impressive.
            </p>

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
          font-family: "Consolas", "Monaco", "Courier New", monospace;
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

export default Round3Page;
