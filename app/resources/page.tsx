"use client";

import { useState } from "react";
import {
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  TrendingUp,
  Code2,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Moon,
  Sun,
  Map,
  Coffee,
  Server,
  Cpu,
  Database,
  Globe,
  Hash
} from "lucide-react";

export default function DSAKnowledgeHub() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCompany, setActiveCompany] = useState("Google");

  // --- Data: Company Topics Mapping ---
  const companyData: Record<string, { color: string; topics: string[]; emphasis: string }> = {
    Google: {
      color: "bg-red-400",
      topics: ["DP on Trees", "Graph (Dijkstra/Union Find)", "Segment Trees", "Grid Problems", "Tries"],
      emphasis: "Focuses on optimizing Hard problems. Often asks variations of standard graph/DP problems that require modeling.",
    },
    Amazon: {
      color: "bg-orange-400",
      topics: ["Sliding Window", "BFS/DFS (Islands)", "OOD (Design Locker)", "Top K Elements", "Merge Intervals"],
      emphasis: "Leadership Principles (LPs) are 50% of the interview. For code: clean, modular code is preferred over competitive hacks.",
    },
    Microsoft: {
      color: "bg-blue-400",
      topics: ["String Parsing", "Linked Lists", "Binary Search Trees", "Matrix Manipulation", "Recursion"],
      emphasis: "Tests core CS fundamentals. Often asks 'Design' questions combined with coding (e.g., Design Tic-Tac-Toe).",
    },
    Meta: {
      color: "bg-blue-600",
      topics: ["Tree Traversals", "Heaps", "Subarray Sums", "Graph Shortest Path", "Backtracking"],
      emphasis: "Speed is everything. You need to solve 2 Mediums in 45 mins perfectly. Memorize patterns like 'Kth Element' patterns.",
    },
    Netflix: {
      color: "bg-red-600",
      topics: ["System Design (Heavy)", "Concurrency", "LRU Cache", "Greedy Algorithms", "Custom Data Structures"],
      emphasis: "Culture fit is huge. Technical rounds focus heavily on System Design and practical engineering problems over abstract CP.",
    },
    Uber: {
      color: "bg-black",
      topics: ["Graph (TSP variations)", "Quad Trees", "Meeting Intervals", "Design HashMap", "Multi-threading"],
      emphasis: "Heavy on geometry, graphs, and concurrency. Expect problems related to maps, routes, and scheduling.",
    },
  };

  // --- Data: Curated Resources (Updated for Product Focus) ---
  const resources = [
    {
      category: "DSA Foundation",
      title: "Striver's A2Z Sheet",
      desc: "The absolute best roadmap for standard DSA. Covers everything from Arrays to Hard Graphs.",
      link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
      icon: <Map className="w-6 h-6" />,
      color: "bg-green-300",
      darkColor: "bg-green-900/50",
    },
    {
      category: "Product & Design",
      title: "System Design Primer",
      desc: "Don't ignore this! Essential for SDE-2 and Product companies (Google, Uber). Learn Scalability.",
      link: "https://github.com/donnemartin/system-design-primer",
      icon: <Server className="w-6 h-6" />,
      color: "bg-pink-300",
      darkColor: "bg-pink-900/50",
    },
    {
      category: "Pattern Logic",
      title: "NeetCode 150",
      desc: "Focuses on patterns. If you know the syntax but can't find the logic, do this roadmap.",
      link: "https://neetcode.io/roadmap",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-purple-300",
      darkColor: "bg-purple-900/50",
    },
    {
      category: "CS Fundamentals",
      title: "CS50 / TeachYourselfCS",
      desc: "OS, DBMS, and Networks. Product companies grill you on threads, locks, and indexing.",
      link: "https://teachyourselfcs.com/",
      icon: <Cpu className="w-6 h-6" />,
      color: "bg-orange-300",
      darkColor: "bg-orange-900/50",
    },
  ];

  // --- Data: Patterns (Expanded) ---
  const patterns = [
    { title: "Two Pointers", icon: "✌️", desc: "Linear structures. Move start/end pointers to find pairs, reverse, or merge sorted arrays." },
    { title: "Sliding Window", icon: "🪟", desc: "Subarrays/Substrings. Expand window to satisfy condition, shrink to optimize size." },
    { title: "Slow & Fast Pointers", icon: "🐢", desc: "Cycle detection (Linked List/Array). Middle of list. Happy Number problems." },
    { title: "Monotonic Stack", icon: "📚", desc: "Next Greater Element. Daily Temperatures. Largest Rectangle in Histogram." },
    { title: "Binary Search Answer", icon: "🔍", desc: "Optimization problems. When asked 'Minimize the Maximum' or 'Smallest capacity'. " },
    { title: "Topological Sort", icon: "🕸️", desc: "Dependencies. Course Schedule problems. Build order. Cycle detection in directed graphs." },
    { title: "Backtracking", icon: "🌲", desc: "Permutations, Subsets, Sudoku Solver. Generate all possibilities and prune invalid paths." },
    { title: "Modified BFS", icon: "🌊", desc: "Shortest path in Grid/Graph. Multi-source BFS (Rotting Oranges). 0-1 BFS." },
  ];

  // --- Data: Blogs & Reads ---
  const blogs = [
    {
      category: "Competitive Programming",
      title: "CP-Algorithms",
      source: "The Holy Bible of CP",
      desc: "Detailed explanations of advanced algo (Segment Trees, Suffix Automata).",
      link: "https://cp-algorithms.com/",
      color: "border-blue-500",
    },
    {
      category: "Interview Prep",
      title: "LeetCode Patterns",
      source: "Seaan Prasad",
      desc: "A legendary blog post breaking down the 14 patterns to ace any coding interview.",
      link: "https://seanprashad.com/leetcode-patterns/",
      color: "border-green-500",
    },
    {
      category: "System Design",
      title: "High Scalability",
      source: "Real Architecture",
      desc: "Case studies on how WhatsApp, YouTube, and Netflix scaled to millions.",
      link: "http://highscalability.com/",
      color: "border-orange-500",
    },
    {
      category: "Deep Dive",
      title: "Visualizing Algorithms",
      source: "Mike Bostock",
      desc: "Beautiful visualizations of Sampling, Sorting, and Mazes. Build mental models.",
      link: "https://bost.ocks.org/mike/algorithms/",
      color: "border-purple-500",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");

        body {
          font-family: "Fredoka", sans-serif;
          background-color: ${darkMode ? "#0a0a0a" : "#f4f4f5"};
          transition: background-color 0.3s ease;
        }
        .cartoon-shadow {
          box-shadow: 4px 4px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-lg {
          box-shadow: 8px 8px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
        .cartoon-shadow-hover:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
      `}</style>

      {/* --- Navbar --- */}
      <nav className={`sticky top-0 z-50 ${darkMode ? "bg-gray-900 border-white" : "bg-white border-black"} border-b-4 cartoon-shadow`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${darkMode ? "bg-blue-500" : "bg-blue-400"} rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} cartoon-shadow`}>
              <Brain className={`w-6 h-6 ${darkMode ? "text-white" : "text-black"}`} />
            </div>
            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-black"}`}>
              DSA <span className={darkMode ? "text-blue-400" : "text-blue-500"}>HUB</span>
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 ${darkMode ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"} rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} cartoon-shadow-hover`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <div className="min-h-screen pb-20">
        <div className="max-w-6xl mx-auto px-4 pt-12">
          
          {/* --- Hero Section --- */}
          <div className="text-center mb-16 space-y-6">
            <div className={`inline-block px-6 py-2 rounded-full border-4 ${darkMode ? "border-white bg-pink-900/50 text-pink-300" : "border-black bg-pink-200 text-pink-900"} font-bold mb-4 cartoon-shadow transform -rotate-2`}>
              🚀 Zero to FAANG Roadmap
            </div>
            <h1 className={`text-5xl md:text-7xl font-black ${darkMode ? "text-white" : "text-black"} leading-tight`}>
              PRODUCT <span className={darkMode ? "text-yellow-400" : "text-yellow-500"}>&</span><br/>
              <span className={darkMode ? "text-blue-400" : "text-blue-500"}>ALGORITHMS</span>
            </h1>
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold max-w-2xl mx-auto`}>
              A curated knowledge base connecting standard DSA with real-world System Design and CS Fundamentals.
            </p>
          </div>

          {/* --- Section 1: Product-Focused Resources --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Database className={`w-8 h-8 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>The Toolkit</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((res, idx) => (
                <div key={idx} className={`relative p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform h-full flex flex-col justify-between`}>
                  <div>
                    <div className={`inline-block p-3 rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} ${darkMode ? res.darkColor : res.color} mb-4`}>
                        {res.icon}
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${darkMode ? "text-white" : "text-black"}`}>{res.title}</h3>
                    <p className={`text-xs font-bold uppercase mb-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{res.category}</p>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 font-semibold text-sm`}>{res.desc}</p>
                  </div>
                  <a href={res.link} target="_blank" rel="noreferrer" className={`flex items-center gap-2 font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-black hover:text-blue-600"} transition-colors`}>
                    Open Resource <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 2: Why DSA? --- */}
          <div className={`mb-20 p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-800" : "border-black bg-blue-100"} cartoon-shadow-lg flex flex-col md:flex-row items-center gap-8`}>
            <div className={`flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full border-4 ${darkMode ? "border-white bg-yellow-500" : "border-black bg-yellow-400"} cartoon-shadow`}>
              <Lightbulb className="w-12 h-12 text-black" />
            </div>
            <div>
              <h2 className={`text-3xl font-black mb-4 ${darkMode ? "text-white" : "text-black"}`}>Why Product Companies Care?</h2>
              <p className={`text-lg font-bold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>
                "Can you scale it?"
              </p>
              <p className={`mt-2 font-semibold ${darkMode ? "text-gray-400" : "text-blue-800"}`}>
                Product companies don't just want code that passes test cases; they want efficient, readable, and scalable code. <br/><br/>
                DSA optimizes **Time & Space**. System Design optimizes **Availability & Throughput**. You need both.
              </p>
            </div>
          </div>

          {/* --- Section 3: Expanded Pattern Library --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Hash className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>Identify The Pattern</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {patterns.map((item, i) => (
                <div key={i} className={`p-5 rounded-2xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-hover`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}>{item.title}</h4>
                  <p className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 leading-tight`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 4: Company Radar --- */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className={`w-8 h-8 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>Company Radar</h2>
            </div>

            <div className={`rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg overflow-hidden`}>
              {/* Tabs */}
              <div className={`flex overflow-x-auto border-b-4 ${darkMode ? "border-white" : "border-black"} scrollbar-hide`}>
                {Object.keys(companyData).map((company) => (
                  <button
                    key={company}
                    onClick={() => setActiveCompany(company)}
                    className={`px-6 py-4 font-black text-lg whitespace-nowrap transition-colors ${
                      activeCompany === company
                        ? darkMode
                          ? "bg-yellow-500 text-black"
                          : "bg-yellow-300 text-black"
                        : darkMode
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    } ${activeCompany === company ? "" : "border-r-2"}`}
                  >
                    {company}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className={`text-4xl font-black mb-4 ${darkMode ? "text-white" : "text-black"}`}>
                      Cracking <span className={`${darkMode ? "text-yellow-400" : "text-blue-600"}`}>{activeCompany}</span>
                    </h3>
                    <p className={`text-lg font-bold mb-6 italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      "{companyData[activeCompany].emphasis}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {companyData[activeCompany].topics.map((topic, i) => (
                        <span key={i} className={`px-4 py-2 rounded-xl border-2 ${darkMode ? "border-white text-white" : "border-black text-black"} font-bold ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`hidden md:flex w-1/3 items-center justify-center rounded-2xl border-4 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"} p-8`}>
                     <Target className={`w-32 h-32 ${darkMode ? "text-gray-700" : "text-gray-200"}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Section 5: The Library (Blogs & Advanced Reads) --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Coffee className={`w-8 h-8 ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
              <h2 className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>The Library</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((article, i) => (
                    <a href={article.link} target="_blank" rel="noreferrer" key={i} className={`block p-6 rounded-3xl border-4 ${darkMode ? "border-gray-700 bg-gray-900 hover:border-white" : "border-black bg-white hover:border-blue-500"} transition-all group`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-black uppercase px-2 py-1 rounded border-2 ${darkMode ? "border-white text-white" : "border-black text-black"} ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                                {article.category}
                            </span>
                            <ExternalLink className={`w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"} group-hover:text-blue-500`} />
                        </div>
                        <h4 className={`font-black text-2xl ${darkMode ? "text-white" : "text-black"} mb-1`}>{article.title}</h4>
                        <p className={`text-sm font-bold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-3`}>by {article.source}</p>
                        <p className={`font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{article.desc}</p>
                    </a>
                ))}
            </div>
          </div>
          
           {/* --- Footer --- */}
           <div className="text-center py-10 border-t-4 border-dashed border-gray-300 dark:border-gray-800">
             <p className={`font-bold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
               "The best time to plant a tree was 20 years ago. The second best time is now."
             </p>
           </div>

        </div>
      </div>
    </>
  );
}