import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Workflow,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Vnoirs | Custom Web Solutions & Messaging Infrastructure",
  description:
    "Learn about Vnoirs, our engineering philosophy, architectural standards, and mission to deliver custom web systems and enterprise WhatsApp Cloud API solutions.",
  alternates: {
    canonical: "/about",
  },
};

const PILLARS = [
  {
    title: "100% Code Ownership",
    desc: "We build tailored software assets that belong entirely to your company. Zero proprietary licensing traps, hidden royalties, or closed ecosystems.",
    icon: Terminal,
  },
  {
    title: "Performance by Design",
    desc: "Speed is a core feature. We optimize Core Web Vitals, server response times, and edge caching to ensure lightning-fast interactions.",
    icon: Cpu,
  },
  {
    title: "Meta-Compliant Integrations",
    desc: "Direct integration with official WhatsApp Cloud API protocols, adhering to data protection standards, webhook integrity, and privacy laws.",
    icon: ShieldCheck,
  },
  {
    title: "Agile Engineering Cadence",
    desc: "Iterative sprint cycles with regular staging reviews. You maintain full visibility over code progression and technical milestones.",
    icon: Workflow,
  },
];

const TECH_STACK = [
  { category: "Frontend Frameworks", items: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS"] },
  { category: "Backend & Messaging", items: ["WhatsApp Cloud API", "Node.js", "Serverless Edge Functions", "Resend API"] },
  { category: "Infrastructure & CI/CD", items: ["Vercel Edge Network", "AWS", "Docker", "Git Automated Pipelines"] },
  { category: "Security & Standards", items: ["GDPR Principles", "Webhook Signatures", "End-to-End Encryption", "Zero Bloat"] },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>About Vnoirs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Building Resilient Web Solutions & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Mission-Critical Messaging Systems
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Vnoirs is an engineering-first digital studio dedicated to building high-converting web applications, scalable APIs, and automated WhatsApp Business workflows.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Story & Philosophy */}
      <section className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
                Our Narrative
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
                Engineered for Reliability, Designed for Growth
              </h2>
              <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                <p>
                  At Vnoirs, we noticed that modern businesses were caught between two extremes: slow, bloated CMS platforms filled with brittle plugins, or enterprise software agencies that charge exorbitant fees with months of bureaucracy.
                </p>
                <p>
                  We founded Vnoirs to provide a modern alternative: agile, specialized engineering that delivers lightweight, ultra-fast web applications and high-throughput WhatsApp Cloud API integrations.
                </p>
                <p>
                  We don&apos;t rely on anonymous freelancers or cookie-cutter template marketplaces. Every project is scoped, engineered, and maintained by experienced software professionals who value clean code, transparent timelines, and measurable client success.
                </p>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="glass-card rounded-2xl p-8 border border-white/10 glow-subtle">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-violet-400" />
                <span>Our Engineering Standards</span>
              </h3>

              <div className="space-y-4">
                {[
                  "Clean, modular TypeScript with strict type checking",
                  "Fast server-side rendering (SSR) and edge-based caching",
                  "Direct integration with official Meta Graph & WhatsApp Cloud APIs",
                  "Automated form processing & Resend transactional notification dispatch",
                  "Zero third-party trackers or bloatware preserving client privacy",
                  "Comprehensive staging environments with continuous CI/CD verification",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Direct consultation available</span>
                <Link
                  href="/contact"
                  className="text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Talk with an engineer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <section className="py-24 bg-[#060911] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Guiding Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              What Defines Every Vnoirs Deliverable
            </h2>
            <p className="text-gray-400 text-base">
              Principles we never compromise on, from initial architecture to final production release.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-violet-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Modern Technologies We Specialize In
            </h2>
            <p className="text-gray-400 text-base">
              Carefully chosen tools proven to deliver high stability, low latency, and infinite scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_STACK.map((stack) => (
              <div
                key={stack.category}
                className="glass-card rounded-2xl p-6 border border-white/5"
              >
                <h3 className="text-base font-bold text-violet-300 mb-4 pb-2 border-b border-white/10">
                  {stack.category}
                </h3>
                <ul className="space-y-2.5">
                  {stack.items.map((item) => (
                    <li key={item} className="text-sm text-gray-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 glass-card rounded-2xl p-8 sm:p-12 border border-violet-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Ready to elevate your digital presence?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
              Speak directly with our technical team today to discuss your project requirements or WhatsApp Cloud API setup.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-violet-600/30"
              >
                <span>Initiate a Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/923202453000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition"
              >
                <span>WhatsApp Us: +92 320 2453000</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
