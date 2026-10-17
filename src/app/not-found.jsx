import Link from "next/link";
import { Home, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-7xl font-extrabold text-violet-500 font-mono">
          404
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm">
          The requested route does not exist or may have been relocated.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Vnoirs Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
