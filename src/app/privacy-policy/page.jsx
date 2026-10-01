import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Privacy & Data Policy | Vnoirs WhatsApp Cloud API & Web Services",
  description:
    "Official Privacy Policy of Vnoirs explaining data collection, WhatsApp Cloud API webhook processing, Meta Business compliance, and data subject rights.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>Compliance & Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Privacy & Data Processing Policy
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Governing your use of vnoirs.com, our custom web application engineering services, and our official WhatsApp Cloud API business messaging infrastructure.
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
                <span className="font-semibold text-white">Privacy Guarantee: </span>
                Vnoirs strictly respects customer confidentiality. We never sell, monetize, or lease your personal information, phone numbers, or WhatsApp conversation contents to advertising brokers or unauthorized third parties.
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">01.</span>
                <span>Information We Collect & Process</span>
              </h2>
              <p>
                Depending on how you interact with Vnoirs (as a website visitor, project client, or recipient of messages sent via our WhatsApp Cloud API integrations), we may collect and process:
              </p>
              <ul className="space-y-2.5 pl-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Direct Inquiries:</strong> Full name, professional email address, phone number, company name, and project requirements submitted via our contact forms.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">WhatsApp Business Messaging Data:</strong> When deployed on behalf of a client, our systems process phone numbers, contact names, incoming text/media payloads, interactive button responses, and delivery/read timestamps.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Technical & Infrastructure Logs:</strong> IP addresses, request headers, error logs, and webhook delivery status codes necessary to debug API uptime and maintain system security.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">02.</span>
                <span>Purpose & Lawful Basis of Processing</span>
              </h2>
              <p>We process collected data exclusively for lawful business and engineering purposes:</p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Contract Execution</h3>
                  <p className="text-xs text-gray-400">
                    Delivering contracted web development, cloud configuration, and WhatsApp Cloud API software milestones.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Operational Messaging</h3>
                  <p className="text-xs text-gray-400">
                    Dispatching transactional updates, verification codes, and client support communications via Resend and WhatsApp.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Security & Uptime</h3>
                  <p className="text-xs text-gray-400">
                    Defending API endpoints against DDoS, spam exploitation, unauthorized webhook impersonation, and fraudulent traffic.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Legal & Meta Compliance</h3>
                  <p className="text-xs text-gray-400">
                    Adhering to Meta Platform Terms, WhatsApp Business Solution Policies, and local data protection regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">03.</span>
                <span>Meta WhatsApp Cloud API Compliance</span>
              </h2>
              <p>
                When building or hosting WhatsApp Cloud API solutions, Vnoirs operates as a technical provider in full alignment with Meta&apos;s Business Policies:
              </p>
              <ul className="space-y-2.5 pl-2">
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Explicit User Opt-In:</strong> Messages are only transmitted to users who have provided verifiable consent according to Meta guidelines.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Opt-Out Honored Instantly:</strong> Automated keyword detection (e.g., &quot;STOP&quot;, &quot;UNSUBSCRIBE&quot;) immediately halts automated sequences.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">End-to-End Encryption & Secure Transit:</strong> In-transit traffic between Meta servers and our application endpoints is encrypted using TLS 1.3 cryptographic protocols.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">04.</span>
                <span>Data Retention & Automatic Pruning</span>
              </h2>
              <p>
                We do not retain customer data indefinitely. Our retention framework adheres to strict principles of data minimization:
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 text-sm">
                  <span className="text-white font-medium">Temporary Webhook Logs</span>
                  <span className="text-violet-400 font-mono text-xs">Purged every 90 days</span>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 text-sm">
                  <span className="text-white font-medium">Website Contact Form Submissions</span>
                  <span className="text-violet-400 font-mono text-xs">Retained up to 12 months</span>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 text-sm">
                  <span className="text-white font-medium">Opt-Out & Unsubscribe Records</span>
                  <span className="text-violet-400 font-mono text-xs">Retained to prevent re-messaging</span>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">05.</span>
                <span>Your Data Rights</span>
              </h2>
              <p>
                You have the full right under applicable data protection frameworks to exercise control over your personal records:
              </p>
              <ul className="space-y-2 pl-2 text-sm">
                <li>&bull; <strong className="text-white">Right of Access:</strong> Request a copy of the personal information we maintain regarding you.</li>
                <li>&bull; <strong className="text-white">Right of Rectification:</strong> Request correction of inaccurate or outdated data.</li>
                <li>&bull; <strong className="text-white">Right of Erasure (&quot;Right to Be Forgotten&quot;):</strong> Request immediate deletion of your records from our databases and logs.</li>
                <li>&bull; <strong className="text-white">Right to Restrict Processing:</strong> Request suspension of processing activities.</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">
                To exercise any of these rights, email our Data Desk at <a href="mailto:cs@vnoirs.com" className="text-violet-400 hover:underline">cs@vnoirs.com</a> with the subject line &quot;Data Subject Request&quot;. We honor verified requests within 48 business hours.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="text-violet-400 font-mono text-base">06.</span>
                <span>Contacting the Privacy Team</span>
              </h2>
              <p>
                For questions, clarifications, or security inquiries regarding this policy, reach us directly through our official channels:
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
          </div>
        </div>
      </section>
    </div>
  );
}
