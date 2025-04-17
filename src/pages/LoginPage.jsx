import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import { Gamepad, Bomb } from "lucide-react";
import { loginUser } from "../api.js"; // ⬅️ Import API

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const userData = await loginUser(username);
      localStorage.setItem("username", username); // Save entire user data
      navigate("/welcome"); // Redirect as needed
    } catch (err) {
      setError("Login failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Dynamic Background Lights */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-ping-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500 opacity-30 rounded-full blur-3xl animate-ping-slower"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500 opacity-30 rounded-full blur-3xl animate-ping-slowest"></div>
      </div>

      {/* Login Card */}
      <div className="z-10 w-full max-w-md bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border border-pink-500/20 rounded-3xl shadow-2xl p-10 animate-fade-pop backdrop-blur-lg">
        <h1 className="p-4 text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 drop-shadow-md flex items-center justify-center gap-2">
          <Gamepad className="text-yellow-400 w-6 h-6 mr-2" />
          <span className="text-3xl font-bold text-pink-400"> WebHunt 2K25</span>
          <Bomb className="text-pink-500 w-6 h-6 ml-2" />
        </h1>
        <p className="text-indigo-300 text-center mb-10 font-mono tracking-wide animate-pulse">
          Ready to test your wits? Let’s begin!
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-gray-900/70 border-2 border-indigo-400/30 text-white placeholder-indigo-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md transition-all duration-300 focus:scale-105"
          placeholder="Enter your awesome username"
        />

        <Button
          className="mt-6 w-full py-3 text-lg font-bold rounded-xl bg-pink-600 hover:bg-pink-700 transition-transform duration-300 hover:scale-105 shadow-lg"
          onClick={handleLogin}
        >
          🚀 Let’s Go!
        </Button>

        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center z-10 text-sm text-purple-300 animate-fade-up-slow">
        <p>Built with 💡 & 🎉 by Team Juniors</p>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-pop {
          animation: fadePop 1s ease-out;
        }
        .animate-fade-up-slow {
          animation: fadeUp 1.5s ease-out;
        }
        .animate-ping-slow {
          animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slower {
          animation: ping 6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slowest {
          animation: ping 8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes fadePop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
