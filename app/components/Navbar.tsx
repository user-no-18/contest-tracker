"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  Moon,
  Sun,
  FileText,
  BookOpen,
  Code2,
  Lightbulb,
  LightbulbOff,
  LogIn,
  LogOut,
  LayoutDashboard,
  X,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Adjust import path based on your structure
import { createClient } from "../lib/supabase/client";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  showSpotlight?: boolean;
  setShowSpotlight?: (show: boolean) => void;
}

// Welcome Popup Component
function WelcomeLoginPopup({
  onClose,
  onSignIn,
  darkMode,
}: {
  onClose: () => void;
  onSignIn: () => void;
  darkMode: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`relative max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl border-4 ${darkMode ? "border-white" : "border-black"} cartoon-shadow p-8`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 ${darkMode ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-100"} rounded-lg transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div
              className={`p-4 ${darkMode ? "bg-blue-500" : "bg-blue-400"} rounded-2xl border-4 ${darkMode ? "border-white" : "border-black"} cartoon-shadow`}
            >
              <Code2
                className={`w-12 h-12 ${darkMode ? "text-white" : "text-black"}`}
              />
            </div>
          </div>

          <div>
            <h2
              className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"} mb-2`}
            >
              Welcome to DSA{" "}
              <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                Quest
              </span>
              !
            </h2>
            <p
              className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Master Data Structures & Algorithms through interactive learning
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-2 ${darkMode ? "border-white" : "border-black"}`}
          >
            <ul
              className={`text-left space-y-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              <li className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span>Interactive problem-solving</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span>Track your progress</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span>Comprehensive resources</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onSignIn}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 rounded-xl font-bold border-4 border-black transition-all cartoon-shadow-hover hover:translate-y-[-2px]`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-lg">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar({
  darkMode,
  setDarkMode,
  showSpotlight,
  setShowSpotlight,
}: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    // Check if user has logged in before
    const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");

    if (!hasLoggedInBefore) {
      // New user - show welcome popup
      setShowWelcomePopup(true);
    } else {
      // Returning user - direct login
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    // Mark that user has logged in
    localStorage.setItem("hasLoggedInBefore", "true");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleWelcomeSignIn = () => {
    setShowWelcomePopup(false);
    handleSignIn();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Don't remove hasLoggedInBefore - they're still a returning user
  };

  return (
    <>
      <nav
        className={`sticky  top-0 z-50 ${darkMode ? "bg-gray-900 border-white" : "bg-white border-black"} border-b-4 cartoon-shadow`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Company Name */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <div
                className={`p-2 ${darkMode ? "bg-blue-500" : "bg-blue-400"} rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} cartoon-shadow`}
              >
                <Code2
                  className={`w-6 h-6 ${darkMode ? "text-white" : "text-black"}`}
                />
              </div>
              <span
                className={`text-2xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                DSA{" "}
                <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                  Quest
                </span>
              </span>
            </Link>

            {/* Right side - Navigation Links */}
            <div className="flex items-center gap-3">
              <a
                href="#docs"
                className={`hidden md:flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-black hover:bg-gray-200"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
              >
                <FileText className="w-4 h-4" />
                Docs
              </a>

              <Link
                href="/resources"
                className={`hidden md:flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-black hover:bg-gray-200"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
              >
                <BookOpen className="w-4 h-4" />
                Resources
              </Link>

              {darkMode && setShowSpotlight && (
                <button
                  onClick={() => setShowSpotlight(!showSpotlight)}
                  className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold border-2 border-white transition-all cartoon-shadow-hover`}
                  title={showSpotlight ? "Remove Light" : "Add Light"}
                >
                  {showSpotlight ? (
                    <LightbulbOff className="w-5 h-5" />
                  ) : (
                    <Lightbulb className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {loading ? (
                <div
                  className={`px-4 py-2 rounded-xl border-2 ${darkMode ? "border-white" : "border-black"}`}
                >
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-400 hover:bg-purple-500"} ${darkMode ? "text-white" : "text-black"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link
                    href="/settings"
                    className={`flex items-center bg-black gap-2 px-4 py-2 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
                  >
                    <Settings className="w-4 h-4 bg-amber-950" />
                   
                  </Link>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.user_metadata?.avatar_url || "/usericon.png"}
                      alt={user.user_metadata?.full_name || "User"}
                      className={`w-10 h-10 rounded-full border-2 ${darkMode ? "border-white" : "border-black"} cartoon-shadow`}
                      onError={(e) => {
                        e.currentTarget.src = "/usericon.png";
                      }}
                    />
                    <span
                      className={`hidden md:inline font-bold ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {user.user_metadata?.full_name?.split(" ")[0] || "User"}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className={`flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-red-500 hover:bg-red-600" : "bg-red-400 hover:bg-red-500"} ${darkMode ? "text-white" : "text-black"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className={`flex items-center gap-2 px-4 py-2 ${darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-400 hover:bg-green-500"} ${darkMode ? "text-white" : "text-black"} rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Popup for New Users */}
      {showWelcomePopup && (
        <WelcomeLoginPopup
          onClose={() => setShowWelcomePopup(false)}
          onSignIn={handleWelcomeSignIn}
          darkMode={darkMode}
        />
      )}
    </>
  );
}

export default Navbar;
