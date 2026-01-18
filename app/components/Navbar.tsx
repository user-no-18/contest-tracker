"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
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
} from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  showSpotlight?: boolean;
  setShowSpotlight?: (show: boolean) => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  showSpotlight,
  setShowSpotlight,
}: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav
      className={`sticky bg-transparent top-0 z-50 ${darkMode ? "bg-gray-900 border-white" : "bg-white border-black"} border-b-4 cartoon-shadow`}
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
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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

                <div className="flex items-center gap-3">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || "User"}
                      className={`w-10 h-10 rounded-full border-2 ${darkMode ? "border-white" : "border-black"} cartoon-shadow`}
                    />
                  )}
                  <span
                    className={`hidden md:inline font-bold ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {user.user_metadata?.full_name || "User"}
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
                onClick={handleSignIn}
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
  );
}

