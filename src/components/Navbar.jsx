"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, MessageSquareCode, UserCheck, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Team", href: "/team" },
  { name: "Careers", href: "/careers" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, openAuthModal } = useAuth();

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-300">
              <MessageSquareCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-violet-300 bg-clip-text text-transparent">
              Vnoirs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-violet-600/20 border border-violet-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Auth status in navbar */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="max-w-[100px] lg:max-w-[130px] truncate font-medium">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  type="button"
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("Sign in to your candidate account")}
                type="button"
                className="px-3 py-2 text-xs font-semibold text-violet-300 hover:text-white transition cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Link
              href="/contact"
              className="ml-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs lg:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Get Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090d16]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {/* Mobile user profile info */}
          {user ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-200 font-medium truncate max-w-[200px]">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                type="button"
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pb-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal("Sign in to your candidate account");
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-xl hover:bg-white/10 transition text-sm"
              >
                <LogIn className="w-4 h-4 text-violet-400" />
                <span>Candidate Sign In / Register</span>
              </button>
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-violet-600/20 text-white border border-violet-500/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-3 rounded-lg hover:bg-violet-500 transition shadow-lg shadow-violet-600/30"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
