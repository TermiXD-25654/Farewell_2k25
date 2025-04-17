import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import Confetti from "react-confetti";
// Import the puzzle image
import puzzleImage from "../assets/puzzle-image.jpg";
import qr from "../assets/qr-code.png";
// Import API for progress tracking
import { updateProgress } from "../api";

// This will be provided by you later
const ROUND_2_CONFIG = {
  // Use the imported image
  imagePath: puzzleImage,
  // You can replace this with your actual puzzle width and height
  gridSize: 3, // 3x3 grid (8 tiles + 1 empty space)
  // Add the secret pin here
  secretPin: "_D5NetMJFLZOhy4vlDMsnQlRJ1DNAQsjaRMxm4VuHCs=", // You can change this to any pin you want
};

// Helper to check if puzzle is solved
const isPuzzleSolved = (tiles) => {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i) {
      return false;
    }
  }
  return true;
};

// Helper to shuffle array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Check if the puzzle is solvable (for 3x3, this is determined by the parity)
  let inversions = 0;
  for (let i = 0; i < shuffled.length - 1; i++) {
    if (shuffled[i] === 8) continue; // Skip the empty tile
    for (let j = i + 1; j < shuffled.length; j++) {
      if (shuffled[j] === 8) continue; // Skip the empty tile
      if (shuffled[i] > shuffled[j]) {
        inversions++;
      }
    }
  }

  // For 3x3 puzzles with the empty space at the end, the puzzle is solvable if the number of inversions is even
  if (inversions % 2 !== 0) {
    // If not solvable, swap the first two tiles if neither is the empty tile
    if (shuffled[0] !== 8 && shuffled[1] !== 8) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    } else {
      [shuffled[2], shuffled[3]] = [shuffled[3], shuffled[2]];
    }
  }

  return shuffled;
};

