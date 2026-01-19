"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import {
  FileText,
  BookOpen,
  Code2,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

interface NavbarProps {
  darkMode: boolean;
}

function Navbar({ darkMode }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    setShowMobileMenu(false);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    await supabase.auth.signOut();
  };

  const closeMenus = () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 ${darkMode ? "bg-gray-900 border-white" : "bg-white border-black"} border-b-4 cartoon-shadow`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer"
            onClick={closeMenus}
          >
            <div
              className={`p-2 ${
                darkMode ? "bg-blue-500" : "bg-blue-400"
              } rounded-lg border-2 ${
                darkMode ? "border-white" : "border-black"
              } cartoon-shadow`}
            >
              <Code2
                className={`w-5 h-5 ${darkMode ? "text-white" : "text-black"}`}
              />
            </div>

            <span
              className={`
      font-black leading-tight
      text-lg sm:text-xl
      flex flex-col sm:flex-row
      sm:gap-1
      ${darkMode ? "text-white" : "text-black"}
    `}
            >
              <span>DSA</span>
              <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                Quest
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/resources"
              className={`flex items-center gap-1.5 px-3 py-2 ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-black hover:bg-gray-200"} rounded-lg font-bold text-sm border-2 ${darkMode ? "border-white" : "border-black"} transition-all`}
            >
              <BookOpen className="w-4 h-4" />
              Resources
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setShowDropdown(false)}
                className={`flex items-center gap-1.5 px-3 py-2 ${darkMode ? "hover:bg-gray-700 text-white border-2 rounded-lg" : "hover:bg-gray-100 text-black  bg-amber-300 rounded-lg border-2"} font-bold transition-colors`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : null}
            {loading ? (
              <div
                className={`px-3 py-2 rounded-lg border-2 ${darkMode ? "border-white" : "border-black"}`}
              >
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 ${darkMode ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-400 hover:bg-purple-500"} ${darkMode ? "text-white" : "text-black"} rounded-lg font-bold text-sm border-2 ${darkMode ? "border-white" : "border-black"} transition-all`}
                >
                  <img
                    src={user.user_metadata?.avatar_url || "/usericon.png"}
                    alt="User"
                    className="w-6 h-6 rounded-full border border-white"
                    onError={(e) => {
                      e.currentTarget.src = "/usericon.png";
                    }}
                  />
                  <span className="max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-gray-800 border-white" : "bg-white border-black"} border-2 rounded-lg shadow-lg overflow-hidden`}
                  >
                    

                    <div
                      className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                    ></div>

                    <button
                      onClick={handleSignOut}
                      className={`w-full flex items-center gap-2 px-4 py-3 ${darkMode ? "hover:bg-red-900/50 text-red-400" : "hover:bg-red-50 text-red-600"} font-semibold transition-colors`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className={`flex items-center gap-1.5 px-3 py-2 ${darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-400 hover:bg-green-500"} ${darkMode ? "text-white" : "text-black"} rounded-lg font-bold text-sm border-2 ${darkMode ? "border-white" : "border-black"} transition-all`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button & User Profile */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile User Profile - Only show if user is logged in */}


            {user && (
              <div
                className={`
                  flex items-center justify-center
                  ${darkMode ? "bg-gray-800 border-white" : "bg-gray-100 border-black"}
                  rounded-full border-2
                  p-1
                  w-10 h-10
                `}
              >
                <img
                  src={user.user_metadata?.avatar_url || "/usericon.png"}
                  alt="User"
                  className="rounded-full border-2 border-white w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/usericon.png";
                  }}
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 ${darkMode ? "text-white" : "text-black"} rounded-lg border-2 ${darkMode ? "border-white" : "border-black"}`}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            className={`md:hidden mt-4 pb-4 space-y-2 border-t-2 ${darkMode ? "border-white" : "border-black"} pt-4`}
          >
            <Link
              href="/resources"
              onClick={closeMenus}
              className={`flex items-center gap-2 px-4 py-3 ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-black hover:bg-gray-200"} rounded-lg font-bold border-2 ${darkMode ? "border-white" : "border-black"}`}
            >
              <BookOpen className="w-4 h-4" />
              Resources
            </Link>

            {user ? (
              <>
                
                <Link
                  href="/dashboard"
                  onClick={closeMenus}
                  className={`flex items-center gap-2 px-4 py-3 ${darkMode ? "bg-purple-500 text-white hover:bg-purple-600" : "bg-purple-400 text-black hover:bg-purple-500"} rounded-lg font-bold border-2 ${darkMode ? "border-white" : "border-black"}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center gap-2 px-4 py-3 ${darkMode ? "bg-red-500 hover:bg-red-600" : "bg-red-400 hover:bg-red-500"} ${darkMode ? "text-white" : "text-black"} rounded-lg font-bold border-2 ${darkMode ? "border-white" : "border-black"}`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className={`w-full flex items-center gap-2 px-4 py-3 ${darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-400 hover:bg-green-500"} ${darkMode ? "text-white" : "text-black"} rounded-lg font-bold border-2 ${darkMode ? "border-white" : "border-black"}`}
              >
                <LogIn className="w-4 h-4" />
                Login with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;