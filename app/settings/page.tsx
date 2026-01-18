"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  User as UserIcon,
  Mail,
  Bell,
  Link2,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
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

export default function Settings() {
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
        alert(data.error || "Failed to save settings");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-20 h-20 border-8 border-white border-t-blue-400 rounded-full animate-spin"></div>
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
        <div className="max-w-4xl mx-auto px-4 pt-12">
          {/* Header */}
          <div className="mb-12">
            <h1
              className={`text-4xl md:text-6xl font-black ${darkMode ? "text-white" : "text-black"} mb-4`}
            >
              ⚙️ Settings
            </h1>
            <p
              className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold`}
            >
              Manage your profile and notification preferences
            </p>
          </div>

          {/* Profile Info Section */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <UserIcon className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>
                Profile Information
              </h2>
            </div>

            <div className="space-y-6">
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
                  <Mail className={`w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className={`flex-1 px-4 py-3 rounded-xl border-2 ${darkMode ? "border-gray-700 bg-gray-800 text-gray-500" : "border-gray-300 bg-gray-100 text-gray-500"} font-semibold cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Links Section */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link2 className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>
                Platform Profiles
              </h2>
            </div>

            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold`}
            >
              Link your competitive programming profiles to track your progress
            </p>

            <div className="space-y-6">
              {/* LeetCode */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"} mb-2`}
                >
                  🟨 LeetCode Profile URL
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
              </div>

              {/* Codeforces */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-2`}
                >
                  🔵 Codeforces Profile URL
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
              </div>

              {/* CodeChef */}
              <div>
                <label
                  className={`block text-sm font-bold ${darkMode ? "text-orange-400" : "text-orange-600"} mb-2`}
                >
                  🟠 CodeChef Profile URL
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
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <Bell className={`w-8 h-8 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>
                Notifications
              </h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div>
                <h3
                  className={`font-bold text-lg ${darkMode ? "text-white" : "text-black"} mb-1`}
                >
                  Email Notifications
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Receive daily digest of contests starting within 24 hours
                </p>
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
                  Save Changes
                </>
              )}
            </button>

            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-green-500 font-bold">
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
        </div>
      </div>
    </>
  );
}