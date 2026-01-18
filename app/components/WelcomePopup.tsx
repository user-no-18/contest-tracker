"use client";

import { useState, useEffect } from "react";
import { X, Bell, TrendingUp, Mail, Sparkles } from "lucide-react";
import Image from "next/image";

interface WelcomePopupProps {
  userName: string;
  onClose: () => void;
  darkMode: boolean;
}

export default function WelcomePopup({ userName, onClose, darkMode }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isVisible ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg transition-all duration-300 z-50 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div
          className={`relative p-8 rounded-3xl border-4 ${
            darkMode ? "border-white bg-gray-900" : "border-black bg-white"
          } cartoon-shadow-lg`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-full border-2 ${
              darkMode ? "border-white bg-gray-800 hover:bg-gray-700" : "border-black bg-gray-100 hover:bg-gray-200"
            } transition-all`}
          >
            <X className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`} />
          </button>

          {/* Welcome Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div
                className={`p-4 rounded-full border-4 ${
                  darkMode ? "border-white bg-gradient-to-r from-blue-500 to-purple-500" : "border-black bg-gradient-to-r from-blue-400 to-purple-400"
                } cartoon-shadow animate-bounce`}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2
              className={`text-3xl md:text-4xl font-black ${
                darkMode ? "text-white" : "text-black"
              } mb-2`}
            >
              Welcome, {userName}! 🎉
            </h2>
            <p
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              You're all set to start your coding journey!
            </p>
          </div>

          {/* Sign in with Google Button */}
          <div className="mb-6">
            <div
              className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 ${
                darkMode ? "border-green-500 bg-green-900/30" : "border-green-600 bg-green-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src="/usericon.png"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-bold ${
                      darkMode ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    ✓ Signed in with Google
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your account is secure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-6">
            <div
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${
                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-yellow-500" : "bg-yellow-400"
                } border-2 ${darkMode ? "border-white" : "border-black"}`}
              >
                <Bell className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3
                  className={`font-black ${
                    darkMode ? "text-white" : "text-black"
                  } mb-1`}
                >
                  Real-time Notifications
                </h3>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Get notified for contests starting within 48 hours
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${
                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-blue-500" : "bg-blue-400"
                } border-2 ${darkMode ? "border-white" : "border-black"}`}
              >
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3
                  className={`font-black ${
                    darkMode ? "text-white" : "text-black"
                  } mb-1`}
                >
                  Track Your Activity
                </h3>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Monitor your progress and coding streaks
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${
                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-purple-500" : "bg-purple-400"
                } border-2 ${darkMode ? "border-white" : "border-black"}`}
              >
                <Mail className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3
                  className={`font-black ${
                    darkMode ? "text-white" : "text-black"
                  } mb-1`}
                >
                  Personalized Updates
                </h3>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Receive weekly emails based on your progress
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className={`w-full py-4 rounded-2xl font-black text-lg border-2 transition-all ${
              darkMode
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-white text-white"
                : "bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 border-black text-black"
            } cartoon-shadow hover:translate-y-1`}
          >
            Let's Get Started! 🚀
          </button>
        </div>
      </div>

      <style jsx>{`
        .cartoon-shadow {
          box-shadow: 6px 6px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
      `}</style>
    </>
  );
}