const Round2Page = () => {
  const gridSize = ROUND_2_CONFIG.gridSize;
  const totalTiles = gridSize * gridSize;
  const emptyTileIndex = totalTiles - 1; // The last tile is the empty one

  const [tiles, setTiles] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showLOL, setShowLOL] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFakeError, setShowFakeError] = useState(false);
  const [showRealButton, setShowRealButton] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [qrScanned, setQrScanned] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleQrScanSuccess = () => {
    setQrScanned(true);
    setShowHint(false);
  };

  useEffect(() => {
    const update = async () => {
      try {
        if (completed) {
          await updateProgress(2, "completed"); // 👈 API call
          setTimeout(() => {
            setShowCongrats(true);
          }, 500);
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
        alert("Something went wrong while saving your progress.");
      }
    };
    update();
  }, [completed]);

  // Initialize the puzzle
  useEffect(() => {
    // Create the initial solved state [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const initialTiles = Array.from({ length: totalTiles }, (_, i) => i);

    // Shuffle the tiles (excluding the empty tile)
    const shuffledTiles = shuffleArray(initialTiles);
    setTiles(shuffledTiles);

    // Load the image to get its natural dimensions
    const img = new Image();
    img.src = puzzleImage;
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatio(ratio);
    };
  }, [totalTiles]);

  // Check if puzzle is solved after each move
  useEffect(() => {
    if (tiles.length === 0) return;

    if (isPuzzleSolved(tiles)) {
      setCompleted(true);
      setShowConfetti(true);
    }
  }, [tiles]);

  // Handle tile click - move tile if adjacent to empty space
  const handleTileClick = (index) => {
    if (completed) return;

    const emptyIndex = tiles.indexOf(emptyTileIndex);

    // Check if the clicked tile is adjacent to the empty space
    // In a 3x3 grid, tiles can be adjacent horizontally or vertically but not diagonally
    const isAdjacentHorizontally =
      Math.floor(index / gridSize) === Math.floor(emptyIndex / gridSize) &&
      Math.abs((index % gridSize) - (emptyIndex % gridSize)) === 1;

    const isAdjacentVertically =
      Math.abs(
        Math.floor(index / gridSize) - Math.floor(emptyIndex / gridSize)
      ) === 1 && index % gridSize === emptyIndex % gridSize;

    if (isAdjacentHorizontally || isAdjacentVertically) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);
      setMoves((prevMoves) => prevMoves + 1);
    }
  };

  const handleNextRound = () => {
    setShowFakeError(true);

    // Show the real button after a delay
    setTimeout(() => {
      setShowLOL(true);
    }, 10000);

    setTimeout(() => {
      setShowFakeError(false);

      setShowRealButton(true);
    }, 15000);
  };

  const handleRealNextRound = () => {
    navigate("/EEsVIGd64nP0_hl6dmgsTXqe7");
  };

  const toggleHint = () => {
    // Modified to show pin input instead of regular hint
    setShowPinInput(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinValue === ROUND_2_CONFIG.secretPin) {
      // If pin is correct, mark as completed and show confetti
      setCompleted(true);
      setShowConfetti(true);
      setShowPinInput(false);
      setPinError("");
    } else {
      // If pin is incorrect, show error and fallback to normal hint
      setPinError("Incorrect PIN. Try again or use the hint.");
      setTimeout(() => {
        setPinError("");
      }, 3000);
    }
  };

  const handleShowRegularHint = () => {
    setShowPinInput(false);
    setShowHint(true);
  };

  const resetPuzzle = () => {
    const initialTiles = Array.from({ length: totalTiles }, (_, i) => i);
    const shuffledTiles = shuffleArray(initialTiles);
    setTiles(shuffledTiles);
    setMoves(0);
    setCompleted(false);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-500 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={500} gravity={0.05} />
      )}

      <div className="absolute top-4 right-4">
        <button
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:shadow-blue-500/50"
          onClick={toggleHint}
        >
          <span className="text-2xl text-white animate-pulse">💡</span>
        </button>
      </div>

      {/* PIN Input Modal */}
      {showPinInput && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <Button
              variant="destructive"
              className="absolute top-4 right-4"
              onClick={() => setShowPinInput(false)}
            >
              Close
            </Button>
            <h3 className="text-2xl font-bold mb-4 text-purple-300">
              Enter PIN
            </h3>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Enter secret PIN to skip puzzle
                </label>
                <input
                  type="password"
                  id="pin"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PIN"
                />
                {pinError && (
                  <p className="text-red-400 text-sm mt-1">{pinError}</p>
                )}
              </div>
              <div className="flex justify-between gap-3">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-2 px-4 rounded-lg w-full"
                >
                  Submit PIN
                </Button>
                <Button
                  type="button"
                  onClick={handleShowRegularHint}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-2 px-4 rounded-lg w-full"
                >
                  Show Regular Hint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  onClick={handleQrScanSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="z-10 max-w-4xl w-full">
        {!showFakeError ? (
          <>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-blue-900/50 shadow-2xl animate-fade-in">
              <h1 className="p-2 text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Round 2: Image Puzzle
              </h1>

              {!completed ? (
                <>
                  <p className="mb-8 text-center text-lg text-blue-300">
                    Rearrange the tiles to complete the image. Click on a tile
                    to move it.
                  </p>

                  {/* Hint modal with original image */}
                  {showHint && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">
                          Reference Image
                        </h3>
                        {qrScanned ? (
                          <div className="relative overflow-hidden rounded-lg mb-6">
                            <img
                              src={puzzleImage}
                              alt="Complete puzzle image"
                              className="w-full object-contain"
                              ref={imageRef}
                            />
                          </div>
                        ) : (
                          <p className="text-center text-gray-300">
                            Please scan the QR code to view the reference image.
                          </p>
                        )}
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setShowHint(false)}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                          >
                            Close Hint
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mb-10">
                    <div
                      className="grid gap-1 relative bg-gray-900/40 p-2 rounded-xl border border-blue-800/50 shadow-lg"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: "320px",
                        height: `${320 / imageAspectRatio}px`, // Adjust height based on aspect ratio
                        aspectRatio: imageAspectRatio,
                      }}
                    >
                      {Array.from({ length: totalTiles }).map((_, index) => {
                        const tileIndex = tiles[index];
                        const isEmptyTile = tileIndex === emptyTileIndex;

                        // Calculate the background position to show the correct part of the image
                        const tileWidth = 100 / gridSize;
                        const tileHeight = 100 / gridSize;

                        const originalRow = Math.floor(tileIndex / gridSize);
                        const originalCol = tileIndex % gridSize;

                        const backgroundPositionX = -originalCol * tileWidth;
                        const backgroundPositionY = -originalRow * tileHeight;

                        return (
                          <div
                            key={index}
                            className={`relative cursor-pointer transition-all duration-200 rounded-md transform hover:scale-105 ${
                              isEmptyTile
                                ? "bg-transparent"
                                : "bg-gray-800/70 shadow-md"
                            }`}
                            style={{
                              backgroundImage: isEmptyTile
                                ? "none"
                                : `url(${puzzleImage})`,
                              backgroundSize: `${gridSize * 100}%`,
                              backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
                            }}
                            onClick={() => handleTileClick(index)}
                          >
                            {/* Tile number overlay */}
                            {!isEmptyTile && (
                              <div className="absolute top-1 left-1 text-xs font-bold text-white bg-black/50 px-1 py-0.5 rounded">
                                {tileIndex + 1}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 mb-6">
                    <Button
                      size="lg"
                      onClick={toggleHint}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Show Hint / Enter PIN
                    </Button>

                    <Button
                      size="lg"
                      onClick={resetPuzzle}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Reset Puzzle
                    </Button>
                  </div>
                  <div className="text-center text-gray-300 text-lg">
                    Moves: {moves}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mb-8 transform animate-bounce-slow">
                    <svg
                      className="w-24 h-24 mx-auto text-blue-500"
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

                  <h2 className="p-1 text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-xl mb-10 text-gray-300">
                    {pinValue === ROUND_2_CONFIG.secretPin
                      ? "You've unlocked the secret PIN!"
                      : "You've solved the image puzzle!"}
                  </p>

                  {!showRealButton ? (
                    <Button
                      size="lg"
                      onClick={handleNextRound}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Next Round
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleRealNextRound}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 animate-bounce"
                    >
                      Continue to Round 3
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center bg-gray-800/40 backdrop-blur-md p-10 rounded-2xl border border-red-800/40 shadow-2xl animate-zoom-in">
            <h2 className="text-8xl font-bold mb-6 text-red-500">404</h2>
            <p className="text-3xl mb-6 text-red-300">Page Not Found</p>
            <div className="max-w-md mx-auto">
              <p className="mb-8 text-gray-400">
                Oops! The page you're looking for doesn't exist.
              </p>
            </div>
            {showFakeError && showLOL && (
              <>
                <p className="text-2xl text-yellow-400 animate-pulse mt-6 ">
                  LOL 😂
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-zoom-in {
          animation: zoomIn 0.5s ease-out;
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
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

export default Round2Page;
