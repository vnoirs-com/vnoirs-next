import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  MessageSquare,
  Mail,
  Linkedin,
  Github,
  Award,
  Layers,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "Founder & Core Leadership | Vnoirs Engineering",
  description:
    "Meet the founder and core engineering minds behind Vnoirs. Specialized in Meta WhatsApp Cloud API infrastructure and high-performance custom web applications.",
  alternates: {
    canonical: "/team",
  },
};

const CORE_TEAM = [
  {
    role: "Lead WhatsApp Solutions Architect",
    focus: "Meta Graph API & Webhook Infrastructure",
    description:
      "Directs Meta Cloud API compliance, 24/7 webhook listener health, rate-limiting buffers, and transactional notification engines.",
    skills: ["Meta Graph API", "Node.js", "Redis", "Supabase", "Webhooks"],
    icon: MessageSquare,
  },
  {
    role: "Senior Full-Stack Web Architect",
    focus: "Next.js 15 & React Systems",
    description:
      "Engineers bespoke client platforms, SSR performance optimizations, component libraries, and sub-second page rendering.",
    skills: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript / ESM", "Zod"],
    icon: Code2,
  },
  {
    role: "Cloud Reliability & DevOps Lead",
    focus: "CI/CD & Edge Global Infrastructure",
    description:
      "Guarantees 99.9% uptime across serverless runtimes, automated deployment pipelines, Docker environments, and edge CDNs.",
    skills: ["Vercel Edge", "AWS", "Docker", "Cloudflare", "GitHub Actions"],
    icon: Cpu,
  },
  {
    role: "Product & UI/UX Systems Specialist",
    focus: "High-Converting Digital Experiences",
    description:
      "Crafts intuitive user journeys, accessibility audits, responsive Figma design tokens, and conversational interface mockups.",
    skills: ["Figma", "UI/UX", "Design Tokens", "CRO", "WCAG 2.1"],
    icon: Layers,
  },
];

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Leadership & Core Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            The Minds Behind <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Vnoirs Technology Solutions
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Founded on pure engineering principles: zero generic website templates, direct technical communication, and production-grade WhatsApp Cloud API systems.
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Founder Spotlight Section */}
      <section className="py-24 bg-[#090d16] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-violet-500/30 relative overflow-hidden glow-subtle">
            {/* Ambient background glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Founder Picture Column */}
              <div className="lg:col-span-5 text-center lg:text-left">
                <div className="relative inline-block mx-auto lg:mx-0">
                  {/* Decorative glowing ring */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-3xl blur-lg opacity-70 animate-pulse" />

                  {/* Picture container */}
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#0e1424] group">
                    <Image
                      src="/founder.jpg"
                      alt="Vnoirs Founder & Principal Solutions Architect"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Founder Status Badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 px-4 py-1.5 rounded-full bg-[#090d16]/95 border border-violet-500/40 text-xs font-semibold text-violet-300 shadow-xl backdrop-blur-md whitespace-nowrap flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Founder & Principal Architect</span>
                  </div>
                </div>

                {/* Direct Founder Channels */}
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
                  <a
                    href="https://wa.me/923202453000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-emerald-400 transition"
                    aria-label="Direct WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:cs@vnoirs.com"
                    className="p-3 rounded-xl bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-violet-400 transition"
                    aria-label="Email Founder"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href="tel:+923202453000"
                    className="p-3 rounded-xl bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-violet-400 transition"
                    aria-label="Phone Founder"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Founder Narrative Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Founder&apos;s Desk
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Engineering What Matters, <br />
                    <span className="text-violet-400">Without Compromise</span>
                  </h2>
                </div>

                <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    &quot;When I founded Vnoirs, my goal was clear: bridge the massive gap between outdated, sluggish CMS sites and high-end enterprise software. Modern businesses need fast, resilient web applications that convert and automated WhatsApp Business systems that actually drive revenue.&quot;
                  </p>
                  <p>
                    &quot;At Vnoirs, we do not operate as a middleman agency or outsource work to disconnected freelancers. We write every line of code with intention—leveraging Next.js App Router, React 19, and official Meta WhatsApp Cloud API standards to deliver software our clients own 100%.&quot;
                  </p>
                </div>

                {/* Core Commitments */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "100% Full Source Code Handover",
                    "Direct Engineer-to-Client Access",
                    "Official Meta Cloud API Verified Workflows",
                    "Sub-Second Next.js Performance Guarantee",
                  ].map((commitment) => (
                    <div key={commitment} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-300 font-medium">
                        {commitment}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-violet-600/30 transition text-sm"
                  >
                    <span>Schedule Technical Discussion</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 font-medium px-5 py-3 rounded-xl border border-white/10 transition text-sm"
                  >
                    <span>Join Our Team</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Members & Engineering Leads */}
      <section className="py-24 bg-[#060911] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Specialized Units
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Core Engineering Divisions
            </h2>
            <p className="text-gray-400 text-base">
              Every deliverable at Vnoirs is backed by specialized subject matter leads across full-stack and cloud engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {CORE_TEAM.map((member) => {
              const Icon = member.icon;
              return (
                <div
                  key={member.role}
                  className="glass-card rounded-3xl p-8 border border-white/10 hover:border-violet-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300">
                      {member.focus}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {member.role}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {member.description}
                  </p>

                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Core Technologies:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recruitment CTA Banner */}
      <section className="py-20 bg-[#090d16] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Want to join our core engineering crew?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              We are actively hiring for WhatsApp Cloud API leads, Next.js engineers, and product designers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/careers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-violet-600/30 text-sm"
              >
                <span>View Open Positions & Upload CV</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition text-sm"
              >
                <span>Contact Leadership</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
