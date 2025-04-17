import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import qr from "../assets/qr-code.png";
import clueImage from "../assets/round5-image.jpg";
import { updateProgress } from '../api.js'; // 👈 import API function

// These values will be provided by you later
const ROUND_5_CONFIG = {
  imagePath: "/src/assets/round5-image.jpg", // Corrected path to the image
  correctAnswer: "EMR Domains", // The answer to the image puzzle
  freezeDuration: 30000, // Duration in milliseconds (30 seconds) to simulate website not responding
};

const Round5Page = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showFrozenMessage, setShowFrozenMessage] = useState(false);
  const [showSecondAttempt, setShowSecondAttempt] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [secondAnswer, setSecondAnswer] = useState("");
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(
    ROUND_5_CONFIG.freezeDuration / 1000
  );
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  const handleFirstSubmit = async (e) => {
    e.preventDefault();

    if (
      userAnswer.trim().toLowerCase() ===
      ROUND_5_CONFIG.correctAnswer.toLowerCase()
    ) {
      try {
        await updateProgress(5, "completed"); // 👈 API call
        setFirstAttemptCorrect(true);
        // Simulate website freezing
        setIsFrozen(true);
        setShowFrozenMessage(true);
        startFreezeTimer();
      } catch (error) {
        console.error("Failed to update progress:", error);
        alert("Something went wrong while saving your progress.");
      }
    } else {
      setUserAnswer("");
    }
  };

  const startFreezeTimer = () => {
    let timeLeft = ROUND_5_CONFIG.freezeDuration / 1000;
    setFreezeTimeLeft(timeLeft);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setFreezeTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setIsFrozen(false);
        setShowFrozenMessage(false);
        setShowSecondAttempt(true);
      }
    }, 1000);
  };

  const handleSecondSubmit = (e) => {
    e.preventDefault();

    if (
      secondAnswer.trim().toLowerCase() ===
      ROUND_5_CONFIG.correctAnswer.toLowerCase()
    ) {
      setIsCompleted(true);
    } else {
      setSecondAnswer("");
    }
  };

  const handleNextRound = () => {
    navigate("/57qWlGe6_jIQ4AW7zji1Je26");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-800 to-pink-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-800 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.2s" }}
        ></div>
      </div>

      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 hover:shadow-pink-500/50"
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

      <div className="z-10 max-w-4xl w-full">
        {!firstAttemptCorrect ? (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-pink-900/50 shadow-2xl animate-fade-in">
            <h1 className="p-2 text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Round 5: Image Challenge
            </h1>
            <div className="mb-10 w-full max-w-md mx-auto">
              <div className="relative group mb-6">
                <div className="flex justify-center items-center">
                  <img
                    src={clueImage}
                    alt="Challenge"
                    className="w-3/4 h-auto rounded-xl shadow-lg border border-purple-500/20 group-hover:border-purple-500/40 transition-all"
                  />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <form onSubmit={handleFirstSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="What do you see in this image?"
                    className="w-full p-4 bg-gray-900/60 border border-pink-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white text-lg placeholder-gray-500 transition-all"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                >
                  Submit Answer
                </Button>
              </form>
            </div>
          </div>
        ) : showFrozenMessage ? (
          // Simulated frozen state
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-red-900/30 shadow-2xl animate-fade-in">
            <div className="animate-pulse text-red-500 text-3xl mb-6 font-bold">
              Website Not Responding...
            </div>

            <div className="mb-8">
              <svg
                className="w-16 h-16 mx-auto text-red-500 opacity-70"
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
            </div>

            <p className="text-lg mb-6">
              Please wait{" "}
              <span className="text-red-400 font-mono">{freezeTimeLeft}</span>{" "}
              seconds
            </p>

            <div className="mt-10 relative">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all rounded-full"
                  style={{
                    width: `${
                      (1 -
                        freezeTimeLeft /
                          (ROUND_5_CONFIG.freezeDuration / 1000)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-pink-500 rounded-full animate-spin"></div>
            </div>

            <p className="mt-8 text-gray-400 text-sm">
              Do not close this browser window...
            </p>
          </div>
        ) : showSecondAttempt && !isCompleted ? (
          <>
            <div className="text-center mb-10">
              <div className="mb-3">
                <svg
                  className="w-12 h-12 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p className="text-xl mb-4 text-green-300">System Recovered!</p>
              <p className="text-gray-300">
                Sorry about that! Our website had a temporary hiccup.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please enter your answer again to continue.
              </p>
            </div>
            {/* <h1 className="p-2 text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Round 5: Image Challenge
          </h1> */}
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-green-900/50 shadow-2xl animate-fade-in">
              <div className="mb-10 w-full max-w-md mx-auto">
                <div className="relative group mb-6">
                  <div className="flex justify-center items-center">
                    <img
                      src={clueImage}
                      alt="Challenge"
                      className="w-3/4 h-auto rounded-xl shadow-lg border border-green-500/20 group-hover:border-green-500/40 transition-all"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <form onSubmit={handleSecondSubmit} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      value={secondAnswer}
                      onChange={(e) => setSecondAnswer(e.target.value)}
                      placeholder="What do you see in this image?"
                      className="w-full p-4 bg-gray-900/60 border border-green-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white text-lg placeholder-gray-500 transition-all"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                  >
                    Submit Answer Again
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          isCompleted && (
            <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-green-500/30 shadow-2xl animate-fade-in">
              <div className="mb-8">
                <svg
                  className="w-24 h-24 mx-auto text-green-500 animate-bounce-slow"
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

              <h2 className="p-2 text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
                Congratulations! 🎉
              </h2>
              <p className="text-xl mb-10 text-gray-300">
                You've completed the image challenge!
              </p>

              <Button
                size="lg"
                onClick={handleNextRound}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Final Round
              </Button>
            </div>
          )
        )}
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
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
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-scan-line {
          animation: scanLine 2s infinite;
        }
        @keyframes scanLine {
          0%,
          100% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Round5Page;
