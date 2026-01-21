import React, { useState } from 'react';
import { Bell, X, Zap, Gift } from 'lucide-react';

interface InlineSignInBannerProps {
  darkMode: boolean;
  onSignIn: () => void;
  isAuthenticated: boolean;
  variant?: 'homepage' | 'resources';
}

export default function InlineSignInBanner({ 
  darkMode, 
  onSignIn, 
  isAuthenticated,
  variant = 'homepage'
}: InlineSignInBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (isAuthenticated || dismissed) return null;

  const messages = {
    homepage: {
      icon: <Bell className="w-6 h-6" />,
      title: "🔥 Hot Take: Lazy people win here!",
      description: "Sign in once → Get contest alerts before they start → Never open 10 tabs again",
      benefit: "24h email alerts + personalized contest feed"
    },
    resources: {
      icon: <Gift className="w-6 h-6" />,
      title: "💎 Unlock Your Personal DSA Library",
      description: "Track which resources you've used, get weekly curated content, sync your progress",
      benefit: "Personalized roadmap + weekly study plans"
    }
  };

  const currentMessage = messages[variant];

  return (
    <div className="w-full mb-8 animate-fade-in">
      <div
        className={`relative overflow-hidden rounded-3xl border-4 ${
          darkMode
            ? 'border-white bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900'
            : 'border-black bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'
        }`}
        style={{
          boxShadow: darkMode
            ? '8px 8px 0px 0px rgba(255, 255, 255, 0.3)'
            : '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative p-6 md:p-8">
          {/* Close Button */}
          <button
            onClick={() => setDismissed(true)}
            className={`absolute top-4 right-4 p-2 rounded-full border-2 ${
              darkMode
                ? 'border-white bg-gray-800 hover:bg-gray-700'
                : 'border-black bg-white hover:bg-gray-100'
            } transition-all`}
            aria-label="Dismiss"
          >
            <X className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-black'}`} />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pr-12">
            {/* Icon */}
            <div
              className={`flex-shrink-0 p-4 rounded-2xl border-3 ${
                darkMode ? 'border-white bg-yellow-500' : 'border-black bg-yellow-400'
              } animate-pulse`}
              style={{
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)',
              }}
            >
              {currentMessage.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3
                className={`text-xl md:text-2xl font-black mb-2 ${
                  darkMode ? 'text-white' : 'text-black'
                }`}
              >
                {currentMessage.title}
              </h3>
              <p
                className={`text-sm md:text-base font-bold mb-3 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {currentMessage.description}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${
                    darkMode
                      ? 'border-green-400 bg-green-900/50 text-green-300'
                      : 'border-green-600 bg-green-50 text-green-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold">{currentMessage.benefit}</span>
                </div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  • 100% Free • No spam ever
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="w-full md:w-auto flex-shrink-0">
              <button
                onClick={onSignIn}
                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-base border-3 transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-green-500 hover:bg-green-600 text-white border-white'
                    : 'bg-green-400 hover:bg-green-500 text-black border-black'
                }`}
                style={{
                  boxShadow: darkMode
                    ? '6px 6px 0px 0px rgba(255, 255, 255, 0.3)'
                    : '6px 6px 0px 0px rgba(0, 0, 0, 1)',
                }}
              >
                🚀 Get Started Free
              </button>
              <p className={`text-xs text-center mt-2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sign in with Google in 2 seconds
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}