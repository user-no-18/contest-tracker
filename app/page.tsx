"use client";
import { User } from "@supabase/supabase-js";
import SignInPrompt from "./components/SignInPrompt";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import {
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  Trophy,
  DollarSign,
  Briefcase,
  AlertCircle,
  Flame,
} from "lucide-react";
import { createClient } from "./lib/supabase/client";
import InlineSignInBanner from "./components/InlineSignInBanner";

interface Contest {
  id: string;
  platform: string;
  title: string;
  url: string;
  start_time: string;
  duration: number;
}

export default function ContestTracker() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const platforms = [
    "all",
    "LeetCode",
    "Codeforces",
    "CodeChef",
    "AtCoder",
    "HackerRank",
    "GeeksforGeeks",
    "HackerEarth",
    "SPOJ",
  ];

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contests");
      const data = await res.json();
      if (data.success) {
        const sortedContests = data.contests.sort((a: Contest, b: Contest) => {
          const now = new Date();
          const startA = new Date(a.start_time);
          const startB = new Date(b.start_time);
          const endA = new Date(startA.getTime() + a.duration * 1000);
          const endB = new Date(startB.getTime() + b.duration * 1000);

          const hoursUntilA =
            (startA.getTime() - now.getTime()) / (1000 * 60 * 60);
          const hoursUntilB =
            (startB.getTime() - now.getTime()) / (1000 * 60 * 60);

          const isLiveA = now >= startA && now <= endA;
          const isLiveB = now >= startB && now <= endB;
          const isHotA = isLiveA || (hoursUntilA >= 0 && hoursUntilA <= 24);
          const isHotB = isLiveB || (hoursUntilB >= 0 && hoursUntilB <= 24);

          const isPriorityPlatformA =
            a.platform === "LeetCode" || a.platform === "Codeforces";
          const isPriorityPlatformB =
            b.platform === "LeetCode" || b.platform === "Codeforces";

          const majorPlatforms = [
            "CodeChef",
            "AtCoder",
            "TopCoder",
            "GeeksforGeeks",
            "HackerEarth",
            "SPOJ",
          ];
          const isMajorA = majorPlatforms.includes(a.platform);
          const isMajorB = majorPlatforms.includes(b.platform);

          const isHackerRankA = a.platform === "HackerRank";
          const isHackerRankB = b.platform === "HackerRank";

          const isWithin48hA = hoursUntilA >= 0 && hoursUntilA <= 48;
          const isWithin48hB = hoursUntilB >= 0 && hoursUntilB <= 48;
          const isWithin72hA = hoursUntilA >= 0 && hoursUntilA <= 72;
          const isWithin72hB = hoursUntilB >= 0 && hoursUntilB <= 72;

          const getPriority = (
            contest: Contest,
            isHot: boolean,
            isPriority: boolean,
            isMajor: boolean,
            isHR: boolean,
            within48h: boolean,
            within72h: boolean,
          ) => {
            if (isHot) return 1;
            if (isPriority && within48h) return 2;
            if (isMajor && within72h) return 3;
            if (isHR) return 4;
            return 5;
          };

          const priorityA = getPriority(
            a,
            isHotA,
            isPriorityPlatformA,
            isMajorA,
            isHackerRankA,
            isWithin48hA,
            isWithin72hA,
          );
          const priorityB = getPriority(
            b,
            isHotB,
            isPriorityPlatformB,
            isMajorB,
            isHackerRankB,
            isWithin48hB,
            isWithin72hB,
          );

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          return startA.getTime() - startB.getTime();
        });

        setContests(sortedContests);
        setLastUpdated(new Date(data.lastUpdated));
      } else {
        setError(data.error || "Failed to fetch contests");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContests();
    const interval = setInterval(fetchContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const isHotContest = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    const hoursUntilStart = diff / (1000 * 60 * 60);
    return hoursUntilStart >= 0 && hoursUntilStart <= 24;
  };

  const getStatus = (startTime: string, duration: number) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 1000);

    if (now >= start && now <= end)
      return {
        text: "LIVE NOW!",
        color: darkMode ? "bg-green-500" : "bg-green-400",
      };
    const diff = start.getTime() - now.getTime();
    if (diff < 86400000)
      return {
        text: "Today!",
        color: darkMode ? "bg-yellow-500" : "bg-yellow-400",
      };
    if (diff < 604800000)
      return {
        text: "This Week",
        color: darkMode ? "bg-blue-400" : "bg-blue-300",
      };
    return {
      text: "Upcoming",
      color: darkMode ? "bg-gray-600" : "bg-gray-200",
    };
  };

  const getPlatformStyle = (platform: string) => {
    if (darkMode) {
      const darkStyles: Record<string, string> = {
        LeetCode: "bg-yellow-900/50 text-yellow-300 border-yellow-500",
        Codeforces: "bg-blue-900/50 text-blue-300 border-blue-500",
        CodeChef: "bg-orange-900/50 text-orange-300 border-orange-500",
        AtCoder: "bg-red-900/50 text-red-300 border-red-500",
        HackerRank: "bg-green-900/50 text-green-300 border-green-500",
        TopCoder: "bg-indigo-900/50 text-indigo-300 border-indigo-500",
        GeeksforGeeks: "bg-emerald-900/50 text-emerald-300 border-emerald-500",
        HackerEarth: "bg-purple-900/50 text-purple-300 border-purple-500",
        SPOJ: "bg-teal-900/50 text-teal-300 border-teal-500",
        CodeSignal: "bg-pink-900/50 text-pink-300 border-pink-500",
        TechGig: "bg-cyan-900/50 text-cyan-300 border-cyan-500",
      };
      return (
        darkStyles[platform] || "bg-gray-700/50 text-gray-300 border-gray-500"
      );
    }

    const lightStyles: Record<string, string> = {
      LeetCode: "bg-yellow-200 text-yellow-900 border-yellow-900",
      Codeforces: "bg-blue-200 text-blue-900 border-blue-900",
      CodeChef: "bg-orange-200 text-orange-900 border-orange-900",
      AtCoder: "bg-red-200 text-red-900 border-red-900",
      HackerRank: "bg-green-200 text-green-900 border-green-900",
      TopCoder: "bg-indigo-200 text-indigo-900 border-indigo-900",
      GeeksforGeeks: "bg-emerald-200 text-emerald-900 border-emerald-900",
      HackerEarth: "bg-purple-200 text-purple-900 border-purple-900",
      SPOJ: "bg-teal-200 text-teal-900 border-teal-900",
      CodeSignal: "bg-pink-200 text-pink-900 border-pink-900",
      TechGig: "bg-cyan-200 text-cyan-900 border-cyan-900",
    };
    return lightStyles[platform] || "bg-gray-200 text-gray-900 border-gray-900";
  };

  const filteredContests =
    filter === "all" ? contests : contests.filter((c) => c.platform === filter);

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
          box-shadow: 4px 4px 0px 0px
            ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-lg {
          box-shadow: 8px 8px 0px 0px
            ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-hover:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px
            ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .dream-company {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(255, 100, 0, 0.5),
              0 0 40px rgba(255, 100, 0, 0.3);
          }
          50% {
            box-shadow:
              0 0 30px rgba(255, 100, 0, 0.8),
              0 0 60px rgba(255, 100, 0, 0.5);
          }
        }
        .hot-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .flame-flicker {
          animation: flicker 1.5s ease-in-out infinite;
        }
      `}</style>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="min-h-screen relative overflow-x-hidden pb-20">
        {/* Background Company Logos */}

        <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
       
          {[
            { src: "/google-1.png", top: "8%", left: "6%" },
            { src: "/google-2.png", bottom: "5%", right: "3%" },
            { src: "/amazon.png", top: "18%", right: "8%" },
            { src: "/meta.jpg", bottom: "12%", left: "5%" },
            { src: "/microsoft.png", bottom: "20%", right: "6%" },
            { src: "/netflix.jpg", top: "42%", left: "2%" },
            { src: "/oracle.png", top: "35%", right: "3%" },
            { src: "/flipkart.png", bottom: "60%", left: "10%" },
            { src: "/zomato.png", top: "10%", right: "3%" },
          ].map((logo, i) => (
            <div
              key={i}
              className="absolute w-28 md:w-36 dream-company"
              style={{
                ...logo,
                opacity: darkMode ? 0.08 : 0.12,
                filter: darkMode
                  ? "saturate(0.3) brightness(0.8) invert(1)"
                  : "saturate(0.6) brightness(1.05)",
                transform: "rotate(-12deg)",
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <img
                src={logo.src}
                alt=""
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12">
          <div className="text-center mb-12 space-y-4">
            <div
              className={`inline-block ${darkMode ? "bg-yellow-500" : "bg-yellow-300"} border-4 ${darkMode ? "border-white" : "border-black"} px-6 py-2 rounded-full cartoon-shadow transform -rotate-2 mb-4`}
            >
              <span
                className={`flex items-center gap-2 font-bold ${darkMode ? "text-white" : "text-black"} text-lg`}
              >
                <DollarSign className="w-5 h-5" /> Track your favorite contests!
              </span>
            </div>
            <h1
              className={`text-5xl md:text-7xl font-black ${darkMode ? "text-white" : "text-black"} drop-shadow-sm tracking-tight leading-tight`}
            >
              DSA{" "}
              <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                {darkMode ? "NIGHT" : "QUEST"}
              </span>{" "}
              <br className="md:hidden" /> {darkMode ? "GRIND" : "BOARD"}
            </h1>
            <p
              className={`text-xl md:text-2xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold max-w-2xl mx-auto`}
            >
            Get Contest Alerts Before Others Do!
            </p>
          </div>

          <div
            className={`${darkMode ? "bg-gray-900 border-white" : "bg-white border-black"} border-4 rounded-3xl p-6 mb-10 cartoon-shadow-lg`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap justify-center gap-3">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter(p)}
                    className={`px-4 py-2 rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-black"} transition-all cartoon-shadow-hover ${
                      filter === p
                        ? darkMode
                          ? "bg-white text-black"
                          : "bg-black text-white"
                        : darkMode
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchContests}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 ${darkMode ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-400 hover:bg-pink-500"} ${darkMode ? "text-white" : "text-black"} border-2 ${darkMode ? "border-white" : "border-black"} rounded-xl font-bold cartoon-shadow-hover disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Loading..." : "Refresh List"}
              </button>
            </div>

            {lastUpdated && (
              <div
                className={`text-center mt-4 text-sm font-bold ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          {error && (
            <div
              className={`${darkMode ? "bg-red-900/30 border-red-500" : "bg-red-100 border-red-500"} border-4 rounded-3xl p-6 mb-10 cartoon-shadow flex items-center gap-4`}
            >
              <AlertCircle
                className={`w-8 h-8 ${darkMode ? "text-red-400" : "text-red-500"} flex-shrink-0`}
              />
              <div>
                <h3
                  className={`font-bold text-xl ${darkMode ? "text-red-300" : "text-red-900"} mb-1`}
                >
                  Oops! Something went wrong
                </h3>
                <p className={darkMode ? "text-red-400" : "text-red-700"}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div
                className={`w-20 h-20 border-8 ${darkMode ? "border-white border-t-blue-400" : "border-black border-t-blue-500"} rounded-full animate-spin`}
              ></div>
              <p
                className={`text-2xl font-bold animate-pulse ${darkMode ? "text-white" : "text-black"}`}
              >
                Fetching opportunities...
              </p>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div
                className={`${darkMode ? "bg-purple-900/30 border-white" : "bg-purple-100 border-black"} border-4 rounded-full p-8 cartoon-shadow-lg`}
              >
                <Trophy
                  className={`w-24 h-24 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
                />
              </div>
              <h2
                className={`text-4xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                No Contests Found!
              </h2>
              <p
                className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold max-w-md text-center`}
              >
                {filter === "all"
                  ? "No upcoming contests at the moment. Time to practice your skills! 💪"
                  : `No upcoming contests on ${filter}. Try checking other platforms!`}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className={`px-8 py-4 ${darkMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-300 hover:bg-yellow-400"} ${darkMode ? "text-white" : "text-black"} border-4 ${darkMode ? "border-white" : "border-black"} rounded-2xl font-bold text-lg cartoon-shadow-hover`}
                >
                  View All Platforms
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
              {filteredContests.map((contest) => {
                const status = getStatus(contest.start_time, contest.duration);
                const start = new Date(contest.start_time);
                const platformStyle = getPlatformStyle(contest.platform);
                const isHot = isHotContest(contest.start_time);

                return (
                  <div
                    key={contest.id}
                    className={`border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} rounded-3xl p-5 cartoon-shadow hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between h-full relative overflow-hidden ${isHot ? "hot-glow" : ""}`}
                  >
                    {isHot && (
                      <div className="absolute top-3 right-3 z-10">
                        <div
                          className={`flex items-center gap-1 px-3 py-1 ${darkMode ? "bg-orange-500" : "bg-orange-400"} text-white rounded-full border-2 ${darkMode ? "border-white" : "border-black"} font-black text-xs uppercase cartoon-shadow`}
                        >
                          <Flame className="w-4 h-4 flame-flicker" />
                          HOT
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${platformStyle}`}
                        >
                          {contest.platform}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? "text-white" : "text-black"} border-2 ${darkMode ? "border-white" : "border-black"} ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      <h3
                        className={`text-2xl font-black ${darkMode ? "text-white" : "text-black"} mb-4 leading-tight`}
                      >
                        {contest.title}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div
                          className={`flex items-center gap-3 p-2 ${darkMode ? "bg-gray-800" : "bg-gray-50"} rounded-xl border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                        >
                          <div
                            className={`p-2 ${darkMode ? "bg-purple-500" : "bg-purple-200"} rounded-lg border-2 ${darkMode ? "border-white" : "border-black"}`}
                          >
                            <Calendar
                              className={`w-4 h-4 ${darkMode ? "text-white" : "text-black"}`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${darkMode ? "text-gray-500" : "text-gray-400"} uppercase`}
                            >
                              Start Date
                            </p>
                            <p
                              className={`font-bold ${darkMode ? "text-white" : "text-black"}`}
                            >
                              {start.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-2 ${darkMode ? "bg-gray-800" : "bg-gray-50"} rounded-xl border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                        >
                          <div
                            className={`p-2 ${darkMode ? "bg-blue-500" : "bg-blue-200"} rounded-lg border-2 ${darkMode ? "border-white" : "border-black"}`}
                          >
                            <Clock
                              className={`w-4 h-4 ${darkMode ? "text-white" : "text-black"}`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${darkMode ? "text-gray-500" : "text-gray-400"} uppercase`}
                            >
                              Time & Duration
                            </p>
                            <p
                              className={`font-bold ${darkMode ? "text-white" : "text-black"}`}
                            >
                              {start.toLocaleTimeString()} •{" "}
                              {formatDuration(contest.duration)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center gap-2 w-full py-4 ${darkMode ? "bg-yellow-500 hover:bg-green-500" : "bg-yellow-300 hover:bg-green-500"} ${darkMode ? "text-white hover:text-white" : "text-black hover:text-black"} rounded-2xl font-bold text-lg border-2 border-transparent ${darkMode ? "hover:border-white" : "hover:border-black"} transition-all`}
                    >
                      <span className="group-hover:hidden">Crack this!</span>
                      <span className="hidden group-hover:inline-block">
                        View
                      </span>
                      <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredContests.length > 0 && (
            <div className="mt-16 text-center pb-10">
              <div
                className={`inline-block p-6 ${darkMode ? "bg-red-900/30 border-white" : "bg-red-100 border-black"} border-4 border-dashed rounded-3xl`}
              >
                <p
                  className={`text-xl font-bold flex items-center gap-2 justify-center ${darkMode ? "text-pink-400" : "text-pink-500"}`}
                >
                  <Briefcase className="w-6 h-6" />
                  Every problem you solve brings you closer to that Offer
                  Letter!
                  <Trophy
                    className={`w-6 h-6 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}
                  />
                </p>
              </div>
            </div>
          )}

          <div
            className={`text-center py-12 border-t-4 border-dashed ${
              darkMode ? "border-gray-800" : "border-gray-300"
            }`}
          >
            {/* Inspirational Quote */}
            <p
              className={`text-lg font-bold mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              "The best time to plant a tree was 20 years ago. The second best
              time is now."
            </p>

            {/* Feedback Call-to-Action */}
            <p
              className={`text-sm font-semibold mb-6 max-w-2xl mx-auto ${
                darkMode ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Found a bug 🐞, have an idea 💡, or want a new feature 🚀?
              <br />
              Your feedback helps make DSA Quest better for everyone!
            </p>

            {/* Feedback Form */}
            <form
              action="https://formsubmit.co/debjyoti2409@gmail.com"
              method="POST"
              className="max-w-2xl mx-auto mb-8"
            >
              {/* Hidden fields for FormSubmit configuration */}
              <input
                type="hidden"
                name="_subject"
                value="New Feedback on DSA Quest!"
              />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              {/* Feedback Type */}
              <select
                name="feedback_type"
                required
                className={`w-full px-4 py-3 rounded-xl border-2 font-bold mb-4 ${
                  darkMode
                    ? "border-white bg-gray-800 text-white"
                    : "border-black bg-white text-black"
                } cartoon-shadow focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Select Feedback Type</option>
                <option value="🐞 Bug Report">🐞 Bug Report</option>
                <option value="💡 Improvement">💡 Improvement</option>
                <option value="🚀 Feature Request">🚀 Feature Request</option>
                <option value="💬 General Feedback">💬 General Feedback</option>
              </select>

              {/* User Email (optional) */}
              <input
                type="email"
                name="user_email"
                placeholder="Your email (optional, if you want a reply)"
                className={`w-full px-4 py-3 rounded-xl border-2 font-semibold mb-4 ${
                  darkMode
                    ? "border-white bg-gray-800 text-white placeholder-gray-500"
                    : "border-black bg-white text-black placeholder-gray-400"
                } cartoon-shadow focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />

              {/* Feedback Message */}
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Share your thoughts here... 💭"
                className={`w-full px-4 py-3 rounded-xl border-2 font-semibold mb-4 resize-none ${
                  darkMode
                    ? "border-white bg-gray-800 text-white placeholder-gray-500"
                    : "border-black bg-white text-black placeholder-gray-400"
                } cartoon-shadow focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg border-4 transition-all cartoon-shadow-hover ${
                  darkMode
                    ? "bg-purple-500 hover:bg-purple-600 text-white border-white"
                    : "bg-purple-400 hover:bg-purple-500 text-black border-black"
                }`}
              >
                📧 Send Feedback
              </button>
            </form>

            {/* Credit/Copyright */}
            <p
              className={`text-xs font-semibold mt-8 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Made with 💜 for competitive programmers
            </p>
          </div>
        </div>
        <SignInPrompt
          darkMode={darkMode}
          onSignIn={handleSignIn}
          isAuthenticated={!!user}
        />
      </div>
    </>
  );
}
