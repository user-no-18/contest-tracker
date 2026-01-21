import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, TrendingUp, Mail, Calendar } from 'lucide-react';

interface SignInPromptProps {
  darkMode: boolean;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

export default function SignInPrompt({ darkMode, onSignIn, isAuthenticated }: SignInPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this before (session storage)
    const wasDismissed = sessionStorage.getItem('signInPromptDismissed');
    if (wasDismissed) {
      setDismissed(true);
    } else {
      // Show with slight delay for better UX
      setTimeout(() => setShowAnimation(true), 3000);
    }
  }, []);

  const handleDismiss = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem('signInPromptDismissed', 'true');
    }, 300);
  };

  if (isAuthenticated || dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ maxWidth: '380px' }}
    >
      {/* Desktop Version */}
      <div className="hidden md:block">
        <div
          className={`relative p-6 rounded-3xl border-4 ${
            darkMode
              ? 'border-white bg-gradient-to-br from-purple-900 to-blue-900'
              : 'border-black bg-gradient-to-br from-purple-100 to-blue-100'
          } shadow-2xl`}
          style={{
            boxShadow: darkMode
              ? '8px 8px 0px 0px rgba(255, 255, 255, 0.3)'
              : '8px 8px 0px 0px rgba(0, 0, 0, 1)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className={`absolute top-3 right-3 p-1.5 rounded-full border-2 ${
              darkMode
                ? 'border-white bg-gray-800 hover:bg-gray-700'
                : 'border-black bg-white hover:bg-gray-100'
            } transition-all`}
            aria-label="Dismiss"
          >
            <X className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-black'}`} />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-xl border-2 ${
                darkMode ? 'border-white bg-yellow-500' : 'border-black bg-yellow-400'
              } animate-bounce`}
              style={{ boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.3)' }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h3
              className={`text-lg font-black ${darkMode ? 'text-white' : 'text-black'}`}
            >
              Never Miss a Contest! 🎯
            </h3>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-2">
              <Bell className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Get email alerts <span className="text-green-500">24h before</span> contests start
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Track progress across <span className="text-purple-500">LeetCode, Codeforces & more</span>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Curated <span className="text-pink-500">DSA resources & roadmaps</span> weekly
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onSignIn}
            className={`w-full py-3 rounded-xl font-black text-sm border-3 transition-all ${
              darkMode
                ? 'bg-green-500 hover:bg-green-600 text-white border-white'
                : 'bg-green-400 hover:bg-green-500 text-black border-black'
            }`}
            style={{
              boxShadow: darkMode
                ? '4px 4px 0px 0px rgba(255, 255, 255, 0.3)'
                : '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            }}
          >
            🚀 Sign In with Google - It's Free!
          </button>

          <p className={`text-xs text-center mt-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join 1000+ coders crushing their goals
          </p>
        </div>
      </div>

      {/* Mobile Version - More Compact */}
      <div className="md:hidden">
        <div
          className={`relative p-4 rounded-2xl border-3 ${
            darkMode
              ? 'border-white bg-gradient-to-br from-purple-900 to-blue-900'
              : 'border-black bg-gradient-to-br from-purple-100 to-blue-100'
          } shadow-xl`}
          style={{
            boxShadow: darkMode
              ? '6px 6px 0px 0px rgba(255, 255, 255, 0.3)'
              : '6px 6px 0px 0px rgba(0, 0, 0, 1)',
          }}
        >
          <button
            onClick={handleDismiss}
            className={`absolute top-2 right-2 p-1 rounded-full border-2 ${
              darkMode
                ? 'border-white bg-gray-800'
                : 'border-black bg-white'
            }`}
            aria-label="Dismiss"
          >
            <X className={`w-3 h-3 ${darkMode ? 'text-white' : 'text-black'}`} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Bell className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} />
            <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-black'}`}>
              Never Miss Contests! 🎯
            </h3>
          </div>

          <p className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            ✓ Email alerts before contests<br/>
            ✓ Track your coding journey<br/>
            ✓ Weekly DSA resources
          </p>

          <button
            onClick={onSignIn}
            className={`w-full py-2.5 rounded-xl font-black text-xs border-2 ${
              darkMode
                ? 'bg-green-500 text-white border-white'
                : 'bg-green-400 text-black border-black'
            }`}
            style={{
              boxShadow: darkMode
                ? '3px 3px 0px 0px rgba(255, 255, 255, 0.3)'
                : '3px 3px 0px 0px rgba(0, 0, 0, 1)',
            }}
          >
            🚀 Sign In Free
          </button>
        </div>
      </div>
    </div>
  );
}