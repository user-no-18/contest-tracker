"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-20 h-20 border-8 border-white border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Problems Solved",
                value: "147",
                color: darkMode ? "bg-yellow-500" : "bg-yellow-400",
                textColor: darkMode ? "text-yellow-400" : "text-yellow-600",
              },
              {
                icon: <Flame className="w-8 h-8" />,
                title: "Current Streak",
                value: "12 days",
                color: darkMode ? "bg-orange-500" : "bg-orange-400",
                textColor: darkMode ? "text-orange-400" : "text-orange-600",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Contests Joined",
                value: "23",
                color: darkMode ? "bg-blue-500" : "bg-blue-400",
                textColor: darkMode ? "text-blue-400" : "text-blue-600",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Global Rank",
                value: "#2,847",
                color: darkMode ? "bg-purple-500" : "bg-purple-400",
                textColor: darkMode ? "text-purple-400" : "text-purple-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform`}
              >
                <div
                  className={`inline-block p-3 rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} ${stat.color} mb-4`}
                >
                  {stat.icon}
                </div>
                <p
                  className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"} uppercase mb-1`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div
            className={`p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg mb-12`}
          >
            <h2
              className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"} mb-6`}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className={`p-6 rounded-2xl border-2 ${darkMode ? "border-white bg-green-900/50 hover:bg-green-900" : "border-black bg-green-100 hover:bg-green-200"} transition-all cartoon-shadow-hover`}
              >
                <Zap className={`w-8 h-8 mb-3 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                <h3
                  className={`font-black text-xl ${darkMode ? "text-white" : "text-black"} mb-2`}
                >
                  Daily Challenge
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Solve today's problem
                </p>
              </button>

              <button
                className={`p-6 rounded-2xl border-2 ${darkMode ? "border-white bg-blue-900/50 hover:bg-blue-900" : "border-black bg-blue-100 hover:bg-blue-200"} transition-all cartoon-shadow-hover`}
              >
                <Calendar className={`w-8 h-8 mb-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <h3
                  className={`font-black text-xl ${darkMode ? "text-white" : "text-black"} mb-2`}
                >
                  Join Contest
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Browse upcoming contests
                </p>
              </button>

              <button
                className={`p-6 rounded-2xl border-2 ${darkMode ? "border-white bg-purple-900/50 hover:bg-purple-900" : "border-black bg-purple-100 hover:bg-purple-200"} transition-all cartoon-shadow-hover`}
              >
                <TrendingUp className={`w-8 h-8 mb-3 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                <h3
                  className={`font-black text-xl ${darkMode ? "text-white" : "text-black"} mb-2`}
                >
                  Track Progress
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  View your analytics
                </p>
              </button>
            </div>
          </div>

          {/* Motivational Quote */}
          <div
            className={`text-center p-8 rounded-3xl border-4 border-dashed ${darkMode ? "border-white bg-gray-800/50" : "border-black bg-gray-100"}`}
          >
            <p
              className={`text-2xl font-black ${darkMode ? "text-white" : "text-black"} mb-2`}
            >
              "Success is the sum of small efforts repeated day in and day out."
            </p>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Keep grinding! 🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
}