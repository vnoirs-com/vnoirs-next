import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  MapPin,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Vnoirs Engineering & WhatsApp Cloud API Support",
  description:
    "Get in touch with Vnoirs for custom web development, Next.js applications, and official WhatsApp Cloud API integrations. Email cs@vnoirs.com or WhatsApp +92 320 2453000.",
  alternates: {
    canonical: "/contact",
  },
};

const FAQS = [
  {
    q: "How does the engagement process begin?",
    a: "We start with a thorough technical discovery call or WhatsApp chat to understand your requirements, existing stack, and expected scale. Within 24-48 hours, we provide an architectural proposal with clear timeline milestones and pricing.",
  },
  {
    q: "What do I need to set up the WhatsApp Cloud API?",
    a: "You need a verified Meta Business Manager account and a clean phone number that is not currently registered on a standard WhatsApp app. We guide you through the entire verification process, token creation, webhook setup, and message template approvals.",
  },
  {
    q: "Do you provide 100% source code ownership?",
    a: "Yes. Once final project milestones are delivered and settled, full copyright and source code repository access are transferred directly to your organization with zero hidden licensing fees.",
  },
  {
    q: "Can you sign a Non-Disclosure Agreement (NDA)?",
    a: "Absolutely. We routinely sign bilateral NDAs before reviewing proprietary workflows, customer data structures, or code repositories.",
  },
  {
    q: "What ongoing maintenance and support do you offer?",
    a: "We offer dedicated monthly SLA support packages covering webhook uptime monitoring, Meta API version upgrades, security patches, and incremental feature rollouts.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Connect Directly With Our Engineers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Contact <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Vnoirs</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or need assistance with your WhatsApp Cloud API integration? Send us a message or contact our team directly.
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Main Section */}
      <section className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Direct Channels
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                  Reach Our Technical Desk
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Skip the sales rep bureaucracy. Speak straight with the engineers who build and maintain your infrastructure.
                </p>
              </div>

              {/* Direct WhatsApp Card */}
              <a
                href="https://wa.me/923202453000"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-500/60 block transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-base">WhatsApp Instant Chat</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Fastest Response
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Direct messaging for urgent scopes & live API consulting.
                    </p>
                    <p className="text-sm font-semibold text-emerald-400 mt-2">
                      +92 320 2453000 &rarr;
                    </p>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:cs@vnoirs.com"
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-violet-500/40 block transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Official Support & Scoping</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      For detailed RFPs, architectural documents, and invoicing.
                    </p>
                    <p className="text-sm font-semibold text-violet-400 mt-2">
                      cs@vnoirs.com &rarr;
                    </p>
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+923202453000"
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-violet-500/40 block transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Direct Phone Line</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Available during standard business hours.
                    </p>
                    <p className="text-sm font-semibold text-violet-400 mt-2">
                      +92 320 2453000 &rarr;
                    </p>
                  </div>
                </div>
              </a>

              {/* Hours & Info */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3 text-xs text-gray-400">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>Business Desk: Mon – Sat, 9:00 AM – 7:00 PM (PKT / UTC+5)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>Critical WhatsApp Webhook Incidents: 24/7 On-Call Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  <span>Remote Engineering Serving Clients Worldwide</span>
                </div>
              </div>
            </div>

            {/* Contact Form with Resend Setup */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 bg-[#060911] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">
              Clarifications
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Answers to common queries regarding engagements, timelines, and WhatsApp API provisioning.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 border border-white/5 space-y-2 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-white">{faq.q}</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
