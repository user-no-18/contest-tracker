"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  User as UserIcon,
  Link2,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Bell,
  Mail,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  leetcode_url: string | null;
  codeforces_url: string | null;
  codechef_url: string | null;
  email_notifications: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      // Fetch profile
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("success");
        setProfile(data.profile);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        alert(data.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className={`w-20 h-20 border-8 ${darkMode ? "border-white border-t-blue-400" : "border-black border-t-blue-500"} rounded-full animate-spin`}></div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");

        body {
          font-family: "Fredoka", sans-serif;
          background-color: ${darkMode ? "#0a0a0a" : "#ffffff"};
          transition: background-color 0.3s ease;
        }

        .cartoon-shadow {
          box-shadow: 4px 4px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-lg {
          box-shadow: 8px 8px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
      `}</style>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || "User"}
                  className={`w-20 h-20 rounded-full border-4 ${darkMode ? "border-white" : "border-black"} cartoon-shadow-lg`}
                />
              )}
              <div>
                <h1
                  className={`text-4xl md:text-6xl font-black ${darkMode ? "text-white" : "text-black"}`}
                >
                  Welcome back,{" "}
                  <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                    {user.user_metadata?.full_name?.split(" ")[0] || "Coder"}
                  </span>
                  !
                </h1>
                <p
                  className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold mt-2`}
                >
                  Ready to crush some problems today? 💪
                </p>
              </div>
            </div>
          </div>

          {/* User Information Card */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <UserIcon
                className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Your Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"} uppercase mb-2`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? "border-white bg-gray-800 text-white" : "border-black bg-white text-black"} font-semibold cartoon-shadow focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"} uppercase mb-2`}
                >
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <Mail
                    className={`w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className={`flex-1 px-4 py-3 rounded-xl border-2 ${darkMode ? "border-gray-700 bg-gray-800 text-gray-500" : "border-gray-300 bg-gray-100 text-gray-500"} font-semibold cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>

            {/* Email Notifications Toggle */}
            <div
              className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"} mb-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell
                    className={`w-6 h-6 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                  />
                  <div>
                    <h3
                      className={`font-bold text-lg ${darkMode ? "text-white" : "text-black"} mb-1`}
                    >
                      Daily Email Notifications
                    </h3>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Get contest alerts every day at 9 PM for contests starting within
                      24 hours
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.email_notifications}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email_notifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Platform Links Section */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link2
                className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Your Coding Profiles
              </h2>
            </div>

            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold`}
            >
              Link your competitive programming profiles to track your journey 🚀
            </p>

            <div className="space-y-6">
              {/* LeetCode */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"} mb-2 flex items-center gap-2`}
                >
                  <span className="text-2xl">🟨</span> LeetCode Profile URL
                </label>
                <input
                  type="url"
                  value={profile.leetcode_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, leetcode_url: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? "border-white bg-gray-800 text-white" : "border-black bg-white text-black"} font-semibold cartoon-shadow focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="https://leetcode.com/u/your-username"
                />
                {profile.leetcode_url && (
                  <a
                    href={profile.leetcode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mt-2 text-sm font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-yellow-600 hover:text-yellow-700"}`}
                  >
                    View Profile →
                  </a>
                )}
              </div>

              {/* Codeforces */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-2 flex items-center gap-2`}
                >
                  <span className="text-2xl">🔵</span> Codeforces Profile URL
                </label>
                <input
                  type="url"
                  value={profile.codeforces_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, codeforces_url: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? "border-white bg-gray-800 text-white" : "border-black bg-white text-black"} font-semibold cartoon-shadow focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://codeforces.com/profile/your-username"
                />
                {profile.codeforces_url && (
                  <a
                    href={profile.codeforces_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mt-2 text-sm font-bold ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                  >
                    View Profile →
                  </a>
                )}
              </div>

              {/* CodeChef */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-orange-400" : "text-orange-600"} mb-2 flex items-center gap-2`}
                >
                  <span className="text-2xl">🟠</span> CodeChef Profile URL
                </label>
                <input
                  type="url"
                  value={profile.codechef_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, codechef_url: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? "border-white bg-gray-800 text-white" : "border-black bg-white text-black"} font-semibold cartoon-shadow focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="https://www.codechef.com/users/your-username"
                />
                {profile.codechef_url && (
                  <a
                    href={profile.codechef_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mt-2 text-sm font-bold ${darkMode ? "text-orange-400 hover:text-orange-300" : "text-orange-600 hover:text-orange-700"}`}
                  >
                    View Profile →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-3 px-8 py-4 ${darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-400 hover:bg-blue-500"} ${darkMode ? "text-white" : "text-black"} rounded-2xl font-black text-lg border-4 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-lg hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Save Profile
                </>
              )}
            </button>

            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-green-500 font-bold animate-pulse">
                <CheckCircle className="w-6 h-6" />
                Saved successfully!
              </div>
            )}

            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-500 font-bold">
                <XCircle className="w-6 h-6" />
                Failed to save
              </div>
            )}
          </div>

          {/* Motivational Section */}
          <div
            className={`text-center p-8 rounded-3xl border-4 border-dashed ${darkMode ? "border-white bg-gray-800/50" : "border-black bg-gray-100"} mt-12`}
          >
            <p
              className={`text-2xl font-black ${darkMode ? "text-white" : "text-black"} mb-2`}
            >
              "The expert in anything was once a beginner."
            </p>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Keep grinding! Every problem solved is a step closer to your dream job 🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
}