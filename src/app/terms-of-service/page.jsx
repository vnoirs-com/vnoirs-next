import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Scale,
  Terminal,
  CheckCircle2,
  Lock,
  CreditCard,
  AlertTriangle,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Cpu,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | Vnoirs Web Engineering & WhatsApp Cloud API",
  description:
    "Official Terms of Service governing the use of vnoirs.com, bespoke software engineering, Next.js web application development, and Meta WhatsApp Cloud API messaging infrastructure.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 2026";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Scale className="w-4 h-4 text-violet-400" />
            <span>Legal & Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Terms of Service & Engagement
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            These terms establish the legal framework, code ownership policies, acceptable usage standards, and service level commitments for all software engineering and WhatsApp Cloud API systems delivered by Vnoirs.
          </p>

          <div className="mt-6 inline-block text-xs text-gray-500 font-mono">
            Effective Date & Last Updated: {lastUpdated}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Main Legal Content */}
      <section className="py-16 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-12 leading-relaxed text-gray-300 text-sm sm:text-base">
            {/* Quick summary notice */}
            <div className="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-start gap-3.5 text-violet-200">
              <Sparkles className="w-5 h-5 flex-shrink-0 text-violet-400 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-white">Engineering Guarantee: </span>
                Vnoirs is committed to total transparency. We guarantee 100% source code ownership upon milestone settlement, zero proprietary vendor lock-in, and strict compliance with Meta WhatsApp Cloud API policies and data protection standards.
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">01.</span>
                <span>Acceptance of Terms & Contractual Framework</span>
              </h2>
              <p>
                By accessing <a href="https://vnoirs.com" className="text-violet-400 hover:underline">vnoirs.com</a>, engaging our engineering consultation services, or entering into a Statement of Work (SOW), proposal, or invoice for digital deliverables, you (&quot;Client&quot;, &quot;User&quot;, or &quot;You&quot;) agree to be legally bound by these Terms of Service (&quot;Terms&quot;).
              </p>
              <p>
                If you are entering into this agreement on behalf of a corporation, partnership, or other legal entity, you represent and warrant that you hold full legal authority to bind that entity to these Terms. If you do not have such authority or do not agree with any part of these Terms, you must refrain from utilizing our services and website.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">02.</span>
                <span>Scope of Engineering & Technology Services</span>
              </h2>
              <p>
                Vnoirs delivers specialized digital engineering, systems architecture, and business messaging infrastructure, including but not limited to:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                    <Terminal className="w-4 h-4 text-violet-400" />
                    <span>Custom Next.js & React Applications</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Bespoke web platforms built with Next.js App Router, React, Tailwind CSS, TypeScript/JavaScript, and server-side rendering for top-tier speed and SEO.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <span>WhatsApp Cloud API Solutions</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Official Meta WhatsApp Business Cloud API architecture, webhook listeners, automated notification triggers, CRM routing, and chatbot integrations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                    <Cpu className="w-4 h-4 text-violet-400" />
                    <span>Backend APIs & Microservices</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Scalable RESTful & GraphQL endpoints, Resend transactional email systems, database schemas (PostgreSQL, Supabase), and secure authentication.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                    <Lock className="w-4 h-4 text-violet-400" />
                    <span>Cloud DevOps & Reliability</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Automated CI/CD deployment pipelines, edge CDN configurations (Vercel, AWS, Cloudflare), domain DNS management, and uptime monitoring.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Specific milestones, technical deliverables, and project timelines are formalized through individual Statements of Work (SOW) or written project quotes referencing these Master Terms.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">03.</span>
                <span>Client Responsibilities & Acceptable Use</span>
              </h2>
              <p>
                Successful software delivery relies on mutual collaboration. As a client or website user, you agree to:
              </p>
              <ul className="space-y-2.5 pl-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Timely Provision of Assets:</strong> Furnish required branding assets, API credentials, domain access, and design feedback within agreed sprint review windows.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Lawful Content & Materials:</strong> Ensure that all text, graphics, trademarks, customer data, and instructions provided to Vnoirs do not infringe third-party intellectual property or violate applicable laws.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Prohibition of Malicious Activities:</strong> You will not use our deliverables or website to distribute malware, orchestrate denial-of-service (DDoS) attacks, conduct unauthorized vulnerability scans, or engage in deceptive phishing practices.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">04.</span>
                <span>Meta Platforms & WhatsApp Cloud API Specific Governance</span>
              </h2>
              <p>
                When commissioning or utilizing our WhatsApp Cloud API engineering services, clients are subject to strict regulatory and Meta platform standards:
              </p>
              <div className="p-5 rounded-2xl bg-[#060911] border border-white/10 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Mandatory Prior Consent (Opt-In):</strong> Clients must obtain affirmative, verifiable opt-in consent from all end-recipients before dispatching business messages via the WhatsApp Business Solution.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Zero Tolerance for Spam:</strong> Vnoirs does not provide scraping tools, unsolicited broadcast lists, or cold outreach engines. Transmission of unsolicited promotional spam or deceptive messages is strictly prohibited and grounds for immediate contract termination.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Honoring Opt-Outs:</strong> All automated conversational flows architected by Vnoirs incorporate automated keywords (&quot;STOP&quot;, &quot;UNSUBSCRIBE&quot;) that immediately halt messaging. Clients must never circumvent these controls.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Meta Policy Compliance:</strong> Clients remain solely responsible for adhering to Meta&apos;s WhatsApp Business Messaging Policy, Meta Commerce Policy, and Terms of Service, including maintaining good account standing and paying Meta conversation fees directly.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">05.</span>
                <span>Intellectual Property Rights & 100% Code Ownership</span>
              </h2>
              <p>
                Our philosophy centers on true digital sovereignty for our clients:
              </p>
              <ul className="space-y-2.5 pl-2 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Custom Code Handover:</strong> Upon full settlement of all contracted project invoices, Vnoirs transfers 100% of the intellectual property, copyright, and ownership rights of custom software, unique design layouts, and business logic developed specifically for the client.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Open-Source & Third-Party Dependencies:</strong> Software deliverables may integrate battle-tested open-source libraries (e.g., Next.js, React, Tailwind CSS, Lucide icons) licensed under permissive licenses (MIT, Apache 2.0). These libraries remain subject to their respective open-source terms.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Portfolio Rights:</strong> Unless explicitly restricted by an executed Non-Disclosure Agreement (NDA), Vnoirs reserves the right to showcase non-confidential project milestones, public screenshots, and high-level case studies in our agency portfolio and marketing materials.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">06.</span>
                <span>Commercial Terms, Invoicing & Third-Party Costs</span>
              </h2>
              <div className="space-y-3">
                <p>
                  Engineering engagements are structured on milestone-based or retainer billing models:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-semibold text-white mb-1">
                      <CreditCard className="w-4 h-4 text-violet-400" />
                      <span>Milestone Deposits</span>
                    </div>
                    <p className="text-gray-400">
                      Standard project kickoffs require an initial deposit (typically 30% to 50%) prior to sprint initiation. Subsequent payments are tied to tangible review milestones.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-semibold text-white mb-1">
                      <FileText className="w-4 h-4 text-violet-400" />
                      <span>Payment Due Dates</span>
                    </div>
                    <p className="text-gray-400">
                      Invoices are payable within 7 business days of issuance unless otherwise stipulated. Overdue balances may temporarily pause staging deployments and active sprint cycles.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 pt-2">
                  <strong className="text-white">Third-Party Hosting & API Consumption:</strong> Fees charged by third-party infrastructure providers (including Meta WhatsApp conversation charges, Vercel/AWS cloud hosting, domain registrars, Supabase database tiers, and Resend email quotas) are the sole responsibility of the Client and are either paid directly to the provider or billed at direct cost.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">07.</span>
                <span>Post-Launch Warranty & Maintenance</span>
              </h2>
              <p>
                We stand behind our code craftsmanship. Every bespoke production deployment includes:
              </p>
              <ul className="space-y-2.5 pl-2 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">30-Day Defect Warranty:</strong> Vnoirs provides a complimentary 30-day post-launch warranty during which any reproducible bug or deviation from the signed Statement of Work is remedied at zero additional charge.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Scope Change Management:</strong> Requests for new features, architectural refactors, or capabilities outside the signed SOW will be scoped, estimated, and approved under a separate Change Order.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Ongoing Retainers:</strong> Clients desiring continuous monitoring, priority ticket turnaround, dependency updates, and monthly WhatsApp flow enhancements can enroll in our dedicated Monthly Maintenance Retainers.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">08.</span>
                <span>Confidentiality & Non-Disclosure</span>
              </h2>
              <p>
                Both parties agree to treat all proprietary business logic, product roadmaps, source code repositories, API secrets, and end-customer records as strictly confidential. Neither party will disclose confidential information to any third party without prior written authorization, except as required by law or judicial process.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">09.</span>
                <span>Limitation of Liability & Upstream Dependencies</span>
              </h2>
              <div className="p-5 rounded-2xl bg-[#060911] border border-white/10 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>
                      <strong className="text-white">Third-Party Platform Outages:</strong> Vnoirs does not operate the underlying infrastructure of Meta Platforms (WhatsApp Business servers), cloud providers (Vercel, AWS), or telecommunication carriers. We are not liable for outages, upstream API downtime, template rejections by Meta policy algorithms, or carrier-level message drops beyond our reasonable engineering control.
                    </p>
                    <p>
                      <strong className="text-white">Consequential Damages:</strong> To the maximum extent permitted by law, Vnoirs shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of profits, revenue, or business reputation.
                    </p>
                    <p>
                      <strong className="text-white">Liability Cap:</strong> Our total aggregate liability arising out of or related to any contracted engagement shall not exceed the total fees actually received by Vnoirs under the specific Statement of Work giving rise to the claim in the 3 months preceding the event.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">10.</span>
                <span>Termination & Orderly Offboarding</span>
              </h2>
              <p>
                Either party may terminate an ongoing engagement upon written notice if the other party materially breaches any provision of these Terms and fails to cure such breach within 14 business days.
              </p>
              <p className="text-sm">
                In the event of termination, the Client shall pay Vnoirs for all work completed, milestones reached, and approved expenses incurred up to the effective termination date. Upon settlement, Vnoirs will deliver all completed code commits, design files, and work-in-progress assets directly to the Client.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">11.</span>
                <span>Dispute Resolution & Governing Law</span>
              </h2>
              <p>
                Any dispute, controversy, or claim arising out of or relating to these Terms or our services shall first be submitted to good-faith mutual negotiations. If unresolved within 30 days, disputes shall be submitted to binding arbitration or adjudicated in the competent courts having jurisdiction over Vnoirs&apos; principal place of business.
              </p>
            </div>

            {/* Section 12 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">12.</span>
                <span>Legal Inquiries & Contact Information</span>
              </h2>
              <p>
                If you have questions, notices, or formal communications regarding these Terms of Service, please reach out to our legal and operations team:
              </p>
              <div className="p-6 rounded-2xl bg-[#060911] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-violet-400" />
                  <span className="text-white font-medium">Email: </span>
                  <a href="mailto:cs@vnoirs.com" className="text-violet-400 hover:underline">
                    cs@vnoirs.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-violet-400" />
                  <span className="text-white font-medium">Telephone / WhatsApp: </span>
                  <a href="https://wa.me/923202453000" className="text-emerald-400 hover:underline">
                    +92 320 2453000
                  </a>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t border-white/5">
                  Vnoirs &bull; Web Solutions & Official WhatsApp Cloud API Messaging Systems &bull; https://vnoirs.com
                </div>
              </div>
            </div>

            {/* Bottom Related Navigation */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span>Need clarification on project scoping or Meta compliance?</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy-policy"
                  className="text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Privacy & Data Policy
                </Link>
                <span className="text-white/20">&bull;</span>
                <Link
                  href="/data-deletion"
                  className="text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Data Deletion
                </Link>
                <span className="text-white/20">&bull;</span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-white hover:text-violet-400 font-semibold transition"
                >
                  <span>Contact Our Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
