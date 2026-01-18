"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function AuthCodeError() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");

        body {
          font-family: "Fredoka", sans-serif;
          background-color: ${darkMode ? "#0a0a0a" : "#ffffff"};
        }

        .cartoon-shadow {
          box-shadow: 4px 4px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-lg {
          box-shadow: 8px 8px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className={`max-w-2xl w-full p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg`}
        >
          <div className="text-center">
            <div
              className={`inline-block p-6 rounded-full border-4 ${darkMode ? "border-white bg-red-900/50" : "border-black bg-red-100"} mb-6 cartoon-shadow`}
            >
              <AlertCircle
                className={`w-16 h-16 ${darkMode ? "text-red-400" : "text-red-500"}`}
              />
            </div>

            <h1
              className={`text-4xl md:text-5xl font-black ${darkMode ? "text-white" : "text-black"} mb-4`}
            >
              Authentication Error
            </h1>

            <p
              className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold mb-8`}
            >
              Oops! Something went wrong during sign-in.
            </p>

            <div
              className={`p-6 rounded-2xl border-2 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"} mb-8 text-left`}
            >
              <h3
                className={`font-bold text-lg ${darkMode ? "text-white" : "text-black"} mb-3`}
              >
                Common Issues:
              </h3>
              <ul
                className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold`}
              >
                <li>• Google OAuth redirect URL not configured correctly</li>
                <li>• Session expired or invalid authentication code</li>
                <li>• Browser cookies are disabled</li>
                <li>• Network connection issue</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className={`flex items-center justify-center gap-2 px-6 py-3 ${darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-400 hover:bg-blue-500"} text-white rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow`}
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>

              <button
                onClick={() => window.location.reload()}
                className={`flex items-center justify-center gap-2 px-6 py-3 ${darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-400 hover:bg-green-500"} ${darkMode ? "text-white" : "text-black"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow`}
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}