"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function SiteLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Admin Portal: Completely isolated from website layout
  // NO website Navbar, NO website Footer, NO candidate AuthModal
  if (isAdminRoute) {
    return <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">{children}</div>;
  }

  // Frontsite: Dark theme with Navbar, Footer, and Candidate Auth
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100 antialiased selection:bg-violet-600 selection:text-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}
