import Link from "next/link";
import { MessageSquareCode, Mail, Phone, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060911] border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
                <MessageSquareCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Vnoirs
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Delivering high-performance custom web solutions, modern SaaS
              architecture, and enterprise WhatsApp Cloud API business integrations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-violet-400">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Official Meta WhatsApp Cloud API standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-violet-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-violet-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-violet-400 transition">
                  Team & Leadership
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-violet-400 transition">
                  Careers & Openings
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-violet-400 transition">
                  Services & Solutions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-violet-400 transition">
                  Contact & Consultation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-violet-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-violet-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-violet-400 transition">
                  Data Deletion Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#whatsapp" className="hover:text-violet-400 transition">
                  WhatsApp Cloud API
                </Link>
              </li>
              <li>
                <Link href="/services#web" className="hover:text-violet-400 transition">
                  Custom Next.js & React Apps
                </Link>
              </li>
              <li>
                <Link href="/services#uiux" className="hover:text-violet-400 transition">
                  UI/UX Architecture
                </Link>
              </li>
              <li>
                <Link href="/services#devops" className="hover:text-violet-400 transition">
                  Cloud Infrastructure & DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Direct Inquiries
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:cs@vnoirs.com"
                  className="flex items-center gap-2 hover:text-violet-400 transition"
                >
                  <Mail className="w-4 h-4 text-violet-400" />
                  <span>cs@vnoirs.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+923202453000"
                  className="flex items-center gap-2 hover:text-violet-400 transition"
                >
                  <Phone className="w-4 h-4 text-violet-400" />
                  <span>+92 320 2453000</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923202453000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Vnoirs. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition">
              Privacy & Data Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-400 transition">
              Terms of Service
            </Link>
            <Link href="/data-deletion" className="hover:text-gray-400 transition">
              Data Deletion
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition">
              Client Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
