import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Server,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Vnoirs | Cutting-Edge Web Solutions & WhatsApp Cloud API",
  description:
    "Vnoirs crafts high-performance custom web applications, scalable software architectures, and automated WhatsApp Cloud API business messaging systems.",
  alternates: {
    canonical: "/",
  },
};

const FEATURES = [
  {
    title: "WhatsApp Cloud API Integration",
    desc: "Direct integration with Meta's official WhatsApp Business Cloud API. Automate notifications, customer service dialogues, transactional alerts, and multi-agent routing.",
    icon: MessageSquare,
    badge: "Flagship Solution",
  },
  {
    title: "Next.js & React Web Applications",
    desc: "Production-ready, SEO-optimized web applications with server-side rendering, sub-second page loads, and bulletproof TypeScript type safety.",
    icon: Code2,
    badge: "Engineering",
  },
  {
    title: "Tailored Architecture & UI/UX",
    desc: "Bespoke digital experiences built from scratch—zero generic off-the-shelf templates. High conversion rates and accessible, responsive design.",
    icon: Layers,
    badge: "Design & UX",
  },
  {
    title: "Cloud DevOps & API Infrastructure",
    desc: "Resilient backend services, webhook dispatchers, rate-limited endpoints, and automated CI/CD deployment pipelines on AWS, Vercel, and modern edge networks.",
    icon: Server,
    badge: "Infrastructure",
  },
];

const METRICS = [
  { label: "Code Ownership", value: "100%", desc: "Full IP ownership handed to you" },
  { label: "API Availability", value: "99.9%", desc: "High-uptime message delivery" },
  { label: "Engineering Standard", value: "Zero", desc: "No bloated templates or lock-in" },
  { label: "Client Support", value: "24/7", desc: "Direct engineering communication" },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Blueprint",
    desc: "We analyze your exact technical requirements, user journeys, data flow, and messaging volume to create an actionable system specification.",
  },
  {
    step: "02",
    title: "Agile Development",
    desc: "Structured milestone-based sprints with live preview environments so you can review real progress and give immediate feedback.",
  },
  {
    step: "03",
    title: "Testing & Compliance",
    desc: "Rigorous automated testing, security validation, and strict Meta WhatsApp Cloud API compliance checks prior to production launch.",
  },
  {
    step: "04",
    title: "Deployment & Scaling",
    desc: "Zero-downtime production deployment with real-time monitoring, webhook health tracking, and continuous maintenance support.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Banner Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner-image.jpg"
            alt="Vnoirs Technology Solutions"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/80 via-[#090d16]/85 to-[#090d16]" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-25"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 5%, black 40%, transparent 95%)",
            }}
          />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Official WhatsApp Cloud API & High-Scale Web Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Innovative <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Web Solutions</span> & API Systems
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Vnoirs delivers custom web applications and mission-critical WhatsApp Business messaging workflows tailored to drive real growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="https://wa.me/923202453000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-200 text-base hover:border-violet-500/50"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>

          {/* Quick value badges */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {METRICS.map((metric) => (
              <div key={metric.label} className="p-3">
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-violet-400 mt-0.5">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Vnoirs Section */}
      <section className="py-24 bg-[#090d16] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
                Engineering Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
                Why Industry Leaders <span className="text-violet-400">Choose Vnoirs</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                We are a dedicated team of full-stack engineers and automation architects committed to solving tangible business hurdles. We do not recycle bloated generic WordPress or Shopify templates. Every line of code is purpose-built for speed, security, and long-term maintainability.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "100% Bespoke Codebase",
                    desc: "Hand-crafted architectures with complete source code transfer and zero vendor lock-in.",
                  },
                  {
                    title: "Official Meta WhatsApp Cloud API Standards",
                    desc: "Strict adherence to Meta guidelines, secure webhook handling, and compliant messaging workflows.",
                  },
                  {
                    title: "Modern Jamstack & Serverless Stack",
                    desc: "Leveraging Next.js App Router, React 19, TypeScript, and edge runtimes for maximal uptime.",
                  },
                  {
                    title: "Transparent & Direct Communication",
                    desc: "Direct access to lead engineers via WhatsApp and email throughout every project stage.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <div className="p-1 rounded-full bg-violet-500/20 text-violet-400 mt-1 flex-shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {item.title}
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="relative">
              <div className="glass-card rounded-2xl p-8 border border-white/10 glow-subtle">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-violet-400 font-mono">vnoirs-architecture.ts</span>
                </div>

                <div className="py-6 space-y-4 font-mono text-xs sm:text-sm">
                  <div className="text-gray-400">// Vnoirs Core Capabilities Specification</div>
                  <div className="text-violet-300">
                    <span className="text-blue-400">export const</span> capabilities = &#123;
                  </div>
                  <div className="pl-6 text-gray-300 space-y-1">
                    <div>
                      messaging: <span className="text-emerald-400">&quot;WhatsApp Cloud API&quot;</span>,
                    </div>
                    <div>
                      frontend: <span className="text-emerald-400">&quot;Next.js 15 (React 19 + TypeScript)&quot;</span>,
                    </div>
                    <div>
                      styling: <span className="text-emerald-400">&quot;Tailwind CSS Modern Styling&quot;</span>,
                    </div>
                    <div>
                      notifications: <span className="text-emerald-400">&quot;Resend API Email Workflows&quot;</span>,
                    </div>
                    <div>
                      infrastructure: <span className="text-emerald-400">&quot;Edge Serverless + Webhooks&quot;</span>,
                    </div>
                    <div>
                      sla: <span className="text-amber-400">99.9</span>,
                    </div>
                  &#125;;
                  </div>
                  <div className="text-violet-300">&#125;;</div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-gray-400">Status: <span className="text-emerald-400 font-medium">Ready for deployment</span></div>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    <span>View all services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[#060911] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Comprehensive Services
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              What We Build & Deliver
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Engineered for high performance, conversion, and seamless integration with modern business infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-8 hover:border-violet-500/40 transition-all duration-300 group hover:-translate-y-1 relative"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {feature.desc}
                  </p>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Explore details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Execution Process */}
      <section className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Methodology
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Our 4-Step Engineering Process
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Structured, transparent execution without unnecessary friction or missed deadlines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="glass-card rounded-2xl p-6 border border-white/5 relative hover:border-violet-500/30 transition-colors"
              >
                <div className="text-4xl font-extrabold text-violet-500/30 mb-4 font-mono">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Preview with Live Contact Form */}
      <section id="contact" className="py-24 bg-[#060911] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Info Column */}
            <div>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                Let&apos;s Build Your Next Technical Solution
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                Whether you need a dedicated WhatsApp Cloud API integration, a full Next.js web application overhaul, or advice on software architecture, we are ready to assist.
              </p>

              <div className="space-y-6">
                <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Direct WhatsApp Inquiries</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Instant messaging with our technical leads</p>
                    <a
                      href="https://wa.me/923202453000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 mt-1 inline-block"
                    >
                      +92 320 2453000 (Chat Now &rarr;)
                    </a>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Official Email</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Project proposals & technical RFPs</p>
                    <a
                      href="mailto:cs@vnoirs.com"
                      className="text-sm font-semibold text-violet-400 hover:text-violet-300 mt-1 inline-block"
                    >
                      cs@vnoirs.com
                    </a>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Confidentiality Guarantee</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mutual NDA signed upon request prior to code review or technical scoping.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form with Resend */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
