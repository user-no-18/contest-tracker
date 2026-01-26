"use client";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DSA Resources - Free Algorithm Learning",
  description: "Curated DSA resources, roadmaps & books. Learn from NeetCode 150, Striver A2Z. Prepare for FAANG interviews.",
};
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  BookOpen,
  Target,
  Lightbulb,
  Briefcase,
  ExternalLink,
  Map,
  Coffee,
  Server,
  Cpu,
  Database,
  Hash,
  FileSpreadsheet,
  Book,
  GraduationCap,
  TrendingUp,
  Code,
} from "lucide-react";

export default function DSAKnowledgeHub() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [activeCompany, setActiveCompany] = useState("Google");

  // --- Data: Company Topics Mapping ---
  const companyData: Record<
    string,
    { color: string; topics: string[]; emphasis: string }
  > = {
    Google: {
      color: "bg-red-400",
      topics: [
        "DP on Trees",
        "Graph (Dijkstra/Union Find)",
        "Segment Trees",
        "Grid Problems",
        "Tries",
      ],
      emphasis:
        "Focuses on optimizing Hard problems. Often asks variations of standard graph/DP problems that require modeling.",
    },
    Amazon: {
      color: "bg-orange-400",
      topics: [
        "Sliding Window",
        "BFS/DFS (Islands)",
        "OOD (Design Locker)",
        "Top K Elements",
        "Merge Intervals",
      ],
      emphasis:
        "Leadership Principles (LPs) are 50% of the interview. For code: clean, modular code is preferred over competitive hacks.",
    },
    Microsoft: {
      color: "bg-blue-400",
      topics: [
        "String Parsing",
        "Linked Lists",
        "Binary Search Trees",
        "Matrix Manipulation",
        "Recursion",
      ],
      emphasis:
        "Tests core CS fundamentals. Often asks 'Design' questions combined with coding (e.g., Design Tic-Tac-Toe).",
    },
    Meta: {
      color: "bg-blue-600",
      topics: [
        "Tree Traversals",
        "Heaps",
        "Subarray Sums",
        "Graph Shortest Path",
        "Backtracking",
      ],
      emphasis:
        "Speed is everything. You need to solve 2 Mediums in 45 mins perfectly. Memorize patterns like 'Kth Element' patterns.",
    },
    Netflix: {
      color: "bg-red-600",
      topics: [
        "System Design (Heavy)",
        "Concurrency",
        "LRU Cache",
        "Greedy Algorithms",
        "Custom Data Structures",
      ],
      emphasis:
        "Culture fit is huge. Technical rounds focus heavily on System Design and practical engineering problems over abstract CP.",
    },
    Uber: {
      color: "bg-black",
      topics: [
        "Graph (TSP variations)",
        "Quad Trees",
        "Meeting Intervals",
        "Design HashMap",
        "Multi-threading",
      ],
      emphasis:
        "Heavy on geometry, graphs, and concurrency. Expect problems related to maps, routes, and scheduling.",
    },
  };

  // --- Data: Pattern-Based Problem Lists ---
  const problemLists = [
    {
      title: "NeetCode 150 + Blind 75",
      audience: "Interview preparation (beginner to intermediate)",
      desc: "A structured breakdown of 150 problems organized by pattern. Each problem includes video explanations and optimized solutions. The Blind 75 subset covers the most frequently asked interview questions across FAANG companies.",
      link: "https://neetcode.io/practice",
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "Sean Prashad's LeetCode Patterns",
      audience: "Intermediate practitioners seeking pattern recognition",
      desc: "A comprehensive spreadsheet categorizing 200+ problems into 14 core patterns. Includes difficulty ratings and links to LeetCode problems. Effective for identifying which patterns require more practice.",
      link: "https://seanprashad.com/leetcode-patterns/",
      icon: <FileSpreadsheet className="w-6 h-6" />,
    },
    {
      title: "Striver's A2Z DSA Sheet",
      audience: "Comprehensive DSA learning (beginner to advanced)",
      desc: "A complete roadmap with 450+ problems covering every major topic from basic arrays to advanced graph algorithms. Each section includes theory explanations, problem sets, and video tutorials.",
      link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
      icon: <Map className="w-6 h-6" />,
    },
    {
      title: "Fraz's DSA Sheet",
      audience: "Interview preparation with focus on pattern mastery",
      desc: "A Google Sheet with 250+ problems organized by company frequency and pattern type. Includes columns for tracking progress, notes, and solution approaches. Particularly useful for targeting specific companies.",
      link: "https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPXQg81R9sFE/",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Love Babbar's DSA Sheet",
      audience: "Comprehensive interview preparation",
      desc: "450 problems categorized by topic and difficulty. Focuses on building strong fundamentals before progressing to advanced patterns. Includes time complexity expectations for each problem.",
      link: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/",
      icon: <GraduationCap className="w-6 h-6" />,
    },
  ];

  // --- Data: Books & Resources ---
  const books = [
    {
      category: "Algorithm Design",
      title: "Introduction to Algorithms (CLRS)",
      authors: "Cormen, Leiserson, Rivest, Stein",
      level: "Intermediate to advanced",
      desc: "The canonical reference for algorithm design and analysis. Comprehensive coverage of sorting, graph algorithms, dynamic programming, NP-completeness, and complexity theory. Dense but authoritative.",
      link: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
    },
    {
      category: "Free Textbook",
      title: "Algorithms by Jeff Erickson",
      authors: "Jeff Erickson (University of Illinois)",
      level: "Intermediate",
      desc: "A freely available textbook covering recursion, backtracking, dynamic programming, greedy algorithms, and graph algorithms. Written with clarity and includes extensive problem sets. Particularly strong on explaining algorithmic thinking.",
      link: "http://jeffe.cs.illinois.edu/teaching/algorithms/",
    },
    {
      category: "Competitive Programming",
      title: "Competitive Programmer's Handbook",
      authors: "Antti Laaksonen",
      level: "Beginner to intermediate CP",
      desc: "A concise 300-page guide covering essential competitive programming techniques. Topics include number theory, graph algorithms, range queries, and geometry. Includes code examples in C++.",
      link: "https://cses.fi/book/book.pdf",
    },
    {
      category: "Advanced Algorithms",
      title: "CP-Algorithms",
      authors: "CP-Algorithms community",
      level: "Intermediate to advanced",
      desc: "An extensive wiki-style resource documenting advanced algorithms with mathematical proofs and implementation details. Covers segment trees, suffix structures, FFT, flows, and string algorithms. Essential reference for competitive programmers.",
      link: "https://cp-algorithms.com/",
    },
  ];

  // --- Data: Learning Roadmaps ---
  const roadmaps = [
    {
      title: "USACO Guide",
      audience: "Competitive programming beginners through advanced",
      desc: "A complete roadmap from basic programming to IOI-level competitive programming. Organized into modules by difficulty (Bronze, Silver, Gold, Platinum). Each module includes theory, practice problems, and editorial solutions. Covers standard algorithms systematically.",
      link: "https://usaco.guide/",
    },
    {
      title: "Tech Interview Handbook",
      audience: "Interview preparation with 8-week study plan",
      desc: "A systematic study plan covering essential interview topics. Organized by pattern with time allocation recommendations. Includes behavioral interview preparation and system design fundamentals. Created by Yangshun Tay.",
      link: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/",
    },
    {
      title: "Grind 75",
      audience: "Interview preparation with time constraints",
      desc: "An adaptive question list that adjusts based on available study time. Focuses on high-frequency interview questions with optimal time investment. Covers fundamental patterns with increasing difficulty.",
      link: "https://www.techinterviewhandbook.org/grind75",
    },
  ];

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
      icon: <BookOpen className="w-6 h-6" />,
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
    {
      title: "Two Pointers",
      icon: "✌️",
      desc: "Linear structures. Move start/end pointers to find pairs, reverse, or merge sorted arrays.",
    },
    {
      title: "Sliding Window",
      icon: "🪟",
      desc: "Subarrays/Substrings. Expand window to satisfy condition, shrink to optimize size.",
    },
    {
      title: "Slow & Fast Pointers",
      icon: "🐢",
      desc: "Cycle detection (Linked List/Array). Middle of list. Happy Number problems.",
    },
    {
      title: "Monotonic Stack",
      icon: "📚",
      desc: "Next Greater Element. Daily Temperatures. Largest Rectangle in Histogram.",
    },
    {
      title: "Binary Search Answer",
      icon: "🔍",
      desc: "Optimization problems. When asked 'Minimize the Maximum' or 'Smallest capacity'.",
    },
    {
      title: "Topological Sort",
      icon: "🕸️",
      desc: "Dependencies. Course Schedule problems. Build order. Cycle detection in directed graphs.",
    },
    {
      title: "Backtracking",
      icon: "🌲",
      desc: "Permutations, Subsets, Sudoku Solver. Generate all possibilities and prune invalid paths.",
    },
    {
      title: "Modified BFS",
      icon: "🌊",
      desc: "Shortest path in Grid/Graph. Multi-source BFS (Rotting Oranges). 0-1 BFS.",
    },
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
      source: "Sean Prashad",
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
      `}</style>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="min-h-screen pb-20">
        <div className="max-w-6xl mx-auto px-4 pt-12">
          {/* --- Hero Section --- */}
          <div className="text-center mb-16 space-y-6">
            <div
              className={`inline-block px-6 py-2 rounded-full border-4 ${darkMode ? "border-white bg-pink-900/50 text-pink-300" : "border-black bg-pink-200 text-pink-900"} font-bold mb-4 cartoon-shadow transform -rotate-2`}
            >
              🚀 Zero to FAANG Roadmap
            </div>
            <h1
              className={`text-5xl md:text-7xl font-black ${darkMode ? "text-white" : "text-black"} leading-tight`}
            >
              DATA STRUCTURES{" "}
              <span
                className={darkMode ? "text-yellow-400" : "text-yellow-500"}
              >
                &
              </span>
              <br />
              <span className={darkMode ? "text-blue-400" : "text-blue-500"}>
                ALGORITHMS
              </span>
            </h1>
            <p
              className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} font-semibold max-w-2xl mx-auto`}
            >
              A curated knowledge base connecting standard DSA with real-world
              System Design and CS Fundamentals.
            </p>
          </div>

          {/* --- Section 1: The Toolkit --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Database
                className={`w-8 h-8 ${darkMode ? "text-green-400" : "text-green-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                The Toolkit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform h-full flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`inline-block p-3 rounded-xl border-2 ${darkMode ? "border-white" : "border-black"} ${darkMode ? res.darkColor : res.color} mb-4`}
                    >
                      {res.icon}
                    </div>
                    <h3
                      className={`text-xl font-black mb-1 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {res.title}
                    </h3>
                    <p
                      className={`text-xs font-bold uppercase mb-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                    >
                      {res.category}
                    </p>
                    <p
                      className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 font-semibold text-sm`}
                    >
                      {res.desc}
                    </p>
                  </div>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-black hover:text-blue-600"} transition-colors`}
                  >
                    Open Resource <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 2: Why DSA? --- */}
          <div
            className={`mb-20 p-8 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-800" : "border-black bg-blue-100"} cartoon-shadow-lg flex flex-col md:flex-row items-center gap-8`}
          >
            <div
              className={`flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full border-4 ${darkMode ? "border-white bg-yellow-500" : "border-black bg-yellow-400"} cartoon-shadow`}
            >
              <Lightbulb className="w-12 h-12 text-black" />
            </div>
            <div>
              <h2
                className={`text-3xl font-black mb-4 ${darkMode ? "text-white" : "text-black"}`}
              >
                Why Product Companies Care?
              </h2>
              <p
                className={`text-lg font-bold ${darkMode ? "text-gray-300" : "text-blue-900"}`}
              >
                "Can you scale it?"
              </p>
              <p
                className={`mt-2 font-semibold ${darkMode ? "text-gray-400" : "text-blue-800"}`}
              >
                Product companies don't just want code that passes test cases;
                they want efficient, readable, and scalable code. <br />
                <br />
                DSA optimizes **Time & Space**. System Design optimizes
                **Availability & Throughput**. You need both.
              </p>
            </div>
          </div>

          {/* --- Section 3: Identify The Pattern --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Hash
                className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Identify The Pattern
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {patterns.map((item, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-hover`}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4
                    className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 leading-tight`}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 4: Pattern-Based Problem Lists --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <FileSpreadsheet
                className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Curated Problem Lists by Pattern
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problemLists.map((list, idx) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform`}
                >
                  <div
                    className={`inline-block p-3 rounded-xl border-2 ${darkMode ? "border-white bg-gray-800" : "border-black bg-red-600"} mb-4`}
                  >
                    {list.icon}
                  </div>
                  <h3
                    className={`text-xl font-black mb-1 ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {list.title}
                  </h3>
                  <p
                    className={`text-xs font-bold uppercase mb-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {list.audience}
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 font-semibold text-sm`}
                  >
                    {list.desc}
                  </p>

                  <a
                    href={list.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-black hover:text-blue-600"} transition-colors`}
                  >
                    Open Resource <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 5: Books & Reading Material --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Book
                className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Books & Reading Material
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map((book, idx) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform`}
                >
                  <span
                    className={`text-xs font-black uppercase px-2 py-1 rounded border-2 ${darkMode ? "border-white text-white bg-gray-800" : "border-black text-black bg-yellow-400"} inline-block mb-3`}
                  >
                    {book.category}
                  </span>
                  <h3
                    className={`text-xl font-black mb-1 ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {book.title}
                  </h3>
                  <p
                    className={`text-sm font-bold mb-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {book.authors}
                  </p>
                  <p
                    className={`text-xs font-bold uppercase mb-3 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Level: {book.level}
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 font-semibold text-sm`}
                  >
                    {book.desc}
                  </p>

                  <a
                    href={book.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-black hover:text-blue-600"} transition-colors`}
                  >
                    Access Book <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 6: Learning Roadmaps --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Map
                className={`w-8 h-8 ${darkMode ? "text-green-400" : "text-green-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Structured Learning Roadmaps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roadmaps.map((roadmap, idx) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow hover:-translate-y-2 transition-transform`}
                >
                  <h3
                    className={`text-xl font-black mb-2 ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {roadmap.title}
                  </h3>
                  <p
                    className={`text-xs font-bold uppercase mb-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {roadmap.audience}
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 font-semibold text-sm`}
                  >
                    {roadmap.desc}
                  </p>

                  <a
                    href={roadmap.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 font-bold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-black hover:text-blue-600"} transition-colors`}
                  >
                    View Roadmap <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 7: Company Radar --- */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase
                className={`w-8 h-8 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                Company Radar
              </h2>
            </div>

            <div
              className={`rounded-3xl border-4 ${darkMode ? "border-white bg-gray-900" : "border-black bg-white"} cartoon-shadow-lg overflow-hidden`}
            >
              {/* Tabs */}
              <div
                className={`flex overflow-x-auto border-b-4 ${darkMode ? "border-white" : "border-black"} scrollbar-hide`}
              >
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
                    <h3
                      className={`text-4xl font-black mb-4 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      Cracking{" "}
                      <span
                        className={`${darkMode ? "text-yellow-400" : "text-blue-600"}`}
                      >
                        {activeCompany}
                      </span>
                    </h3>
                    <p
                      className={`text-lg font-bold mb-6 italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      "{companyData[activeCompany].emphasis}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {companyData[activeCompany].topics.map((topic, i) => (
                        <span
                          key={i}
                          className={`px-4 py-2 rounded-xl border-2 ${darkMode ? "border-white text-white" : "border-black text-black"} font-bold ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`hidden md:flex w-1/3 items-center justify-center rounded-2xl border-4 border-dashed ${darkMode ? "border-gray-700" : "border-gray-300"} p-8`}
                  >
                    <Target
                      className={`w-32 h-32 ${darkMode ? "text-gray-700" : "text-gray-200"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Section 8: The Library (Blogs & Advanced Reads) --- */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Coffee
                className={`w-8 h-8 ${darkMode ? "text-orange-400" : "text-orange-600"}`}
              />
              <h2
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
              >
                The Library
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((article, i) => (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  key={i}
                  className={`block p-6 rounded-3xl border-4 ${darkMode ? "border-gray-700 bg-gray-900 hover:border-white" : "border-black bg-white hover:border-blue-500"} transition-all group`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`text-xs font-black uppercase px-2 py-1 rounded border-2 ${darkMode ? "border-white text-white" : "border-black text-black"} ${darkMode ? "bg-gray-800" : "bg-yellow-400"}`}
                    >
                      {article.category}
                    </span>
                    <ExternalLink
                      className={`w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"} group-hover:text-blue-500`}
                    />
                  </div>
                  <h4
                    className={`font-black text-2xl ${darkMode ? "text-white" : "text-black"} mb-1`}
                  >
                    {article.title}
                  </h4>
                  <p
                    className={`text-sm font-bold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-3`}
                  >
                    by {article.source}
                  </p>
                  <p
                    className={`font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {article.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* --- Footer --- */}
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
    "The best time to plant a tree was 20 years ago. The second best time is now."
  </p>

  {/* Feedback Call-to-Action */}
  <p
    className={`text-sm font-semibold mb-6 max-w-2xl mx-auto ${
      darkMode ? "text-gray-500" : "text-gray-600"
    }`}
  >
    Found a bug 🐞, have an idea 💡, or want a new feature 🚀?<br />
    Your feedback helps make DSA Quest better for everyone!
  </p>

  {/* Feedback Form */}
  <form
    action="https://formsubmit.co/debjyoti2409@gmail.com"
    method="POST"
    className="max-w-2xl mx-auto mb-8"
  >
    {/* Hidden fields for FormSubmit configuration */}
    <input type="hidden" name="_subject" value="New Feedback on DSA Quest!" />
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
      </div>
    </>
  );
}
