import { Code2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="w-24 h-24 mx-auto bg-blue-400 rounded-2xl border-4 border-black"></div>
          </div>
          <div className="relative w-24 h-24 mx-auto bg-blue-400 rounded-2xl border-4 border-black flex items-center justify-center animate-bounce shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Code2 className="w-12 h-12 text-black" />
          </div>
        </div>

        {/* Loading Text */}
        <div>
          <h2 className="text-3xl font-black text-black mb-2">
            DSA <span className="text-blue-500">Quest</span>
          </h2>
          <p className="text-lg font-bold text-gray-600 animate-pulse">
            Loading...
          </p>
        </div>

        {/* Spinner Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
}