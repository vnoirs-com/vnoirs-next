import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  Code2,
  Server,
  Layers,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Database,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | WhatsApp Cloud API & Custom Web Engineering | Vnoirs",
  description:
    "Explore Vnoirs' core offerings: WhatsApp Cloud API integrations, custom Next.js web applications, API engineering, UI/UX systems, and cloud infrastructure.",
  alternates: {
    canonical: "/services",
  },
};

const SERVICES_DETAILED = [
  {
    id: "whatsapp",
    title: "WhatsApp Cloud API Integration",
    subtitle: "Enterprise Conversational Infrastructure",
    icon: MessageSquare,
    badge: "Specialized Solution",
    description:
      "Transform customer engagement through the official Meta WhatsApp Cloud API. We architect automated notification engines, interactive bot flows, customer support routing, and CRM synchronization with high throughput and strict compliance.",
    capabilities: [
      "Official Meta WhatsApp Business Cloud API setup & verification",
      "Interactive message templates with quick replies & CTA buttons",
      "Real-time webhook listener and multi-agent routing engines",
      "Transactional automated alerts (order confirmations, 2FA, OTPs)",
      "CRM & database synchronization (PostgreSQL, Supabase, MongoDB)",
      "Strict data privacy compliance and opt-in/opt-out management",
    ],
    technologies: ["Meta Graph API", "Webhooks", "Node.js", "Serverless Edge", "Redis Queue"],
  },
  {
    id: "web",
    title: "Custom Next.js & React Applications",
    subtitle: "Bespoke Full-Stack Web Systems",
    icon: Code2,
    badge: "Core Engineering",
    description:
      "Modern web applications engineered with Next.js 15, React 19, and TypeScript. We eliminate boilerplate templates in favor of tailored software that delivers sub-second page loads, flawless SEO, and effortless scalability.",
    capabilities: [
      "Next.js App Router with Server-Side Rendering (SSR) & Static Generation",
      "Type-safe architectures with end-to-end TypeScript validation",
      "Modern responsive styling using Tailwind CSS with glassmorphic accents",
      "Role-based authentication & secure session management",
      "Integration with third-party payment gateways and external APIs",
      "Full ownership of the clean, documented codebase",
    ],
    technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Zod"],
  },
  {
    id: "api",
    title: "API Development & Backend Engineering",
    subtitle: "Scalable Microservices & Data Pipelines",
    icon: Server,
    badge: "Backend & Systems",
    description:
      "Robust RESTful and GraphQL backend systems designed for high uptime, secure data exchange, and seamless integration between your web apps, mobile clients, and third-party tools.",
    capabilities: [
      "Custom RESTful & GraphQL API endpoints with OpenAPI documentation",
      "Resend API integration for automated email workflows and alerts",
      "Secure webhook event receivers with signature verification",
      "Database schema architecture, migrations, and index optimization",
      "Rate-limiting, CORS configuration, and DDoS mitigation",
      "Cache management with Redis and Edge Key-Value storage",
    ],
    technologies: ["Node.js", "Resend API", "PostgreSQL", "Redis", "REST / GraphQL"],
  },
  {
    id: "uiux",
    title: "UI/UX Architecture & Design Systems",
    subtitle: "High-Converting Digital Experiences",
    icon: Layers,
    badge: "Design & UX",
    description:
      "We design user interfaces that look striking and convert visitors into paying clients. From interactive prototypes to complete design systems, every screen is crafted with accessibility and usability at the core.",
    capabilities: [
      "Figma design system creation with reusable component libraries",
      "Information architecture, user journey mapping, and wireframing",
      "Micro-interactions, smooth CSS animations, and dark mode theming",
      "Mobile-first responsive layouts tested across all device sizes",
      "WCAG 2.1 accessible contrast ratios and keyboard navigation",
      "Conversion rate optimization (CRO) audits for landing pages",
    ],
    technologies: ["Figma", "Tailwind CSS", "Lucide Icons", "CSS Grid & Flexbox"],
  },
  {
    id: "devops",
    title: "Cloud Infrastructure & DevOps",
    subtitle: "High Availability & Automated Delivery",
    icon: Cpu,
    badge: "Cloud & Reliability",
    description:
      "Take your applications to production with confidence. We configure automated CI/CD pipelines, containerized deployments, edge routing, and monitoring systems that ensure 99.9% uptime.",
    capabilities: [
      "Automated CI/CD deployment pipelines using GitHub Actions",
      "Global CDN edge distribution via Vercel and Cloudflare",
      "Docker containerization for consistent local & cloud environments",
      "Domain DNS management, SSL certification, and HTTPS enforcement",
      "Application performance monitoring (APM) and error logging",
      "Automated backup strategies and disaster recovery planning",
    ],
    technologies: ["Vercel Edge", "AWS", "Docker", "Cloudflare", "GitHub Actions"],
  },
  {
    id: "consulting",
    title: "Technical Strategy & Code Audits",
    subtitle: "Architecture Reviews & Roadmaps",
    icon: ShieldCheck,
    badge: "Advisory",
    description:
      "Need guidance on tech stack selection, Meta WhatsApp approval hurdles, or system refactoring? We provide honest, pragmatic technical evaluations to save you months of costly mistakes.",
    capabilities: [
      "System architecture reviews and scalability bottleneck diagnosis",
      "Meta Business verification & WhatsApp Cloud API compliance checks",
      "Security audits, vulnerability scans, and dependency reviews",
      "Technical scoping documentation for angel & venture pitches",
      "Code quality reviews and refactoring roadmaps",
      "Legacy codebase migration to modern React / Next.js",
    ],
    technologies: ["Architecture Audits", "Meta Policy", "Lighthouse", "Security Best Practices"],
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>Full-Spectrum Digital Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Services Built for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Speed, Stability & Scalability
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From official WhatsApp Cloud API enterprise automation to custom Next.js full-stack web platforms, discover how Vnoirs engineers your competitive edge.
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[110px] pointer-events-none" />
      </section>

      {/* Services List */}
      <section className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {SERVICES_DETAILED.map((service, index) => {
            const Icon = service.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.id}
                className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 hover:border-violet-500/40 transition-all duration-300 glow-subtle scroll-mt-28"
              >
                <div className={`grid lg:grid-cols-12 gap-10 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                  {/* Service info column */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {service.title}
                      </h2>
                      <p className="text-sm font-medium text-violet-400 mt-1">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        What We Deliver:
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {service.capabilities.map((cap) => (
                          <div key={cap} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-gray-300 leading-snug">
                              {cap}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3 items-center">
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-violet-600/25"
                      >
                        <span>Inquire About This Service</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="https://wa.me/923202453000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium px-4 py-2.5 rounded-xl transition border border-white/10"
                      >
                        <span>WhatsApp Chat</span>
                      </a>
                    </div>
                  </div>

                  {/* Tech stack badge block */}
                  <div className="lg:col-span-5 bg-[#060911]/80 rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">
                        Technologies Deployed
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Deployment Highlights
                      </div>
                      <div className="text-xs text-gray-400 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>100% full source code ownership handover</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Direct technical support via cs@vnoirs.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Strict SLA uptime & security audits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[#060911] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Need a custom technical roadmap?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-base">
            Reach out directly. We discuss your technical specifications and provide a clear, no-nonsense estimate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-violet-600/30"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:cs@vnoirs.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition"
            >
              <span>Email: cs@vnoirs.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
